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

CPU使用率衡量的是程序运行占用的CPU百分比。  
Linux的CPU使用率信息可以通过/proc/stat文件计算得到。  
`/proc/stat`包含了所有CPU活动的信息，该文件中的所有值都是从系统启动开始累计的  


例如，通过下面的命令查看`/proc/stat`文件：

```
tiankonguse:~ $ cat /proc/stat | grep -v intr
          user    nice    system       idle  iowait irq softirq    steal guest
cpu  154375552 1011872 682040476 5420612907 2043408  18 1217716 27972503     0
cpu0  41650418  247813 165811096 1356403837  367672  17  844659  6709755     0
cpu1  37329100  259004 171591260 1355459763  562584   0  123774  7088423     0
cpu2  37526836  251588 172158332 1354712101  551088   0  125533  7090496     0
cpu3  37869197  253466 172479787 1354037205  562063   0  123750  7083827     0
ctxt 21766306
btime 1447249138
processes 6279
procs_running 2
procs_blocked 0
softirq 3450935 8 1276220 2486 7484 321121 0 823406 514259 3765 502186
```

cpu一行指的是总的CPU信息，cpu0、cpu1、cpu2、cpu3几行指的是CPU各个核的CPU信息。  
从这里也可以看出这台服务器共有4个核。每列从左到右的意思为：  

* user：从系统启动开始累计到当前时刻，用户态的CPU时间 ，不包含 nice值为负进程。
* nice：从系统启动开始累计到当前时刻，nice值为负的进程所占用的CPU时间
* system：从系统启动开始累计到当前时刻，内核态时间
* idle：从系统启动开始累计到当前时刻，除硬盘IO等待时间以外其它等待时间
* iowait：从系统启动开始累计到当前时刻，硬盘IO等待时间
* irq：从系统启动开始累计到当前时刻，硬中断时间
* softirq：从系统启动开始累计到当前时刻，软中断时间
* steal：在虚拟环境下 CPU 花在处理其他作业系统的时间，Linux 2.6.11 开始才开始支持。
* guest：在 Linux 内核控制下 CPU 为 guest 作业系统运行虚拟 CPU 的时间，Linux 2.6.24 开始才开始支持。（因为内核版本不支持，上面的示例没有这一列）


根据这些信息，就可以计算出CPU使用率。  




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

