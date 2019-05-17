---   
layout:     post  
title:       清理journal日志  
description:  journal 是什么，该如何清理？      
keywords: 技术 
tags: [程序人生]  
categories: [程序人生]  
updateData:  23:40 2018/09/10   
published: true   
---  


## 背景



![](http://res.tiankonguse.com/images/2018/09/disk-journal.png)   


最近收到磁盘告警，一看是根目录所在磁盘快满了。  
使用du命令找到 /run/log/journal 这个目录占了4G的大小空间。  
这里就有两个问题了：我是谁？我要干什么？  
具体点就是 journal 是什么？ 怎么处理 journal 来降低磁盘的使用率。  


## 介绍




我们知道，linux有一个系统日志，会记录很多信息，比如开机过程、服务启动过程、登陆信息、任务信息等。  
那自然有一个疑问，这个日志是谁记录的？    


以前的时候，都是使用 rsyslogd 这个守护进程来记录，但是 rsyslogd 有个问题就是只能开机后才能开始记录。  
开机过程中的一些信息之前都是使用内核的一个 klogd 服务记录，等 rsyslogd 启动后再同步过来处理。  


现在，操作系统进化改进了，在内核 systemd 启动后， 直接会拉起一个 systemd-journald 进程来收集所有信息。  


为了性能，systemd-journald 是使用内存来储存日志文件的，因此重启机器时，之前的日志就会都被清除。  
上面的截图也可以看到，日志的路径为 /run/log/journal/ ，这是操作系统 CentOS 的特性， /run/ 目录下的内容都会映射到内存。  


至于 journal 的使用，可以参考 `man journalctl`。  


## 清理


最后，我们的问题就是怎么清理 journal 了，毕竟磁盘快满了。  
而且 journal 作为系统的进程，还不能影响系统的正常运行，也不能影响其他服务的正常运行。  


这个网上找到了答案，如下图：



![](http://res.tiankonguse.com/images/2018/09/clear-journal.png)   


文本如下：  


```
journalctl --vacuum-time=2d
journalctl --vacuum-size=500M
```


只需永久生效，则需要修改系统配置并重启 journal 服务，这个还是不要随便重启系统服务比较好。  


参考资料：  
1. 《鸟哥的 Linux 私房菜：基础学习篇 第四版》  
2. stackexchange  





---


本文首发于公众号：天空的代码世界，微信号：tiankonguse-code。  


推荐阅读：  


* [经济危机（一）](https://mp.weixin.qq.com/s/hxO7oR8cLljSClYS-yE6pw)   
* [读书《淘宝技术这十年》](https://mp.weixin.qq.com/s/IeOQGh22U_1TPrf6sYYTkQ)  
* [读恐怖小说《1984》](https://mp.weixin.qq.com/s/q7HL5o_R5cqJc0b9Ll7EMw)    
* [那些营销套路（初级版）](https://mp.weixin.qq.com/s/xdvqZo9ll6kaL66Cdx)   
* [数据脏了怎么办](https://mp.weixin.qq.com/s/Blw4yxmIsE51dzzbNcfFbg)    
* [中年危机笔记与思考](https://mp.weixin.qq.com/s/dFzDtZS0JN6hhpc1DF-e_g)     
* [《长尾理论》解释了抖音为啥火了](https://mp.weixin.qq.com/s/sFWtMYj_WOKdgjolo7T56A)  



![](http://res.tiankonguse.com/images/tiankonguse-support.png)   


今天长按识别上面的二维码，在公众号中回复“**ACM模板**”，你将免费获得我大学耗时四年整理的《ACM算法模板》。  
回复“**算法的世界**”，或点击**阅读原文**加入“tiankonguse的朋友们”，已有三百多个小伙伴加入。  



