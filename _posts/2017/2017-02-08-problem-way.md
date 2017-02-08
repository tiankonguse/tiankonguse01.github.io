---
layout:     post
title:      后台服务定位问题规范
description: 记录一下针对后台服务的定位问题方法  
keywords: 后台服务
tags: [后台服务]
categories: [程序人生]
updateData:   19:10 2017/2/8
---

## 硬件相关

* 网卡流量  
* 磁盘IO  
* 内存  
* CPU  
* 丢包率  

## 其他


### 虚拟机

在虚拟机环境下，高并发高吞吐服务性能折损严重，请使用实体机进行性能压测  


### 大量日志

检查业务日志打印量。  
正常需要将log级别设置为ERROR（3）及以上。  
服务在过载时，错误日志输出会影响性能，导致彻底雪崩, 此时可以将log级别调到FATAL（4）或者更高。

### 连接监控

连接overload非零，表示链接数过载  
连接timeout则说明存在连接超时, 则会丢包



proxy已经到瓶颈，业务酌情优化spp_handle_input函数，如无可优化，说明已经到了proxy瓶颈。业务只能通过增加性能来扩展；  
worker到瓶颈，业务通过perf查看API调用耗时，酌情优化。如果worker上共享内存文件锁(perf中flock)耗时较多，可以采取减少单group worker量并增加group的方式优化。  
cpu0的利用率100%，而其他cpu不忙，可能是机器操作系统较老，没有开启网卡多队列优化，更换测试机或者升级测试机操作系统。  
vmstat、iostat、ss等检查系统瓶颈，做相关优化  

在cpu2.66G的处理器下， proxy 极限在8-9W/S。鉴于以上的性能数据，如果业务服务器，单机处理能力低于4-5W/S，请关注业务逻辑(worker)性能问题，如果是超过5W，请关注proxy的性能问题。  
Proxy主动断开连接  排查业务代码是否回复空包，或者返回错误码促使框架向proxy发送空包，导致proxy与client连接断开。  
协程框架并发大约每秒9w的样子，相比同步模式，在proxy有大量的write调用，在worker有大量的flock。  
协程框架作为转发服务器，并发大概在6w/s的水平  


worker和proxy之间的队列带flock,且数据是内存拷贝的，性能比较差，猜测多worker由于对应多队列，可以也提升一些性能。
所有Worker同时卡住就是导致请求队列的请求超时的罪魁祸首。
Worker进程的动作就是锁住队列，插入一条响应消息，写管道通知，然后释放锁。

### 系统Cache


系统Cache太多数据导致IO的毛刺。  
调节系统Cache参数，减少IO毛刺  
控制Read文件速度和对Write进行同步sync，进一步降低IO的毛刺  


查看进程的CPU占用状况   

```
pidstat -p 32124 
Linux 2.6.32.43-tlinux-1.0.22-default (V-100.65.25.218)         01/11/17        _x86_64_        (48 CPU)

13:00:12          PID    %usr %system  %guest    %CPU   CPU  Command
13:00:12        32124    0.09    0.02    0.00    0.11    41  spp_union_cache
```

查看进程的内存占用状况  

```
pidstat -p 32124 -r
Linux 2.6.32.43-tlinux-1.0.22-default (V-100.65.25.218)         01/11/17        _x86_64_        (48 CPU)

13:00:55          PID  minflt/s  majflt/s     VSZ    RSS   %MEM  Command
13:00:55        32124      0.00      0.00 50420732 119464   0.09  spp_union_cache
```

查看进程io状况  

```
pidstat -p 32124 -d
Linux 2.6.32.43-tlinux-1.0.22-default (V-100.65.25.218)         01/11/17        _x86_64_        (48 CPU)

13:01:55          PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command
13:01:55        32124      0.00      0.00      0.00  spp_union_cache
```

查看worker进程的系统调用统计情况  

```
strace -p 32124 -c
Process 32124 attached - interrupt to quit
Process 32124 detached
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 99.34    0.032197           2     21225           epoll_wait
  0.30    0.000097           0     17416      2301 read
  0.23    0.000074           0     12450           sendto
  0.06    0.000019           0     12588           recvfrom
  0.06    0.000019           0     29196           flock
  0.02    0.000006           0      5978           write
  0.00    0.000000           0         3           close
  0.00    0.000000           0        16           setsockopt
  0.00    0.000000           0      3057           epoll_ctl
------ ----------- ----------- --------- --------- ----------------
100.00    0.032412                101929      2301 total 
```

系统调用最耗时的函数在做什么  

```
strace -p 32124


read(10, "a\316\261>\357{H\310", 8)     = 8
sendto(12, "QV\0\0\0\0\1V\5\201\314\214\0\0'\32\0\0\1R\10\2\20\323\17\32\17h47ow"..., 358, 0, NULL, 0) = 358
epoll_wait(3, {}, 100000, 0)            = 0
epoll_wait(3, {{EPOLLIN, {u32=43, u64=15474767167531}}}, 100000, 1) = 1
recvfrom(12, "QA\0\0\0\0\2L\5\201\314\214\32'\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\2H"..., 131072, 0, NULL, NULL) = 616
flock(8, LOCK_EX)                       = 0
write(6, "!", 1)                        = 1
flock(8, LOCK_UN)                       = 0
epoll_wait(3, {}, 100000, 2)            = 0
```

