---
layout: post
title: cmake 学习笔记
category: blog
description: 三个月前就学习了怎么使用cmake, 但是感觉简单就没做记录，现在发现还是有必要记一下。  
tags:  cmake 编译 链接 makefile 依赖库 
keywords: cmake, 编译, 链接,  makefile, 依赖库 
updateData:  22:35 2014/12/14
---

## 前言

之前 hades 说让我在64位系统下做东西，我说没问题。  

然后我问："有 demo(样例) 吗？ 回答:"没有，以后我们都会迁移到 64 位的，你这是新项目，你就先在那上面做吧，还有你看看 cmake 怎么用的吧"  

于是我就开始作为第一个吃螃蟹的人开始了 cmake 的生涯。  

但是当时遇到公共库的问题时，我更多的依赖于 hades, 他解决了我继续找下一个坑。  

直到上周， hades 去北京出差了，他走之前给我说你抽一天时间做做什么吧，很简单的。  

那天我做的时候，发现之前大家都是在 32 位下使用那个东西，64位下根本没有，而且之前的都是 makefile 写的， 还没有 cmake 的 demo.  

刚开始想着等 hades 回来让他把公共库和环境搭建好了我再弄。  

后来我问自己，为什么要等 hades 回来再弄呢？现在自己弄不行吗？  

想了想没什么问题，虽然自己之前从来没弄过与公共库有关的东西。  

> cmake 主要参考 pdf文档 [CMake Practice][book-cmake-practice] 和 [官网][cmake]


## 背景

实际上我不熟悉 makefile , 所以我没法评价 makefile 和 cmake 那个更好。  

不管谁好谁坏吧，先来学习一下这个基本语法吧。  


## cmake 基本语法

当时做了一个笔记，一张A4纸就够了，感觉图片不清晰的话，可以看这个 [pdf][note-cmake-pdf].  

![note-cmake-img][]  


接下来我再简单的介绍一下。   


> cmake 的文件必须保存为 CMakeLists.txt 。  


### 我的编译命令

我把我的 cmake 编译命令写成一个脚本了。  

编译的时候，只需要建一个 bulid 目录， 然后把这个文件放在 bulid 目录里，执行即可。  

为什么要放到 bulid 目录里呢？ 

是因为 cmake 编译的时候会生成很多垃圾数据，这些数据还不能用过 cmake 命令清除(我学的不好，谁知道怎么做可以留言)。  

于是我们放在 一个目录里就可以通过删除目录的所有文件来清理垃圾数据了。  


```
#########################################################################                                         
# File Name: run.sh
# Author: tiankonguse(skyyuan)
# mail: i@tiankonguse.com
# Created Time: Wed Aug 27 11:48:28 2014
#########################################################################
#!/bin/bash
 
cp -f ./run.sh ../run.sh;
rm -rf *;
cp -f ../run.sh ./run.sh;
cmake ../;
make;
make install;
cp -f ./run.sh ../run.sh;
rm -rf *;
cp -f ../run.sh ./run.sh;
```

上面的有效数据其实只有三条。  

第一条会生成 makefile, 然后就只编译 makefile 的命令了。  

```
cmake ../; 
make;  
make install;
```

### 初识 cmake  

假设我们的程序没有依赖任何外部库，这时我们只需要下面几行 cmake 语句即可。  

```
//main.c
#include <stdio.h>
int main()
{
    printf(“Hello World from t1 Main!\n”);
    return 0;
}
```

```
# 项目名称
PROJECT (HELLO) 

# 设置cmake的最低版本
cmake_minimum_required(VERSION 2.8)

# CMAKE_CURRENT_SOURCE_DIR 变量中储存的是当前目录位置
# ${CMAKE_CURRENT_SOURCE_DIR} 为得到变量的值
# MESSAGE 为输出调试信息
MESSAGE(STATUS "This is BINARY dir " ${CMAKE_CURRENT_SOURCE_DIR})

# 将.c文件放到 SRC_LIST 变量中
SET(SRC_LIST main.c)

# 设置生成的可执行程序的名字
ADD_EXECUTABLE(hello SRC_LIST)
```


### PROJECT 命令

完整的语法如下

```
PROJECT(projectname [CXX] [C] [Java])
```

大概意思是定义项目的名称和支持的语言列表，默认支持所有的语言。  


### SET 命令


语法如下

```
SET(VAR [VALUE] [CACHE TYPE DOCSTRING [FORCE]])
```

我们只需要知道 set(key val) 即可。  

### MESSAGE 命令

```
MESSAGE([SEND_ERROR | STATUS | FATAL_ERROR] "message to display" ...)
```

* SEND_ERROR，产生错误，生成过程被跳过。  
* SATUS，输出前缀为—的信息。  
* FATAL_ERROR，立即终止所有cmake过程.  

我一般只用 STATUS， 然后后面的输出简单的提示信息。  


### ADD_EXECUTABLE 命令

定义可执行程序的名字，当然你可以直接这样 `ADD_EXECUTABLE(hello main.c)`
 
