---  
layout: post  
title: perf 性能分析 
description:  最近半年在做外网服务, 由于请求量比较大, 且热点不集中, 服务性能需要不断优化来使用较少的机器承载较高的访问量.  
updateData:  23:11 2016/03/29
categories: [后台技术]
---  


## 背景

性能越高的服务, 做的事情应该越要简单.  
当即想做很多复杂的逻辑, 又想性能高, 这本身就是一个悖论.  



## 原理介绍篇


性能计数器是现代CPU中一些特殊的硬件寄存器。  
这些寄存器对特定的硬件事件进行计数：比如指令的执行，cache miss或者是分支预测错误等，同时不会对内核或应用的性能产生影响。  
这些寄存器中的内容可以被定期收集，同时这些寄存器也可以在特定的事件数量超过一定数值时触发中断。  
而在这些中断中，特定的事件数量被记录，并在应用层需要时返回这些数据。  
这样，使得开发者能够收集代码执行过程中某些事件比如cache miss，内存引用以及CPU clock或cycle等的相关信息，并使得开发者能够根据它们来判断代码的运行情况及其原因。  


Linux的性能计数器子系统对这些硬件特性进行了抽象。  
它可以提供针对每个任务和每个CPU的计数器或者是计数器组，并基于它们提供了一系列的事件特性。  
同时，无论底层硬件计数器的字宽是什么，它都可以提供“虚拟的”64位计数器。  

性能计数器可以通过特殊的文件描述符访问。  
这些特殊的文件描述符通过特定的系统调用perf_event_open打开，并可以通过通常的文件访问接口进行访问和设置。多个性能计数器可以被一次打开，并支持poll操作。

Perf对判断系统的性能瓶颈非常有用。  
它可以被配置以中断或定期方式获取事件实例数来收集代码的运行信息。  
在许多体系结构上，Perf提供了对性能计数器的访问。  

Perf能够观察的事件类型包括：  

* PERF_TYPE_HARDWARE ：内核能够提供的“通用的”硬件事件  
* PERF_TYPE_SOFTWARE：内核提供的软件定义的事件（即使没有硬件的支持）  
* PERF_TYPE_TRACEPOINT：由Ftrace 架构提供，支持采样功能  
* PERF_TYPE_HW_CACHE：这些是硬件事件，但是由于其复杂性，因而需要特殊的编码  
* PERF_TYPE_RAW：只有某些CPU支持的特定事件  


其中，PERF_TYPE_HARDWARE类事件包括：  

* cpu-cycles：某段时间内的CPU cycle数；  
* instructions：某段时间内的CPU所执行的指令数；  
* cache misses：cache miss次数；  
* branch misses：分支预测错误次数；  
* 等等。  

而PERF_TYPE_SOFTWARE包含的事件包括：  

*  cpu-clock：某段时间内的cpu时钟数；  
* page faults：页错误次数；  
* context switches：上下文交换次数；  
* 等等。  

以上是一些常用的事件，其中CPU cycles事件和cpu-clock事件因比较常用，我们说一下它们的区别：  
cpu-clock可以用来表示程序执行经过的真实时间，而无论CPU处于什么状态（Pn（n非0）或者是C状态）；  
而CPU cycles则用来表示执行程序指令花费的时钟周期数，如果CPU处于Pn（n非0）或者是C状态，则cycles的产生速度会减慢。  
也即，如果你想查看哪些代码消耗的真实时间多，则可以使用cpu-clock事件；而如果你想查看哪些代码消耗的时钟周期多，则可以使用CPU cycles事件。  


其它的事件我们不再一一赘述，有兴趣的请参考perf相关文档。
 
 
## perf 简单使用篇 


Perf工具的常用命令包括stat，record，report等。  
Perf stat命令用来显示程序运行的整体状况；  
Perf record命令则用来记录指定事件在程序运行过程中的信息  
Perf report命令则用来报告基于前面record命令记录的事件信息生成的程序运行状况报告。  


在使用Perf时，需要对计算机体系结构有深入的了解并理解相关事件的含义，才能选择合适的事件进行观察并根据事件信息对代码的运行状况进行正确的判断。  
如何使用Perf判断性能瓶颈点所在并揭示性能瓶颈原因呢？  
我们下面举例说明常用的Perf命令与用法，更多更详细的用法请参考相关文档。  
在程序运行出现问题时，我们希望快速定位热点代码段，以使得后面的优化和问题分析有的放矢，实现问题的快速定位与解决。  
我们可以使用Perf record命令记录合适的事件信息，并使用Perf report命令生成程序运行状况报告。  


### perf help