Device: rrqm/s  wrqm/s   r/s    w/s  rsec/s  wsec/s avgrq-sz avgqu-sz  await  svctm  %util
sda       0.23  158.14  0.37  13.91   43.47 1376.67    99.47     0.07   4.95   1.02   1.45
```

这里显示的有三个信息: 系统信息, cpu信息, io信息.  
这里主要介绍io信息, 其他信息含义可以参考系统信息和cpu信息的介绍.  

io信息每列含义如下:  

* rrqm/s:   每秒进行merge的读操作数目。
* wrqm/s:   每秒进行merge的写操作数目。
* r/s:      每秒完成的读 I/O 设备次数。
* w/s:      每秒完成的写 I/O 设备次数。
* rsec/s:   每秒读扇区数。
* wsec/s:   每秒写扇区数。
* rkB/s:    每秒读K字节数。是 rsect/s 的一半，因为扇区大小为512字节
* wkB/s:    每秒写K字节数。是 wsect/s 的一半
* avgrq-sz: 平均每次设备I/O操作的数据大小 (扇区)
* avgqu-sz: 平均I/O队列长度。
* await:    平均每次设备I/O操作的等待时间 (毫秒)
* svctm:    平均每次设备I/O操作的服务时间 (毫秒)
* %util:    一秒中有百分之多少的时间用于 I/O 操作，或者说一秒中有多少时间 I/O 队列是非空的。 

怎么理解这里的字段呢？下面以超市结账的例子来说明。  

我们在超市排队结账时，怎么决定该去哪个收银台呢?   
首先是看每个收银台的排队人数，5个人总比20人要快吧？  
除了数人头，我们也常常看看前面人购买的东西多少，如果前面有个采购了一星期食品的大妈，那么可以考虑换个队排了。  
还有就是收银员的速度了，如果碰上了连钱都点不清楚的新手，那就有的等了。  
另外，时机也很重要，可能 5分钟前还人满为患的收款台，现在已是人去楼空，这时候交款就很爽啊，当然，前提是那过去的 5 分钟里所做的事情比排队要有意义（不过我还没发现什么事情比排队还无聊的）。  

I/O 系统也和超市排队有很多类似之处:  


*  r/s+w/s 类似于交款人的总数
*  avgqu-sz（平均队列长度）：类似于单位时间里平均排队的人数
*  svctm（平均服务时间）类似于收银员的收款速度
*  await（平均等待时间）类似于平均每人的等待时间
*  avgrq-sz（平均IO数据）类似于平均每人所买的东西多少
*  %util（磁盘IO使用率）类似于收款台前有人排队的时间比例。

我们可以根据这些数据分析出 I/O 请求的模式，以及 I/O 的速度和响应时间：

* 如果%util 接近100%，说明产生的I/O请求太多，I/O系统已经满负荷，该磁盘可能存在瓶颈
* svctm的大小一般和磁盘性能有关，CPU/内存的负荷也会对其有影响，请求过多也会间接导致 svctm 的增加。
* await的大小一般取决于服务时间（svctm） 以及 I/O 队列的长度和 I/O 请求的发出模式。一般来说svctm < await，因为同时等待的请求的等待时间被重复计算了。如果svctm 比较接近await，说明I/O 几乎没有等待时间
* 如果await 远大于svctm，说明I/O队列太长，应用得到的响应时间变慢
* 队列长度（avgqu-sz）也可作为衡量系统 I/O 负荷的指标，但由于 avgqu-sz 是按照单位时间的平均值，所以不能反映瞬间的 I/O 洪水。
*  如果响应时间超过了用户可以容许的范围，这时可以考虑更换更快的磁盘，调整内核elevator算法，优化应用，或者升级 CPU。
*  如果%util很大，而rkB/s和wkB/s很小，一般是因为磁盘存在较多的磁盘随机读写，最好把磁盘随机读写优化成顺序读写。

### diskstats

另外,iostat命令的信息实际上是从 /proc/diskstats 文件读取计算得到的.  

```
tiankonguse:~ $ cat /proc/diskstats
   1       0 ram0 0 0 0 0 0 0 0 0 0 0 0
   1       1 ram1 0 0 0 0 0 0 0 0 0 0 0
   1       2 ram2 0 0 0 0 0 0 0 0 0 0 0
   1       3 ram3 0 0 0 0 0 0 0 0 0 0 0
   1       4 ram4 0 0 0 0 0 0 0 0 0 0 0
   1       5 ram5 0 0 0 0 0 0 0 0 0 0 0
   1       6 ram6 0 0 0 0 0 0 0 0 0 0 0
   1       7 ram7 0 0 0 0 0 0 0 0 0 0 0
   1       8 ram8 0 0 0 0 0 0 0 0 0 0 0
   1       9 ram9 0 0 0 0 0 0 0 0 0 0 0
   1      10 ram10 0 0 0 0 0 0 0 0 0 0 0
   1      11 ram11 0 0 0 0 0 0 0 0 0 0 0
   1      12 ram12 0 0 0 0 0 0 0 0 0 0 0
   1      13 ram13 0 0 0 0 0 0 0 0 0 0 0
   1      14 ram14 0 0 0 0 0 0 0 0 0 0 0
   1      15 ram15 0 0 0 0 0 0 0 0 0 0 0
   7       0 loop0 0 0 0 0 0 0 0 0 0 0 0
   7       1 loop1 0 0 0 0 0 0 0 0 0 0 0
   7       2 loop2 0 0 0 0 0 0 0 0 0 0 0
   7       3 loop3 0 0 0 0 0 0 0 0 0 0 0
   7       4 loop4 0 0 0 0 0 0 0 0 0 0 0
   7       5 loop5 0 0 0 0 0 0 0 0 0 0 0
   7       6 loop6 0 0 0 0 0 0 0 0 0 0 0
   7       7 loop7 0 0 0 0 0 0 0 0 0 0 0
   8       0 sda 263865 42939 9871240 5147856 45241 157331 4957538 7345136 0 1237864 12493112
   8       1 sda1 360 1226 5142 10468 2 0 2 4 0 5796 10472
   8       2 sda2 257603 16605 9617346 5002116 42984 24213 3881432 6726948 0 1201648 11729428
   8       3 sda3 5714 25105 247224 134516 1395 133118 1076104 570124 0 80340 704624
