---  
layout: post  
title: linux下定位CPU较高的原因  
description:  一个同事的程序很异常， CPU毛刺很高，于是我帮忙定位一下。  
updateData:  13:31 2016/03/26
categories: [后台技术]
---  


## 背景

问题现象： 8个CPU, 同一时间有一个CPU会跑满。  
程序结构： 该程序只有一个进程， 进程内开了20个线程。  



## 旅行开始


### 定位到进程


top找到有问题的进程.  
我们发现进程号为`31518`的进程的CPU较高, 其中一个CPU的内核态占`71.4%sy`.  
可以确定这个进程在进行大量的系统调用, 导致CPU较高.  

```
[root@V_10_129_129_44 /home/user_00]# top -u user_00 -c -S  

top - 14:53:46 up 602 days, 23:44,  2 users,  load average: 1.47, 1.43, 1.47
Tasks: 250 total,   1 running, 249 sleeping,   0 stopped,   0 zombie
Cpu0  :  4.9%us,  3.0%sy,  0.0%ni, 91.8%id,  0.0%wa,  0.0%hi,  0.3%si,  0.0%st
Cpu1  :  5.6%us,  1.6%sy,  0.0%ni, 92.1%id,  0.0%wa,  0.0%hi,  0.7%si,  0.0%st
Cpu2  :  4.3%us,  3.3%sy,  0.0%ni, 91.7%id,  0.0%wa,  0.0%hi,  0.7%si,  0.0%st
Cpu3  :  3.0%us,  1.0%sy,  0.0%ni, 94.7%id,  0.0%wa,  0.0%hi,  1.3%si,  0.0%st
Cpu4  :  4.2%us,  2.6%sy,  0.0%ni, 93.1%id,  0.0%wa,  0.0%hi,  0.0%si,  0.0%st
Cpu5  : 27.9%us, 71.4%sy,  0.0%ni,  0.0%id,  0.0%wa,  0.0%hi,  0.7%si,  0.0%st
Cpu6  :  2.0%us,  2.3%sy,  0.0%ni, 94.7%id,  0.0%wa,  0.0%hi,  1.0%si,  0.0%st
Cpu7  :  5.2%us,  2.0%sy,  0.0%ni, 91.8%id,  0.0%wa,  0.0%hi,  1.0%si,  0.0%st
Mem:   8052496k total,  6046952k used,  2005544k free,   654588k buffers
Swap:  2104504k total,   164980k used,  1939524k free,  3470952k cached

  PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND
31518 user_00   20   0 2178m 1.2g 230m S 128.2 15.8  17129:40 ./spp_union_worker
27447 user_00   20   0  194m  52m  35m S  4.0  0.7   1773:14 ./spp_union_proxy
```

### 进位到线程

找到进程了, 我们还需要找到对应的线程.  
top可以查看指定进程的线程信息.  
我们可以看出来线程号为`31527`的线程有问题.  


```
[root@V_10_129_129_44 /home/user_00]# top -H -p 31518 -c

top - 14:58:59 up 602 days, 23:49,  2 users,  load average: 1.80, 1.55, 1.49
Tasks:  20 total,   1 running,  19 sleeping,   0 stopped,   0 zombie
Cpu0  : 28.7%us, 71.3%sy,  0.0%ni,  0.0%id,  0.0%wa,  0.0%hi,  0.0%si,  0.0%st
Cpu1  :  4.0%us,  3.3%sy,  0.0%ni, 92.0%id,  0.0%wa,  0.0%hi,  0.7%si,  0.0%st
...
Mem:   8052496k total,  6048928k used,  2003568k free,   654596k buffers
Swap:  2104504k total,   164980k used,  1939524k free,  3472796k cached

  PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND                                        
31527 user_00   20   0 2178m 1.2g 230m R 99.8 15.8   7520:23 ./spp_union_worker
31529 user_00   20   0 2178m 1.2g 230m S  5.7 15.8   1239:10 ./spp_union_worker 
...
```

### 查看各线程的函数调用栈

我们可以使用`gstack`把某个进程的所有线程栈打印出来.  

> 如果你的系统没有`gstack`这个命令， 可以尝试`pstack`这个命令。  

我们可以发现, 线程`31527`对应的编号是`Thread 12`, 目前在调用函数`epoll_wait()`.  


```
[root@V_10_129_129_44 /home/user_00]# gstack 31518 > gstack_31518.log
[root@V_10_129_129_44 /home/user_00]# cat gstack_31518.log | grep  -A 9  --color "31527"
Thread 12 (Thread 0x7fcd57551700 (LWP 31527)):
#0  0x00007fcd771fd2c3 in epoll_wait () from /lib64/libc.so.6
#1  0x00007fcd7377f86e in ?? ()
#2  0x00007fcd57550e30 in ?? ()
#3  0x0000000000000003 in ?? ()
#4  0x0000000000084918 in ?? ()
#5  0x0000000056f639ed in ?? ()
#6  0x00000000000001a3 in ?? ()
#7  0x0000000000000000 in ?? ()
```


### 得到进程的内存镜像

