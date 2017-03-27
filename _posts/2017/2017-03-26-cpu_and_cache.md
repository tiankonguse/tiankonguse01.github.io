---
layout:     post
title:      了解一下CPU与内存之间的秘密  
description: CPU与内存的差距越来越大, 中间需要一些其他技术来弥补这个差距.  
keywords: 后台服务
tags: [后台服务]
categories: [程序人生]
updateData:  23:22 2017/3/26
---


> 
> 大家好, 这里是tiankonguse的公众号(tiankonguse-code).   
> tiankonguse曾是一名ACMer, 现在是鹅长视频部门的后台开发.  
> 这里主要记录工作中的技术架构与经验，计算机相关的技术，数学、算法、生活上好玩的东西  
> 是的, 这里一般只讲技术, 不讲其他的.   
>
>  这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/NK-94uMl6_DPkCC5kIkfGw)自动同步过来.  
>  如果转载请加上署名:公众号tiankonguse-code，并附上公众号二维码，谢谢。   
>  

 


## 零、研究一下底层的东西

之前我曾在《[每秒千万级别的量是重生还是炼狱?](https://mp.weixin.qq.com/s/enDLT-YE2BQWVFFm3xHjXA)》文章提过,我需要接手一个三四年前的一个旧中转系统,于是交给另外一个同事一个任务.  
"我反汇编后, 和代码比较, 发现性能都消耗在第一次加载数据上了...", 我说.  
然后那位同事收集了部分资料就没然后了, 于是我需要找时间来研究了一下CPU和内存之间到底有什么玄机,然后进一步提高我的服务的性能.  


站在巨人的肩膀上可以更快的达到目标, 于是我向REDIS DB同事咨询他们针对大内存多核CPU有没有针对性的做参数调优.  
他们回答没有针对性参数调优, 只是REDIS部署多实例, 每个实例使用一个核和2G内存.  
好吧, 我的业务场景是一个实例必须开几十G的内存, 使用七八个核, 那只好自己去查询资料了.  


**考虑到CPU, CACHE, 内存等理论性太强, 这里就只简单介绍一下结论和数据吧.**  


先来看一下CPU, 内存, 缓存读数据的时延对比吧.  
很明显内存很慢, L1缓存很快, 相差十几倍的延时.  


![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3109067587.png)  
(图来自网络)  



## 一、处理器之CPU  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/921427118.png)  
(图来自wsfdl.com站点)  

CPU核数计算公式: `CPU个数 * 每个CPU核数 * 每个核超线程个数`    


比如下面的信息可以看出有两个处理器, 每个处理器有12个核, 然后每个核都开了2个超线程, 所以对于用户总共就是48个核了.    
另一个信息就是每个处理器有自己的三级缓存(缓存的地址不一样).    


```  
dmidecode -t processor  
  
Socket Designation: CPU01  
    Type: Central Processor  
    Version: Intel(R) Xeon(R) CPU E5-2670 v3 @ 2.30GHz  
    L1 Cache Handle: 0x0013  
    L2 Cache Handle: 0x0014  
    L3 Cache Handle: 0x0015  
    Core Count: 12  
    Core Enabled: 12  
    Thread Count: 24  
Socket Designation: CPU02  
    Type: Central Processor  
    Version: Intel(R) Xeon(R) CPU E5-2670 v3 @ 2.30GHz  
    L1 Cache Handle: 0x0018  
    L2 Cache Handle: 0x0019  
    L3 Cache Handle: 0x001A  
    Core Count: 12  
    Core Enabled: 12  
    Thread Count: 24  
```  
  
## 二、内存之DRAM  
 

DRAM大小计算公式: `DRAM内存大小 = 使用内存卡槽个数 * 每个内存大小`    
查询可以看到共有16个内存槽, 其中使用了8个, 每个内存16G, 合起来就是128G, 如果全插满,应该可以是256G.    
  
```  
dmidecode -t memory  
  
Memory Device  
    Total Width: 72 bits  
    Data Width: 64 bits  
    Size: 16384 MB  
    Form Factor: DIMM  
    Speed: 2400 MHz  
```  

  
## 三、TLB  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1675028237.png)  
(图来自wsfdl.com站点)  


TLB是内存管理中虚拟地址到物理地址转化的优化技术.  
这个技术是在OS层面上实现的.  
当进程需要很大的内存时, TLB上就会有一些弊端了.  
比如进程使用1G的内存, 一页4K, 则TLB需要256K的空间来储存页表索引.  
假设每个页表索引需要8字节, 则1G内存需要2M的内存开销.  

我们可以通过配置页表的大小来减少TLB的数量,这个就是平常听说的huge page.  


  
## 四、NUMA  
  
![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3393194735.png)  
(图来自www.ibm.com站点)  

  
原先所有的CPU通过北桥来读取内存.    
但是CPU核数越来越多, 内存槽数量也越来越多, 北桥就会成为瓶颈.    
于是硬件开发商就把内存控制器做了拆分, 内存分别挂在部分CPU上.    
影响: CPU访问自己关联的内存时速度较快, 访问其他内存时速度较慢(慢三倍).    
严重影响: Linux Kernel优先分配关联自己的内存, 导致内存分布不均匀,其他CPU访问这个内存时性能急剧下降.    
  
查看NUMA与CPU关系.    
  
```  
lscpu   
Architecture:          x86_64  
CPU op-mode(s):        32-bit, 64-bit  
Byte Order:            Little Endian  
CPU(s):                48  
On-line CPU(s) list:   0-47  
Thread(s) per core:    2  #每个核的线程数  
Core(s) per socket:    12 #每个CPU的核数  
Socket(s):             2  #CPU的插槽数量  
NUMA node(s):          2  
Vendor ID:             GenuineIntel  
CPU family:            6  
Model:                 63  
Model name:            Intel(R) Xeon(R) CPU E5-2670 v3 @ 2.30GHz  
Stepping:              2  
CPU MHz:               2301.000  
BogoMIPS:              4591.38  
L1d cache:             32K  
L1i cache:             32K  
L2 cache:              256K  
L3 cache:              30720K  
NUMA node0 CPU(s):     0-11,24-35  
NUMA node1 CPU(s):     12-23,36-47  
```  
  
  
解决方案: 让系统平均分配内存    
  
  
```  
numactl --interleave=all    
```  
  
  
  
  
## 五、L1,L2,L3之cache  


![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2896324173.png)  
(图来自nieyong.github.io站点)  

查询了大量英文资料后,结论如下:    
  
* cache 可以大大提高程序运行速度, 因为不需要去比较慢的内存取数据了.      
* 当程序的内存变大后, cache 的性能会降低, 因为cache中的数据被淘汰了.    
* 当程序的热点内存大小恰好是某些大小时, 性能会急剧下降, 因为恰好遇到了N路关联(N-way set associative cache)的竞争.    
* 当多核有共享内存时, 回写操作可能导致性能急剧下降, 因为数据一致性问题需要刷新所有cache.     
  

想想自己的服务内存几十G, 十几个进程在共享内存竞争同一片内存, 性能果然会很低. ^\/^   
  
>  
> cache是硬件层面的技术, 为了解决内存与CPU之间的差距存在的一种技术.  
> OS不能管理cache, 但是可以flush整个cache的更新数据,保证数据一致性.  
>  

  
我们可以查看一下cache的参数.  
下面命令可以得到这样几个信息:有两个CPU, 每个CPU有单独的三级cache.
其中一级缓存两个,大小都是32K, 8路联合, 二级缓存256K, 8路联合,三级缓存30M, 全联合   
  
  
```  
dmidecode -t cache   
  
第一个核L1D, L1I, L2, L3  
Handle 0x0012, DMI type 7, 19 bytes  
Cache Information  
        Socket Designation: L1 Cache  
        Operational Mode: Write Back  
        Installed Size: 32 kB  
        Maximum Size: 32 kB  
        System Type: Data  
        Associativity: 8-way Set-associative  
Handle 0x0013, DMI type 7, 19 bytes  
Handle 0x0014, DMI type 7, 19 bytes  
Handle 0x0015, DMI type 7, 19 bytes  
          
另外一核L1D, L1I, L2, L3  
Handle 0x0017, DMI type 7, 19 bytes  
Handle 0x0018, DMI type 7, 19 bytes  
Handle 0x0019, DMI type 7, 19 bytes  
Handle 0x001A, DMI type 7, 19 bytes  
```  
  
每个CPU中也可以查看cache的具体信息  
比如下面的路径下,可以在文件中得到很详细的信息.  
我已经转化为表格了.  
  
  
```  
cd /sys/devices/system/cpu1/cache/;tree  
  
|-- index0  
|   |-- coherency_line_size  
|   |-- level  
|   |-- number_of_sets  
|   |-- physical_line_partition  
|   |-- shared_cpu_list  
|   |-- shared_cpu_map  
|   |-- size  
|   |-- type  
|   |-- ways_of_associativity  
|-- index1  
|-- index2  
|-- index3  
  
--------------------------------------------------  
|level | type     | size | sets | ways | block |                 
+------+----------+------+------+------+-------+--  
|  1   | Data     | 32K  | 64   | 8    | 64B   |            
+------+----------+------+------+------+-------+--   
|  1   | Ins      | 32K  | 64   | 8    | 64B   |   
+------+----------+------+------+------+-------+--       
|  2   | Unified  | 256K | 512  | 8    | 64B   |         
+------+----------+------+------+------+-------+--           
|  3   | Unified  | 30M  | 24K  | 20   | 64B   |                   
--------------------------------------------------  
``` 

最后上一张图, 是cache细节的.  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3403636265.png)  
(图来自http://www.cs.umd.edu站点)    


## 六、结论


* 大部分情况下, 业务不需要考虑内存和CPU底层这些情况的.  
* 如果业务的架构能够避免多核操作同一片内存就尽量避免操作同一片内存。  
* 如果业务的架构能够避免申请大量内存就避免申请大量内存。  
* 如果不能避免操作大量内存，就配置huge page, 提高TLB的命中率.  
* 如果不能避免多核, 又有多个CPU, 可以把业务进程绑定在同一个CPU下.  
* 如果业务发现L1或L2命中率异常, 可以试着调整业务内存节点的大小避免竞争问题.  

>  
> 比如我的服务, 我就可以通过单机部署更多的实例, 每个实例单独申请内存, 配置机器的页大小等来调优.  
>  

## 七、参考资料  


* [Introduction to Caches](http://www.cs.umd.edu/class/sum2003/cmsc311/Notes/Memory/introCache.html)  
* [Linux 的 NUMA 技术](https://www.ibm.com/developerworks/cn/linux/l-numa/)  
* [CPU体系架构](https://nieyong.github.io/wiki_cpu/CPU%E4%BD%93%E7%B3%BB%E6%9E%B6%E6%9E%84-Cache.html)   
* [Linux Memory Management](http://www.tldp.org/HOWTO/KernelAnalysis-HOWTO-7.html)  

## 八、其他文章


* [怎么使用GDB快速定位问题?](http://mp.weixin.qq.com/s/vZoZLnUvnliBTp59JKyC3A)  
* [每秒千万级别的量是重生还是炼狱?](http://mp.weixin.qq.com/s/enDLT-YE2BQWVFFm3xHjXA)   
* [每秒千万每天万亿级别服务之诞生](http://mp.weixin.qq.com/s/6taVob0DFx7K5QK-l4nmxQ)  
* [排名算法](http://mp.weixin.qq.com/s/2Y8yS89fLeb019z_TaoYhw)  
* [谈谈布隆过滤器(Bloom Filter)](https://mp.weixin.qq.com/s/NpVzMT_0etlrVNvZ-YWQEQ)


<hr>

长按图片关注公众号, 接受最新文章消息.  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/4224042967.jpg)