```
user_00@:[~]: perf 

 usage: perf [--version] [--help] COMMAND [ARGS]

 The most commonly used perf commands are:
   annotate        Read perf.data (created by perf record) and display annotated code
   archive         Create archive with object files with build-ids found in perf.data file
   bench           General framework for benchmark suites
   buildid-cache   Manage build-id cache.
   buildid-list    List the buildids in a perf.data file
   diff            Read two perf.data files and display the differential profile
   evlist          List the event names in a perf.data file
   inject          Filter to augment the events stream with additional information
   kmem            Tool to trace/measure kernel memory(slab) properties
   kvm             Tool to trace/measure kvm guest os
   list            List all symbolic event types
   lock            Analyze lock events
   record          Run a command and record its profile into perf.data
   report          Read perf.data (created by perf record) and display the profile
   sched           Tool to trace/measure scheduler properties (latencies)
   script          Read perf.data (created by perf record) and display trace output
   stat            Run a command and gather performance counter statistics
   test            Runs sanity tests.
   timechart       Tool to visualize total system behavior during a workload
   top             System profiling tool.

 See 'perf help COMMAND' for more information on a specific command.
```

### Perf list

使用 perf list 命令可以列出所有能够触发 perf 采样点的事件。  
不同的系统会列出不同的结果，在 2.6.35 版本的内核中，该列表已经相当的长，但无论有多少，我们可以将它们划分为三类：  

* Hardware Event 是由 PMU 硬件产生的事件  
  比如 cache 命中，当您需要了解程序对硬件特性的使用情况时，便需要对这些事件进行采样；  
* Software Event 是内核软件产生的事件  
  比如进程切换，tick 数等 ;  
* Tracepoint event 是内核中的静态 tracepoint 所触发的事件  
  这些 tracepoint 用来判断程序运行期间内核的行为细节  
  比如 slab 分配器的分配次数等。  


### perf stat


面对一个问题程序，最好采用自顶向下的策略。先整体看看该程序运行时各种统计事件的大概，再针对某些方向深入细节。  
而不要一下子扎进琐碎细节，会一叶障目的。  

有些程序慢是因为计算量太大，其多数时间都应该在使用 CPU 进行计算，这叫做 CPU bound 型  
有些程序慢是因为过多的 IO，这种时候其 CPU 利用率应该不高，这叫做 IO bound 型  
对于 CPU bound 程序的调优和 IO bound 的调优是不同的。  


如果您认同这些说法的话，Perf stat 应该是您最先使用的一个工具。  
它通过概括精简的方式提供被调试程序运行的整体情况和汇总数据。  


缺省情况下，除了 task-clock-msecs 之外，perf stat 还给出了其他几个最常用的统计信息：  

* Task-clock-msecs：CPU 利用率，该值高，说明程序的多数时间花费在 CPU 计算上而非 IO。  
* Context-switches：进程切换次数，记录了程序运行过程中发生了多少次进程切换，频繁的进程切换是应该避免的。  
* Cache-misses：程序运行过程中总体的 cache 利用情况，如果该值过高，说明程序的 cache 利用不好  
* CPU-migrations：表示进程 t1 运行过程中发生了多少次 CPU 迁移，即被调度器从一个 CPU 转移到另外一个 CPU 上运行。  
* Cycles：处理器时钟，一条机器指令可能需要多个 cycles，  
* Instructions: 机器指令数目。  
* IPC：是 Instructions/Cycles 的比值，该值越大越好，说明程序充分利用了处理器的特性。  
* Cache-references: cache 命中的次数  
* Cache-misses: cache 失效的次数  


```
[user_00@V_10_157_52_38_tlinux /usr/local/services/spp_union_cache_access-2.3/bin]$ sudo perf stat -p 5520 -a  -d 
^C
 Performance counter stats for process id '5520':

    1282722.546146 task-clock                #    7.990 CPUs utilized          
           3777044 context-switches          #    0.003 M/sec                  
             46472 CPU-migrations            #    0.000 M/sec                  
           4807186 page-faults               #    0.004 M/sec                  
     3318941846010 cycles                    #    2.587 GHz                     [75.00%]
     <not counted> stalled-cycles-frontend 
     <not counted> stalled-cycles-backend  
     2045862374411 instructions              #    0.62  insns per cycle         [83.33%]
      473068085460 branches                  #  368.800 M/sec                   [83.33%]
       34589234520 branch-misses             #    7.31% of all branches         [83.33%]
      402475822704 L1-dcache-loads           #  313.767 M/sec                   [83.33%]
       77313494519 L1-dcache-load-misses     #   19.21% of all L1-dcache hits   [83.33%]
       33903915811 LLC-loads                 #   26.431 M/sec                   [33.33%]
       16054743925 LLC-load-misses           #   47.35% of all LL-cache hits    [33.33%]

     160.542797986 seconds time elapsed
```
  

### perf Top

Perf top 用于实时显示当前系统的性能统计信息。  
该命令主要用来观察整个系统当前的状态，比如可以通过查看该命令的输出来查看当前系统最耗时的内核函数或某个用户进程。    

```
sudo perf top -p 16279 
```


![Perf top](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/474612026.png)





### perf record


