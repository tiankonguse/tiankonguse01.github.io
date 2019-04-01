---   
layout:     post  
title:  【算法】队列理论就是这么简单  
description: 数组系列的知识分享完了，今天开始分享队列的基础知识。  
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateData: 2019-04-02 23:24   
published: false 
wxurl: https://mp.w eixin.qq.com/s/UB1_uHMhFVrLTPtusb_NJQ  
---  


## 一、背景  

前面分享了《[数组就是简单系列](https://mp.weixin.qq.com/s/n_B38CXxmvsOl7FZxyPKgA)》，接下来就是分享队列和栈了。  


我们知道，我们可以通过索引下标来随机访问数组的元素。  
但是有时候，我们会对访问顺序进行限制。  
比如先进先出，就对应队列数据结构；后进先出对应栈数据结构。  


接下来的几篇文章会介绍队列和栈的基础知识，以及用来解决什么问题，即实践与应用。  


下面我们先来看看队列的基础知识吧。  


## 二、队列的定义  


![](/images/2019/04/leetcode-queue-base-001.png)  


队列是一种先进先出的数据结构。  
先进先出英文是 `First In First Out`，简称为`FIFO`。  
具体含义就是首先处理添加到队列中的第一个元素。  


一般，插入操作称为入队（enqueue），具体实现是将新元素放在了队列的最后。  
而删除操作称为出队（dequeue），即将最前面的元素删除。  









-EOF-  


