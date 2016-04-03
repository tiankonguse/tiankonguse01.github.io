---  
layout: post  
title: redis源码阅读之内存管理
description:  早就想阅读一下redis的源码了， 但是迟迟没有赋予行动， 现在开始记录下阅读笔记。  
updateData:  20:11 2016/04/03
categories: [数据库]
---  


## 背景

redis是一个很不错的NOSQL数据库。  
关于redis的使用文档， 可以参考[这里]({{ site.data.link.github_tiankonguse_redis_doc }}).  
关于redis内存管理的源码可以参考[这里]({{ site.data.link.github_tiankonguse_git_redis_zmalloc }})  


## 功能

redis对内存管理函数进行了封装， 好处有下面几个。  

1. 可以根据自己的需要， 适当的改造内存管理函数。  
2. 可以方便的切换到另一种内存管理库上面。  
3. 可以监控内存的分配和回收， 防止内存泄露。  


redis封装了下面一系列的内存相关的函数， 我们只需要重点阅读通用的内存管理函数即可。  

```
void *zmalloc(size_t size);
void *zcalloc(size_t size);
void *zrealloc(void *ptr, size_t size);
void zfree(void *ptr);
char *zstrdup(const char *s);
size_t zmalloc_used_memory(void);
void zmalloc_enable_thread_safeness(void);
void zmalloc_set_oom_handler(void (*oom_handler)(size_t));
float zmalloc_get_fragmentation_ratio(size_t rss);
size_t zmalloc_get_rss(void);
size_t zmalloc_get_private_dirty(void);
size_t zmalloc_get_smap_bytes_by_field(char *field);
size_t zmalloc_get_memory_size(void);
void zlibc_free(void *ptr);
size_t zmalloc_size(void *ptr);
```

## 辅助函数

阅读重点函数前， 需要了解几个辅助函数， 这样阅读重点函数的时候，就可以忽略这些辅助函数了。  

### 错误处理函数

`oom`的含义是 `Out of memory`.  
所以函数`zmalloc_default_oom`的功能就是当申请内存失败的时候， 调用改函数进行失败处理。  
`zmalloc_oom_handler`是一个内存申请失败时， 调用的函数指针， 默认指向函数`zmalloc_default_oom`。  


`zmalloc_default_oom` 的实现也很简单， 输出错误日志， 然后退出程序。  


```
fprintf(stderr, "zmalloc: Out of memory trying to allocate %zu bytes\n", size);
fflush(stderr);
abort();
```


### 原子加减操作


`__atomic_add_fetch`和`__atomic_sub_fetch`是`c++11`支持的内置函数。  

```
#define update_zmalloc_stat_add(__n) __atomic_add_fetch(&used_memory, (__n), __ATOMIC_RELAXED)
#define update_zmalloc_stat_sub(__n) __atomic_sub_fetch(&used_memory, (__n), __ATOMIC_RELAXED)
```

如果编译器不支持这两个函数的话， 就需要显示的使用锁了。  

```
#define update_zmalloc_stat_add(__n) do { \
    pthread_mutex_lock(&used_memory_mutex); \
    used_memory += (__n); \
    pthread_mutex_unlock(&used_memory_mutex); \
} while(0)

#define update_zmalloc_stat_sub(__n) do { \
    pthread_mutex_lock(&used_memory_mutex); \
    used_memory -= (__n); \
    pthread_mutex_unlock(&used_memory_mutex); \
} while(0)
```



### 内存统计函数

内存必须是`sizeof(long)`的整数倍， 当不是的话， 需要调整为整数倍。  

不要看下面使用了位操作， 其实它这个算法是最初级的算法， 优化空间还很大（后面具体分析怎么优化）。  
下面直接使用`sizeof(long)`来对齐， 其实是不好的写法， 至少应该使用一个宏来代替。  


```
#define update_zmalloc_stat_alloc(__n) do { \
    size_t _n = (__n); \
    if (_n&(sizeof(long)-1)) _n += sizeof(long)-(_n&(sizeof(long)-1)); \
    if (zmalloc_thread_safe) { \
        update_zmalloc_stat_add(_n); \
    } else { \
        used_memory += _n; \
    } \
} while(0)

#define update_zmalloc_stat_free(__n) do { \
    size_t _n = (__n); \
    if (_n&(sizeof(long)-1)) _n += sizeof(long)-(_n&(sizeof(long)-1)); \
    if (zmalloc_thread_safe) { \
        update_zmalloc_stat_sub(_n); \
    } else { \
        used_memory -= _n; \
    } \
} while(0)
```



假设`sizeof(long)`为4， 我们的目标是对内存按4字节对齐， 不足的向上对齐。  

则最原始的算法是这个样子：  

当需要对齐的时候， 把多余的部分删除， 然后加上一个`sizeof(long)`即可。  

```
if(n%4){
    //需要对齐
    n = (n - n%4) + 4;
}
```


大家看到了取模操作， 知道很慢， 于是可以使用位操作代替。  
代替后， 就会发现redis源码使用的就是只优化取模操作的算法啦。  

```
if(n & (4-1)){
    //需要对齐
    n = (n - (n & (4-1))) + 4;
}
```

上面向上对齐的算法， 我们也可以使用位运算优化的。  
对齐位全部至1， 然后再加1即可。  

```
if(n & (4-1)){
    //需要对齐
    n = (n | (4-1)) + 1;
}
```

当然， 由于对齐数是2的幂数， 假设我们知道有多少位的话， 可以通过左移右移来实现这个对齐操作。  
先右移， 及处理对齐数字， 然后加1， 再左移回来（假设左移时使用0补齐）。  

```
if(n & (4-1)){
    //需要对齐
    n = ((n >> 2) + 1) << 2;
}
```


