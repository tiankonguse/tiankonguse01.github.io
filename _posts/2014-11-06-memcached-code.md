---
layout:     post
title:      memcached 源码阅读之原理篇
description: 阅读了半天 memcached ，发现那些代码都是没用的代码，所以直接搜索找到 memcached 的核心代码，然后终于看懂了。
keywords: memcached, 源码阅读, hash table
tags: memcached 源码阅读 hash_table
categories: [软件研究]
---

## 初期阅读

初期我是一行一行的看，遇到很多库函数不认识，于是[研究了一番][memcached-lib]。  
后来发现方向跑错了，那些库函数是为了实现网络编程，与 memcached 的本质没有关系。  
于是开始查看函数名了。

### cache_create

初始化 memcached .

主要工作是生成一个 cache_t 对象。

```
cache_t* cache_create(const char *name, size_t bufsize, size_t align,
                      cache_constructor_t* constructor,
                      cache_destructor_t* destructor) {
    cache_t* ret = calloc(1, sizeof(cache_t));
    char* nm = strdup(name);
    void** ptr = calloc(initial_pool_size, sizeof(void*));
    ret->name = nm;
    ret->ptr = ptr;
    ret->freetotal = initial_pool_size;
    ret->constructor = constructor;
    ret->destructor = destructor;

    ret->bufsize = bufsize;

    return ret;
}
```

### cache_destroy

回收 memcached.

```
void cache_destroy(cache_t *cache) {
    while (cache->freecurr > 0) {
        void *ptr = cache->ptr[--cache->freecurr];
        if (cache->destructor) {
            cache->destructor(get_object(ptr), NULL);
        }
        free(ptr);
    }
    free(cache->name);
    free(cache->ptr);
    pthread_mutex_destroy(&cache->mutex);
    free(cache);
}
```
### cache_alloc 与 cache_free

申请一个节点和释放一个节点

### 最后一个

这样又看了结果函数，发现还是没有涉及到 memcached 的本质，这些在创建 服务器，还是网络编程的知识。  
虽然我不会网络编程。  


## 原理

### 可以做什么

memcached 是以 key-val 的方式储存的 map<string, Object>。  
而且key是字符串， val 是一个对象。  

### 客户端

客户端连接上 memcached 的服务器后，可以set设置内容，get查询内容了。  
内容是通过 socket 的方式传给服务器的。  
数据分两部分，一部分是key,一部分是val的序列化。

### 服务器

对于服务器来说，接收到的数据其实就是两个字符串的映射 map<string, string>
所以这时就简单了。  
直接实现一个 hash table 就行了。  
刚好前几天我实现了一个精简版的 [hash table][tiankonguse-hash-table], 刚好可以用上。  
只不过需要加一个字符串val字段，而key字段永远是字符串。  
又由于 key 是字符串，所以字符串的 hash 函数就不需要用户提供了。  
对于 val 同样是这样，字符串判断相等直接 cmp 即可。


这样 memcached 就很容易实现了。  

### 迟迟到来的原理

服务器端分两部分功能。  
第一步分是 hash table 用于存储 string 到 string 的映射。  
第二部分是 服务器，用于接收客户端的请求：查询，增加，删除，更新等操作。  

客户端实现只有一部了：向服务器发送查询，增加，删除，更新等操作。








[memcached-lib]: http://github.tiankonguse.com/blog/2014/11/06/memcached-lib/
[tiankonguse-hash-table]: http://github.tiankonguse.com/blog/2014/11/04/hash-table/