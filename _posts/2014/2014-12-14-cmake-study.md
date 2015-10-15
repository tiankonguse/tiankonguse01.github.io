---
layout: post
title: cmake 学习笔记
description: 三个月前就学习了怎么使用cmake, 但是感觉简单就没做记录，现在发现还是有必要记一下。  
tags:  cmake 编译 链接 makefile 依赖库 
keywords: cmake, 编译, 链接,  makefile, 依赖库 
updateData:  22:35 2014/12/14
categories: [程序人生]
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

当时做了一个笔记，一张A4纸就够了，感觉图片不清晰的话，可以看这个 [pdf][note-cmake-pdf] 或 [图片][note-cmake-img-pan] (现在的百度云的压缩策略改变了，一张高清图片被缩略的这么不清晰).  


![note-cmake-img][]  


接下来我再简单的介绍一下。   


> cmake 的文件必须保存为 CMakeLists.txt 。  
> 一般每个目录有放一个 CMakeLists.txt, 本目录的 CMakeLists.txt 负责管理本目录的项目。 
> 这样我们通过一个树形的 CMakeLists.txt 就很容易管理一个大型项目了。


.


### 我的编译命令


我把我的 cmake 编译命令写成一个脚本了。  

编译的时候，只需要在根目录建一个 bulid 目录(当然也需要一个bin目录)， 然后把这个文件放在 bulid 目录里，执行即可。  

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

第一条 `cmake ../;` 会生成 makefile, 然后就只编译 makefile 的命令 `make` 和 安装程序的命令 `make install` 了 。  


### 初识 cmake  


假设我们的程序没有依赖任何外部库，这时我们只需要下面几行 cmake 语句即可。  

```
//main.c
#include <stdio.h>
int main(){
    printf("Hello World from t1 Main!\n");
    return 0;
}
```


```
# CMakeLists.txt 
PROJECT (HELLO) 

cmake_minimum_required(VERSION 2.8)

MESSAGE(STATUS "This is BINARY dir " ${CMAKE_CURRENT_SOURCE_DIR})

AUX_SOURCE_DIRECTORY(. SRC_LIST)
ADD_EXECUTABLE(hello SRC_LIST)

SET(EXE_NAME main)
install(TARGETS ${EXE_NAME} RUNTIME DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}/bin)
```


* PROJECT  定义项目的名称和支持的语言列表，默认支持所有的语言  
* SET 定义变量  
* MESSAGE 输出调试信息  
    - SEND_ERROR，产生错误，生成过程被跳过。  
    - SATUS，输出前缀为—的信息。    
    - FATAL_ERROR，立即终止所有cmake过程.    
* AUX_SOURCE_DIRECTORY 获得当前目录下的cpp源文件列表， 付给变量 SRC_LIST， 列表使用空格隔开
* ADD_EXECUTABLE 定义可执行程序的名字 ， 后面需要附加cpp列表 
* ${name} 得到变量 name 的值  
* install 把可执行程序安装到指定位置。安装的原理其实就是 cp， 只不过如果有依赖，需要把依赖处理好。  


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

```
SET(CMAKE_CXX_FLAGS "-fPIC -g -Wall -o2")
INCLUDE($ENV{PUBLIC_LIBS_PATH}/json/config.json.cmake)
```


我们可以看到，我们src 里面的 CMakeLists.txt 又引用了上面列表中的那个 config.json.cmake 文件。  

也就是说我们把主要的描述信息都写在 config.json.cmake 里面了。  


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
INCLUDE($ENV{PUBLIC_LIB_PATH}/A/config.A.cmake)
INCLUDE($ENV{PUBLIC_LIB_PATH}/B/config.B.cmake)

IF(NOT TARGET json)

AUX_SOURCE_DIRECTORY(${json_src_path} json_xpp_src)
ADD_LIBRARY(json STATIC ${json_xpp_src})

add_dependencies(json A)
add_dependencies(json B)

SET_TARGET_PROPERTIES(json PROPERTIES ARCHIVE_OUTPUT_DIRECTORY "${json_lib_path}")