### 设置线程安全模式

线程安全模式， 会操作去加锁。  


```
void zmalloc_enable_thread_safeness(void) {
    zmalloc_thread_safe = 1;
}
```

### 设置内存错误处理函数


```
void zmalloc_set_oom_handler(void (*oom_handler)(size_t)) {
    zmalloc_oom_handler = oom_handler;
}
```

## 内存管理函数


### 申请内存

`zmalloc/zcalloc/zrealloc`这三个函数和内置函数功能类似， 只不过增加了下面几个功能。  

1. 记录申请的内存大小  
2. 申请失败时错误处理  
3. 内存申请统计  


```
//申请指定大小的内存
void *zmalloc(size_t size);
//与zmalloc完全等价， 申请指定大小的内存
void *zcalloc(size_t size);
//调整内存
void *zrealloc(void *ptr, size_t size);


void *ptr = malloc(size+PREFIX_SIZE);
if (!ptr) zmalloc_oom_handler(size);
*((size_t*)ptr) = size;
update_zmalloc_stat_alloc(size+PREFIX_SIZE);
return (char*)ptr+PREFIX_SIZE;
```


这里大家会对`PREFIX_SIZE`产生疑问， 而我上面也说了， 这个函数增加了记录内存大小的功能。  
我们知道内置的函数不能得到申请内存的大小， 我们自己来记录的话， 就需要内存来储存这个大小啦。  
多出来的`PREFIX_SIZE`这个内存， 就是用来储存应用级别申请的大小的（应用级别代表`PREFIX_SIZE`的内存对用户不可见）。  


### 内存大小

我们记录了内存的大小， 当然既可以获得内存的大小了。  
当然， 这里还是对内存大小进行了对齐。  


```
size_t zmalloc_size(void *ptr) {
    void *realptr = (char*)ptr-PREFIX_SIZE;
    size_t size = *((size_t*)realptr);
    /* Assume at least that all the allocations are padded at sizeof(long) by
     * the underlying allocator. */
    if (size&(sizeof(long)-1)) size += sizeof(long)-(size&(sizeof(long)-1));
    return size+PREFIX_SIZE;
}
```


### 释放内存


```
void zfree(void *ptr) {
    void *realptr;
    size_t oldsize;

    if (ptr == NULL) return;
    realptr = (char*)ptr-PREFIX_SIZE;
    oldsize = *((size_t*)realptr);
    update_zmalloc_stat_free(oldsize+PREFIX_SIZE);
    free(realptr);
}
```


### 深拷贝字符串


```
char *zstrdup(const char *s) {
    size_t l = strlen(s)+1;
    char *p = zmalloc(l);

    memcpy(p,s,l);
    return p;
}
```


### 查询使用内存大小

代码中， 这个是否打开安全模式和是否支持原子操作在函数中实现， 又是不好的代码风格。  
因为很多地方都需要这个原子操作， 不能让使用方频繁的去判断， 应该封装为一个统一的函数或者宏， 然后使用者直接调用宏或者函数即可。  
当然， 只所以没有封装成宏， 原因大概是还需要对变量赋值。 函数的话又怕效率低吧。  


```
size_t zmalloc_used_memory(void) {
    size_t um;

    if (zmalloc_thread_safe) {
#if defined(__ATOMIC_RELAXED) || defined(HAVE_ATOMIC)
        um = update_zmalloc_stat_add(0);
#else
        pthread_mutex_lock(&used_memory_mutex);
        um = used_memory;
        pthread_mutex_unlock(&used_memory_mutex);
#endif
    }
    else {
        um = used_memory;
    }

    return um;
}
```


### 实际内存大小

一个进程占占用的实际内存等于一页大小乘以实际页个数。  
一页大小可以通过`sysconf(_SC_PAGESIZE)`获得， 而实际页个数可以在`/proc/[pid]/stat`中获得。  
`rss`是 `Resident Set Size`的简称。  


```
size_t zmalloc_get_rss(void)；
```


### 内存中断率

当我们的数据全部加载到内存中的话， 直接运行就OK了。  
但是当内存不足的时候， 系统就会创建虚拟内存， 把不常用的内存放到磁盘上， 需要的时候再加载到内存中。  
如果存在从磁盘上加载数据， 性能必然就会低下了。  


```
/* Fragmentation = RSS / allocated-bytes */
float zmalloc_get_fragmentation_ratio(size_t rss) {
    return (float)rss/zmalloc_used_memory();
}
```

### 内存信息

内存的各种信息， 在`/proc/[pid]/smaps`里面都可以查到， 比如上面的`rss`.  
`/proc/self/smaps`和`/proc/[pid]/smaps`完全等价。  
需要注意的一点是这里的单位是`kb`。  


```
size_t zmalloc_get_smap_bytes_by_field(char *field) {
    char line[1024];
    size_t bytes = 0;
    FILE *fp = fopen("/proc/self/smaps","r");
    int flen = strlen(field);

    if (!fp) return 0;
    while(fgets(line,sizeof(line),fp) != NULL) {
        if (strncmp(line,field,flen) == 0) {
            char *p = strchr(line,'k');
            if (p) {
                *p = '\0';
                bytes += strtol(line+flen,NULL,10) * 1024;
            }
        }
    }
    fclose(fp);
    return bytes;
}
```

### 实际内存大小



```
size_t zmalloc_get_private_dirty(void) {
    return zmalloc_get_smap_bytes_by_field("Private_Dirty:");
}
```


### 得到物理内存大小

直接读页数以及页大小， 相乘即可。  


```
size_t zmalloc_get_memory_size(void) {
    return (size_t)sysconf(_SC_PHYS_PAGES) * (size_t)sysconf(_SC_PAGESIZE);
}
```




