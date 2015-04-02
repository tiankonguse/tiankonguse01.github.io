---
layout:     post
title:      memcached 源码阅读之库函数介绍
description: 很早就听说过 memcached 了，但是一直没时间来研究一下，现在研究一下。
keywords: memcached, 源码阅读, 库函数
tags: memcached 源码阅读 库函数
categories: [软件研究]
---

## 前言

最近下载了 memcached 源码，准备研究研究。  
但是下载后发现里面有很多库函数自己没见过，于是把这些函数收集起来。  
后来发现我知道的一些函数读者可能还不知道，于是把不常见的函数都记录下来吧。  
这些函数都是看 man 的英文手册学习的，所以可能讲解的非常浅，如果想深入学习，可以询问我或者自行 google 查资料了解。  

想看原理的直接转向 [memcached 源码阅读之原理篇][memcached-code]

## assert

**函数的含义**  

abort the program if assertion is false  
判断一个值是否是 false, 如果是false 就退出。  

这个函数主要用于程序员做测试。  
对于某个变量应该为某个值的时候，为了确保那个变量确实在是那个值，可以用 assert 来担保。  
如果那个变量出现意外不是规定的值，程序将会强制退出，并输出错误信息，格式如下  

当程序正式使用时，就要关闭 assert 这个功能。  
当然，我们不会去一个一个的注释。  
我们可以定义一个宏 NDEBUG， 定义之后 assert 就会无效的。  


**头文件与声明**  

```
#include <assert.h>
void assert(scalar expression);

//source
assert(argc > 2);

//error message
a.out: timedrun.c:94: int main(int, char**): Assertion `argc > 2' failed.
Aborted
```

## alarm


**函数的含义**  

set an alarm clock for delivery of a signal  
设置一个定时发送信号的 alarm  

这个函数主要用于那些需要信号量的程序中。  
alarm 实际上就是一个超时限制。  
alarm 只能设置一个，后面的会覆盖前面的。  


**头文件与声明**  

```
#include <unistd.h>
unsigned int alarm(unsigned int seconds);
```

## fork
       

**函数的含义**  

create a child process  
创建一个子进程

创建一个子进程，这个子进程的内存空间和父进程一样。  
但是这个子进程和父进程还是有一些区别的，这里不多介绍。  

如果 fork 成功，子进程的 PID 会返回给父进程，而在子进程中返回的是0.  
如果返回 -1， 代表子进程创建失败。


**头文件与声明**  

```
#include <unistd.h>
pid_t fork(void);
```


## perror

**函数的含义**  

print a system error message

向标准错误 输出一条信息。  
可以简单的理解为输出一条信息。  


**头文件与声明**  

```
#include <stdio.h>
void perror(const char *s);

#include <errno.h>
const char *sys_errlist[];
int sys_nerr;
int errno;
```


## execvp


**函数的含义**  

execute a file  
执行一个文件     
就是调用另一个可执行程序。  


**头文件与声明**  

```
#include <unistd.h>

extern char **environ;

int execl(const char *path, const char *arg, ...);
int execlp(const char *file, const char *arg, ...);
int execle(const char *path, const char *arg,
          ..., char * const envp[]);
int execv(const char *path, char *const argv[]);
int execvp(const char *file, char *const argv[]);
```


## sigaction


**函数的含义**  

examine and change a signal action  
检查和修改信号 action 


**头文件与声明**  

```
#include <signal.h>
int sigaction(int signum, const struct sigaction *act, struct sigaction *oldact);
```


## waitpid


**函数的含义**  

wait for process to change state  
等待进程去修改状态
简单的说就是等待子进程的信号。  
成功了就返回修改修改状态的那个子进程的 PID.  
如果状态没有修改，返回0，错误返回 -1.  

WIFEXITED(status) 这个宏用来指出子进程是否为正常退出的，如果是，它会返回一个非零值。  
WEXITSTATUS(status) 当WIFEXITED返回非零值时，我们可以用这个宏来提取子进程的返回值.  
WIFSIGNALED(status)
WTERMSIG(status) 当 WIFSIGNALED 返回非零值时，这个宏会导致子进程结束的信号数


**头文件与声明**  

```
#include <sys/types.h>
#include <sys/wait.h>

pid_t wait(int *status);

pid_t waitpid(pid_t pid, int *status, int options);

int waitid(idtype_t idtype, id_t id, siginfo_t *infop, int options);
```


## signal


**函数的含义**  

ANSI C signal handling  
ANSI C 信号  
设置一个信号的回调函数。  
当接受到指定信号时，执行 handler 函数。  

**头文件与声明**  

```
#include <signal.h>

typedef void (*sighandler_t)(int);

sighandler_t signal(int signum, sighandler_t handler);
```


## kill

**函数的含义**  

send signal to a process  
给一个进程发送信号

**头文件与声明**  

```
#include <sys/types.h>
#include <signal.h>
int kill(pid_t pid, int sig);
```

## getrlimit setrlimit

**函数的含义**  

get/set resource limits  
得到最大的资源限制

**头文件与声明**  

```
#include <sys/time.h>
#include <sys/resource.h>

int getrlimit(int resource, struct rlimit *rlim);
int setrlimit(int resource, const struct rlimit *rlim);
```

## getuid

**函数的含义** 

get user identity  
得到用户的身份ID

**头文件与声明**  

```
#include <unistd.h>
#include <sys/types.h>

uid_t getuid(void);
uid_t geteuid(void);
```

## getpwnam

**函数的含义** 

get password file entry 
得到密码文件实体

**头文件与声明**  

```
#include <sys/types.h>
#include <pwd.h>

struct passwd *getpwnam(const char *name);

struct passwd *getpwuid(uid_t uid);

int getpwnam_r(const char *name, struct passwd *pwd, char *buf, size_t buflen, struct passwd **result);

int getpwuid_r(uid_t uid, struct passwd *pwd, char *buf, size_t buflen, struct passwd **result);
```


## setgid

**函数的含义** 

set group identity
设置用户组的ID

**头文件与声明**  

```
#include <sys/types.h>
#include <unistd.h>

int setgid(gid_t gid);
```


## setuid

**函数的含义** 

set user identity
设置用户的ID

**头文件与声明**  

```
#include <sys/types.h>
#include <unistd.h>

int setuid(uid_t uid);
```

## sigemptyset

**函数的含义** 

POSIX signal set operations.

**头文件与声明**  

```
#include <signal.h>

int sigemptyset(sigset_t *set);

int sigfillset(sigset_t *set);

int sigaddset(sigset_t *set, int signum);

int sigdelset(sigset_t *set, int signum);

int sigismember(const sigset_t *set, int signum);
```


## setsid

**函数的含义** 

creates a session and sets the process group ID

**头文件与声明**  

```
#include <unistd.h>

pid_t setsid(void);
```


## dup2

**函数的含义** 

duplicate a file descriptor


**头文件与声明**  

```
#include <unistd.h>

int dup(int oldfd);
int dup2(int oldfd, int newfd);

#define _GNU_SOURCE
#include <unistd.h>

int dup3(int oldfd, int newfd, int flags);
```


## mlockall

**函数的含义** 

lock and unlock memory


**头文件与声明**  

```
#include <sys/mman.h>

int mlock(const void *addr, size_t len);
int munlock(const void *addr, size_t len);

int mlockall(int flags);
int munlockall(void);
```


## getenv

**函数的含义** 

get an environment variable


**头文件与声明**  

```
#include <stdlib.h>

char *getenv(const char *name);
```

[memcached-code]: http://github.tiankonguse.com/blog/2014/11/06/memcached-code/