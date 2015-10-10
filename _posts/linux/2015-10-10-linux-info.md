---
layout:     post
title:      Linux下的设备信息
description: 偶尔需要查看一下linux系统下的设备信息, 记录一下.
keywords: linux
tags: [linux]
categories: [程序人生]
updateData:   22:47 2015/10/10
---

## CPU 
 

在 cpuinfo 文件中, 可以看到CPU的信息:  

```
tiankonguse@:[~]: cat /proc/cpuinfo
processor       : 0
vendor_id       : GenuineIntel
cpu family      : 6
model           : 30
model name      : Intel(R) Xeon(R) CPU           X3440  @ 2.53GHz
stepping        : 5
cpu MHz         : 2534.000
cache size      : 8192 KB
physical id     : 0
siblings        : 8
core id         : 0
cpu cores       : 4
apicid          : 0
initial apicid  : 0
fpu             : yes
fpu_exception   : yes
cpuid level     : 11
wp              : yes
flags           : fpu vme de pse ...
bogomips        : 5054.06
clflush size    : 64
cache_alignment : 64
address sizes   : 36 bits physical, 48 bits virtual
power management:
```

重要字段含义如下:  

* processor 逻辑处理器的唯一标识符。
* physical id 物理CPU的唯一标识符, 一般为0.  
* core id    内核的唯一标识符
* siblings  物理CPU中逻辑CPU的数量
* cpu cores  逻辑CPU中内核数量



## 内存



在 meminfo 文件中, 可以看到内存的信息: 


```
tiankonguse@:[~]: cat /proc/meminfo
MemTotal:        8052852 kB
MemFree:          622468 kB
Buffers:          504856 kB
Cached:          5416756 kB
SwapCached:        16656 kB
Active:          4918784 kB
Inactive:        2056172 kB
Active(anon):    1399360 kB
Inactive(anon):   699804 kB
Active(file):    3519424 kB
Inactive(file):  1356368 kB
Unevictable:           0 kB
Mlocked:               0 kB
SwapTotal:       2104504 kB
SwapFree:              0 kB
Dirty:              3532 kB
Writeback:             0 kB
AnonPages:       1036744 kB
Mapped:           721968 kB
Shmem:           1045816 kB
Slab:             292004 kB
SReclaimable:     230188 kB
SUnreclaim:        61816 kB
KernelStack:        9704 kB
PageTables:        62684 kB
NFS_Unstable:          0 kB
Bounce:                0 kB
WritebackTmp:          0 kB
CommitLimit:     6130928 kB
Committed_AS:    8838576 kB
VmallocTotal:   34359738367 kB
VmallocUsed:      301848 kB
VmallocChunk:   34359432024 kB
HardwareCorrupted:     0 kB
HugePages_Total:       0
HugePages_Free:        0
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:       2048 kB
DirectMap4k:        3712 kB
DirectMap2M:     8376320 kB
```

这里的信息和 `free` 命令显示的差不多.  

```
tiankonguse@:[~]: free -k
             total       used       free     shared    buffers     cached
Mem:       8052852    7430136     622716          0     504856    5416756
-/+ buffers/cache:    1508524    6544328
Swap:      2104504    2104504          0
``` 


重要字段含义如下:  

* MemTotal 内存总数
* MemFree 空闲的内存数
* Buffers  磁盘缓存的大小
* -buffers/cache   已用的内存数: `used - buffers - cached`
* +buffers/cache   可用的内存数: `free + buffers + cached`
* 


## 磁盘  


### 查看磁盘分区


```
tiankonguse@:[~]: df -h
Filesystem            Size  Used Avail Use% Mounted on
/dev/sda1             9.9G  2.2G  7.2G  24% /
/dev/sda3              20G  4.2G   15G  23% /usr/local
/dev/sda4             427G  236G  170G  59% /data
tmpfs                 3.9G  2.4M  3.9G   1% /dev/shm
```


### 查看磁盘io  

```
tiankonguse@:[~]: iostat  -x
Linux 2.6.32.43-tlinux-1.0.7-default (TENCENT64.site)   10/10/2015      _x86_64_        (8 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           2.22    0.00    1.73    0.15    0.00   95.91

Device:         rrqm/s   wrqm/s     r/s     w/s   rsec/s   wsec/s avgrq-sz avgqu-sz   await  svctm  %util
sda               0.23   158.14    0.37   13.91    43.47  1376.67    99.47     0.07    4.95   1.02   1.45
```


## 整体性能

```
tiankonguse@:[~]: vmstat 
procs -----------memory---------- ---swap-- -----io---- --system-- -----cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0 2104504 632680 508064 5411892    0    0     3    86    0    0  2  2 96  0  0
```


## 其他

### 查看系统信息

```
tiankonguse@:[~]: uname -a
Linux TENCENT64.site 2.6.32.43-tlinux-1.0.7-default #1 SMP Mon Dec 17 12:09:27 CST 2012 x86_64 x86_64 x86_64 GNU/Linux
```


### 查看系统负载

```
tiankonguse@:[~]: top

top - 22:22:27 up 261 days,  9:58, ? users,  load average: 2.75, 2.57, 2.43
Tasks: 1040 total,   2 running, 1038 sleeping,   0 stopped,   0 zombie
Cpu(s):  2.2%us,  1.7%sy,  0.0%ni, 95.9%id,  0.1%wa,  0.0%hi,  0.0%si,  0.0%st
Mem:   8052852k total,  7421328k used,   631524k free,   507720k buffers
Swap:  2104504k total,  2104504k used,        0k free,  5404192k cached
```

### 查看系统运行时长


```
tiankonguse@:[~]: uptime
 22:22:49 up 261 days,  9:59, ? users,  load average: 2.33, 2.49, 2.40
```


