---  
layout: post  
title: 删除文件未释放空间
description: 经常遇到服务器上的日志文件太大导致磁盘满了, 如果直接删除的话, 会发现空间并没有释放, 这里记录一下怎么找到这样的文件.   
updateData:  21:08 2016/8/12
categories: [linux]
---  


## 背景

经常遇到服务器上的日志文件太大导致磁盘满了, 如果直接删除的话, 会发现空间并没有释放.  
有时候我们发现文件满了, 却找不到大文件.  
这篇文章记录这么两个知识点.


## 现象

问题的现象是服务器的磁盘满了.    


有时是我们手动删除了大文件, 发现空闲磁盘大小并没有增加.    

```
user_00@Tencent64:~> df -h
Filesystem            Size  Used Avail Use% Mounted on
/dev/sda1             9.2G  1.8G  7.0G  20% /
udev                  3.9G  256K  3.9G   1% /dev
/dev/sda3              19G  16G   16G  100% /usr/local
/dev/sda4             430G  6.2G  402G   2% /data
```


有时是我们登陆服务器没找到大文件, 但是磁盘不足了.     

```
user_00@Tencent64:/usr/local/services> du -h | grep M
1.3M    ./ccagent-0.2/bin
1.4M    ./ccagent-0.2
20M     ./itil_dt_server-0.1/bin
20M     ./itil_dt_server-0.1
1.2M    ./core_check-1.0/admin/data/tmp
1.2M    ./core_check-1.0/admin/data
1.3M    ./core_check-1.0/admin
1.3M    ./core_check-1.0
4.4M    ./spp_searchpool-2.3/bin/lib
8.7M    ./spp_searchpool-2.3/bin
1.8M    ./spp_searchpool-2.3/client/spp_searchpool/lib
1.8M    ./spp_searchpool-2.3/client/spp_searchpool/module
3.9M    ./spp_searchpool-2.3/client/spp_searchpool
3.9M    ./spp_searchpool-2.3/client
1.5M    ./spp_searchpool-2.3/stat
192M    ./spp_searchpool-2.3/moni
206M    ./spp_searchpool-2.3
...
...
...
5.0M    ./uniq_client-1.0
345M    .
```


>
> 这里先不考虑大量小文件的情况.  
>



## 理论知识

在Linux或者Unix系统中，通过rm或者文件管理器删除文件将会从文件系统的目录结构上解除链接(unlink).  
然而如果文件是被打开的（有一个进程正在使用），那么进程将仍然可以读取该文件，磁盘空间也一直被占用。  


## 解决方法

使用`lsof`找到被删除但是fd没释放的文件.  


```
[user_00@V_10_242_131_86 /usr/local/services/spp_list_server_access-2.3/log]$  lsof |grep deleted
unified_c 24853 user_00    2w      REG                8,1        48      50670 /var/spool/cronx/std_logs/stderr_21981_24084_1_153625_1449980771_60 (deleted)
unified_c 24854 user_00    2w      REG                8,1        48      50670 /var/spool/cronx/std_logs/stderr_21981_24084_1_153625_1449980771_60 (deleted)
```


我们可以找到占用删除文件的进程列表了, 然后杀死(`kill -9`)对于的进程或者重启对于的服务即可.  



## 其他知识


说到这里, 可能有人要问: 当我知道一个文件很大时, 该如何清理呢?  

答案是使用重定向重新写该文件即可.  

```
echo > file
```


