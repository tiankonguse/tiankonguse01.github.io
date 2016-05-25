---  
layout: post  
title: redis源码阅读之map
description:  map又称为字典表, 实现方式可以是hashtable, 或者hashlink，　甚至是平衡树。  
updateData:  22:57 2016/04/18
categories: [数据库]
published: true
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
* 添加元素(set)  
* 得到元素(get)  
* 查询元素(find)  
* 删除元素(delete)  
* 释放字典表(release)  

当然，　也需要一些通用的操作。  

* 清空字典表(clear)  
* 判断是否为空(empty)  
* 当前元素个数(size)  
* 迭代器(iterator)  



## 实现

### 创建字典表

创建字典表就是申请内存 `dict`，　然后初始化。  

```
/* Create a new hash table */
dict *dictCreate(dictType *type, void *privDataPtr) {
    dict *d = zmalloc(sizeof(*d));
    
    _dictInit(d, type, privDataPtr);
    return d;
}
```

### 添加元素

创建字典表后，　就到了关键的`add`操作了。  
一般对于数据结构，　`add`操作的实现决定了整个数据结构的实现。  

redis的`add`操作主要由下面几个步实现。  

1. 检查是否需要重建hash表，需要则重建(dictIsRehashing)  
2. 得到key的hash值,当key存在时直接返回`NULL`(dictKeyIndex)  
3. 生成节点内存，以链表的形式插入到hash值对应的节点.  
4. 设置key的值  
5. 设置value的值  


核心代码如下:  

```
/* Add an element to the target hash table */
int dictAdd(dict *d, void *key, void *val) {
    dictEntry *entry = dictAddRaw(d, key);
    
    if (!entry)
        return DICT_ERR;
    dictSetVal(d, entry, val);
    return DICT_OK;
}

dictEntry *dictAddRaw(dict *d, void *key) {
    int index;
    dictEntry *entry;
    dictht *ht;
    
    if (dictIsRehashing(d))
        _dictRehashStep(d);
    
    /* Get the index of the new element, or -1 if
     * the element already exists. */
    if ((index = _dictKeyIndex(d, key)) == -1)
        return NULL;
    
    /* Allocate the memory and store the new entry.
     * Insert the element in top, with the assumption that in a database
     * system it is more likely that recently added entries are accessed
     * more frequently. */
    ht = dictIsRehashing(d) ? &d->ht[1] : &d->ht[0];
    entry = zmalloc(sizeof(*entry));
    entry->next = ht->table[index];
    ht->table[index] = entry;
    ht->used++;
    
    /* Set the hash entry fields. */
    dictSetKey(d, entry, key);
    return entry;
}
```


## 得到元素/查询元素

得到元素和查找元素是`add`操作的一个判断逻辑, 既对应上面的第二步。  
循环里面先循环第一个hash，　再循环第二个hash这个看起来很奇怪，　后面在**调整hash**小节会解释为什么会这样。  


核心代码如下:  

```
dictEntry *dictFind(dict *d, const void *key) {
    dictEntry *he;
    unsigned int h, idx, table;
    
    if (d->ht[0].size == 0)
        return NULL; /* We don't have a table at all */
    if (dictIsRehashing(d))
        _dictRehashStep(d);
    h = dictHashKey(d, key);
    for (table = 0; table <= 1; table++) {
        idx = h & d->ht[table].sizemask;
        he = d->ht[table].table[idx];
        while (he) {
            if (dictCompareKeys(d, key, he->key))
                return he;
            he = he->next;
        }
        if (!dictIsRehashing(d))
            return NULL;
    }
    return NULL;
}
void *dictFetchValue(dict *d, const void *key) {
    dictEntry *he;
    
    he = dictFind(d, key);
    return he ? dictGetVal(he) : NULL;
}
```

## 删除元素

删除元素和查找元素的代码类似，　不过这里找到元素后，　需要把元素从链表中删除。  

```
/* Search and remove an element */
static int dictGenericDelete(dict *d, const void *key, int nofree) {
    unsigned int h, idx;
    dictEntry *he, *prevHe;
    int table;
    
    if (d->ht[0].size == 0)
        return DICT_ERR; /* d->ht[0].table is NULL */
    if (dictIsRehashing(d))
        _dictRehashStep(d);
    h = dictHashKey(d, key);
    
    for (table = 0; table <= 1; table++) {
        idx = h & d->ht[table].sizemask;
        he = d->ht[table].table[idx];
        prevHe = NULL;
        while (he) {
            if (dictCompareKeys(d, key, he->key)) {
                /* Unlink the element from the list */
                if (prevHe)
                    prevHe->next = he->next;
                else
                    d->ht[table].table[idx] = he->next;
                if (!nofree) {
                    dictFreeKey(d, he);
                    dictFreeVal(d, he);
                }
                zfree(he);
                d->ht[table].used--;
                return DICT_OK;
            }
            prevHe = he;
            he = he->next;
        }
        if (!dictIsRehashing(d))
            break;
    }
    return DICT_ERR; /* not found */
}
```

