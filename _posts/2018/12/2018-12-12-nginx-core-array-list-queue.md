---   
layout:     post  
title:  Nginx 数据结构之 Array、List、Queue
description: Nginx 用到的数据结构都自己实现了，今天来看三个简单的。  
keywords: 技术
tags: [程序人生]  
categories: [程序人生]  
updateData: 2018-12-12 16:27  
published: true   
wxurl: https://mp.weixin.qq.com/s/e_eA8cbfG_681EU06v0jhA  
---  

 


## 一、背景

之前在内部分享了一次 Nginx，并写了一篇文章《[一次 Nginx 分享](https://mp.weixin.qq.com/s/wGscVGR7Ytf8uMWzEwOjLQ)》。  
后来分享了 Nginx 很魔幻的内存池文章《[Nginx 中的内存池](https://mp.weixin.qq.com/s/hcnMA0h5BPsRJH9cnmq7hw)》。  
魔幻不是由于实现的有多高端，而是实现的非常简单，简单到什么都没有，数据结构的功能都耦合到业务实现中去了。  


今天，我们来看看 Nginx 的 Array、List、Queue数据结构吧，看了更魔幻。  


## 二、Nginx 的 Array

Nginx 中 Array 只对外提供了四个函数：创建数组、回收数组、申请一个元素、申请n个元素。  

![](http://res.tiankonguse.com/images/2018/12/20181212172517.png)  


创建数组函数用于申请一个数组头和长度为`n`大小为`size`的连续节点。  
回收数组函数用于回收内存。  


![](http://res.tiankonguse.com/images/2018/12/20181212185149.png)  


申请一个元素会先判断是否还有剩余空间，就返回最后一个空闲的节点。  
如果不够了，先判断当前数组是不是在内存池最后分配的。如果是最后分配的，而且还有空闲空间，就直接扩大内存。  
而内存池也满了，那就重新按两倍法申请一个新的内存，数据`memcpy`过去。  
旧的内存也没有回收。


## 三、Nginx的 List  

Nginx 的 List 保持了传统的魔幻风格，只有两个函数：`create`函数 和 `push`函数。  


创建函数和`Array`类似，申请`n`个元素。  
`push`函数和数组的功能也类似，从前向后返回一个空节点。  


而当空节点用完时，这里会去申请一个大小为`n`的`List`，然后当做链表挂在最后面。  
这个不就是我们之前在《[从零开始学算法：6.链表](https://mp.weixin.qq.com/s/mLvJEc-wmsTZcAMt3fGAKQ)》文章里介绍的分块链表吗？   


还有其他功能吗？没有了  


## 四、Nginx 的 Queue

前面看了`Nginx`的`Array`和`List`，竟然和我们之前认识的不一样。  
那队列呢，和你认识的也不一样的。  


队列只提供了两个函数：`queue_middle`和`queue_sort`。  
对于其他的，都是宏的形式提供，比如`insert_head`、`insert_after`、`insert_remove`等。  


看到这里，业内人士会发出惊呼：这哪是队列呢？这明明是链表嘛！  
是的，你们是正确的，在`Nginx`里面看到的名字和具体实现差异很大的。  
我们看到的名字是队列，实际是链表。  
看到的是链表，实际是分块链表。  


那提供的两个函数是什么功能呢?  


顾名思义，第一个函数是查找链表的中值，第二个函数是对链表排序。  


1.中值查找  


下面我们来看看相关实现吧，很简单。  


![](http://res.tiankonguse.com/images/2018/12/20181212192118.png)


链表查找中值，使用了另一道经典链表面试题的思想。  
面试题：怎么判断链表有环？  


看到这个面试题，很多工作的人都可以说上答案来吧。  
典型的做法是两倍追赶法。  


而对于链表，查找中值也是使用两倍追赶法来实现的。  


2.链表排序  


链表排序那就很朴素了，使用冒泡排序即可。  

![](http://res.tiankonguse.com/images/2018/12/20181212192950.png)  


## 五、最后


`Nginx` 里面数据结构都是半成品，一半在数据结构中实现了，一半在业务代码中调用数据结构时实现。  
是的，耦合就是这么深，这样那些实现的数据节后我们就不能拿出来单独使用了。  
为啥这样做就不得而知了。  



今天分享一本内存相关的数，名字叫做《编程珠玑》，公众号后台回复"编程珠玑"领取。  