看句柄分别是什么

```
lsof -p 32124 

spp_union 32124 user_00    0r   CHR        1,3      0t0     5830 /dev/null
spp_union 32124 user_00    1w   REG        8,1     1477   122945 /tmp/rrestart_pkg.pkg.27733 (deleted)
spp_union 32124 user_00    2w   REG        8,1      772   516208 /var/spool/cronx/std_logs/stderr_21469_27551_1_3218975_1484059005_60 (deleted)
spp_union 32124 user_00    3u  0000        0,8        0       19 anon_inode
spp_union 32124 user_00    4u   REG        8,4    27224  6602839 /data/log/spp_union_cache_access-2.3/spp_frame_worker2.log
spp_union 32124 user_00    5u   REG        8,4        0  6602840 /data/log/spp_union_cache_access-2.3/spp_worker2.log
spp_union 32124 user_00    6u  FIFO        8,3      0t0   221218 /usr/local/services/spp_union_cache_access-2.3/bin64/.notify_5
spp_union 32124 user_00    7u  FIFO        8,3      0t0   221217 /usr/local/services/spp_union_cache_access-2.3/bin64/.notify_4
spp_union 32124 user_00    8u   REG        8,3        0   221221 /usr/local/services/spp_union_cache_access-2.3/bin64/.mq_producer_51a6d41b.lock
spp_union 32124 user_00    9u   REG        8,3        0   221222 /usr/local/services/spp_union_cache_access-2.3/bin64/.mq_comsumer_e91ab37e.lock
spp_union 32124 user_00   10r   CHR        1,9      0t0     5846 /dev/urandom
```

### strace统计中为什么会有失败  


futex的失败是由于没有抢到锁，futex是2.6.x系列内核中出现的，用来实现POSIX互斥体， 如pthread的mutex互斥锁和sem信号量。futex保存在用户态的共享内存。  
read的失败是由于设定时间内没有读取到数据  
recvfrom的失败是由于设定时间内没有读取到数据，读取成长值的接口超时了  


### flock是做什么用的  

下面是个典型的序列，worker首先加锁锁住响应包共享内存，然后放响应包到共享内存:`flock(8, LOCK_EX) = 0`  
向通知管道写入一个字符，告诉proxy要发送数据啦: `write(6, "!", 1) = 1`
解锁响应包共享内存锁: `flock(8, LOCK_UN) = 0`  
作为消费者从请求包共享内存队列中取出一个请求包，加锁，取出后解锁  

```
flock(9, LOCK_EX) = 0
flock(9, LOCK_UN) = 0
```




### 查看系统的pdflush相关参数

```
/proc/sys/vm/dirty_expire_centiseconds 3000  //pdflush在距离上次启动30s后再次启动

/proc/sys/vm/dirty_background_ratio 10    //pdflush在dirty数据达到空闲内存的10%的时启动
```

在上面两个条件只要一个满足，系统就开始将cache写到磁盘。   
因为系统此时还剩下大概10G左右内存可用  来Cache文件数据，导致第二个条件基本上不被触发，只能等第一个条件触发。  
就是系统Cache太多数据导致IO的毛刺。  

```
iostat  -x -d 1 
```


## 总结

最近业务经常会反映一些网络延时问题，就我所知原因有：  

1. 网络延时大，这个众所周知，当然也不得不面对，公司的IDC机房感觉很容易就耗尽了，不得不跨机房，这样延时就来了。  
2. 客户端负载高，导致延时大，负载为啥会影响延时，很简单，cpu忙别的去了，or你自己被迫睡眠了，再次叫醒你，那挺久了。  
3. 服务端负载高，这个同2，负载高到一定程度，不仅延时会增大，丢包也可能会增加。  
4. 大数据引发的延时。比如10M数据，如果你cpu每秒才能拷贝1G数据，那拷贝10M，10ms就过去了。另外10M数据，需要网络分多次包来交互，转包的效率不一定可控的，如果应用层做多次同步交互逻辑延时就更大了。  
5. 批量操作，类似于大数据，但又不同于大数据。  
6. ipc的通讯的效率及epoll的使用，目前公司很多ipc通讯都使用共享内存来传递数据,共享内存无锁的东西简直已经泛滥到没啥技术难度可言了。  
7. 存储介质引发的延时，存在内存的还比较快，磁盘的就难说了。  
8. 打日志也会影响。  
9. 还有一些通用的，比如tcp nagle算法引发的小包延时。一些比较慢的函数snprintf,itoa类的。减少数据拷贝无疑是一个手段之一，减少传锁的使用，用用无锁、自旋锁之类的也是手段。  
10. tcp连接建立的延时也蛮大的，而且毛刺也很多，性能不怎样，一台C1，在传统的suse内核下，跑3.4W/s基本接近极限了。  