### 释放字典表/清空字典表

释放字典表就是先情况两个字典表，然后回收内存。  
而情况字典表则需要遍历hash数组，　删除所有链表的节点。  

下面唯一不明确的代码就是那个`callback`, 这个需要后面再解释吧。  



```
/* Destroy an entire dictionary */
int _dictClear(dict *d, dictht *ht, void (callback)(void *)) {
    unsigned long i;
    
    /* Free all the elements */
    for (i = 0; i < ht->size && ht->used > 0; i++) {
        dictEntry *he, *nextHe;
        
        if (callback && (i & 65535) == 0)
            callback(d->privdata);
        
        if ((he = ht->table[i]) == NULL)
            continue;
        while (he) {
            nextHe = he->next;
            dictFreeKey(d, he);
            dictFreeVal(d, he);
            zfree(he);
            ht->used--;
            he = nextHe;
        }
    }
    /* Free the table and the allocated cache structure */
    zfree(ht->table);
    /* Re-initialize the table */
    _dictReset(ht);
    return DICT_OK; /* never fails */
}

/* Clear & Release the hash table */
void dictRelease(dict *d) {
    _dictClear(d, &d->ht[0], NULL);
    _dictClear(d, &d->ht[1], NULL);
    zfree(d);
}
void dictEmpty(dict *d, void (callback)(void*)) {
    _dictClear(d, &d->ht[0], callback);
    _dictClear(d, &d->ht[1], callback);
    d->rehashidx = -1;
    d->iterators = 0;
}
```

### 调整hash

上面增删改成的实现都有了，　但是漏了一个重要的逻辑：调整hash.  

在调整hash时，　会先增加一个`hash[1]`, 这时增加的时候插入到新`hash[1]`中, 查询时扫描两个hash.  
这也是上面为什么要循环两个hash的原因。  

如果`hash[0]`中元素太多的话，全部调整会话费很多时间。  
所以这里选择遇到`empty_visits`次`NULL`或`n`个节点就直接返回(默认n等于１)，　下次调整时继续。  
看到这里，　也就明白了`d->rehashidx`的含义：记录上次调整的位置。  

不过我们知道redis的hash有个迭代器，　所以当有迭代器在使用hash的时候，　还是不能进行调整的。  

```
int dictRehash(dict *d, int n) {
    int empty_visits = n * 10; /* Max number of empty buckets to visit. */
    if (!dictIsRehashing(d))
        return 0;
    
    while (n-- && d->ht[0].used != 0) {
        dictEntry *de, *nextde;
        
        /* Note that rehashidx can't overflow as we are sure there are more
         * elements because ht[0].used != 0 */
        assert(d->ht[0].size > (unsigned long )d->rehashidx);
        while (d->ht[0].table[d->rehashidx] == NULL) {
            d->rehashidx++;
            if (--empty_visits == 0)
                return 1;
        }
        de = d->ht[0].table[d->rehashidx];
        /* Move all the keys in this bucket from the old to the new hash HT */
        while (de) {
            unsigned int h;
            
            nextde = de->next;
            /* Get the index in the new hash table */
            h = dictHashKey(d, de->key) & d->ht[1].sizemask;
            de->next = d->ht[1].table[h];
            d->ht[1].table[h] = de;
            d->ht[0].used--;
            d->ht[1].used++;
            de = nextde;
        }
        d->ht[0].table[d->rehashidx] = NULL;
        d->rehashidx++;
    }
    
    /* Check if we already rehashed the whole table... */
    if (d->ht[0].used == 0) {
        zfree(d->ht[0].table);
        d->ht[0] = d->ht[1];
        _dictReset(&d->ht[1]);
        d->rehashidx = -1;
        return 0;
    }
    
    /* More to rehash... */
    return 1;
}
static void _dictRehashStep(dict *d) {
    if (d->iterators == 0)
        dictRehash(d, 1);
}
```

### 迭代器

迭代器有一个特性：　迭代过程中，当前指针不能被删除。  
所有实现迭代器的时候，　有必要在迭代的时候禁止修改或者修改的时候能够感知到。  

这里支持两种模式：　安全模式(禁止修改)，　监控模式(安全检查)。  
安全模式很好理解，　有一个开关，修改的时候判断即可。  
监控模式就需要好好选择一个方法了，　选择的不好时很影响性能的，　下个小节可以看看`dictFingerprint`的实现。  