实际上，我现在都不明确指定可执行程序的名字了，而是使用 AUX_SOURCE_DIRECTORY 自动获得 cpp 列表。  
 
 
### AUX_SOURCE_DIRECTORY 命令

自动获得当前目录下的cpp源文件列表 

比如`AUX_SOURCE_DIRECTORY(. CXX_SRC)` 之后， 列表就存在 CXX_SRC 变量中了。  


### install 命令

一般我们的程序要安装的指定位置，比如 bin 目录，在 cmake 的最后就需要安装命令了。  
安装的原理其实就是 cp， 只不过如果有依赖，需要把依赖处理好。  

```
install(TARGETS ${EXE_NAME} RUNTIME DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}/bin)
```


## cmake 高级语法


上面的 cmake 可以处理我们的大部分小项目了。  

但是如果我们的项目如果依赖一些公共库的话，那时候就需要学会使用依赖库的相关语法了。  


### INCLUDE_DIRECTORIES 引入头文件

有时候我们有一些公共头文件，都拷贝一份的做法虽然能达到目标，但是一旦这样做了，结果是可怕的。  

所以我们必须要保证有文件只有一份，这样我们只需要维护一份头文件即可。  

那头文件怎么包含进来呢？  

使用  INCLUDE_DIRECTORIES 即可引入头文件了。  

```
set(BASE_INCLUDE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/include)
INCLUDE_DIRECTORIES(${BASE_INCLUDE_DIR})
```


### INCLUDE 依赖库

有时候我们使用的文件不是自己的，这个时候我们一般不简单的指定 include 位置，而是在那个库的位置写一个  `config.project.cmake` 文件。  

`config.project.cmake` 文件内可以详细的写自己这个库的依赖与文件的位置。  

假设我们的公共库的位置存在 变量 PUBLIC_LIBS_PATH 中，我们只需要下面的命令即可引入 json 的库。  

```
INCLUDE($ENV{PUBLIC_LIBS_PATH}/json/config.json.cmake)
```

### target_link_libraries 库

我们把想用的库引进来了，还需要链接才能使用这个库。  

链接命令

```
set(EXE_NAME hello)
target_link_libraries(${EXE_NAME} json)
```

如果我们要链接 A 库， 但是 A 库又依赖 B　库。　　
这个时候我们需要线连接 A 库，然后再链接 B 库。  

即是下面的样子  

```
set(EXE_NAME hello)
target_link_libraries(${EXE_NAME} A)
target_link_libraries(${EXE_NAME} B)
```

### 编译公共库

下面就以 json 这个公共库为例来讲讲怎么编译公共库，并提供给外面的项目使用。  


json 目录的文件大概如下。

```
build/
CMakeLists.txt
config.json.cmake
include/
lib/
lib64/
src/
```
其中 看到的那个 CMakeLists.txt 实际上很简单。  

```
cmake_minimum_required(VERSION 2.8)
ADD_SUBDIRECTORY(src)
```

然后 src 下面的也有个 CMakeLists.txt, 内容如下  

我们可以看到，我们又引用了上面列表中的那个 config.json.cmake 文件。  
也就是说有的信息我们都写在 config.json.cmake 里面了。  

```
SET(CMAKE_CXX_FLAGS "-fPIC -g -Wall -o2")
INCLUDE($ENV{PUBLIC_LIBS_PATH}/json/config.json.cmake)
```

config.json.cmake 文件的内容如下  


```
SET(json_path $ENV{PUBLIC_LIBS_PATH}/json)
SET(json_src_path ${json_path}/src)

IF ($ENV{IS_64BITS_OS})
    SET(json_lib_path ${json_path}/lib64)
ELSE()
    SET(json_lib_path ${json_path}/lib)
ENDIF($ENV{IS_64BITS_OS})

INCLUDE_DIRECTORIES(${json_path}/include)

IF(NOT TARGET json)

AUX_SOURCE_DIRECTORY(${json_src_path} json_xpp_src)
ADD_LIBRARY(json STATIC ${json_xpp_src})

SET_TARGET_PROPERTIES(json PROPERTIES ARCHIVE_OUTPUT_DIRECTORY "${json_lib_path}")

ENDIF()
```
config.json.cmake  文件的简单含义是先定义一下目录的绝对路径，  导入 include， 如果没有 lib 则生成 lib .  


### 特殊的公共库  

有些公共库只是一些头文件，没有 lib 文件，这个时候我们只写个  config.json.cmake 即可。  


## 后话

如果你是初学者的话，可能会采一些坑，不过相信你很快会学会 cmake 的。  

对于 cmake ， 最难的应该就是处理依赖关系吧。  

今天我当下定决心自己处理那几个依赖关系时， 发现依赖关系竟然是如此的简单。  

《完》



[cmake]: http://www.cmake.org/
[note-cmake-pdf]: http://pan.baidu.com/s/1ntt9b7N
[note-cmake-img]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1933500176.png
[book-cmake-practice]: http://pan.baidu.com/s/1bn4cKRt