```

这个文件统计了每个驱动的io信息.  
每行有14列, 含义如下:  

1. major number
2. minor mumber
3. device name
4. reads completed
5. reads merged                                        （
6. sectors read
7. time spent reading (ms)
8. writes completed
9. writes merged
10. sectors written
11. time spent writing (ms)
12. I/Os currently in progress
13. time spent doing I/Os (ms)
14. weighted time spent doing I/Os (ms)

跟记录CPU信息的`/proc/stat`文件一样，`/proc/diskstats`中每个字段的数值也是从系统启动后一直累加的。我们用delta来表示在时间t内某个字段的增量。例如定义delta(reads merged)为当前reads merged的值减去t秒前reads merged的值


知道了`/proc/diskstats`每个字段的意义，磁盘IO数据的统计算法原理也就非常直观了。算法如下：

* rrqm/s：delta(reads merged) / t   （得到时间t内平均每秒reads merged的值）
* wrqm/s：delta(writes merged) / t
* r/s：delta(reads completed) / t
* w/s：delta(writes completed) / t
* rsec/s：delta(sectors read) / t
* wsec/s：delta(sectors written) / t
* rkB/s：delta(sectors read) / t / 2   （因为1 扇区为512字节，所以rkB/s为rsec/s的一半）
* wkB/s：delta(sectors written) / t / 2
* avgrq-sz：(delta(sectors read) + delta(sectors written)) / (delta(reads completed) + delta(writes completed))
* avgqu-sz：delta(weighted time spent doing I/Os) / t / 1000 （单位为毫秒，所以除以1000）
* await：(delta(time spent reading) + delta(time spent writing)) / (delta(reads completed) + delta(writes completed))
* svctm：delta(time spent doing I/Os)/ (delta(reads completed) + delta(writes completed))
* %util：delta(time spent doing I/Os) / t / 1000 * 100%




## 整体性能

```
tiankonguse@:[~]: vmstat 
procs -----------memory---------- ---swap-- -----io---- --system-- -----cpu-----
 r  b    swpd   free   buff   cache   si   so    bi    bo   in   cs us sy id wa st
 1  0 2104504 632680 508064 5411892    0    0     3    86    0    0  2  2 96  0  0
```



## 查看系统信息

```
tiankonguse@:[~]: uname -a
Linux TENCENT64.site 2.6.32.43-tlinux-1.0.7-default #1 SMP Mon Dec 17 12:09:27 CST 2012 x86_64 x86_64 x86_64 GNU/Linux
```


## 查看系统综合信息

```
tiankonguse@:[~]: top

top - 22:22:27 up 261 days,  9:58, ? users,  load average: 2.75, 2.57, 2.43
Tasks: 1040 total,   2 running, 1038 sleeping,   0 stopped,   0 zombie
Cpu(s):  2.2%us,  1.7%sy,  0.0%ni, 95.9%id,  0.1%wa,  0.0%hi,  0.0%si,  0.0%st
Mem:   8052852k total,  7421328k used,   631524k free,   507720k buffers
Swap:  2104504k total,  2104504k used,        0k free,  5404192k cached
```

## 查看系统运行时长与负载


```
tiankonguse@:[~]: uptime
 22:22:49 up 261 days,  9:59, ? users,  load average: 2.33, 2.49, 2.40
