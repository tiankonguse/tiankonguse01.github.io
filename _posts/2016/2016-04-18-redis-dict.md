---  
layout: post  
title: redis源码阅读之map
description:  map又称为字典表, 实现方式可以是hashtable, 或者hashlink，　甚至是平衡树。  
updateData:  22:57 2016/04/18
categories: [数据库]
---  


## 背景

redis是一个很不错的NOSQL数据库。  
关于redis的使用文档， 可以参考[这里]({{ site.data.link.github_tiankonguse_redis_doc }}).  
关于redis字典表的源码可以参考[这里](https://github.com/tiankonguse/redis/tree/unstable/src/comlib/dict)  


## 功能  


字典表是一种`key-value`型的数据结构。  
在解释型语言中，　就是对象了。比如在`javascript`中是`object`, 在php中是关联数组。  
在`c++`中是map类型, 在c语言中没有内置`key-value`类型，　所以只好自己实现一个了。  

结构如下：  

```

typedef struct dictEntry {
    void *key;
    union {
        void *val;
        uint64_t u64;
        int64_t s64;
        double d;
    } v;
    struct dictEntry *next;
} dictEntry;


/* This is our hash table structure. Every dictionary has two of this as we
 * implement incremental rehashing, for the old to the new table. */
typedef struct dictht {
    dictEntry **table;
    unsigned long size;
    unsigned long sizemask;
    unsigned long used;
} dictht;

typedef struct dict {
    dictType *type;
    void *privdata;
    dictht ht[2];
    long rehashidx; /* rehashing not in progress if rehashidx == -1 */
    int iterators; /* number of iterators currently running */
} dict;
```


字典表一般需要有下面几个基本功能。  

* 创建字典表(create)  
* 释放字典表(release)  
* 添加元素(set)  
* 得到元素(get)  
* 查询元素(find)  
* 删除元素(delete)  

当然，　也需要一些通用的操作。  

* 清空字典表(clear)  
* 判断是否为空(empty)  
* 当前元素个数(size)  
* 迭代器(iterator)  