ENDIF()
```

config.json.cmake  文件的简单含义是先定义一下目录的绝对路径，  导入 include， 如果没有 lib 则生成 lib .  

其中那个 `IF ($ENV{IS_64BITS_OS})` 语句主要是判断系统时多少位的，然后会把生成的 lib 库放到合适的位置。  

而 `IF(NOT TARGET json)` 语句则判断目标文件 .a 库 是否存在， 不存在则生成那个目标文件。  

如果这个库依赖其他的库，则需要先 INCLUDE 对应的 配置文件(`INCLUDE($ENV{PUBLIC_LIB_PATH}/A/config.A.cmake)`)，然后链接对应的依赖库(`add_dependencies(json A)`) 即可。  

最后，在 bulid 中执行 `./run.sh`， 你去 lib 或 lib64 下看看是不是已经生成了 .a 库文件。  


### 静态编译公共库

上面的门编译了 json 这个库，然后使用时发现还会重新编译生成。   

原来我们简单的使用 `IF(NOT TARGET packet)` 来判断是不行的。  

那我们就需要换一种静态编译公共库的方法了。  

我们 src 下的 CMakeLists 单独写一份来专门生成 .a 库。  

```
SET(CMAKE_CXX_FLAGS "-fPIC -g -Wall -o2")

IF ($ENV{IS_64BITS_OS})
    SET(json_lib_path ${PROJECT_SOURCE_DIR}/lib64)
ELSE()
    SET(json_lib_path ${PROJECT_SOURCE_DIR}/lib)
ENDIF($ENV{IS_64BITS_OS})

SET(json_src_path ${PROJECT_SOURCE_DIR}/src)

INCLUDE_DIRECTORIES(${PROJECT_SOURCE_DIR}/include)

AUX_SOURCE_DIRECTORY(${json_src_path} X_SRC)
ADD_LIBRARY(json STATIC ${X_SRC})

SET_TARGET_PROPERTIES(json PROPERTIES ARCHIVE_OUTPUT_DIRECTORY "${json_lib_path}")
```

然后我们在 config.json.cmake 中专门提供 json 库的信息即可。

```
IF(NOT json_path)

SET(json_path $ENV{PUBLIC_LIBS_PATH}/json)

IF ($ENV{IS_64BITS_OS})
    SET(json_lib_path ${json_path}/lib64)
ELSE()
    SET(json_lib_path ${json_path}/lib)
ENDIF($ENV{IS_64BITS_OS})

INCLUDE_DIRECTORIES(${json_path}/include)

ADD_LIBRARY(json STATIC IMPORTED)
SET_PROPERTY(TARGET json PROPERTY IMPORTED_LOCATION ${json_lib_path}/json.a)

ENDIF()
```

上面这两段代码什么意思呢？  

第一个是 CMakeLists.txt, 用于生成 静态库， 我们指定的名字是 json, 编译之后会生成 libjson.a 库或 libjson.so 库， 这个就看我们的第二个参数了。

* SHARED 动态库
* STATIC 静态库
* MODULE 在使用dyld的系统有效，如果不支持dyld，则被当作SHARED对待。
  
第二个指定库的头文件和使用库。  


### 库的几个命令


** ADD_LIBRARY **

上面两段代码中都使用了 ADD_LIBRARY 这个命令。  

第一个命令 `ADD_LIBRARY(json STATIC ${X_SRC})` 是生成 静态库大家应该都没有什么疑问。   

第二个命令 `ADD_LIBRARY(json STATIC IMPORTED)` 的意思也可以猜到: 使用外部静态库。  


** SET_TARGET_PROPERTIES 和 SET_PROPERTY **

SET_TARGET_PROPERTIES 和 SET_PROPERTY 的作用是为 TARGET 附加一下信息，比如指定输出的位置。  


### 特殊的公共库  

有些公共库只是一些头文件，没有 lib 文件，这个时候我们只写个  config.json.cmake 即可， 而且也不需要编译生成 lib 了。  
  


## 后话

如果你是初学者的话，可能会采一些坑，不过相信你很快会学会 cmake 的。  

对于 cmake ， 最难的应该就是处理依赖关系吧。  

今天我当下定决心自己处理那几个依赖关系时， 发现依赖关系竟然是如此的简单。  

cmake 还有很多语法，我没有介绍，我这里就不介绍了。  

《完了》



[cmake]: http://www.cmake.org/
[note-cmake-pdf]: http://pan.baidu.com/s/1ntt9b7N
[note-cmake-img-pan]: http://pan.baidu.com/s/1sj5Chh7
[note-cmake-img]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1933500176.png
[book-cmake-practice]: http://pan.baidu.com/s/1kTB1Iy7 
