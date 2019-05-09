---  
layout: post
title:  Expert C Programming Note
category: [c/c++]
description: C专家编程在大一的时候看过，现在过了这么多年了，再次阅读一遍，还是可以学到很多东西的。  
tags: [c/c++, linux, 网络编程]
keywords: [timerfd, linux, 网络编程]
updateData:   19:08 2015/4/15
---

## 穿越时空的迷雾

** 不可移植的代码(unportable code) **

由编译器定义的(implementation-defined)----由编译器设计者决定采取何种行动，并做好文档记录。  
未确定的(unspecified)----在某些正确情况下的做法，标准未明确规定该怎么做，例如计算参数的顺序。  

** 坏代码(bad code) **

未定义的(undefined)----在某些不正确情况下的做法，但标准未规定该怎么做。  
约束条件(a constraint)----这是一个必须遵守的限制或要求。  


** 可移植的代码(portable code) **

严格遵守标准的(strictly-conforming)----一个严格遵守标准的程序应该是:

* 只使用已确定的特性
* 不突破任何由编译器实现的限制
* 不产生任何依赖由编译器定义的或者未确定的或未定义的特性输出  

遵循标准的(conforming)----一个严格遵守标准的程序可以依赖一些某种编译器特有的不可移植的特性。  