使用 top 和 stat 之后，您可能已经大致有数了。  
要进一步分析，便需要一些粒度更细的信息。  
比如说您已经断定目标程序计算量较大，也许是因为有些代码写的不够精简。  
那么面对长长的代码文件，究竟哪几行代码需要进一步修改呢？  
这便需要使用 perf record 记录单个函数级别的统计信息，并使用 perf report 来显示统计结果。  
您的调优应该将注意力集中到百分比高的热点代码片段上，假如一段代码只占用整个程序运行时间的 0.1%，即使您将其优化到仅剩一条机器指令，恐怕也只能将整体的程序性能提高 0.1%。俗话说，好钢用在刀刃上，不必我多说了。  


record命令收集采样信息，并将其记录在数据文件中。  
随后可以通过其它工具(perf-report)对数据文件进行分析，结果类似于perf-top的。 


```
perf record  -p 4221
perf report
```


![record](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/489858965.png)


## perf 深入使用篇


CPU周期(cpu-cycles)是默认的性能事件   
比如我们上面的命令`perf record  -p 4221`实际上是`perf record -e cpu-clock -p 4221`的简写形式. 


所谓的CPU周期是指CPU所能识别的最小时间单元，通常为亿分之几秒，是CPU执行最简单的指令时所需要的时间    
例如读取寄存器中的内容，也叫做clock tick。  


### 事件

Perf-list用来查看perf所支持的性能事件，有软件的也有硬件的。  
其中hw(Hardware event 9个),  sw(Software event 9个), cache(Hardware cache event 26个), tracepoint(Tracepoint event 775个).  
sw实际上是内核的计数器，与硬件无关。  
hw和cache是CPU架构相关的，依赖于具体硬件。  
tracepoint是基于内核的ftrace，主线2.6.3x以上的内核版本才支持。  

事件实际上还是有属性的,  使用方式 `-e <event>:<属性>`  
属性有userspace, kernel, hypervisor, guest counting, host counting.  

比如显示内核和模块中，消耗最多CPU周期的函数 `perf top -e cycles:k`  
比如显示分配高速缓存最多的函数 `perf top -e kmem:kmem_cache_alloc`  


### top

对于一个指定的性能事件(默认是CPU周期)，显示消耗最多的函数或指令。  

perf top主要用于实时分析各个函数在某个性能事件上的热度，能够快速的定位热点函数，包括应用程序函数、模块函数与内核函数，甚至能够定位到热点指令。  
默认的性能事件为cpu cycles。  

top 会显示四列数据.  

第一列：符号引发的性能事件的比例，默认指占用的cpu周期比例。  
第二列：符号所在的DSO(Dynamic Shared Object)，可以是应用程序、内核、动态链接库、模块。  
第三列：DSO的类型。[.]表示此符号属于用户态的ELF文件，包括可执行文件与动态链接库)。[k]表述此符号属于内核或模块。  
第四列：符号名。有些符号不能解析为函数名，只能用地址表示。  

常用参数:  

* `-G` 得到调用关系图
* `-e cycles` 指定性能事件
* `-p 1234,5678` 查看指定进程列表的cpu cycles使用情况
* `-s comm,pid,symbol` 显示调用symbol的进程名和进程号
* `--comms nginx,top` 仅显示属于指定进程的符号
* `--symbols kfree` 仅显示指定的符号


### stat

主要输出下面几个性能事件的统计.  

1. task-clock：任务真正占用的处理器时间，单位为ms。`CPUs utilized = task-clock / time elapsed`，CPU的占用率。  
2. context-switches：上下文的切换次数。  
3. CPU-migrations：处理器迁移次数。  
   Linux为了维持多个处理器的负载均衡，在特定条件下会将某个任务从一个CPU迁移到另一个CPU。  
4. page-faults：缺页异常的次数。  
   当应用程序请求的页面尚未建立、请求的页面不在内存中，或者请求的页面虽然在内存中，但物理地址和虚拟地址的映射关系尚未建立时，都会触发一次缺页异常。  
   另外TLB不命中，页面访问权限不匹配等情况也会触发缺页异常。  
5. cycles：消耗的处理器周期数。  
   如果把被ls使用的cpu cycles看成是一个处理器的，那么它的主频为2.486GHz。  可以用cycles / task-clock算出。
6. stalled-cycles-frontend：略过。  
7. stalled-cycles-backend：略过。  
8. instructions：执行了多少条指令。IPC为平均每个cpu cycle执行了多少条指令。  
9. branches：遇到的分支指令数。branch-misses是预测错误的分支指令数。  


### 其他命令

* lock 内核锁的性能分析。  
* kmem slab分配器的性能分析。  
* sched 调度模块分析。  
* probe 自定义探测点。如`fun:12` 在fun函数的12处增加一个探测点.  


## 参考资料

* http://www.ibm.com/developerworks/cn/linux/l-cn-perf1/  
* http://www.ibm.com/developerworks/cn/linux/l-cn-perf2/  
* https://perf.wiki.kernel.org/index.php/Tutorial  


