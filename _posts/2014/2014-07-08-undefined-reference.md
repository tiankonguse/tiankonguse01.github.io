---
layout : post 
description : 我犯了比较低级的错误, 最后发现是因为gcc和g++的区别导致的。  
title : undefined reference to std::ios_base::Init::Init
keywords: undefined, reference, 错误
tags: [reference, gcc, ios_base]
categories: [程序人生]
---

## 问题背景


最近在看《[UNIX环境高级编程][C_and_Cplusplus_in_linux]》，在敲上面的例子的时候，发现使用　gcc 编译时出现一些错误：


```text
tiankonguse@tiankonguse:~/github/C_and_Cplusplus_in_linux/linux/apue/process$ gcc getpid.cpp 

/tmp/ccnM12VC.o: In function `__static_initialization_and_destruction_0(int, int)':
getpid.cpp:(.text+0x2b3): undefined reference to `std::ios_base::Init::Init()'
getpid.cpp:(.text+0x2ca): undefined reference to `std::ios_base::Init::~Init()'
collect2: error: ld returned 1 exit status

```

## 几个参测

面对这个问题，我有几个猜测。

说猜测之前需要说一下背景，几个小时前，我[搭建了 Objective-C 的环境][C_and_Cplusplus_in_linux]，其中安装了　GNUstep 等一大堆东西。

然后我的第一个猜测是就是安装 GNUstep 导致我的编译出现问题。

但是我这个猜测没有对应的解决方案，所以我尝试删除与　std 有关的头文件。

然后竟然编辑成功且正常运行了。

于是我的第二个猜测是 Objective-C 与安装的 c++ 库有冲突。

然后我写代码是使用 vi 写的。

vi 新创建一个文件的时候，会默认插入我ACM比赛时常用的头文件，也就是那些与std有关的头文件。

每次创建都一个一个的删除自然不是方法，写一个 vi-script 函数虽然可以解决问题，但是这事治病不治根。

于是我还是打开浏览器，启动代理，　google了一下，找到问题的根本原因了。

原来我SB了。

## 解决方法

把　gcc 替换成　g++ 即可。

其实看到上面的解决方案，原因不用说也可以看出来吧。

gcc 主要用于编译c程序，　g++ 用于编译c++程序，当然也可以编译c程序。

这里的'编译'指的是从源码生成可执行程序，即编译+链接+生成可执行程序。

说到这，可能就要提一个问题了，gcc与g++的真正区别了。


我直接从网上搜了一个，可以参考一下：

* gcc和g++都是GNU(组织)的一个编译器。
* 后缀名为.c的程序和.cpp的程序g++都会当成是c++的源程序来处理。而gcc不然，gcc会把.c的程序处理成c程序。
* 对于.cpp的程序，编译可以用gcc/g++，而链接可以用g++或者gcc -lstdc++。（个人觉得这条是最重要的）


## 参考资料

* [chinazhangjie][]

(完)

[C_and_Cplusplus_in_linux]: https://github.com/tiankonguse/C_and_Cplusplus_in_linux/tree/master/linux/apue
[C_and_Cplusplus_in_linux]: https://github.com/tiankonguse/C_and_Cplusplus_in_linux/tree/master/objective-c
[chinazhangjie]: http://www.cnblogs.com/chinazhangjie/archive/2011/05/23/2054598.html
