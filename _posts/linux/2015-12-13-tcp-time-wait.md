---
layout:     post
title:      TIME_WAIT 简单记录(一)
description: 上周五遇到一个服务有个客户端能使用, 有的客户端不能使用的问题, 于是定位了一下.  
keywords: linux, tcp
tags: [linux, tcp]
categories: [程序人生]
updateData:   19:44 2015/12/13
---


![tcp-state-diagram](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3667791299.png)

## 背景

写了一个server, 发布上去, 客户端正常. 换一台客户端后, 客户端CPU跑满了, 一看监控, socket连接数也比较多.  
netstat 一看, 好多 TIME_WAIT 状态.  


## 一些数据

注：下面的ip已经随机修改， 只做参考。 另外， 目前抓到的数据不是CPU较高时候的数据。  

### strace 命令

监控系统调用, strace 是必选工具.  
我们主要是为了统计时间浪费在哪里了, strace 的 `-c` 参数就有这个功能.  


![strace-c](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3575940174.png)

## netstat/ss 命令

我[这里](http://github.tiankonguse.com/blog/2014/09/30/linux-command/#menuIndex22)曾说过, `netstat 已经被ss命令和ip命令所取代.`.  
那这里就使用 ss 命令了, 等价于 netstat 命令的.  
我们可以只是简单的统计一下 TIME-WAIT 状态, 也可以统计所有状态的数量.  


![ss-ant-head](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3540605567.png)

![ss-ant-awk](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3546449301.png)


### sockstat 文件

如果我们想看准确的 TIME-WAIT 数量, 还是去储存这些数据的地方看比较好.  

![cat-sockstat](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3581574864.png)

### 最大端口数

我们知道. 一个 socket 连接会占用一个端口的.  
那这么多的 TIME-WAIT, 会不会把可以端口使用完了呢? 看一下最大连接数吧.  
看了之后, 好可怕, 总共4W端口, 但是我们的 TIME-WAIT 有35W, 所以应该端口复用了, 不是端口的问题了.  



![sysctl-a-grep-port](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3585038245.png)


### 减少TIME-WAIT状态

不管怎么说, TIME-WAIT 数量很大, 我们要想办法减少 TIME-WAIT 的数量.  
这里假设客户端不能修改程序, 使用短连接吧.  

这里需要问一个问题: 为什么有这么多TIME-WAIT?

这个是 TCP四次挥手的知识点了, 这里不啰嗦了.  
我不会告诉你4次挥手断开连接时,发起socket主动关闭的一方 socket将进入TIME_WAIT状态,TIME_WAIT状态将持续2个MSL(Max Segment Lifetime).TIME_WAIT状态下的socket一般不能被回收使用.  
既然TCP加了这个功能, 那我们就可以假设TIME_WAIT是TCP协议用以保证被重新分配的socket不会受到之前残留的延迟重发报文影响的机制, 是不能缺少的.  
这样的后果是 TIME-WAIT 这个状态会保存很长一段时间.  


接下来我们就想能不能快速结束TIME-WAIT状态, 或者让TIME-WAIT状态不影响接下来的socket操作.  
网上可以看到两个词 `net.ipv4.tcp_tw_reuse` 和 `net.ipv4.tcp_tw_recycle`.  
根据名字我们就可以知道, 一个是复用TIME-WAIT状态, 一个是回收TIME-WAIT状态.  

修改操作大概如下:  

> 注:  
> 我未运行下面的两条命令, 所以不对执行后的结果负责.  
> 还有人说通过sysctl命令修改内核参数时，重启后会还原  


![tcp_tw_reuse](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3588943279.png)

后来网上又有很多人说, 修改这两个参数后并不是万能的.  
在NAT环境下会引发问题的.会引发问题的, 会引发问题的.我的网络就是NAT环境,宝宝好害怕  

搜一下TIME-WAIT, 发现还有一个 tcp_max_tw_buckets 参数, 那我们是不是可以调小点这个值来变量缩小这个值呢?  
这里我不做回答.  

![sysctl-tw](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3592352029.png)

### tcp_timestamps认识

背景:TCP有一种行为，可以缓存每个主机最新的时间戳，后续请求中如果时间戳小于缓存的时间戳，即视为无效，相应的数据包会被丢弃。  

查看是否丢包  

![netstat-timestamp](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3595912161.png)

怎么一台有丢弃包的行为, 一台没有呢?  

![sysctl-timestamps](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3599118326.png)


好吧, 原来配置的就是一台启动 tcp_timestamps, 一台没启动 tcp_timestamps.  

如果关闭了tcp_timestamps, 就不会回收和重新利用TIME-WAIT了, 赶紧看看这两台机器的TIME-WAIT数量.  

我能告诉你, 下面第一个是16核机器, 第二个是8核机器吗?  

![diff-sockstat](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3603040912.png)



## 假设的解决方案

忽悠了这么多东西, 我现在的问题是什么呢?  
问题是我写了一个server, 有些机器正常使用我的服务, 有些机器不正常使用我的服务.  
那不正常的机器又什么现象呢?  
CPU极度不稳定, 一会跑满, 一会降下来.  
socket也是, 一会大量创建, 一会大量释放.  
看看错误日志输出, 大量的connect失败.  


针对这个问题, 能够命中tcp_timestamps 那个知识点.  
所以我们需要做的是保证tcp_timestamps是打开的. 如果服务通过通过NAT网关的话, 确保tcp_tw_recycle关闭即可.  

为什么说这个是假设的解决方案, 因为到目前为止, 我还没有解决这个问题, 只有到周一才能再次遇到这个问题, 然后才能确定真正原因是不是这个.  



## 参考资料

* [tcp_tw_recycle和tcp_timestamps导致connect失败问题](http://blog.sina.com.cn/s/blog_781b0c850100znjd.html)
* [Coping with the TCP TIME-WAIT state on busy Linux servers](http://vincent.bernat.im/en/blog/2014-tcp-time-wait-state-linux.html)
* [记一次TIME_WAIT网络故障](http://huoding.com/2012/01/19/142)
* [发现大量的TIME_WAIT解决办法](http://kerry.blog.51cto.com/172631/105233)
* [再叙TIME_WAIT](http://huoding.com/2013/12/31/316)
* [TCP的TIME_WAIT快速回收与重用](http://blog.csdn.net/dog250/article/details/13760985)
* [tcp短连接TIME_WAIT问题解决方法大全（1）——高屋建瓴](http://blog.csdn.net/yunhua_lee/article/details/8146830)
* [tcp短连接TIME_WAIT问题解决方法大全（2）——SO_LINGER](http://blog.csdn.net/yunhua_lee/article/details/8146837)
* [tcp短连接TIME_WAIT问题解决方法大全（3）——tcp_tw_recycle](http://blog.csdn.net/yunhua_lee/article/details/8146845)
* [打开tcp_tw_recycle引起的一个问题](http://www.pagefault.info/?p=416)
* [tcp短连接TIME_WAIT问题解决方法大全（4）——tcp_tw_reuse](http://blog.csdn.net/yunhua_lee/article/details/8146856)
* [tcp短连接TIME_WAIT问题解决方法大全（5）——tcp_max_tw_buckets](http://blog.csdn.net/yunhua_lee/article/details/8146862)


