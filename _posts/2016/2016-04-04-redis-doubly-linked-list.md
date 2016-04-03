---  
layout: post  
title: redis源码阅读之双向列表
description:  双向列表是一个很基础的数据结构， redis按STL的思想造了一个轮子。  
updateData:  00:57 2016/04/04
categories: [数据库]
---  


## 背景

redis是一个很不错的NOSQL数据库。  
关于redis的使用文档， 可以参考[这里]({{ site.data.link.github_tiankonguse_redis_doc }}).  
关于redis双向链表的源码可以参考[这里](https://github.com/tiankonguse/redis/tree/unstable/src/comlib/adlist)  


## 功能

双向链表， 看名字就知道， 不单单记录着下一个元素的位置， 还记录着上一个元素的位置。  
这里定义了三个基础结构：`listNode`节点元素， `listIter`迭代器， `list`列表容器， 所有操作都是在这个结构的基础上操作。  
有点STL的思想。  


```
typedef struct listNode {
    struct listNode *prev;
    struct listNode *next;
    void *value;
} listNode;

typedef struct listIter {
    listNode *next;
    int direction;
} listIter;

typedef struct list {
    listNode *head;
    listNode *tail;
    void *(*dup)(void *ptr);
    void (*free)(void *ptr);
    int (*match)(void *ptr, void *key);
    unsigned long len;
} list;
```

基础结构确定后， 对应的基本操作也就确定了。  



* `listCreate` 创建列表
* `listRelease` 释放列表
* `listAddNodeHead` 列表头部增加元素
* `listAddNodeTail` 列表尾部增加元素
* `listInsertNode` 指定位置增加元素(前或者后由参数决定)
* `listDelNode` 删除元素


对于一个容器， 迭代也需要具备一些基本功能。  

* `listGetIterator` 创建迭代器
* `listNext` 迭代
* `listReleaseIterator` 释放迭代器

redis还附加了一些功能。  

* `listDup` 复制列表
* `listSearchKey` 列表中搜索值
* `listIndex` 表中指定位置的节点
* `listRewind` 迭代器重置到表头
* `listRewindTail` 迭代器重置到表尾
* `listRotate` 顺时针旋转指针一次（循环左移）



## 基本操作


### 创建列表

申请内存， 初始化列表即可。  

```
list *listCreate(void){
    struct list *list;
    if ((list = zmalloc(sizeof(*list))) == NULL)
        return NULL;
    list->head = list->tail = NULL;
    list->len = 0;
    list->dup = NULL;
    list->free = NULL;
    list->match = NULL;
    return list;
}
```

### 释放列表

先释放节点， 最后释放列表。  

```
void listRelease(list *list) {
    unsigned long len;
    listNode *current, *next;
    
    current = list->head;
    len = list->len;
    while (len--) {
        next = current->next;
        if (list->free)
            list->free(current->value);
        zfree(current);
        current = next;
    }
    zfree(list);
}
```

### 列表头部增加元素

对于头部添加元素， 需要特殊考虑的就是是否已经有节点了。  
又由于是双向列表， 所以需要旧的头部的`prev`指向新的节点。  

```
list *listAddNodeHead(list *list, void *value) {
    listNode *node;
    
    if ((node = zmalloc(sizeof(*node))) == NULL)
        return NULL;
    node->value = value;
    if (list->len == 0) {
        list->head = list->tail = node;
        node->prev = node->next = NULL;
    } else {
        node->prev = NULL;
        node->next = list->head;
        list->head->prev = node;
        list->head = node;
    }
    list->len++;
    return list;
}
```

### 列表尾部增加元素

增加尾部节点和增加头部节点类似， 需要判断是否已经有节点了。  
旧的尾部指向新的尾部。  

```
list *listAddNodeTail(list *list, void *value) {
    listNode *node;
    
    if ((node = zmalloc(sizeof(*node))) == NULL)
        return NULL;
    node->value = value;
    if (list->len == 0) {
        list->head = list->tail = node;
        node->prev = node->next = NULL;
    } else {
        node->prev = list->tail;
        node->next = NULL;
        list->tail->next = node;
        list->tail = node;
    }
    list->len++;
    return list;
}
```
### 指定位置增加元素

由于是指定位置添加元素， 所以可以确定列表中已经有元素了。  
所以可以先把新节点的`prev`和`next`确定了。  
然后根据节点是否是头部，尾部来更新其他节点的指针和列表的指针。  


```
list *listInsertNode(list *list, listNode *old_node, void *value, int after) {
    listNode *node;
    
    if ((node = zmalloc(sizeof(*node))) == NULL)
        return NULL;
    node->value = value;
    if (after) {
        node->prev = old_node;
        node->next = old_node->next;
        if (list->tail == old_node) {
            list->tail = node;
        }
    } else {
        node->next = old_node;
        node->prev = old_node->prev;
        if (list->head == old_node) {
            list->head = node;
        }
    }
    if (node->prev != NULL) {
        node->prev->next = node;
    }
    if (node->next != NULL) {
        node->next->prev = node;
    }
    list->len++;
    return list;
}
```

### 删除元素

处理好其他节点的指针和列表的指针即可。  

```
void listDelNode(list *list, listNode *node) {
    if (node->prev)
        node->prev->next = node->next;
    else
        list->head = node->next;
    if (node->next)
        node->next->prev = node->prev;
    else
        list->tail = node->prev;
    if (list->free)
        list->free(node->value);
    zfree(node);
    list->len--;
}
```

## 迭代器

### 创建迭代器

申请迭代器的内存， 确认是头部还是尾部即可。  

```
listIter *listGetIterator(list *list, int direction) {
    listIter *iter;
    
    if ((iter = zmalloc(sizeof(*iter))) == NULL)
        return NULL;
    if (direction == AL_START_HEAD)
        iter->next = list->head;
    else
        iter->next = list->tail;
    iter->direction = direction;
    return iter;
}
```


### 迭代

根据方向， 移动带下一个节点。  

```
listNode *listNext(listIter *iter) {
    listNode *current = iter->next;
    
    if (current != NULL) {
        if (iter->direction == AL_START_HEAD)
            iter->next = current->next;
        else
            iter->next = current->prev;
    }
    return current;
}
```


### 释放迭代器

```
void listReleaseIterator(listIter *iter) {
    zfree(iter);
}
```

## 附加功能

### 复制列表

不知你是否还记得list结构里面的`void *(*dup)(void *ptr);`函数指针。  
这个函数指针用于决定是否深拷贝列表， 如果要深拷贝列表， 需要指定深拷贝函数。  

```
list *listDup(list *orig) {
    list *copy;
    listIter *iter;
    listNode *node;
    
    if ((copy = listCreate()) == NULL)
        return NULL;
    copy->dup = orig->dup;
    copy->free = orig->free;
    copy->match = orig->match;
    iter = listGetIterator(orig, AL_START_HEAD);
    while ((node = listNext(iter)) != NULL) {
        void *value;
        
        if (copy->dup) {
            value = copy->dup(node->value);
            if (value == NULL) {
                listRelease(copy);
                listReleaseIterator(iter);
                return NULL;
            }
        } else
            value = node->value;
        if (listAddNodeTail(copy, value) == NULL) {
            listRelease(copy);
            listReleaseIterator(iter);
            return NULL;
        }
    }
    listReleaseIterator(iter);
    return copy;
}
```

### 列表中搜索值

列表搜索的时候， 同样需要指定搜索函数`int (*match)(void *ptr, void *key);`。  
如果没指定搜索函数， 将会按指针比较来搜索了。  
搜索复杂度`O(n)`.  


```
listNode *listSearchKey(list *list, void *key) {
    listIter *iter;
    listNode *node;
    
    iter = listGetIterator(list, AL_START_HEAD);
    while ((node = listNext(iter)) != NULL) {
        if (list->match) {
            if (list->match(node->value, key)) {
                listReleaseIterator(iter);
                return node;
            }
        } else {
            if (key == node->value) {
                listReleaseIterator(iter);
                return node;
            }
        }
    }
    listReleaseIterator(iter);
    return NULL;
}
```

### 表中指定位置的节点

通过位置来获得节点的实现简单粗暴： 一个循环即可。  
当位置是负数的时候， 就是从尾部逆序搜索了。  
当位置大于列表的节点个数时， 肯定会返回空指针了。  
实际上可以先判断一下位置， 这样对于大于列表节点个数的查询， 直接返回空指针。  


```
listNode *listIndex(list *list, long index) {
    listNode *n;
    
    if (index < 0) {
        index = (-index) - 1;
        n = list->tail;
        while (index-- && n)
            n = n->prev;
    } else {
        n = list->head;
        while (index-- && n)
            n = n->next;
    }
    return n;
}
```

### 迭代器置头置尾

```
void listRewind(list *list, listIter *li) {
    li->next = list->head;
    li->direction = AL_START_HEAD;
}

void listRewindTail(list *list, listIter *li) {
    li->next = list->tail;
    li->direction = AL_START_TAIL;
}
```

### 顺时针旋转

实现方式很普通：保存尾节点， 列表的尾节点更新， 插入头节点。  

```
void listRotate(list *list) {
    listNode *tail = list->tail;
    
    if (listLength(list) <= 1)
        return;
    
    /* Detach current tail */
    list->tail = tail->prev;
    list->tail->next = NULL;
    /* Move it as head */
    list->head->prev = tail;
    tail->prev = NULL;
    tail->next = list->head;
    list->head = tail;
}
```


实际上可以更简单点。  
当然， 下面的方法需要八条语句， 但是应该更好理解吧。  

```
void listRotate(list *list) {
    
    if (listLength(list) <= 1)
        return;
    
    //节点首尾相连
    list->tail->next = list->head;
    list->head->prev = list->tail;
    
    //列表更新首尾
    list->tail = list->tail->prev；
    list->head = list->head->prev;
    
    //首尾节点反相连
    list->tail->next = NULL;
    list->head->prev = NULL;
}
```




