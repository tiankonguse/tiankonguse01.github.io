---  
layout: post  
title: linux 下core dump 简单了解   
description:  c++程序问题遇到的多了，就会发现有时候core文件是非常有用的，于是简单了解一下core背景知识。  
keywords: [linux, core dump]
updateData:  13:38 2015/4/2
tags: [linux, core dump] 
categories: [程序人生]
---  


## 概念

A core dump is the recorded state of the working memory of a computer program at a specific time, generally when the program has terminated abnormally (crashed).   

In practice, other key pieces of program state are usually dumped at the same time, including the processor registers, which may include the program counter and stack pointer, memory management information, and other processor and operating system flags and information.   

The name comes from the once-standard memory technology core memory.   

Core dumps are often used to diagnose or debug errors in computer programs.  



On many operating systems, a fatal error in a program automatically triggers a core dump, and by extension the phrase "to dump core" has come to mean, in many cases, any fatal error, regardless of whether a record of the program memory is created.  



## 配置

在终端中输入`ulimit -c`如果结果为0，说明当程序崩溃时，系统并不能生成core dump。  


使用`ulimit -c unlimited`命令，开启core dump功能，并且不限制生成core dump文件的大小。  
如果需要限制，加数字限制即可。  

```
ulimit - c 1024
```


默认情况下，core dump生成的文件名为core，而且就在程序当前目录下。  
新的core会覆盖已存在的core。  
通过修改`/proc/sys/kernel/core_uses_pid`文件，可以将进程的pid作为作为扩展名，生成的core文件格式为core.xxx，其中xxx即为pid  


通过修改`/proc/sys/kernel/core_pattern`可以控制core文件保存位置和文件格式。


## 实验


```
tiankonguse@tiankonguse:~/github$ ulimit -c 
0

tiankonguse@tiankonguse:~/github$ ulimit -c unlimited
tiankonguse@tiankonguse:~/github$ ulimit -c 
unlimited

tiankonguse@tiankonguse:~/github$ ulimit -c 0
tiankonguse@tiankonguse:~/github$ ulimit -c 
0

tiankonguse@tiankonguse:~/github$ cat /proc/sys/kernel/core_uses_pid
0

tiankonguse@tiankonguse:~/github$ ulimit -c unlimited
bash: ulimit: core file size: 无法修改 limit 值: 不允许的操作

tiankonguse@tiankonguse:~/github$ cat /proc/sys/kernel/core_pattern
|/usr/share/apport/apport %p %s %c %P

tiankonguse@tiankonguse:~/github$ ll /usr/share/apport/apport
-rwxr-xr-x 1 root root 17289  3月 18 08:02 /usr/share/apport/apport*
```

apport 是个python编写的程序崩溃时收集信息的程序。

```
tiankonguse@tiankonguse:~/github$ head /usr/share/apport/apport
#!/usr/bin/python3

# Collect information about a crash and create a report in the directory
# specified by apport.fileutils.report_dir.
# See https://wiki.ubuntu.com/Apport for details.
#
# Copyright (c) 2006 - 2011 Canonical Ltd.
# Author: Martin Pitt <martin.pitt@ubuntu.com>
```


[kongque-141262]: http://www.cppblog.com/kongque/archive/2011/03/07/141262.aspx
