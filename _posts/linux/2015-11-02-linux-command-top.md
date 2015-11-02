---
layout:     post
title:      linux命令之top
description: 关于top这个命令, 虽然简单, 但是真正的了解了怎么使用, 还是很有帮助的.  
keywords: linux, shell, top
tags: [linux, shell, top]
categories: [程序人生]
updateData:   8:49 2015/11/2
---

## 前言

之前有一篇记录《[Linux 命令记录(持续更新中)](http://github.tiankonguse.com/blog/2014/09/30/linux-command/)》.  
那篇文章命令比较多, 只能简单的记录罗列出命令的基本功能以及常见用法, 并不能详细的讲解每一个命令.  

于是这里针对每一个命令, 在单独开一个记录来详细的讲解命令的功能以及用法.  


## 基本用法

在终端中输入 `top` 命令, 可以看到基本信息.  

```
user_00@:[~]: top

top - 11:47:38 up 283 days, 23:23, ? users,  load average: 1.20, 1.48, 1.90
Tasks: 1163 total,   1 running, 1162 sleeping,   0 stopped,   0 zombie
Cpu(s):  3.7%us,  3.7%sy,  0.0%ni, 92.3%id,  0.0%wa,  0.0%hi,  0.4%si,  0.0%st
Mem:   8052852k total,  3234092k used,  4818760k free,    38664k buffers
Swap:  2104504k total,  2103300k used,     1204k free,  2146968k cached

PID USER PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+ COMMAND              
25045 user_00   20   0 12144 8984 2448 S 15.2  0.1   1:05.49 syncCateScore.p
```


* 第一行 机器的使用情况. 到当前时间11:47:38 位置,  共运行了283天23小时23分钟.  
* 第二行 共运行了 1163 个进程, 1个在运行状态, 1162 个处于sleep状态, 0个处于stop状态, 0个处于zombie状态.  状态待完善.  
* 第三行 CPU 用户相关占用 3.7%, 这一行具体含义待后面补充完善.  
* 第四行 内存 共8G 内存, 用了3.2G, 空闲4.8G, 缓存38M.  
* 第五行 交换区  2G的交换区大小, 使用了 2G, 剩余1M, 缓存了2G.  具体含义待补充.  


接下来是一个列表.  
默认显示12列.  

* PID 进程号
* USER 进程所属用户
* PR 
* NI
* VIRT
* RES
* SHR
* S       
* %CPU  占用CPU
* %MEM  占用内存
* TIME+ 运行时长
* COMMAND 执行这个进程的命令


## 基本命令


### 各种命令开关

* Z 配置颜色,一般不配置, 默认即可.   
* B 控制是否开启高亮显示.  
* l 控制 `load average` 是否显示.  
* t 控制  `task/cpu stats` 是否显示
* m 控制 `mem info` 是否显示
* 1 分别显示CPU的状态
* I Irix/Solaris mode 
* f 控制显示那些字段.字段如下  
    * A: PID        = Process Id
    * E: USER       = User Name
    * H: PR         = Priority
    * I: NI         = Nice value
    * O: VIRT       = Virtual Image (kb)
    * Q: RES        = Resident size (kb)
    * T: SHR        = Shared Mem size (kb)
    * W: S          = Process Status
    * K: %CPU       = CPU usage
    * N: %MEM       = Memory usage (RES)
    * M: TIME+      = CPU Time, hundredths
    * B: PPID       = Parent Process Pid
    * C: RUSER      = Real user name
    * D: UID        = User Id
    * F: GROUP      = Group Name
    * G: TTY        = Controlling Tty
    * J: P          = Last used cpu (SMP)
    * P: SWAP       = Swapped size (kb)
    * L: TIME       = CPU Time
    * R: CODE       = Code size (kb)
    * S: DATA       = Data+Stack size (kb)
    * U: nFLT       = Page Fault count
    * V: nDRT       = Dirty Pages count
    * Y: WCHAN      = Sleeping in Function
    * Z: Flags      = Task Flags <sched.h>
    * X: COMMAND    = Command name/line
* o 调整字段显示的顺序
* F/O 调整默认排序字段
* `>/<` 下个字段作为排序字段
* R 正常排序或者反序
* H 显示线程
* c 显示命令
* i idle tasks
* S cumulative time
* x 高亮排序字段
* y 运行的任务
* z 颜色
* b 高亮
* u 显示指定用户的进程信息
* n/# 控制显示的进程数
* k kill task
* r renice task
* d/s 更新周期时间
* W 保存配置文件
* q 退出




### 配置颜色

Z 命令可以配置颜色,一般不配置, 默认即可.  

```
Help for color mapping - procps version 3.2.8
current window: 1:Def

   color - 04:25:44 up 8 days, 50 min,  7 users,  load average:
   Tasks:  64 total,   2 running,  62 sleeping,   0 stopped,
   Cpu(s):  76.5% user,  11.2% system,   0.0% nice,  12.3% idle
    Nasty Message!   -or-  Input Prompt
     PID TTY     PR  NI %CPU    TIME+   VIRT SWAP STA Command  
   17284 pts/2    8   0  0.0   0:00.75  1380    0 S   /bin/bash 
    8601 pts/1    7 -10  0.4   0:00.03   916    0 R < color -b 
   11005 ?        9   0  0.0   0:02.50  2852 1008 S   amor -ses 
   available toggles: B =disable bold globally (On),
       z =color/mono (On), b =tasks "bold"/reverse (On)

Select target as upper case letter:
   S = Summary Data,  M = Messages/Prompts,
   H = Column Heads,  T = Task Information
Select color as number:
   0 = black,  1 = red,      2 = green,  3 = yellow,
   4 = blue,   5 = magenta,  6 = cyan,   7 = white

Selected: target  T ; color  1 
   press 'q' to abort changes to window '1:Def'
   press 'a' or 'w' to commit & change another, <Enter> to commit and end
```

