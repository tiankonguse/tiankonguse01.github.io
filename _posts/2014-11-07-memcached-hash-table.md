---
layout:     post
title:      memcached 源码阅读之 hash table
description: 之前写了两篇 memcached 源码阅读记录，没什么价值，现在来记录一个有价值的源码阅读。
keywords: memcached, 源码阅读, hash table
tags: memcached 源码阅读 hash_table
categories: [软件研究]
---

![cover][]

## 前言

昨晚用一个小时把 memcached 的服务端程序看了，发现踩到一个坑，大部分程序都在实现服务器的网络编程的部分。  
而我是不懂网络编程的，于是又花了半个小时去找 memcached 的储存代码，发现时使用 hash table 储存的。  
于是这里研究一下 memcached 的 hash table .  
昨晚记录的 [memcached 源码阅读之原理篇][memcached-code-server] 最后说了，服务器端做两部分：一部分是网络编程方面。另一部分就是 hash table 的实现。  
刚好前几天我自己实现过一个 [hash table 研究与实现][hash-table], 于是 memcached 的 hash table 可以很快的看完并理解。  
这里就简单的讲解一下 memcached 的 hash table .


## 我的 hash table

大家可以先阅读一下我之前的 [hash table 研究与实现][hash-table]。  
大家可以看出来，我的这个 hash table 实现的太简单了，所以没有实用价值的，只能用来学习 hash table 。  
这里我先说一下我的这个 hash table 需要加强之处吧。

### Node(节点) 与 bucket(桶)

先熟悉一下我的 Node 节点 和 桶。

```cpp
class Node {
public:
    Node():next(-1) {
    }
    int next;
    int pos;
};
Node  * hash_bucket ; //指向桶内存的指针
```

### val 的改造
  
首先我的 val 是一个对象，且所有的 val 必须有相同的内存大小。  
这往往是不现实的，所以一个很简单的改造就是 val 修改为动态申请内存，然后用指针来储存在 Node 里面即可。  

```
class Node {
public:
    Node():next(-1) {
    }
    int next;
    int pos;
    
    void* val;
    int valLen;
};
```
### key 改造

我这里是没有 key 的，所以 key 是由 val hash 得到，但是实际中往往是 key-value 的储存方式，所以实际中是有个 key 的。  
不过我的那个程序很容易就加入 key.  
由于之后还有 key 的比较，且 key 的长度也是未知，所以这里我们就需要也把 key 储存在 Node 里面了。


```
class Node {
public:
    Node():next(-1) {
    }
    int next;
    int pos;
    
    void* val;
    int valLen;
    
    void* key;
    int keyLen;
};
```

### 内存管理

大家还可以明显看到，我的内存管理其实更不现实。  
使用前是根本不知道我们会插入多少个加点，所以这个内存需要时动态增加的。  
关于这个实现，一会我们看 memcached 里面的实现方式吧。  


### 其他改造

改造之后，发现我的 桶没有必要是 Node 节点，也就是链表不需要一个头，所以这个桶需要改造。  
当然链表又没有头的学问也很大，大家可以自己研究一番。  

```
Node** hash_bucket;
```

## memcached 的 hash table

### 头文件认识

memcached 的 hash table 有两个文件，一个 .c, 一个 .h .  
这是他们的位置 [assoc.h][memcached-assoc-h] 和 [assoc.c][memcached-assoc-c] .  

在 .h 中，代码就不足 10 行，可以看一下。  后两个是我自己加上的。

```
/* associative array */
void assoc_init(const int hashpower_init); //初始化 hash table
item *assoc_find(const char *key, const size_t nkey, const uint32_t hv); //查找
int assoc_insert(item *item, const uint32_t hv);//插入
void assoc_delete(const char *key, const size_t nkey, const uint32_t hv);//删除
void do_assoc_move_next_bucket(void);//
int start_assoc_maintenance_thread(void); //开启一个线程来合并两个hash table
void stop_assoc_maintenance_thread(void); //结束线程
extern unsigned int hashpower; //hash table

static void *assoc_maintenance_thread(void *arg);//合并代码
static void assoc_expand(void);//自动扩大hash table 的大小，有两个hash table.
```