我们知道线程编号后, 可以直接`gdb`挂到线程上去, 但是为了不影响线上服务, 我们还是把现场保存一份.  

```
[root@V_10_129_129_44 /home/user_00]# gcore  31518
[Thread debugging using libthread_db enabled]
...
0x00007fcd771fd2c3 in epoll_wait () from /lib64/libc.so.6
Saved corefile core.31518
[root@V_10_129_129_44 /home/user_00]# ll core.31518
-rw-r--r-- 1 root root 1508477304 Mar 26 15:33 core.31518
```

### gdb查看函数栈

由于core文件, 我们就可以查看函数栈了.  
通过切换每一个线程, 我们发现我们的线程编号不是12.  
因为加载gdb的时候, 这个编号不一定是按之前那个顺序展示的, 所以需要自己根据显示的线程计算出对应的编号.   
所以这个时候线程`31527`的编号是9.  
然后我们查看对应的函数栈, 发现栈全是问号.  

```
[root@V_10_129_129_44 /home/user_00]# gdb /usr/local/services/spp_union-2.3/client/union/lib/spp_union.so  core.31518
warning: core file may not match specified executable file.
[New Thread 31519] => 1
[New Thread 31520] => 2
[New Thread 31521] => 3
[New Thread 31522] => 4
[New Thread 31523] => 5
[New Thread 31524] => 6
[New Thread 31525] => 7
[New Thread 31526] => 8
[New Thread 31527] => 9
[New Thread 31528]
...
(gdb) thread 1  
[Switching to thread 1 (Thread (LWP 31519))]#0  in pthread_cond_timedwait@@GLIBC_2.3.2 () from /lib64/libpthread.so.0
...
(gdb) thread 9
[Switching to thread 9 (Thread (LWP 31527))]#0  in ?? ()
...
(gdb) thread 12
[Switching to thread 12 (Thread (LWP 31530))]#0  in pthread_cond_timedwait@@GLIBC_2.3.2 () from /lib64/libpthread.so.0
...
(gdb) thread 9
[Switching to thread 9 (Thread 0x7fcd57551700 (LWP 31527))]#0  0x00007fcd73781558 in ?? ()
(gdb) bt
#0  0x00007fcd73781558 in ?? ()
#1  0x00000000017e3708 in ?? ()
#2  0x00007fcd7377f94c in ?? ()
#3  0x00007fcd00000040 in ?? ()
#4  0x0000000000000003 in ?? () at video_packet.cpp:154
#5  0x000000000000fa00 in ?? ()
#6  0x0000000056f63b32 in ?? ()
#7  0x000000000000000f in ?? () at /usr/lib/gcc/x86_64-redhat-linux/4.4.6/../../../../include/c++/4.4.6/bits/stl_algobase.h:214
Backtrace stopped: previous frame inner to this frame (corrupt stack?)
```

这个时候, gdb到线上服务, 发现gdb的也是这个信息.  

```
[root@V_10_129_129_44 /home/user_00]# gdb -p 31518
[Thread debugging using libthread_db enabled]
[New Thread 0x7fcd52547700 (LWP 31537)] => 2
[New Thread 0x7fcd52d48700 (LWP 31536)] => 3
[New Thread 0x7fcd53549700 (LWP 31535)] => 4
[New Thread 0x7fcd53d4a700 (LWP 31534)] => 5
[New Thread 0x7fcd5454b700 (LWP 31533)] => 6
[New Thread 0x7fcd54d4c700 (LWP 31532)] => 7
[New Thread 0x7fcd5554d700 (LWP 31531)] => 8
[New Thread 0x7fcd55d4e700 (LWP 31530)] => 9
[New Thread 0x7fcd5654f700 (LWP 31529)] => 10
[New Thread 0x7fcd56d50700 (LWP 31528)] => 11
[New Thread 0x7fcd57551700 (LWP 31527)] => 12
[New Thread 0x7fcd57d52700 (LWP 31526)]
...
(gdb) thread 12
[Switching to thread 12 (Thread 0x7fcd57551700 (LWP 31527))]#0  0x00007fcd73781558 in ?? ()
(gdb) bt
#0  0x00007fcd73781558 in ?? ()
#1  0x00000000017e3708 in ?? ()
#2  0x00007fcd7377f94c in ?? ()
#3  0x00007fcd00000040 in ?? ()
#4  0x0000000000000003 in ?? ()
#5  0x0000000000017700 in ?? ()
#6  0x0000000056f64111 in ?? ()
#7  0x00000000000003e3 in ?? ()
#8  0x0000000000000000 in ?? ()
```


### strace 查看系统调用和花费的时间

strace可以用来查看系统调用的相关数据, 我们这里主要看系统调用花费的时间.  

