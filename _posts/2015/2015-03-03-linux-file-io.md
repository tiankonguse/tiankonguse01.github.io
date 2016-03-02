---  
layout: post  
title:  简单了解linux 文件I/O 
description: 之前一直没系统的阅读linux书籍，过年回家看了几章UNIX环境高级编程，发现挺好的，现在记录一下文件I/O 相关知识点。  
updateData:  22:24 2015/3/3
keywords: linux,文件IO
tags: [linux, 文件IO]
categories: [程序人生]
---  

## 背景

常见的文件IO函数时 open, create, close, read, lseek, write 这六个函数，大家都经常见到的。  

但是提起 dup, dup2, fcntl， ioctl 这些函数， 很多人就不认识了。  

这里就重点介绍一下这些不认识的函数吧， 对于常见的函数只是简单的提一下吧。  


## 基础知识

对于内核而言，所有打开的文件都是通过文件描述符引用。  
当打开或者创建一个文件的时候，内核向进程返回一个文件描述符（非负整数）。  
后续对文件的操作只需通过该文件描述符，内核记录有关这个打开文件的信息（file结构体）。  

一个进程启动时，默认打开了3个文件，标准输入、标准输出、标准错误，对应文件描述符是0（STDIN_FILENO）、1（STDOUT_FILENO）、2（STDERR_FILENO）,这些常量定义在unistd.h头文件中。


### open 函数

open 函数可以打开或创建一个文件。  

```
#include<fcntl.h>
int open(const char *path, int flags, ... /* mode_t mode */);
```

path 是文件名字， flags是打开文件的选项。  

选项大概有下面这些

* O_RDONLY 打开一个供读取的文件
* O_WRONLY 打开一个供写入的文件
* O_RDWR 打开一个可供读写的文件
* O_APPEND 写入的所有数据将被追加到文件的末尾
* O_CREAT 打开文件，如果文件不存在则建立文件
* O_EXCL 如果已经置O_CREAT且文件存在，则强制open() 失败
* O_TRUNC 在open() 时，将文件的内容清空
* O_CLOEXEC 在进行exec进程替换时关闭打开的文件描述符。
* O_NONBLOCK 非阻塞模式


### create 函数

create 函数创建一个新文件。  


```
#include<fcntl.h>
int create(const char *path, int flags,  mode_t mode);
```

参数说明请参考 open 函数。  

### close 函数

close 关闭一个打开的文件，参数为文件描述符。  

```
#include<unistd.h>
int close(int filedes);
```

### lseek 函数

lseek 显示的位打开的文件设置偏移量，打开时偏移量为0。  

```
#include<unistd.h>
off_t lseek(int filedes, off_t offset, int whence);
```

参数简单解释

* whence 为 SEEK_SET 时， 偏移量 offset 相对于文件开始处计数。  
* whence 为 SEEK_CUR 时， 偏移量 offset 相对于当前的偏移量开始计数, offset 可以为正或负
* whence 为 SEEK_END 时， 偏移量 offset 相对于文件末尾处开始计数, offset 可以为正或负


### read 函数

read 函数从打开的文件读数据。  

```
#include<unistd.h>
off_t read(int filedes, void* buf, size_t nbytes);
```

### write 函数

write 函数从打开的文件写数据。  

```
#include<unistd.h>
off_t write(int filedes, const void* buf, size_t nbytes);
```

## 文件共享

如果一个进程或线程操作一个文件， 那没什么问题。  
但是多个进程和线程同时操作一个文件时，就需要共享打开的文件了。  


### 内核中IO的数据结构


内核使用三种数据结构表示打开的文件。  

1. 进程在进程表中中都有一个记录项：文件描述符和指向一个文件表项的指针
2. 内核为所有打开的文件维持一张文件表；文件状态标志，文件当前偏移量，指向该文件v节点表项的指针
3. 每个打开的文件都有一个v节点结构：文件信息。  


两个进程打开同一个文件，会共用一个 v节点表。  


当多个进程同时写一个文件时，就会发生意想不到的问题了。  

例如后来新增的 pread 和 pwrite 就是将seek 操作和io操作合并为一个原子操作的扩展。  


### dup 复制文件描述符函数

复制一个现有的文件描述符  

```
#include<unistd.h>
int dup(int filedes);
int dup2(int filedes, int filedes2);
```

dup 复制当前文件描述符，返回最小的可用的文件描述符。  
dup2 将当前文件描述符复制到指定的文件描述符，指定的文件描述符若一打开，则先关闭。  


复制文件描述符后， 他们共享同一个文件表。  


### sync 同步函数

sync 主要用于刷新缓存。  

```
#include<unistd.h>
int fsync(int filedes);
int fdatasync(int filedes);
void sync(void);
```

sync 函数将所有修改过的块缓冲区排入写队列后立即返回。    
fsync 函数只对指定的文件的搜索修改的块缓冲写入到队列，并等待写到磁盘后返回。  
fdatasync 函数将所有数据写入磁盘后返回。fsync 只是将数据写到磁盘，文件属性信息写到磁盘之前就返回了。  

### fcntl 函数

fcntl 函数改变已经打开的文件的性质  

```
#include<unistd.h>
int fcntl(int filedes, int cmd, .../* int arg */);
```


fcntl 的具体功能如下  

* 复制文件描述符 F_DUPFD(long)
* 设置/获取文件描述符标志 F_GETFD (void)= F_SETFD (long)
* 设置/获取文件状态标志 F_GETFL (void) F_SETFL (long)
* 获取/设置文件锁 F_GETLK F_SETLK，F_SETLKW
* 获取/设置异步IO所有权 F_GETOWN, F_SETOWN


### ioctl 函数

ioctl 函数时 IO 操作的杂物箱， 上面函数不能实现的功能，都在这里面实现。  

比如操作磁带，获取和设置终端窗口大小以及终端的高级功能。  


## 参考资料

* UNINX环境高级编程
* [Linux Programmer's Manual FCNTL(2)][man2-fcntl]
* [Linux下 fcntl 函数用法说明][cissco-iteye-266924]
* [fcntl 函数与文件锁][csdn-jnu_simba-8927115]

[cissco-iteye-266924]: http://cissco.iteye.com/blog/266924
[man2-fcntl]: http://man7.org/linux/man-pages/man2/fcntl.2.html
[csdn-jnu_simba-8927115]: http://blog.csdn.net/jnu_simba/article/details/8927115
