---  
layout: post
title:  timerfd 初级笔记1
category: [后台技术]
description: 几个月前我使用timerfd封装了一个定时器，使用了这么久一切正常。今天回顾一下timerfd的基础知识。
tags: [timerfd, linux, 网络编程]
keywords: [timerfd, linux, 网络编程]
updateData:   19:08 2015/4/15
---


## timerfd是什么

timerfd 是 Linux 为用户程序提供的一个定时器接口。  

这个接口基于文件描述符，然后我们就可以和 epoll 组合做很多事了。  

关于 epoll 的记录可以看看这里 [epoll初级笔记1][epoll-base-study-one].  


## 创建定时器

使用 timerfd_create 函数可以创建一个定时器。  

```
#include <sys/timerfd.h>

int timerfd_create(int clockid, int flags);
int timerfd_settime(int fd, int flags, const struct itimerspec *new_value, struct itimerspec *old_value);
int timerfd_gettime(int fd, struct itimerspec *curr_value);
```


参数 clockid 可以是 CLOCK_MONOTONIC 或者 CLOCK_REALTIME 。  
这两个参数的区别如下：  

* CLOCK_REALTIME 参考系统的实时时间，如果系统时间被改变，定时器的参考时间也改变  
* CLOCK_MONOTONIC 参考建定时器时的时间，如果之后系统时间被修改， 定时器里的参考时间不变。  

flags 参数在 linux 2.6.26 版本之后，必须为0。  

之前参数可以使用 TFD_NONBLOCK 和 TFD_CLOEXEC 通过异或配置。  


函数执行成功返回一个文件描述符，失败的话返回-1,错误码需要查errno。


错误码如下  


* EINVAL 不能识别clockid。
* EINVAL flags 无效； 或者，在 2.6.26 及其前，flags 非零。
* EMFILE 达到单个进程打开的文件描述上限。
* ENFILE 达到可打开文件个数的系统全局上限。
* ENODEV 不能挂载（内部）匿名结点设备。
* ENOMEM 内存不足


## 设置非阻塞模式


由于timerfd_create的flags参数现在必须为0了， 所以我们必须手动设置这个FD为非阻塞模式了。  

设置代码如下， 获取现有FD的参数， 然后加上 O_NONBLOCK， 最后再设置我们的FD即可。  

```
flags = fcntl(fd, F_GETFL, 0);
flags |= O_NONBLOCK;
fcntl(fd, F_SETFL, flags)
```
我这里有简单的介绍 fcntl 函数 - [简单了解linux 文件I/O][linux-file-io-content-h3-fcntl].  

不懂 fcntl 的人可以来这里快速了解一下这个函数的功能。  


## 设置超时时间


创建完定时器的FD了，肯定要设置超时时间才能启动定时作用啦。  


```
#include <sys/timerfd.h>

int timerfd_settime(int fd, int flags, const struct itimerspec *new_value, struct itimerspec *old_value);
```


* fd 就是我们的定时器文件描述符。    
* flags 1代表设置的是绝对时间；为0代表相对时间。  
  绝对时间的意思是到那个时间点触发事件  
  相对时间是多少时间之后触发事件  
* new_value 需要设置的时间  
* old_value 需要返回的上次设置的时间，一般传NULL指针。  


## 得到设置的时间


有时候，我们需要手动定时器时，可能需要查询上次设置的时间，这时可以使用 timerfd_gettime 函数。  


```
#include <sys/timerfd.h>

int timerfd_gettime(int fd, struct itimerspec *curr_value);
```

### 定时器的数据结构


我们在设置时间和得到时间时，遇到了结构体 `struct itimerspec`， 它的结构如下。  


```
struct timespec {
    time_t tv_sec;                /* Seconds */
    long   tv_nsec;               /* Nanoseconds */
};

struct itimerspec {
    struct timespec it_interval;  /* Interval for periodic timer */
    struct timespec it_value;     /* Initial expiration */
};
```

## 简单使用样例

```
//创建定时器
timer_id = timerfd_create(CLOCK_REALTIME, 0);

//设置非阻塞
flags = fcntl(fd, F_GETFL, 0);
flags |= O_NONBLOCK;
fcntl(fd, F_SETFL, flags)

//设置超时时间
double timer_internal = 3.2;
struct itimerspec ptime_internal;
memset(&ptime_internal, 0, sizeof(ptime_internal));
ptime_internal.it_value.tv_sec = (int) timer_internal;
ptime_internal.it_value.tv_nsec = (timer_internal - (int) timer_internal) * 1000000;

timerfd_settime(timer_id, 0, &ptime_internal, NULL);

//其他操作
```



[linux-file-io-content-h3-fcntl]: http://github.tiankonguse.com/blog/2015/03/03/linux-file-io/#content-h3-fcntl 函数
[epoll-base-study-one]: http://github.tiankonguse.com/blog/2015/04/14/epoll-base-study-one/
