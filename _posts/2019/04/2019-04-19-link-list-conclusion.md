---   
layout:     post  
title:  链表的高级应用，你会吗？
description: 链表高级应用学会后，你会发现已经会树的操作了  
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateData: 2019-04-19 23:24   
published: true 
wxurl: https://mp.weixin.qq.com/s/SQCJWiG2HMhI8U-hVTvk7A  
---  


## 一、背景  


前面分享了《[单向链表就是这么简单](https://mp.weixin.qq.com/s/rG1ehI-9QK8h7p6_KkRJew)》、《[面试中必问的几道链表问题](https://mp.weixin.qq.com/s/2tT4j-ePNeoktqkVNvAqJQ)》、《[链表反转与双向链表就是这么简单](https://mp.weixin.qq.com/s/EJwgXqkgTy5pIUvHQx4zgA)》三篇文章，现在分享一下链表的最后一篇文章：链表高级应用。  


这里的几道练习题学习之后，可以发现链表有多个指针的时候，就可以称为树或者图了。  


## 二、总结  


看练习题之前，先看看链表各种操作的复杂度。  


![](http://res.tiankonguse.com/images/2019/04/19/link-list-conclusion-001.png)  


如上图可以看出链表的操作复杂度  
通过下标随机访问的复杂度是`O(n)`  
通过指定的节点，可以`O(1)`复杂度内插入元素  
对于双向链表，通过指定的节点，可以在`O(1)`复杂度删除元素。  


这些复杂度其实都是数据结构的特征限制的，你们不需要强行记住这些复杂度，只需要知道数据结构的特征就行了。  
到时候需要复杂度时，简单推理一下就可以得到了。  


## 三、合并两个有序链表  


题意：告诉你两个有序链表，求合并后的链表。  


思路：这道题有点归并排序的味道。  
每次从两个链表得到最小的链表，删除头结点，插入到新列表最后面。  


![](http://res.tiankonguse.com/images/2019/04/19/link-list-conclusion-002.png)  


## 四、两数相加  


题意：给两个逆序数字链表，求和。  
逆序数字链表指的是链表每个节点一位数字，个位在最前面，最高位在最后面。  


思路：如果给的是正常的数字链表，使用上一篇文章的《[链表反转](https://mp.weixin.qq.com/s/EJwgXqkgTy5pIUvHQx4zgA)》即可得到逆序数字链表。  
不过这里都是逆序的，反而简单了，直接循环加就可以了。  


注意事项：  
1、两个链表长度可能不一样，此时需要使用`0`和较长的相加。  
2、最后可能会进位，所以需要特殊判断。如果进位则再加上一个进位的数字。  


![](http://res.tiankonguse.com/images/2019/04/19/link-list-conclusion-003.png)  


## 五、扁平化多级双向链表  


题意：给你一个特殊的链表。每个节点有两个指针，一个指向下一个节点，另一个指向新的链表。  
求这个特殊链表扁平化后的链表。  
如下图  


![](http://res.tiankonguse.com/images/2019/04/19/link-list-conclusion-004.png)  


偷偷告诉你们，这种特殊的链表其实就是一个二叉树。  
而题意说的扁平化多级双向链表，就是先序遍历这个二叉树。  


先序的意思是先输出父节点，然后输出所有的左儿子节点，最后输出所有的右儿子节点。  
这个使用递归再合适不过了。  


递归函数的定义是扁平化当前链表，返回尾指针。  
得到了展开后的链表，你就可以直接将这里展开的链表插入到当前位置之后（之前都是插入一个节点，现在是插入一个链表）。  


![](http://res.tiankonguse.com/images/2019/04/19/link-list-conclusion-005.png)  


## 六、复制带随机指针的链表  


题意：给你一个特殊的链表，每个节点有两个指针，一个指向下一个节点，另一个指向链表中的随机一个节点。  
求这个链表的深`copy`。  


![](http://res.tiankonguse.com/images/2019/04/19/link-list-conclusion-006.png)  


再次偷偷的告诉你，这个其实就是一个简单的图。  
对于链表的深`copy`，需要对每个指针创建一个新的实例。  
而对于图，由于一个节点会有多个节点指向它，所以创建新实例之前需要先判断是否已创建。  


![](http://res.tiankonguse.com/images/2019/04/19/link-list-conclusion-007.png)  


## 七、旋转链表  


题意：告诉你一个链表，求顺时针循环移动`K`次后的链表。  


思路：先找到新链表的头部，拆分为两个链表，然后拼接即可。  


![](http://res.tiankonguse.com/images/2019/04/19/link-list-conclusion-009.png)  


注意实现：`K`可能很大，需要先对链表长度取模。  
另外就是，`K`是向右移动次数。如果使用左右交换的方法，你其实需要找到的是第`len - K`个节点。  


![](http://res.tiankonguse.com/images/2019/04/19/link-list-conclusion-008.png)  


## 八、最后  


好了，链表其实就是对`next`指针的运用，做了这么多实践练习，相信你已经学的差不多了吧。  


那如果让你对链表做一个快速排序，是不是也很简单呢？  
源代码大概如下：  


```
def qsort(head)
    if(!head || !head->next)return head
    (first, second) = split(head, head->val)
    first=qsort(first)
    second=qsort(second)
    head=merge(first, second)
    return head
```


后面的文章，将会给你们分享树的知识。  
你想学树的什么知识呢？  


-EOF-  


