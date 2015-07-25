---  
layout: post  
title: redis 源代碼閱讀
description:  好久之前就在github上fork了redis的源代碼，但是一直沒有找時間去閱讀，今天開始堅持閱讀redis的源代碼吧。
tags:  redis
keywords: redis
updateData: 2015-07-25 14:55 
categories: [程序人生]
---  

## 背景

很早之前就听说过redis, 但是一直不知道redis到底强大在哪里了。  
如果仅仅是key-vakue型分布式内存型数据库的话， 这样的开源库有很多的。  
后来查了文档，才知道，redis做到了另一个功能：value可以支持多种类型。  
比如有字符串列表，无序集合，有序集合， 当然还有基本的hashMap功能。  


## 源代码

redis 的源代码在 [这里][github-redis] . 

这个文章测试一下。


[github-redis]: https://github.com/tiankonguse/redis

