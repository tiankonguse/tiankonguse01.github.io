---
layout:     post
title:      TIME_WAIT 简单记录(一)
description: 上周五遇到一个服务有个客户端能使用, 有的客户端不能使用的问题, 于是定位了一下.  
keywords: linux, tcp
tags: [linux, tcp]
categories: [程序人生]
updateData:   19:44 2015/12/13
---


## 背景

写了一个server, 发布上去, 客户端正常. 换一台客户端后, CPU跑满了, 一看监控, socket连接数也比较多.  
netstat 一看, 好多 TIME_WAIT 状态.  


## 一些数据

注：下面的ip已经随机修改， 只做参考。 另外， 目前抓到的数据不是CPU较高时候的数据。  

### strace 命令

监控系统调用, strace 是必选工具.  
我们主要是为了统计时间浪费在哪里了, strace 的 `-c` 参数就有这个功能.  


```
[user_00@V_10_177_141_158_tlinux ~]$ strace -s128 -ttt -p 25793 -c
Process 25793 attached - interrupt to quit
[ Process PID=25793 runs in 32 bit mode. ]
^CProcess 25793 detached
System call usage summary for 32 bit mode:
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 82.01    0.004321           5       923        14 recv
 13.55    0.000714           1       805           connect
  1.18    0.000062           0     10002           close
  0.76    0.000040           0      4613           open
  0.65    0.000034           0      1529           mmap2
  0.63    0.000033           0      4570           read
  0.32    0.000017           0      3118           socket
  0.23    0.000012           0      1529           munmap
  0.19    0.000010           0      9188           gettimeofday
  0.15    0.000008           0      2313       771 ioctl
  0.13    0.000007           0      6158           time
  0.13    0.000007           0       861           fcntl64
  0.08    0.000004           0      1514           dup
  0.00    0.000000           0       906           write
  0.00    0.000000           0      1542           access
  0.00    0.000000           0       771           umask
  0.00    0.000000           0      3028           dup2
  0.00    0.000000           0         2           getdents
  0.00    0.000000           0         2           poll
  0.00    0.000000           0       771           rt_sigaction
  0.00    0.000000           0       771           stat64
  0.00    0.000000           0      1528           fstat64
  0.00    0.000000           0      1542           geteuid32
  0.00    0.000000           0      2373           gettid
  0.00    0.000000           0       757           accept
  0.00    0.000000           0       773           send
  0.00    0.000000           0        78           sendto
  0.00    0.000000           0        20           recvfrom
  0.00    0.000000           0      1534           setsockopt
------ ----------- ----------- --------- --------- ----------------
100.00    0.005269                 63521       785 total
```

## netstat/ss 命令