### 核心变量介绍

变量的介绍详见我的注释

```
//hash table 的桶大小永远是2的倍数，且按2的倍数扩增
unsigned int hashpower = HASHPOWER_DEFAULT; 

// 桶的大小
#define hashsize(n) ((ub4)1<<(n))

// 主要用于取模 a % (2^n) = a & (2^n - 1)
#define hashmask(n) (hashsize(n)-1)

// 当前桶的指针
static item** primary_hashtable = 0;

//桶扩增后，旧的桶的指针
static item** old_hashtable = 0;

//目前桶内的节点个数
static unsigned int hash_items = 0;

//旧桶数据是否清理
static bool expanding = false;

//是否开始扩增桶
static bool started_expanding = false;

//旧桶清理到那个位置，每次清理 2^expand_bucket 个，expand_bucket 递增
static unsigned int expand_bucket = 0;
```

### 初始化

初始化主要做一件事： 申请桶的内存。   

```
void assoc_init(const int hashtable_init) {
    if (hashtable_init) {
        hashpower = hashtable_init;
    }
    primary_hashtable = calloc(hashsize(hashpower), sizeof(void *));
    if (! primary_hashtable) {
        fprintf(stderr, "Failed to init hashtable.\n");
        exit(EXIT_FAILURE);
    }
}
```

### 查找

由于 key-value 的储存需要保证 相同的key 对应唯一的 value.  
这样也就代表 一个 key 是唯一的，就和我的 hash table 的 val 是一个性质的。  
nkey 代表 这个 key 的字符串长度。  
hv 代表 这个 字符串 key 的 hash 值。

expanding 代表是否有旧桶，有的话我们需要先判断当前 key 是在新桶还是旧桶里面。  
怎么判断呢？  
新桶范围是 0~ 2\^hashpower， 插入到新桶的值的范围是 0 ~ expand_bucket  
旧桶范围是 0 ~ 2\^(hashpower - 1),旧桶的值范围是 expand_bucket ~ 2\^(hashpower - 1)  

这时可能就会有人说不对呀，那 对于 2\^(hashpower - 1) ~ 2\^hashpower 的数据在哪呢？  
其实，那些数据超过了 2\^(hashpower - 1)， 所以会进行取模，这样就还在那个范围了。  
什么意思呢？  
对于新来的数据，只看范围，如果在 expand_bucket ~ 2\^(hashpower - 1)， 即使有新桶还会存在旧桶里。  

it 指针指向当前 key 对应的桶的位置。  
然后就可以循环判断了。  
由于是内存比较，所以需要先比较长度，再比较内存，完全相同了就找到了。  

```
item *assoc_find(const char *key, const size_t nkey, const uint32_t hv) {
    item *it;
    unsigned int oldbucket;

    if (expanding &&
        (oldbucket = (hv & hashmask(hashpower - 1))) >= expand_bucket)
    {
        it = old_hashtable[oldbucket];
    } else {
        it = primary_hashtable[hv & hashmask(hashpower)];
    }

    item *ret = NULL;
    int depth = 0;
    while (it) {
        if ((nkey == it->nkey) && (memcmp(key, ITEM_key(it), nkey) == 0)) {
            ret = it;
            break;
        }
        it = it->h_next;
        ++depth;
    }
    return ret;
}
```

### 添加

添加比较简单，实现方式和我的差不多，插在链表头部。  
这里多了一步桶大小的检测，节点个数超过当前桶大小的 1.5 倍时就增大桶(调用启动增大桶线程)。
这里要注意的一点是对于插入的key,已经在其他地方检察过是否存在了。  
意思就是这里保证一定不存在。  

