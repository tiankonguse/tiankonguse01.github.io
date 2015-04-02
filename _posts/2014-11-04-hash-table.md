---
layout:     post
title:      hash table 研究与实现
description: 我是敲c++的，经常听起面试喜欢问hash table与hash map的区别，我只能说对不起，我没听过这两个名词。
keywords: hash, hash table, hash map, wiki
tags: hash hash_table hash_map wiki
categories: [软件研究]
---

![hash table 研究与实现][cover-img]

## 什么是 hash table 

说这个的时候，大家需要回忆一下大学学的数据结构上关于hash那一块，噢，大学的课本上不叫hash,而叫散列表。

### 散列表

说起散列表，那么问题来了。什么是散列表呢？  
大家可以先看看 [wiki][散列表] 上怎么说  ,顺便再看看英文的 [hash table][Hash_table]怎么说。


> 散列表（Hash table，也叫哈希表），是根据关键字（Key value）而直接访问在内存存储位置的数据结构  
> In computing, a hash table (also hash map) is a data structure used to implement an associative array, a structure that can map keys to values.   
>A hash table uses a hash function to compute an index into an array of buckets or slots, from which the correct value can be found.  


看了 wiki 的第一句话，我知道了，原来 传说中的 hash table 就是散列表呀。  
但是我大学很少听课的，所以对于散列表这个词我也很陌生。  
但是我经常使用 hash 技术，我只听所过 哈希表，原来说来说去他们都是一个东西呀。  


现在我只想吐槽一下翻译的问题了，翻译成哈希表就成了，怎么还出来一个散列表，或者直接不翻译就叫做 hash table 也行呀。  
我为什么这么吐槽呢？因为对于 hash table , 在公司里，大家只叫 hash table, 在课堂上，大家只叫 散列表。  
而在平常的编码和项目中，我们这些Acmer直接叫 hash 或者 map 了，当然也有时候叫做 哈希表，但是绝不会叫上面的那两个外号。  

既然 hash table 是 hash 后储存到 array 上的称呼，又由于存在冲突后，会以链表的形式追加到后面，所以称为 hash table 还说的过去。

对于 hash map, 我 wiki 中输入hash map, 自动跳转到 hash table 了。 

## 实现原理

首先需要知道的是 hash table 能够做什么。  
在这里， **假设我们有很多值** ，这个值的类型不确定，可能自定义，也可能基本类型，这个无关紧要。  
然后我们又大量的查询操作，当然也有插入，删除操作。  
一般方法是定义一个数组，但是这样的时间复杂度是 O(n) 的，代价太大。  
我们想快点操作，于是 hash 技术就出来了， 可以近似 O(1) 的时间完成操作。  

基本原理都是

1. 准备一个数组
2. 把数据映射为一个整数位置，然后把这个数据存在那个位置上。  
3. 当映射到一个位置时，那个位置已经有值时(冲突)，我们需要把这些值存为链表   
4. 判断冲突需要一个判断是否相等的函数   
5. 对于要保存的值怎么储存，可以在链表中加一个指针，也可以和链表的节点绑定在一起。   

![基本原理][hash-img]


## 实现算法

对于 hash table ,我们需要先看看基本原理然后确定几件事。

1. 一个 hash table 的数组的大小要根据实际情况来设置，这个数组我们以后成为 桶(buckets).  
2. 我们需要事先申请一批节点内存，如果在使用时申请内存，很浪费时间的。因此我们需要预先估计节点的个数(node_num)。  
3. 我们需要一个hash 函数，来对 key 映射到 index 上(hash_key)。
4. 由于val我们不知道是什么，所以还要申请一批val的内存，这里我们可以直接把val的内存放到节点的后面,所以需要知道val的大小(node_size)。
5. 我们还需要一个判断两个val是否相等的函数(fun_equal)

有了上面的条件，我们就可以自己实现一个 hash table 了。

### 需要的变量

根据上面的分析，我们需要下面几个变量。