```

实际上这个信息在 top 命令的第一行也可以得到.  

这里重点记录一下 load average 中三个数据的含义.  
通过man手册中查到，这三个数据分别是CPU 1分钟、5分钟、15分钟内系统的平均负载。  
如果你继续看手册，它还会告诉你，当CPU完全空闲的时候，平均负载为0；当CPU工作量饱和的时候，平均负载为1。  

很显然，"load average"的值越低，比如等于0.2或0.3，就说明电脑的工作量越小，系统负载比较轻。  

但是，什么时候能看出系统负载比较重呢？  
等于1的时候，还是等于0.5或等于1.5的时候？如果1分钟、5分钟、15分钟三个值不一样，怎么办？  

### 理解CPU负载

首先，假设最简单的情况，你的电脑只有一个CPU，所有的运算都必须由这个CPU来完成。  

那么，我们不妨把这个CPU想象成一座大桥，桥上只有一根车道，所有车辆都必须从这根车道上通过。（很显然，这座桥只能单向通行。）  

* 系统负载为0，意味着大桥上一辆车也没有。  
* 系统负载为0.5，意味着大桥一半的路段有车  
* 系统负载为1.0，意味着大桥的所有路段都有车，也就是说大桥已经"满"了。
  但是必须注意的是，直到此时大桥还是能顺畅通行的。  
* 系统负载为1.7，意味着车辆太多了，大桥已经被占满了（100%），后面等着上桥的车辆为桥面车辆的70%。
* 以此类推，系统负载2.0，意味着等待上桥的车辆与桥面的车辆一样多；  
* 系统负载3.0，意味着等待上桥的车辆是桥面车辆的2倍。

总之，当系统负载大于1，后面的车辆就必须等待了；系统负载越大，过桥就必须等得越久。  

CPU的系统负载，基本上等同于上面的类比。  
大桥的通行能力，就是CPU的最大工作量；桥梁上的车辆，就是一个个等待CPU处理的进程（process）。  

如果CPU每分钟最多处理100个进程，那么系统负载0.2，意味着CPU在这1分钟里只处理20个进程；  
系统负载1.0，意味着CPU在这1分钟里正好处理100个进程；  
系统负载1.7，意味着除了CPU正在处理的100个进程以外，还有70个进程正排队等着CPU处理。  

为了电脑顺畅运行，系统负载最好不要超过1.0，这样就没有进程需要等待了，所有进程都能第一时间得到处理。  
很显然，1.0是一个关键值，超过这个值，系统就不在最佳状态了，你要动手干预了  

### 经验法则

1.0是系统负载的理想值吗？  
不一定，系统管理员往往会留一点余地，当这个值达到0.7，就应当引起注意了。经验法则是这样的：  
当系统负载持续大于0.7，你必须开始调查了，问题出在哪里，防止情况恶化。  
当系统负载持续大于1.0，你必须动手寻找解决办法，把这个值降下来。  
当系统负载达到5.0，就表明你的系统有很严重的问题，长时间没有响应，或者接近死机了。你不应该让系统达到这个值。  

### 多处理器

上面，我们假设你的电脑只有1个CPU。如果你的电脑装了2个CPU，会发生什么情况呢？  
2个CPU，意味着电脑的处理能力翻了一倍，能够同时处理的进程数量也翻了一倍。  
还是用大桥来类比，两个CPU就意味着大桥有两根车道了，通车能力翻倍了。  
所以，2个CPU表明系统负载可以达到2.0，此时每个CPU都达到100%的工作量。  
推广开来，n个CPU的电脑，可接受的系统负载最大为n.0。  


### 多核处理器

芯片厂商往往在一个CPU内部，包含多个CPU核心，这被称为多核CPU。  

在系统负载方面，多核CPU与多CPU效果类似，所以考虑系统负载的时候，必须考虑这台电脑有几个CPU、每个CPU有几个核心。  
然后，把系统负载除以总的核心数，只要每个核心的负载不超过1.0，就表明电脑正常运行。  

怎么知道电脑有多少个CPU核心呢？  

"cat /proc/cpuinfo"命令，可以查看CPU信息。  

```
tiankonguse:~ $ grep -c 'model name' /proc/cpuinfo
4
```


### 观察时长

最后一个问题，"load average"一共返回三个平均值：1分钟系统负载、5分钟系统负载，15分钟系统负载。应该参考哪个值？  

如果只有1分钟的系统负载大于1.0，其他两个时间段都小于1.0，这表明只是暂时现象，问题不大。  

如果15分钟内，平均系统负载大于1.0（调整CPU核心数之后），表明问题持续存在，不是暂时现象。  
所以，你应该主要观察"15分钟系统负载"，将它作为电脑正常运行的指标。  




## 参考资料


* [Understanding Linux CPU Load](http://blog.scoutapp.com/articles/2009/07/31/understanding-load-averages)