```
int assoc_insert(item *it, const uint32_t hv) {
    unsigned int oldbucket;

    if (expanding &&
        (oldbucket = (hv & hashmask(hashpower - 1))) >= expand_bucket)
    {
        it->h_next = old_hashtable[oldbucket];
        old_hashtable[oldbucket] = it;
    } else {
        it->h_next = primary_hashtable[hv & hashmask(hashpower)];
        primary_hashtable[hv & hashmask(hashpower)] = it;
    }

    hash_items++;
    if (! expanding && hash_items > (hashsize(hashpower) * 3) / 2) {
        assoc_start_expand();
    }

    return 1;
}

```

### 删除

删除也比较简单，先找到需要删除的那个节点的父节点，然后删除即可。  
需要注意的是这里也是保证要删除的节点已经存在。  
另外大家不能理解的是为什么要用指向指针的指针。  
这个问题曾经在 [segmentfault][segmentfault-1010000000741529] 上有人问过这个问题，不过他那个问题就没有办法使用指向指针的指针了。

问题就是，如果不使用指向指针的指针，查找的节点不在第一个位置的话，可以正常操作。  
但是在第一个位置的话，我们的操作不会生效的。  
如果你不能明白的话，先去 [segmentfault][segmentfault-1010000000741529] 研究一下那个问题，那个明白了，这个就明白了。  


```
void assoc_delete(const char *key, const size_t nkey, const uint32_t hv) {
    item **before = _hashitem_before(key, nkey, hv);
    if (*before) {
        item *nxt;
        hash_items--;
        nxt = (*before)->h_next;
        (*before)->h_next = 0; 
        *before = nxt;
        return;
    }
}
```

### 父节点的指针

实现方式和普通的查找类似，只是使用指向指针的指针。  

```
static item** _hashitem_before (const char *key, const size_t nkey, const uint32_t hv) {
    item **pos;
    unsigned int oldbucket;

    if (expanding &&
        (oldbucket = (hv & hashmask(hashpower - 1))) >= expand_bucket)
    {
        pos = &old_hashtable[oldbucket];
    } else {
        pos = &primary_hashtable[hv & hashmask(hashpower)];
    }

    while (*pos && ((nkey != (*pos)->nkey) || memcmp(key, ITEM_key(*pos), nkey))) {
        pos = &(*pos)->h_next;
    }
    return pos;
}
```

### 启动增大桶线程

启动增大桶线程也很简单，只做一件事：给增大桶的线程发送一个信号。

```
static void assoc_start_expand(void) {
    if (started_expanding)
        return;
    started_expanding = true;
    pthread_cond_signal(&maintenance_cond);
}
```

### 线程控制

线程控制做两件事：启动线程和停止线程。  
线程主要执行 assoc_maintenance_thread 函数。

```
static pthread_t maintenance_tid;

int start_assoc_maintenance_thread() {
    int ret;
    if ((ret = pthread_create(&maintenance_tid, NULL,
                              assoc_maintenance_thread, NULL)) != 0) {
        fprintf(stderr, "Can't create thread: %s\n", strerror(ret));
        return -1;
    }
    return 0;
}

void stop_assoc_maintenance_thread() {
    mutex_lock(&cache_lock);
    do_run_maintenance_thread = 0;
    pthread_cond_signal(&maintenance_cond);
    mutex_unlock(&cache_lock);
    pthread_join(maintenance_tid, NULL);
}
```

### 线程做的事 - 合并桶

这个合并桶的线程只做两件事。  
第一件事是桶内的节点一个一个的合并，合并完了回收旧桶。  
第二事是旧桶释放后，开始监听是否增大桶，接收到信号，调用增大桶  assoc_expand 函数。