```
int     bucket_len ; //桶的大小
int     node_size ; //一个节点的大小
int     node_num ; //节点的最大个数

Node  * hash_bucket ; //指向桶内存的指针
void* heap; //指向节点内存的指针
int head; //目前剩余的节点的第一个位置
Hash_fun_equal fun_equal; //比较函数
Hash_fun_key hash_key; //hash 函数
```

### 定义节点的结构

对于acmer, 很容易发现这个节点用数组就可以表示了。  
但是为了所有读者都可以明白这个节点，我还是使用结构体来表示。

```
class Node {
public:
    Node():next(-1) {
    }
    int next;
    int pos;
};
```

### 初始化

我们初始化要做的有这么几件事

1. 初始化变量
2. 申请桶的内存
3. 申请节点的内存
4. 节点保存起来


```
int init(int bucket_len  , int node_num   ,int node_size, Hash_fun_equal fun_equal, Hash_fun_key hash_key) {
    this->fun_equal = fun_equal;
    this->hash_key = hash_key;
    this->bucket_len = bucket_len ;
    this->node_size = node_size ;
    this->node_num = node_num ;

    if(bucket_len < 5 || node_num < 10 || node_size <= 0) {
        return -1 ;
    }

    if(malloc_bucket() == -1) {
        return -1;
    }

    if(malloc_queue() == -1) {
        free_bucket();
        return -1;
    }
    initQueue();
}
```

### 申请与释放内存

申请与释放内存就参考[源代码][github-hash-table]吧

### 初始化节点序列

使用位置的话更容易理解。  
实际上可以做到几乎所有的代码都是用位置来代替指针的。  

```
void initQueue() {
    head = 0;

    for (int i=0; i < node_num - 1; ++i) {
        heapNode(i)->pos = i;
        heapNode(i)->next = i + 1;
    }
    heapNode(node_num - 1)->pos = node_num - 1;
    heapNode(node_num - 1)->next = -1;

}
```

### 查询元素

查询的核心部分是：

1. 找到 hash 值，也就是在桶的位置
2. 在桶里找这个元素是否存在

```
int query(void const * pkey) {
    int key = hash_key(pkey);
    int pos = (hash_bucket + key)->next;
    void const* now ;
    while(pos != -1) {
        now = (void*)(heapNode(pos) + 1);
        if(fun_equal(now, pkey) == true) {
            return 0;
        } else {
            pos = heapNode(pos)->next;
        }
    }
    return 1;
}
```
### 添加元素

添加元素做的事多了一些。

1. 查询是否存在
2. 得到对应的桶
3. 申请内存节点
4. 新节点扔到对应的桶里面去


```
int insert(void const * pkey) {

    int ret = query(pkey);
    if(ret == 0) {
        return 1;
    }
    if(ret == -1) {
        return -1;
    }

    int key = hash_key(pkey);
    Node* now  = hash_bucket + key;

    int pos = malloc_node();
    if(pos == -1) {
        return -1;
    }

    heapNode(pos)->next = now->next;
    now->next = pos;
    memcpy ((void*)(heapNode(pos) +1 ), pkey, node_size);

    return 0;
}
```
### 删除元素

删除元素和查询很类似，只是由于我们使用的是单向列表，所以需要保存父节点的指针。

```
int del(void const * pkey) {
    if(pkey == NULL) {
        return -1;
    }
    int key = hash_key(pkey);

    if (key >= bucket_len ) {
        return -1 ;
    }

    Node* pre = hash_bucket + key;
    int pos = pre->next;
    void const* now ;

    while(pos != -1) {
        now = (void*)(heapNode(pos) + 1);
        if(fun_equal(now, pkey)  == true) {
            pre->next = heapNode(pos)->next;
            free_node(pos);
            return 0;
        } else {
            pre = heapNode(pos);
            pos = pre->next;
        }
    }

    return 1;
}
```

## 完整代码

完整的代码请参考我的 [github][github-hash-table]

[cover-img]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2550503544.png
[hash-img]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/261547805.png
[github-hash-table]: https://github.com/tiankonguse/ACM/blob/master/hash/hash_table1.cpp
[Hash_table]: http://en.wikipedia.org/wiki/Hash_table
[散列表]: http://zh.wikipedia.org/wiki/哈希表