```
[root@V_10_129_129_44 /home/user_00]# strace -T -r -c -f -F -p 31518
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 51.29   96.376456         201    479092     42695 futex
 39.95   75.057084          68   1096059           epoll_wait
  7.54   14.163526        1008     14047           poll
  1.21    2.276142      206922        11         3 restart_syscall
  0.00    0.004877           0    125815           write
  0.00    0.003775           0     21283       388 recvfrom
  0.00    0.002747           0    144794           epoll_ctl
  0.00    0.002170           0    115084     41984 read
  0.00    0.001972           0     86524           flock
  0.00    0.000808           0     21320           sendto
  0.00    0.000625           0     41402           gettid
  0.00    0.000436           0     51521           getpeername
  0.00    0.000421           4       110           munmap
  0.00    0.000013           0        65           stat
  0.00    0.000009           0       333           setsockopt
  0.00    0.000000           0        77           close
  0.00    0.000000           0       110           mmap
  0.00    0.000000           0         3           madvise
  0.00    0.000000           0        77           socket
  0.00    0.000000           0        74         3 connect
  0.00    0.000000           0         6           recvmsg
  0.00    0.000000           0         5           shutdown
  0.00    0.000000           0         3           bind
  0.00    0.000000           0         3           getsockname
  0.00    0.000000           0         3           getsockopt
  0.00    0.000000           0        16           fcntl
------ ----------- ----------- --------- --------- ----------------
100.00  187.891061               2197837     85073 total

[root@V_10_129_129_44 /home/user_00]# strace -T -r -c  -p 31527     
Process 31527 attached - interrupt to quit
Process 31527 detached
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 83.82    0.025837           0   1329103           epoll_wait
  7.85    0.002419           0     65589       626 futex
  2.91    0.000898           0     94231     28285 read
  2.40    0.000741           0     37536           write
  2.39    0.000737           0     75098           epoll_ctl
  0.62    0.000191           0     37537           getpeername
  0.00    0.000000           0        26           close
  0.00    0.000000           0        26           socket
  0.00    0.000000           0        13        13 connect
  0.00    0.000000           0        13           sendto
  0.00    0.000000           0        59        59 recvfrom
  0.00    0.000000           0        26           recvmsg
  0.00    0.000000           0        13           bind
  0.00    0.000000           0        13           getsockname
  0.00    0.000000           0        65           setsockopt
  0.00    0.000000           0        13           getsockopt
  0.00    0.000000           0        26           fcntl
------ ----------- ----------- --------- --------- ----------------
100.00    0.030823               1639387     28983 total
```

### perf 分析瓶颈所在


查看 stat 信息.  

```
[root@V_10_129_129_44 /home/user_00]# perf stat -t 31527
 Performance counter stats for thread id '31527':

      55565.778954 task-clock                #    0.999 CPUs utilized          
               539 context-switches          #    0.000 M/sec                  
              4341 CPU-migrations            #    0.000 M/sec                  
                 0 page-faults               #    0.000 M/sec                  
      149053980907 cycles                    #    2.682 GHz                    
     <not counted> stalled-cycles-frontend 
     <not counted> stalled-cycles-backend  
       95017103254 instructions              #    0.64  insns per cycle        
       17835289218 branches                  #  320.976 M/sec                  
         795836040 branch-misses             #    4.46% of all branches        

      55.644597914 seconds time elapsed 
```

查看 top 信息.  

```
[root@V_10_129_129_44 /home/user_00]# perf top -t 31527
PerfTop:    1001 irqs/sec  kernel:68.5%  exact:  0.0% [1000Hz cycles],  (target_tid: 31527)        

|samples  pcnt function              DSO

|2992.00 26.4% ep_send_events_proc  [kernel.kallsyms]  
|2983.00 26.3% tcp_poll             [kernel.kallsyms]  
|1633.00 14.4% sock_poll            [kernel.kallsyms]  
|1045.00  9.2% aeProcessEvents      spp_union.so       
| 725.00  6.4% redisAsyncHandleRead spp_union.so 
```

查看 record 信息.  
其中还可以找到这个线程的相关函数, 进入确定是哪个线程.  
可以看出来, 是redis相关的进程有问题.  

```
[root@V_10_129_129_44 /home/user_00]# perf record -e cpu-clock -t 31527
[root@V_10_129_129_44 /home/user_00]# perf report
Events: 54K cpu-clock
25.34%  spp_union_worke  [kernel.kallsyms]    [k] ep_send_events_proc         
25.03%  spp_union_worke  [kernel.kallsyms]    [k] tcp_poll                    
14.00%  spp_union_worke  [kernel.kallsyms]    [k] sock_poll                    
 9.09%  spp_union_worke  spp_union.so         [.] aeProcessEvents                 
 6.14%  spp_union_worke  spp_union.so         [.] redisAsyncHandleRead   
```

### 问题猜测

上面使用了那么多方法， 只得到几个信息：   

1. 系统调用使CPU跑满  
2. 整个进程`futex`和`epoll_wait`最占用时间。  
3. 有问题的线程`epoll_wait`最占用时间。  


然后 [google futex]({{ site.data.link.google_forum_unix_programmer_futex_cpu }})， 发现存在`leap second`问题.  
但是`leap second`几年才会遇到一次， 而我们这个问题几个月就出现一次， 所以和这个关系不大。  


难道网络操作封装的有问题? 
有时间了, 去看看那个同事的代码吧.






