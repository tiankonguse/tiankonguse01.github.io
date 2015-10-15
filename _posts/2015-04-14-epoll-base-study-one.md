---  
layout: post
title:  epoll初级笔记1
category: [后台技术]
description: 几个月前我使用epoll封装了一个定时器，使用了这么久一切正常。今天回顾一下epoll的基础知识。
tags: [epoll, linux, 网络编程]
keywords: [epoll, linux, 网络编程]
updateData:   2015-04-14 02:12:45 
---


## epoll　是什么

介绍 epoll 之前，需要先介绍一下　文件描述符,也就是人们常说的　FD.  

在　linux　中,我们对文件的操作映射到一个文件描述符（其实就是一个数字）,然后我们对这个文件描述符的操作都会对应到具体的文件上。  

后来，由于文件描述符如此好用,我们就把文件描述符抽象出来,比如网络操作，数据库操作等都映射到文件描述符。这样我们的所有这些IO操作都可以当做文件一样来操作就行了。  

然后由于某些原因，比如网络延迟，文件加锁等等吧,那些“文件”暂时是不可用的,此时我们就需要等待了。  

一个网络程序是经常进行网络操作的，如果等待的时间长了，那程序的效率显然比较底下了。  

如果在等待文件描述符的过程中，我们可以去做其他事，文件描述符可以使用的使用，我们再过来继续操作我们的文件描述符。这样的话效率显然提高了。  

然后呢，系统就提供了这样一些函数来监听文件描述符，当IO准备好的时候，我们就可以马上来继续操作这个文件描述符了。  

这样的函数有　epoll, ppoll, select, pselect 等等吧。  

## 打开epoll文件描述符

使用epoll_create函数可以打开一个epoll文件描述符。  

```
#include <sys/epoll.h>

int epoll_create(int size);
int epoll_create1(int flags);
```

上面的代码说明了epoll_create 函数需要sys/epoll.h头文件。  

epoll_create函数会创建一个epoll实例,然后申请创建size个描述符空间。  
但是采用原先创建的方法必然会造成文件描述符的浪费，所以系统只会参考这个size, 实际上创建的个数比这个少，之后需要时会动态创建文件描述符的。  
但是也要注意,这个size不能为０。  

关于epoll_create1函数,当flags是０的时候,作用和epoll_create相同。  
当参数不为０时，应该只能为EPOLL_CLOEXEC了,这里就不讲解这个功能了,初级的我们忽略epoll_create1函数吧。  


这里还要简单的介绍一下返回值。  

默认成功返回非负的epoll文件描述符,返回-1代表出错了,错误把设置在　errno　上。  

错误码如下  

* EINVAL size 不是正数。
* EINVAL (epoll_create1())在 flags 中无效标记被指定。
* EMFILE epoll 实例的单用户个数达到指定的限制值。
* ENFILE 达到系统允许打开文件个数的全局上限。
* ENOMEM 没有更多的内存来创建内核对象。


## 管理epoll下监听的文件描述符集

使用epoll_ctl函数来管理监听的文件描述符集,这个集合我们统称为事件吧。  

主要可以做的是增加新事件，修改已有的事件，删除已有的事件。  


```
#include <sys/epoll.h>
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);
```

### 参数如下  

* epfd 就是我们的epoll文件描述符。  
* fd 是我们要管理的事件。  
* op 指定我们的管理方式：添加，修改，删除。  
* events 是主要指定我们的事件主要是干什么的  


默认成功时，返回０。错误时返回-1,并设置了错误码　errno。  

### 错误码如下  

* EBADF epoll文件描述符或者事件描述符无效
* EEXIST 同一个事件重复添加
* EINVAL epfd 不是一个 epoll 文件描述符，或者 fd 与 epfd 相同，或者请求的操作 op 不被本接口支持。
* ENOENT 修改或者删除的事件不存在
* ENOMEM 没有足够的内存来处理请求的 op 控制操作
* ENOSPC 到达注册事件上限，不能再注册事件
* EPERM 事件不被这个epoll支持


## 等待epoll事件


注册完事件了，接下来我们就可以使用epoll_wait或epoll_pwait等待事件触发了。  


```
#include <sys/epoll.h>

int epoll_wait (int epfd, struct epoll_event *events,int maxevents, int timeout);
int epoll_pwait(int epfd, struct epoll_event *events,int maxevents, int timeout, const sigset_t *sigmask);
```

### 参数如下  


* epfd 就是我们的epoll文件描述符。  
* events 指向的内存包含对调用者有效的事件(关于这个事件后面具体介绍)。  
* maxevents 最多等待触发的事件个数，一般是events数组的大小  
* timeout 超时事件。-1为无事件无限等待，0为若无事件则立即返回。  
* sigmask 信号知识这里不介绍  

返回正数代表触发的事件个数。  
0 代表没有事件返回。  
-1　代表发生错误,并设置了错误码　errno。  

### 错误码如下 

* EBADF 无效　epoll 文件描述符
* EFAULT events 指向的内存没有写权限。
* EINTR 请求事件就绪或 timeout 到期之前，这个调用被信号处理器中断
* EINVAL 无效　epoll 文件描述符，或 maxevents 小于或等于零。


## epoll的数据结构

### epoll_event结构

epoll_wait时的那个　epoll_event　相当简单，只有两个值。  

一个是事件配置信息, 一个是注册这个事件时的一些数据，存在epoll_data_t结构中。  

```
struct epoll_event {
    uint32_t events; /* 事件配置 */
    epoll_data_t data; /* 用户数据变量 */
};
```

events 事件如下：  


* EPOLLIN 对 read(2) 操作有效。
* EPOLLOUT 对 write(2) 操作有效。
* EPOLLRDHUP  流套接口对端关闭连接，或把写端关闭
* EPOLLPRI 存在对 read(2) 操作有效的紧急数据
* EPOLLERR 错误状态：总是等待这个事件，它不需要设置。
* EPOLLHUP 阻塞：总是等待这个事件，不需要设置。
* EPOLLET 设置为边缘触发行为。对 epoll 默认的行为是水平触发的。
* EPOLLONESHOT 设置为一次性有效。



### epoll_data_t 结构

epoll_data_t是一个联合体，事件触发时，我们就当做是事件描述符就行了。  

```
typedef union epoll_data {
    void *ptr;
    int fd;
    uint32_t u32;
    uint64_t u64;
} epoll_data_t;
```

## epoll的好处

1. 接口简单，容易使用(只有三个接口)。
2. 监听多个事件，性能不变。  


[man-pages-epoll_wait]: http://man7.org/linux/man-pages/man2/epoll_wait.2.html
[man-2-epoll_wait]: http://linux.die.net/man/2/epoll_wait
[libc-epoll-wait-1]: http://refspecs.linuxbase.org/LSB_4.1.0/LSB-Core-generic/LSB-Core-generic/libc-epoll-wait-1.html
[linux_manpage-epoll_pwait]: http://cpp.ezbty.org/import_doc/linux_manpage/epoll_pwait.2.html
[linux_manpage-epoll_ctl]: http://cpp.ezbty.org/import_doc/linux_manpage/epoll_ctl.2.html
[linux_manpage-epoll_create]: http://cpp.ezbty.org/import_doc/linux_manpage/epoll_create.2.html
[linux_manpage-select]: http://cpp.ezbty.org/import_doc/linux_manpage/select.2.html

