---  
layout: post  
title: free命令详解
description: 简单记录一下free命令．  
updateData:  13:08 2016/8/14
categories: [linux]
---  


## 背景

free命令是linux下最常见的命令之一．  
这里简单记录一下．  


## 介绍


`free`用于显示系统内存的使用情况．  


```
tiankonguse:~ $ free -m
             total       used       free     shared    buffers     cached
Mem:          3876       3549        326        323         24       1033
-/+ buffers/cache:       2491       1384
Swap:         4018        132       3886
```


第二行显示了从系统角度看来内存使用的情况．  
第三行从用户角度显示内存信息,可用内存从数量上等于mem行used列值减去buffers和cached内存的大小．  
第四行内存交换：　当可用内存少于额定值的时候，就会开始进行交换  
这些信息都是从`/proc/meminfo`读到的．  

### 字段含义

* total 系统可用的内存大小, 数量上等于系统物理内存减去内核保留的内存  
* used 已经使用的内存数  
* free 空闲的内存数  
* shared 当前已经废弃不用  
* buffers: Buffer Cache内存数, 与某个块设备关联, 包含了文件系统元数据, 并且跟踪了块的变化  
* cached: Page Cache内存数,只包含了文件本身  


### 缓存扩展


为了提高磁盘存取效率, Linux做了一些精心的设计, 除了对dentry进行缓存(用于VFS,加速文件路径名到inode的转换), 还采取了两种主要Cache方式：Buffer Cache和Page Cache。  
前者针对磁盘块的读写，后者针对文件inode的读写。  
这些Cache有效缩短了 I/O系统调用(如read,write,getdents)的时间。  

因为Linux会将暂时不使用的内存作为文件和数据缓存，以提高系统性能，当应用程序需要这些内存时，系统会自动释放.  


## 使用

### 大小

* `-b` B为单位  
* `-k`　K为单位  
* `-m` M为单位  
* `-g` G为单位  
* `-h` 自动按合适的单位显示  

### 其他

`-s`按指定时间显示一次内容.  
`-c`显示指定数量次数  

```
tiankonguse:~ $ free -m -c 3 -s 1
             total       used       free     shared    buffers     cached
Mem:          3876       3589        286        364         29       1085
-/+ buffers/cache:       2474       1401
Swap:         4018        132       3886

             total       used       free     shared    buffers     cached
Mem:          3876       3590        285        364         29       1086
-/+ buffers/cache:       2474       1401
Swap:         4018        132       3886

             total       used       free     shared    buffers     cached
Mem:          3876       3590        285        364         29       1086
-/+ buffers/cache:       2475       1401
Swap:         4018        132       3886
```








