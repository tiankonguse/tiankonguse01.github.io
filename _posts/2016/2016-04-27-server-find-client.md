---  
layout: post  
title: 从服务端反向查找客户端信息
description:  提供一个服务, 有时候想反过来查找调用方的进程信息, 今天用到了, 这里记录一下.    
updateData:  22:02 2016/4/27
categories: [程序人生]
---  


## 抓到客户端ip

直接`tcpdump`监听服务的端口号, 找到客户端的ip.  
比如这里服务的ip是`10.185.16.50`, 端口是`8560`和`8563`, 找到客户端ip是`10.134.131.36`.  

```
sudo tcpdump  -iany -nlp  "port 8560 or 8563" -c 1         

22:17:19.955583 IP 10.130.25.95.46622 > 10.185.16.50.8563: P 37:74(37) ...
```

## 确认客户端ip

这一步实际上可以忽略, 但是如果在服务器上抓包时间和第二步的时间相差比较久, 还是确认一下比较好.  
不然双方不好对账, 服务方说有请求, 客户端说没请求.  
另一方面, 我们也可以看看通信频率.  
下面抓到客户端和服务器通信, 客户端使用的端口是`23717`.  


> 当然, 实际项目中, 请多抓包一会, 可能有多个不同的程序存在.    

<br>

```
sudo tcpdump  -iany -nlp  "src 10.185.16.50 and (port 8560 or 8563)" -c 1

22:23:21.410760 IP 10.185.16.50.8563 > 10.130.25.95.23717: ....
```

## 找到进程名

使用客户端端口, 服务端端口或者服务端ip都可以定位到具体的进程名和进程号.  


> 当然, 实际项目中, 请不要使用 more, 而应该多监听一会, 可能有多个程序存在.    

<br>

```
#通过客户端端口号
lsof -nP | grep 38972 | more -1

modulefra 28114 user_00 28u IPv4 1117707040 TCP 10.130.25.95:38972->v.cm.com:8563 (ESTABLISHED)

#通过服务端端口号
lsof -nP | grep 8563 | more -1
sync_cove 2439 user_00 53u IPv4 1128559523 TCP 10.130.25.95:40816->10.185.16.50:8563 (ESTABLISHED)

#通过服务端ip
lsof -nP | grep 10.185.16.50 | more -1
sync_cove 2439 user_00 30u IPv4 1128559486 TCP 10.130.25.95:58377->10.185.16.50:8561 (ESTABLISHED)
```


## 初级定位进程位置

如果幸运, 后面会直接显示程序的绝对路径, 但是这里很不幸, 显示的是相对路径.  
这个时候我们就需要找到进程的`cwd`所在的位置了.  

```
ps -aef |  grep sync_cove
user_00   2439     1  1 14:48 ?        00:07:26 ./sync_cover_redis
```

## 高级定位进程位置

进程运行时, 会把当前目录保存起来, 我们可以查看这个信息.  

```
user_00@V_10_130_25_95:/proc/2439> ll /proc/2439
total 0
-r--------  1 user_00 users 0 Apr 27 22:34 auxv
-r--r--r--  1 user_00 users 0 Apr 27 14:48 cmdline
-r--r--r--  1 user_00 users 0 Apr 27 22:34 cpuset
lrwxrwxrwx  1 user_00 users 0 Apr 27 14:50 cwd -> /usr/local/services/video_write_redis-1.0/bin
-r--------  1 user_00 users 0 Apr 27 14:48 environ
lrwxrwxrwx  1 user_00 users 0 Apr 27 14:48 exe -> /usr/local/services/video_write_redis-1.0/bin/sync_cover_redis
dr-x------  2 user_00 users 0 Apr 27 14:48 fd
-rw-------  1 user_00 users 0 Apr 27 22:34 mapped_base
-r--r--r--  1 user_00 users 0 Apr 27 22:24 maps
-rw-------  1 user_00 users 0 Apr 27 22:34 mem
-r--r--r--  1 user_00 users 0 Apr 27 22:34 mounts
-rw-r--r--  1 user_00 users 0 Apr 27 22:34 oom_adj
-r--r--r--  1 user_00 users 0 Apr 27 22:34 oom_score
lrwxrwxrwx  1 user_00 users 0 Apr 27 14:48 root -> /
-rw-------  1 user_00 users 0 Apr 27 22:34 seccomp
-r--r--r--  1 user_00 users 0 Apr 27 14:49 smaps
-r--r--r--  1 user_00 users 0 Apr 27 14:48 stat
-r--r--r--  1 user_00 users 0 Apr 27 14:53 statm
-r--r--r--  1 user_00 users 0 Apr 27 14:48 status
dr-xr-xr-x 16 user_00 users 0 Apr 27 14:49 task
-r--r--r--  1 user_00 users 0 Apr 27 22:34 wchan
```

## 结语

好了, 到目前我们就快乐的找到自己想要的进程以及路径了.  

