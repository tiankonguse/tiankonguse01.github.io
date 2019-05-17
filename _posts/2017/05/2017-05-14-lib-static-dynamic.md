---  
layout:     post  
title:      同时连接动态库和静态库
description: 有时候我们编译程序时希望手动决定链接静态库还是动态库，这里记录一下。  
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateData:  19:30 2017/5/14 
published: true  
---  
  
  
>   
> 大家好，这里是tiankonguse的公众号(tiankonguse-code)。    
> tiankonguse曾是一名ACMer，现在是鹅厂视频部门的后台开发。    
> 这里主要记录算法，数学，计算机技术等好玩的东西。   
>      
> 这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/kjuZuB6l80e49rP_cJEr_g)自动同步过来。    
> 如果转载请加上署名：公众号tiankonguse-code，并附上公众号二维码，谢谢。    
>    
  

## 零、背景

假设我们需要使用一个库，动态库和动态库我们都有，这个时候可能会出现我们不希望发生的事情，所以需要手动制定了。  


## 一、原理

linux下链接库时使用`-L`来指定路径，使用`-l`来指定库名。  
默认情况下优先找动态库，找不到了再找静态库。  



## 二、指定库

如果直接使用`-static`或者`-dynamic`会使所有库都使用这种形式链接，显示不是我们想要的。  
当我们想要为某些库链接静态库，某些链接静态库，其余的按默认链接，则需要下面的样子。  

```
-L./lib/test/ -Wl,-Bstatic -ltest #指定静态库
-L./lib/test/ -Wl,-Bdynamic -ltest #指定动态库
-Wl,-Bdynamic #回复默认设置
```

## 三、结语

好了，看到这里差不多就可以动态指定库了.  

参考资料: 

1. `man gcc`  
2. `man ld`  


对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
小密圈这周接受免费加入，欢迎大家加入看各种算法的思路。  

![](http://res.tiankonguse.com/images/suanfa_xiaomiquan.jpg)  
  
  
长按图片关注公众号，接受最新文章消息。   
  
![](http://res.tiankonguse.com/images/weixin-50cm.jpg)  
  
  
  