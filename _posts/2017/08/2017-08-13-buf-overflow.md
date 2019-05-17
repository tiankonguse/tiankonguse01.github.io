---   
layout:     post  
title:      记一次buf溢出的问题  
description: 周五帮同事定位了一下,原来是buf溢出导致的。  
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateData:  22:24 2017/8/13  
published: true  
---  
  
  
>   
> 大家好，这里是tiankonguse的公众号(tiankonguse-code)。    
> tiankonguse曾是一名ACMer，现在是鹅厂视频部门的后台开发。    
> 这里主要记录算法，数学，计算机技术等好玩的东西。   
>      
> 这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/Cte5aGAGuwAQ5tmQXTPhGw)自动同步过来。    
> 如果转载请加上署名：公众号tiankonguse-code，并附上公众号二维码，谢谢。  
>   
>    
  

## 零、背景

周五进行了一场组内分享《[如何定位线上问题](http://mp.weixin.qq.com/s/pkGUvsIAPD75VlcZEaAiHg)》，结果分享开始前的那一刻，一位同事的服务突然开始偶尔coredump了。  
这次coredump比较奇怪，很久没有发版本了，所以只能看能不能快速找到哪里出问题了。  
结果他没找到，于是求助与我。  


问他影响严重吗？回答不严重。于是大家说先进行分享，结束之后再来看看。  
分享结束了到吃饭时间了，问目前严重吗？回答还行。于是大家说先去吃饭，回来之后再看看吧。  
吃完饭另一个同事说鬼吹灯可以看了，我就说看完再帮忙定位吧，那位同事说还是先定位吧，于是就有了这篇文章了。  


## 一、GDB看堆栈

由于一会必然coredump一次，于是随便找一个进程挂上去，结果每次coredump的时候堆栈还不一样.  
于是猜测有空指针,导致堆栈乱了.  


幸运的是偶尔还是可以得到一个完整的栈信息的（是的，堆乱了，但是栈还没乱）.  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1897376146.png)  


看对应的信息，发现都是网络框架的信息。  
找到框架源码，发现异常的最后位置是回调业务的函数。  
于是怀疑回调指针为空导致coredump。  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/4010023729.png)


快速grep搜索对应的代码，有三四十处，但是发现都是直接new一个对象的，这个指针(pCurActionInfo1)不可能为空。
不过另一个指针(pCurActionInfo1)传给智能指针,然后塞到map中,倒有可能导致指针的内容提前释放.  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1955555081.png)


但是现在堆栈中没有业务的信息，没法确定是哪个地方有这个问题的。  


## 二、堆栈与源码结合

这时候，我只能先看看框架源码，看能不能找到有用的信息，然后来确定是哪块业务逻辑出问题了。  
业务代码有三四十个地方，我又不了解业务, 不能太贸然的去看业务代码, 等确定是哪个地方出问题了，再去review一下就可以快速找到问题了.  

堆栈一层层的找，当找到第三层时， 这个参数id给了突破口，因为猜想没错的话，这个id就可以唯一确定业务的代码位置了。  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1866906486.png)


继续向下看, 此时可以确定这个id就是自己猜想的意思，于是告诉同事看id为23的代码就行了。  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/945906684.png)
  

## 三、review业务代码


告诉那个同事代码位置后，我本想去看鬼吹灯了。  
结果等了许久，那同事说没看出什么问题来。  

于是我问出那个代码具体在哪里，看之后确定肯定是有问题的。  

可以看出，当GenActorAccount的两个参数相同时，就会存在map因相同key而插入失败，进而指针会被释放。  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1792396172.png)  


同事回答之前已经有逻辑使用set去重了,不会有重复的。  
于是我打开了GenActorAccount这个函数。  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2218505554.png)  


看到这个函数，可以一眼就看出当`strUserID`很大的时候，20个buf很容易就填满。  
如果前缀相同，必然反返回相同的key，从而出现之前说的内存被提前释放。  


那位同事不相信，测试环境构造出这样的数据一侧，测试环境重现问题了。  
接下来要做的就是发版本修复这个问题了。  


## 四、总结

其实这个问题，前面怎么由空指针找到具体代码可能有难度，那时候需要的就是沉下心来分析堆栈(堆已经乱了,只剩下栈了)。  
到了后面已经确定业务代码了，其实严格一点的话，大家都应该能够发现潜在的问题，尤其是边界问题。  


这时候又比较怀念ACM比赛的时光了。  
那个比赛不仅仅考察算法能力，还考察对一个问题是否全面分析，全面思考。  
只要有一个边界没有想到，对应的题就会过不了。  


所以参加了ACM比赛后，就像锻炼出了火眼金睛，一下就能看出有哪些边界情况。  



  
对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
欢迎大家加入看各种算法的思路。  

![](http://res.tiankonguse.com/images/suanfa_xiaomiquan.jpg)  
  
  
长按图片关注公众号，阅读不一样的技术文章。   
  
![](http://res.tiankonguse.com/images/weixin-50cm.jpg)  
  
  