```
dictEntry *dictNext(dictIterator *iter) {
    while (1) {
        if (iter->entry == NULL) {
            dictht *ht = &iter->d->ht[iter->table];
            if (iter->index == -1 && iter->table == 0) {
                if (iter->safe)
                    iter->d->iterators++;
                else
                    iter->fingerprint = dictFingerprint(iter->d);
            }
            iter->index++;
            if (iter->index >= (long) ht->size) {
                if (dictIsRehashing(iter->d) && iter->table == 0) {
                    iter->table++;
                    iter->index = 0;
                    ht = &iter->d->ht[1];
                } else {
                    break;
                }
            }
            iter->entry = ht->table[iter->index];
        } else {
            iter->entry = iter->nextEntry;
        }
        if (iter->entry) {
            /* We need to save the 'next' here, the iterator user
             * may delete the entry we are returning. */
            iter->nextEntry = iter->entry->next;
            return iter->entry;
        }
    }
    return NULL;
}
```

## 其他功能


### 监控模式

迭代器中提到可以使用监控模式来检查迭代时，　数据是否被修改。  

这里的实现也很简单，　监控的指标有: 两个hash的指针，大小，使用个数。  
指针和大小一旦改变，　很容易监控到，　但是个数这个数据，　就不能保证了。  
比如增加一个元素，　删除一个元素，　个数是不变的。  



```
long long dictFingerprint(dict *d) {
    long long integers[6], hash = 0;
    int j;
    
    integers[0] = (long) d->ht[0].table;
    integers[1] = d->ht[0].size;
    integers[2] = d->ht[0].used;
    integers[3] = (long) d->ht[1].table;
    integers[4] = d->ht[1].size;
    integers[5] = d->ht[1].used;
    
    /* We hash N integers by summing every successive integer with the integer
     * hashing of the previous sum. Basically:
     *
     * Result = hash(hash(hash(int1)+int2)+int3) ...
     *
     * This way the same set of integers in a different order will (likely) hash
     * to a different number. */
    for (j = 0; j < 6; j++) {
        hash += integers[j];
        /* For the hashing step we use Tomas Wang's 64 bit integer hash. */
        hash = (~hash) + (hash << 21); // hash = (hash << 21) - hash - 1;
        hash = hash ^ (hash >> 24);
        hash = (hash + (hash << 3)) + (hash << 8); // hash * 265
        hash = hash ^ (hash >> 14);
        hash = (hash + (hash << 2)) + (hash << 4); // hash * 21
        hash = hash ^ (hash >> 28);
        hash = hash + (hash << 31);
    }
    return hash;
}
```

### 随机节点

假设我们的数据右上限，　当达到上限的时候，我们需要使用淘汰算法来删除数据。  
一种最简单的方式就是随机找一个数据，删除。  
字典表中提供了这样一个方法。  

算法也很简单：　第一步随机找到链表，　第二步在链表中随机找一个元素。  
由于这里的hash可能有两个，　所以需要分两种情况来特殊判断。  


```
/* Return a random entry from the hash table. Useful to
 * implement randomized algorithms */
dictEntry *dictGetRandomKey(dict *d) {
    dictEntry *he, *orighe;
    unsigned int h;
    int listlen, listele;
    
    if (dictSize(d) == 0)
        return NULL;
    if (dictIsRehashing(d))
        _dictRehashStep(d);
    if (dictIsRehashing(d)) {
        do {
            /* We are sure there are no elements in indexes from 0
             * to rehashidx-1 */
            h =d->rehashidx+ (random()% (d->ht[0].size + d->ht[1].size- d->rehashidx));
            he = (h >= d->ht[0].size) ? d->ht[1].table[h - d->ht[0].size] : d->ht[0].table[h];
        } while (he == NULL);
    } else {
        do {
            h = random() & d->ht[0].sizemask;
            he = d->ht[0].table[h];
        } while (he == NULL);
    }
    
    /* Now we found a non empty bucket, but it is a linked
     * list and we need to get a random element from the list.
     * The only sane way to do so is counting the elements and
     * select a random index. */
    listlen = 0;
    orighe = he;
    while (he) {
        he = he->next;
        listlen++;
    }
    listele = random() % listlen;
    he = orighe;
    while (listele--)
        he = he->next;
    return he;
}
```

### 32位整数hash算法

```
/* Thomas Wang's 32 bit Mix Function */
unsigned int dictIntHashFunction(unsigned int key) {
    key += ~(key << 15);
    key ^= (key >> 10);
    key += (key << 3);
    key ^= (key >> 6);
    key += ~(key << 11);
    key ^= (key >> 16);
    return key;
}
```






