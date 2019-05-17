---   
layout:     post  
title:  【算法】链表就是这么简单（基础）
description: 数组、队列、栈分享完了，接下来是链表的知识。    
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateData: 2019-04-11 23:24   
published: true 
wxurl: https://mp.weixin.qq.com/s/rG1ehI-9QK8h7p6_KkRJew  
---  


## 一、背景  

之前写了五篇文章来讲解了《[数组就是这么简单](https://mp.weixin.qq.com/s/n_B38CXxmvsOl7FZxyPKgA)》系列，后来写了四篇文章来讲解《[队列与栈就是这么简单](https://mp.weixin.qq.com/s/y9vQ5gUdUAfiZXZFHoVrKg)》，今天开始讲解链表。  


## 二、基础  


链表与数组类似，也是一种线性数据结构。  
如下图：  


![](http://res.tiankonguse.com/images/2019/04/link-so-easy-001.png)  


链表中的每个元素都是一个对象，每个对象里有一个字段来指向下一个对象元素。  


PS：注意，上面的解释中，我并没有说使用指针字段指向下一个对象。在后面图的小节中，会介绍使用数组来模拟链表的方法。  


常见的链表有两种类型：单向链表和双向链表。  
上面的图片是单向链表，下面的图片是双向链表。  


![](http://res.tiankonguse.com/images/2019/04/link-so-easy-002.png)  


PS：注意，在链表头结点和链表尾节点，有时候会使用指针来标识，有时候会使用额外的对象来标识。  


## 三、复杂度  


链表与数组不同，你无法在常量时间内访问单向链表中的随机元素（第几个元素）。  
如果你想要获得第i个元素，就必须从头开始遍历。  
所以这里按照索引来访问元素的复杂度是`O(n)`。  


## 四、插入元素  


如果你想在链表指定位置之后插入一个元素，则需要这么做。  


1.得到待插入节点`cur`和指定位置节点`pre`。  


![](http://res.tiankonguse.com/images/2019/04/link-so-easy-003.png)  


2.将`cur`的next指向`pre`的`next`。  


![](http://res.tiankonguse.com/images/2019/04/link-so-easy-004.png)  


3.将`pre`的next指向`cur`  


![](http://res.tiankonguse.com/images/2019/04/link-so-easy-005.png)  


这里可以看到，链表和数组的区别是插入元素时，不需要将之后的所有元素后移。  
所以你可以在`O(1)`的复杂度将一个节点插入到指定位置。  


思考题：如何将`cur`插入到链表头部或者链表尾部的那个节点？  


## 五、删除元素  


如果你想从单向链表中删除一个节点`cur`，分两步即可。  


1.找到`cur`的上一个节点`pre`。  


![](http://res.tiankonguse.com/images/2019/04/link-so-easy-006.png)  


2.将`pre`的next指向`cur`的next即可（`cur`的next是否情况按具体情况处理）。  


![](http://res.tiankonguse.com/images/2019/04/link-so-easy-007.png)  


如果你已经知道`pre`的话，可以在`O(1)`复杂度内完成删除。  
如果不知道则需要先使用`O(n)`来找到`pre`，然后再完成删除。  


思考题：如何删除链表头部或者链表尾部的那个节点？  


## 六、设计链表  


自己设计一个链表，需要具备下面这些功能。  
注：下面的`index`下标都是从`0`开始。  


1.`get(index)` 获取第`index`个节点的值  
2.`addAtHead(val)` 在链表第一个元素之前插入一个节点  
3.`addAtTail(val)` 在链表最后一个元素之后插入一个节点  
4.`addAtIndex(index,val)` 在第`index`元素之前插入一个节点  
5.`deleteAtIndex(index)` 删除第`index`个元素  


思路：这里只需要实现一个函数：查询指定位置的节点，之后就可以实现所有功能了。  


```
class MyLinkedList {
    struct SinglyListNode {
        int val;
        SinglyListNode *next;
        SinglyListNode(int x = 0) : val(x), next(NULL) {}
    };
    SinglyListNode* head;
    int iNodeNum;

    SinglyListNode* getNode(int index){
        SinglyListNode* node = head;
        while(index-- > 0){
            node = node->next;
        }
        return node;
    }
public:
    MyLinkedList() {
        head = nullptr;
        iNodeNum = 0;
    }
    int get(int index) {
        if(index >= iNodeNum || index < 0)return -1;
        SinglyListNode* node = getNode(index);
        return node->val;
    }
    void addAtHead(int val) {
        SinglyListNode* node = new SinglyListNode(val);
        node->next = head;
        head = node;
        iNodeNum++;
    }
    void addAtTail(int val) {
        addAtIndex(iNodeNum, val);
    }
   void addAtIndex(int index, int val) {
        if(index <= 0){
            addAtHead(val);
        }else if(index <= iNodeNum && index > 0){
            SinglyListNode* node = new SinglyListNode(val);
            SinglyListNode* pre = getNode(index-1);
            node->next = pre->next;
            pre->next = node;
            iNodeNum++;
        }
    }
    void deleteAtIndex(int index) {
        if(index >= iNodeNum || index < 0)return ;
        SinglyListNode* node = nullptr;
        if(index == 0){
            node = head;
            head = head->next;
        }else{
            SinglyListNode* pre =  getNode(index-1);
            node = pre->next;
            pre->next = node->next;
        }
        iNodeNum--;
        delete node;
    }
};
```


## 七、最后  


这里介绍了链表的定义、插入和删除如何实现，以及讨论了复杂度。  
下一篇文章来介绍一些链表的实际使用场景吧。  



-EOF-  