```
static volatile int do_run_maintenance_thread = 1;
#define DEFAULT_HASH_BULK_MOVE 1
int hash_bulk_move = DEFAULT_HASH_BULK_MOVE;
static void *assoc_maintenance_thread(void *arg) {

    while (do_run_maintenance_thread) {
        int ii = 0;
        item_lock_global();
        mutex_lock(&cache_lock);
        for (ii = 0; ii < hash_bulk_move && expanding; ++ii) {
            item *it, *next;
            int bucket;

            for (it = old_hashtable[expand_bucket]; NULL != it; it = next) {
                next = it->h_next;
                bucket = hash(ITEM_key(it), it->nkey) & hashmask(hashpower);
                it->h_next = primary_hashtable[bucket];
                primary_hashtable[bucket] = it;
            }

            old_hashtable[expand_bucket] = NULL;

            expand_bucket++;
            if (expand_bucket == hashsize(hashpower - 1)) {
                expanding = false;
                free(old_hashtable);
            }
        }

        mutex_unlock(&cache_lock);
        item_unlock_global();

        if (!expanding) {
            /* finished expanding. tell all threads to use fine-grained locks */
            switch_item_lock_type(ITEM_LOCK_GRANULAR);
            slabs_rebalancer_resume();
            /* We are done expanding.. just wait for next invocation */
            mutex_lock(&cache_lock);
            started_expanding = false;
            pthread_cond_wait(&maintenance_cond, &cache_lock);
            /* Before doing anything, tell threads to use a global lock */
            mutex_unlock(&cache_lock);
            slabs_rebalancer_pause();
            switch_item_lock_type(ITEM_LOCK_GLOBAL);
            mutex_lock(&cache_lock);
            assoc_expand();
            mutex_unlock(&cache_lock);
        }
    }
    return NULL;
}
```

### 增大桶

增大桶做的事很简单，保存旧桶，申请新桶即可。

```
static void assoc_expand(void) {
    old_hashtable = primary_hashtable;

    primary_hashtable = calloc(hashsize(hashpower + 1), sizeof(void *));
    if (primary_hashtable) {
        if (settings.verbose > 1)
            fprintf(stderr, "Hash table expansion starting\n");
        hashpower++;
        expanding = true;
        expand_bucket = 0;
    } else {
        primary_hashtable = old_hashtable;
    }
}
```

## memcached 的 hash table 的评价

看到这里，大家的心理可能会想几件事  
1. 节点的管理怎么没有呢？  
2. 简单的几个函数竟然实现了这个复杂功能？  

我猜想这就是软件设计的强大之处。  
节点管理从 hash table 里面抽象出去，你只需要给我传一个指向那个节点的指针，且那个节点有key的信息和下一个节点的指针即可。  
另外对于面向过程的编程方式，想编出好的代码，就要学会函数封装。  
每个函数都实现一个简单的功能，合起来就是很强大的功能了。  
就像在 acm 比赛的时候，对于模拟题，我就感觉很简单 -- 不就是若干简单函数的实现嘛！  

写到这文章也要结束了，打个广告，大家留意到了吗？  
没上面没有提起对 key 的 hash 方法，那是因为 对 字符串的hash 又是一个很大的学问，我下篇文章慢慢介绍。  

这篇文章之所以介绍的这个详细，是为了补偿昨晚写的那两篇没有价值的记录 《[memcached 源码阅读之原理篇][memcached-code]》 和 《[memcached 源码阅读之库函数介绍][memcached-lib]》。  
《完》

[cover]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3064550786.png
[memcached-code-server]: http://github.tiankonguse.com/blog/2014/11/06/memcached-code/#content-h3-迟迟到来的原理
[segmentfault-1010000000741529]: http://segmentfault.com/q/1010000000741529/a-1020000000741540
[memcached-assoc-h]: https://github.com/tiankonguse/memcached/blob/master/assoc.h
[memcached-assoc-c]: https://github.com/tiankonguse/memcached/blob/master/assoc.c
[hash-table]: http://github.tiankonguse.com/blog/2014/11/04/hash-table/
[memcached-code]: http://github.tiankonguse.com/blog/2014/11/06/memcached-code/
[memcached-lib]: http://github.tiankonguse.com/blog/2014/11/06/memcached-lib/