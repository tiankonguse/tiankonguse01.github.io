---   
layout:     post  
title:       python的时间库不是线程安全的
description: 震惊，多线程程序竟然在时间函数哪里挂了。    
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateData:  10:28 2017/8/28  
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

前端时间写了多线程程序，最终发现在调用`time.strptime`函数时偶尔抛出异常,是的,偶尔抛异常.  
多线程下偶尔发生的问题显然是线程安全问题了.  


## 一、分析

先看看代码, 开个线程, 线程里对时间进行计算.  

```
import time
import thread

def f():
    for m in xrange(1, 13):
        for d in xrange(1,29):
            time.strptime("2010%02d%02d"%(m,d),"%Y%m%d")

for _ in xrange(10):
    thread.start_new_thread(f, ())

> Traceback (most recent call last):
>   File "[...]/test.py", line 75, in f
>     time.strptime("2010%02d%02d"%(m,d),"%Y%m%d")
> AttributeError: _strptime_time
```

查询python文档, 发现不是线程安全的.  

```
Thread safety: The use of strptime is thread safe, but with one important caveat.  The first use of strptime is not thread safe because the first use will import _strptime.  That import is not thread safe and may throw AttributeError or ImportError.  To avoid this issue, import _strptime explicitly before starting threads, or call strptime once before starting threads.
```


具体的说`time.strptime`自身是线程安全的, 但是`time.strptime`依赖其他库, 其他库使用时才会进行`import`，而`import`操作不是线程安全的.  


解决方案也就简单了，在多线程之前手动调用一下`time.strptime`即可.  
当然,也可以手动的显示引入依赖库`import _strptime`.  




## 八、总结

python已经是这么成熟的语言了，但是`time.strptime`的文档上一直都没有提这个函数是非线程安全的，悲剧呀。      

  
对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
欢迎大家加入看各种算法的思路。  

![](http://res.tiankonguse.com/images/tiankonguse-algorithms.png)  
  
  
长按图片关注公众号，阅读不一样的技术文章。   
  
![](http://res.tiankonguse.com/images/tiankonguse-code.gif)  
  
  