我[这里](http://github.tiankonguse.com/blog/2014/09/30/linux-command/#menuIndex22)曾说过, `netstat 已经被ss命令和ip命令所取代.`.  
那这里就使用 ss 命令了, 等价于 netstat 命令的.  
我们可以只是简单的统计一下 TIME-WAIT 状态, 也可以统计所有状态的数量.  

```
[user_00@V_10_177_141_158_tlinux ~]$ ss -ant | grep TIME-WAIT > log
[user_00@V_10_177_141_158_tlinux ~]$ head log
TIME-WAIT  0      0              18.12.41.228:80          27.188.237.137:5957  
TIME-WAIT  0      0              18.12.41.228:80           102.28.72.169:4358  
TIME-WAIT  0      0           120.198.199.168:80          102.140.48.102:6999  
TIME-WAIT  0      0              18.12.41.228:80            116.53.36.31:1411  
TIME-WAIT  0      0            163.177.68.177:80          212.138.138.85:57100 
TIME-WAIT  0      0              18.12.41.228:80          182.242.225.39:58264 
TIME-WAIT  0      0              18.12.41.228:80            58.46.127.65:62701 
TIME-WAIT  0      0              18.12.41.228:80            1.202.36.213:9522  
TIME-WAIT  0      0           120.198.199.168:80          111.36.118.113:62967 
TIME-WAIT  0      0              18.12.41.228:80          202.98.210.197:54773 
[user_00@V_10_177_141_158_tlinux ~]$ cat log | wc -l
331454


[user_00@V_10_177_141_158_tlinux ~]$ ss -ant | awk 'NR>1 {++s[$1]; sum++;} END {print "ALL ",sum;for(k in s) print k,s[k]}'
ALL  360501
SYN-SENT 6
LAST-ACK 96
SYN-RECV 455
ESTAB 2232
FIN-WAIT-1 3337
FIN-WAIT-2 1294
CLOSING 1311
TIME-WAIT 351567
CLOSE-WAIT 192
LISTEN 11
```

### sockstat 文件

如果我们想看准确的 TIME-WAIT 数量, 还是去储存这些数据的地方看比较好.  

```
[user_00@V_10_177_141_158_tlinux ~]$ cat /proc/net/sockstat
sockets: used 4224
TCP: inuse 7106 orphan 4614 tw 326428 alloc 7142 mem 8559
UDP: inuse 325 mem 229
UDPLITE: inuse 0
RAW: inuse 0
FRAG: inuse 0 memory 0
```

### 最大端口数

我们知道. 一个 socket 连接会占用一个端口的.  
那这么多的 TIME-WAIT, 会不会把可以端口使用完了呢? 看一下最大连接数吧.  
看了之后, 好可怕, 总共2W端口, 但是我们的 TIME-WAIT 有35W, 所以应该端口复用了, 不是端口的问题了.  

```
[user_00@V_10_177_141_158_tlinux ~]$ sysctl -a | grep port
error: permission denied on key 'kernel.cad_pid'
fs.nfs.nfs_callback_tcpport = 0
fs.nfs.nlm_udpport = 0
fs.nfs.nlm_tcpport = 0
net.ipv4.ip_local_port_range = 21000    61000
sunrpc.transports = tcp 1048576
sunrpc.transports = udp 32768
sunrpc.min_resvport = 665
sunrpc.max_resvport = 1023
[user_00@V_10_177_141_158_tlinux ~]$ echo $((61000-21000+1))     
40001
```


### 减少TIME-WAIT状态

不管怎么说, TIME-WAIT 数量很大, 我们要想办法减少 TIME-WAIT 的数量.  
这里假设客户端不能修改程序, 使用长连接吧.  

这里需要问一个问题: 为什么有这么多TIME-WAIT?

这个是 TCP四次挥手的知识点了, 这里不啰嗦了.  
我不会告诉你4次挥手断开连接时,发起socket主动关闭的一方 socket将进入TIME_WAIT状态,TIME_WAIT状态将持续2个MSL(Max Segment Lifetime).TIME_WAIT状态下的socket一般不能被回收使用.  
既然TCO加了这个功能, 那我们就可以参详TIME_WAIT是TCP协议用以保证被重新分配的socket不会受到之前残留的延迟重发报文影响的机制, 是不能缺少的.  
这样的后果是 TIME-WAIT 这个状态会保存很长一段时间.  


接下来我们就像能不能快速结束TIME-WAIT状态, 或者让TIME-WAIT状态不影响接下来的socket操作.  
网上可以看到两个词 `net.ipv4.tcp_tw_reuse` 和 `net.ipv4.tcp_tw_recycle`.  
根据名字我们就可以知道, 一个是复用TIME-WAIT状态, 一个是回收TIME-WAIT状态.  

修改操作大概如下:  

> 注:  
> 我未运行下面的两条命令, 所以不对执行后的结果负责.  
> 还有人说通过sysctl命令修改内核参数，重启后会还原  

```
sysctl net.ipv4.tcp_tw_reuse=1
sysctl net.ipv4.tcp_tw_recycle=1
```

后来网上又有很多人说, 修改这两个参数后并不是万能的.  
在NAT环境下会引发问题的.会引发问题的, 会引发问题的.  

搜一下TIME-WAIT, 发现还有一个 tcp_max_tw_buckets 参数, 那我们是不是可以调小点这个值来变量缩小这个值呢?  
这里我不做回答.  

```
user_00@V_10_137_148_76:~> sysctl -a | grep "_tw_"
error: permission denied on key 'kernel.cad_pid'
net.ipv4.tcp_max_tw_buckets = 524288
net.ipv4.tcp_tw_recycle = 1
net.ipv4.tcp_tw_recycle_private_only = 0
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_ignore_syn_tsval_zero = 1
```

### tcp_timestamps认识

背景:TCP有一种行为，可以缓存每个主机最新的时间戳，后续请求中如果时间戳小于缓存的时间戳，即视为无效，相应的数据包会被丢弃。  

查看是否丢包  

```
[user_00@V_10_177_141_156_tlinux ~]$ netstat -s | grep timestamp
    286 packets rejects in established connections because of timestamp
[user_00@V_10_177_141_156_tlinux ~]$

user_00@V_10_209_1_77:~> netstat -s | grep timestamp
user_00@V_10_209_1_77:~> 
```

怎么一台有丢弃包的行为, 一台没有呢?  

```
[user_00@V_10_177_141_156_tlinux ~]$  sysctl -a | grep tcp_timestamps
error: permission denied on key 'kernel.cad_pid'
net.ipv4.tcp_timestamps = 1

user_00@V_10_209_1_77:~> sysctl -a | grep tcp_timestamps
error: permission denied on key 'kernel.cad_pid'
net.ipv4.tcp_timestamps = 0
```

好吧, 原来配置的就是一台启动 tcp_timestamps, 一台没启动 tcp_timestamps.  

如果关闭了tcp_timestamps, 就不会回收和重新利用TIME-WAIT了, 赶紧看看这两台机器的TIME-WAIT数量.  

我能告诉你, 下面第一个是16核机器, 第二个是8核机器吗?  

```
[user_00@V_10_177_141_156_tlinux ~]$ cat /proc/net/sockstat
sockets: used 4106
TCP: inuse 7831 orphan 5433 tw 360422 alloc 7831 mem 9928
UDP: inuse 325 mem 224
UDPLITE: inuse 0
RAW: inuse 0
FRAG: inuse 0 memory 0

user_00@V_10_209_1_77:~> cat /proc/net/sockstat
sockets: used 4067
TCP: inuse 7223 orphan 4830 tw 488549 alloc 7223 mem 8855
UDP: inuse 331 mem 224
UDPLITE: inuse 0
RAW: inuse 0
FRAG: inuse 0 memory 0
```


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


