---   
layout:     post  
title:      圣诞？碎碎念！  
description: 又到圣诞节了，有快两个月没有动笔了，今天写点什么东西吧。    
keywords: 程序人生  
tags: [程序人生]  
categories: [程序人生]  
updateData:  22:25 2017/12/25
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

11月份起，我便很少动笔了。整个人都变懒了，不想动了。  
两个月期间，睡眠的时间点竟然更晚了，现在想想也不知道自己都干嘛了。  
书貌似也没看几本，人也变得没精神了。  
上个周五小组聚餐，意外聊到印象笔记，于是我回来找了找我曾经的笔记。  
翻了近六七年的邮件和QQ空间状态，看到一些东西，如今恰好是圣诞节了，于是想写点什么了,讲几个故事吧。  
这篇文章大概分三个故事：死亡笔记，伤物语，圣诞日记。  



## 一、死亡笔记

从最初的邮箱中，发现我是在2012年1月份开始使用evernote的。  
那时候还没有印象笔记这个名字，那时候我的网络ID还是tiankongever，那时候我还自称神。  


![](/images/2017/12/20171226004047.png)
![](/images/2017/12/20171226012328.png)  



大概半年后，evernote有了中文版，名字叫做印象笔记。由于印象笔记不和evernote兼容，我使用QQ邮箱注册了新用户。 


![](/images/2017/12/20171226012811.png)  

   
由于当时印象笔记体验是如此糟糕，我同期还使用了另一个笔记软件为知。为什么用为知？因为可以把我在博客园写的所有东西全部下载下来。  

![](/images/2017/12/20171226013249.png)  
![](/images/2017/12/20171226013902.png)

evernote和为知就这样使用了一年多，在2013年8月份，我使用tiankonguse邮箱重新注册了一个evernote账号，然后发生了什么事情不记得了，影响是两年的笔记都没了。为知的备份没了，evernote的也没了。  
所有，我的所有笔记都只能查到2013年8月份，之前的都成为一种记忆。  


![](/images/2017/12/20171226013415.png)  
![](/images/2017/12/20171226014216.png)


也许从那之后，我就再也不相信这些笔记软件了，不再使用笔记软件了。  
当然那些都是2013年的事情了，现在2017年12月25日了，我准备重新拾起曾经的笔记，重新整理自己的知识图谱。  



## 二、伤物语

12月15日，公司举办两会。公司年会下午举行，元旦晚会晚上举行。两会还有各种大奖等着他们去抽。  
我知道这些与我无关，所以今年我根本就没想过去参加这些活动。  
恰好当天朋友李珂来深圳玩，下午到。我们是高中同学，好多年没见了，便想着他到了就带他去上次和学长一起去吃烧烤的地方吃饭，聊聊天什么的。  


中午，其他人都走了，我们组的老员工没去，结果新员工也跟着没去了。  
这个责任在我，如果我去的话，大家应该都会去吧。  
十二点多吃完午饭，公司年会也就开始了，没去的在看直播。而我突然困意来袭，就不管年会了，睡我的觉去了。  


三点多睡醒了，闲着没事干，拉上同事开黑玩一局农药。结果一局没玩完，有人跑过来说线上A服务出问题了，看看监控确实异常了，但是目前的监控信息不足以发现哪里的问题。    
过了一会另外一个同事找我，说B服务出问题了，还发了图给我。一看他给我的图，我猜到什么问题了，应该是机房故障。  
赶紧看看A服务，虽然两个服务没关联，但都在一个机房，确认机房问题。  


具体是A服务在双写储存，其中一个写节点在故障机房。而恰好这个双写是这周做的事情：增量双写，同步全量，对比数据。做了整整一周，对外还没有正式读，现在却出了这样一个幺蛾子。  
我犹豫了几秒，还是狠下心把新的写节点摘除了，一周的工作白做了，A服务随即恢复正常。  

而对于B服务，我不需要做任何事情，几百个调用方业务，只有他这个业务有问题，说明他的调用方式有问题。  
考虑到当天凌晨一点的时候，这个机房也整体不可用了一段时间，又是周五，那个主写点我就不挂上去了吧，我想好好过个周末，下周重新来过吧。  


傍晚饿着肚子等李珂的到来，那时已经是七点多了。  
走到烧烤店，发现排队的人坐满了整个广场，于是决定骑车去公司附近的湘菜馆子吃。  
点了一桌菜后，我却发现自己没有胃口，聊了一会天后，困意再次来袭，双眼都要睁不开了。
于是强行喊上李珂说不吃了，规划是我去公司拿包，打车回去睡觉，他住宿的话在我家附近找个宾馆即可。  
走之前，在腾大一楼给李珂照了一张照，就匆匆回去了。  


到家九点多，我躺在床上就睡着了。
快二十四点的时候，我醒了，有点想吐的感觉，然后就吐了，那中午晚上吃的也全吐了，屋里打扫一下，拖干净，于是下楼买了面包。  
吃面包的时候，有人给我打了个电话，说一个老服务出问题了，让我看看。看看时间十二点半，此时VPN竟然连不上，打电话回复今晚正在迁移员工账号，期间不可用。  
问能手动修复我的账号吗，急着用。回答竟然是可以，于是登录VPN发现我的底层服务除了请求量降低了，其他的监控都正常。后来发现是上层的问题他们临时修复就继续睡觉了。  


12月16号，中午才睡醒，联系李珂，被告知去找其他同学了。走了也好，我猜想自己病了，就不陪他去奔波了。以后有缘再聚吧。    
中午去7 eleven买了小面和香肠，小面吃不下，努力把香肠吃了。回来买了泡面吃了，然后继续睡觉。  

睡到两点多醒来，发现自己好多了。  
猜测到自己肠胃不舒服，我就去药店拿药。当场在药店吃药时，强大的苦味刺激着我，当场在药店门口再次吐了。  
这次中午吃的方便面都是从鼻子里面出来的。  


卖药的看到我的状况，说我是肠胃型感冒，可以喝藿香正气水。  
我网上一查肠胃型感冒，竟然和我的症状一抹一眼。然后问有西药吗？答曰西药是处方药，没有处方单不卖。  




## 六、总结  


《待续》


对了现在开通了博客、公众号、算法小密圈、IT技术交流微信群。    
要加微信群的可以加我微信，我拉大家进群。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
欢迎大家加入看各种算法的思路。  

![](/images/tiankonguse-algorithms.png)  
  
  
长按图片关注公众号，阅读不一样的技术文章。   
  
![](/images/tiankonguse-code.gif)  
  
  