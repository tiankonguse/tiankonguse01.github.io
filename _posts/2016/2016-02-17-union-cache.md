---  
layout: post  
title: 统一数据缓存系统记录
description:  最近几个月在做同意数据缓存系统， 现在.  
tags:  cache 
keywords: cache
updateData:  22:34 2016/02/17
categories: [程序人生]
---  

## 背景

突然后一天， 组长找我， 说有个系统要加层cache，让我做。  
我想既然是cache，前段时间做了打点系统的cache，应该类似，于是愉快的答应了。  
结果发现这个cache是个不归路， 这么几个月就这样过去了。  

## 需求

统一数据服务就是把视频的所有数据聚合在一起，使用相同的协议，通过一个接口输出数据。  
这些不同的数据，我们称为 table.  
比如视频信息就是一个table，人名信息也是一个table，直播视频信息也是一个table等。  
每个table代表一类数据，这些数据有对应的具体数据信息，比如id,标题，横图，描述等各种信息。  
其中的主键id我们称为key，其他信息称为字段field，用户请求某个table下某些id的某些字段，统一数据服务就返回对应的数据。  


基本需求如下图：  





## 优化内存

架构已经成型, CPU依旧偏高, 性能分析工具发现大部分时间消耗在内存上.  

```
perf record -e cycles -g -a
perf record -e cpu-clock -g -a

perf report
```

从以上结果可以看出，耗费cpu较多的调用主要是堆内存分配、释放。因此想用tcmalloc优化内存分配。

tcmalloc 是 gperftools下的一个库.  
因此需下载 [gperftools][gperftools-github] .    

安装前最好看下里面的INSTALL文件，明确说明了64bit机子需要先安装[libunwind][libunwind-0-99], 并给出了下载链接.  
因此按其要求先安装了[libunwind][libunwind-0-99], 再安装gperftools。

安装之后直接把动态库放到对应位置, 修改配置, 重启服务, 结果效果不大.  

```
export LD_LIBRARY_PATH=/usr/local/lib/:$LD_LIBRARY_PATH
export LD_PRELOAD=/usr/local/lib/libtcmalloc.so
```

后来找到一个测试报告, 原来我的服务使用tcmalloc确实提高不了性能.  


> 在单线程的情况下glibc自带的内存分配在小内存的情况相比TcMalloc还要相对有优势，分配到了1MB时TcMalloc才开始比glibc快。
> 而在多线程的情况，TcMalloc性能完全是碾压glibc，glibc增长几乎随着分配字节大小近指数增长


我的服务时多线程,单线程的, 分配的也都是小内存, 所以



[gperftools-github]: https://github.com/tiankonguse/gperftools
[libunwind-0-99]: http://download.savannah.gnu.org/releases/libunwind/libunwind-0.99-beta.tar.gz














