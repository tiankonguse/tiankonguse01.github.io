---
layout: page
title: Chrome V8 - Introduction
---


## Introduction


Welcome to the developer documentation for V8. V8 is Google's open source, high performance JavaScript engine. It is written in C++ and is used in Google Chrome, Google's open source browser.  

> 欢迎来到V8的开发文档。  
> V8是google的一个开源高性能javascript引擎。  
> 它使用C++编写， 应用于google的开源浏览器 - [谷歌浏览器]({{ site.data.link.dev_chromium }})。  


This documentation is aimed at C++ developers who want to use V8 in their applications, as well as anyone interested in V8's design and performance. This document introduces you to V8, while the remaining documentation shows you how to use V8 in your code and describes some of its design details, as well as providing a set of JavaScript benchmarks for measuring V8's performance.  



> 这个文档主要面向想在程序中使用V8的C++开发者， 也面向对V8的涉及和性能感兴趣的任何人。  
> 本文主要向你介绍V8,其余文档教你怎么在您的代码中使用V8，而且还介绍了它的一些设计细节,还提供一组用于测量V8 JavaScript基准的性能。  



## About V8

V8 implements ECMAScript as specified in ECMA-262, 5th edition, and runs on Windows (XP or newer), Mac OS X (10.5 or newer), and Linux systems that use IA-32, x64, or ARM processors.  


> V8以ECMA-262为标准实现了ECMAScript， 运行于 Windows, Mac 以及使用IA-32, x64, 或 ARM处理器的Linux上。  



V8 compiles and executes JavaScript source code, handles memory allocation for objects, and garbage collects objects it no longer needs. V8's stop-the-world, generational, accurate garbage collector is one of the keys to V8's performance. You can learn about this and other performance aspects in V8 Design Elements.  

> V8编译运行javascript源代码，负责对象内存的分配，垃圾回收不再使用的对象。  
> V8的精确的垃圾回收是高性能的关键点。  
> 你在V8的[设计原理]({{ site.data.link.v8_design }})页面学到垃圾回收和其他与性能有关的知识。  


JavaScript is most commonly used for client-side scripting in a browser, being used to manipulate Document Object Model (DOM) objects for example. The DOM is not, however, typically provided by the JavaScript engine but instead by a browser. The same is true of V8—Google Chrome provides the DOM. V8 does however provide all the data types, operators, objects and functions specified in the ECMA standard.  

> javascript是最常见的应用于浏览器上的客户端脚本，比如用来维护DOM。  
> DOM不是javascript必须提供的功能， 相反，浏览器必须支持这个功能。  
> 因此V8也支持DOM这个功能。  
> V8实现了ECMA的所有规范：全部数据类型，操作，对象，函数等。  


V8 enables any C++ application to expose its own objects and functions to JavaScript code. It's up to you to decide on the objects and functions you would like to expose to JavaScript. There are many examples of applications that do this, for example: Adobe Flash and the Dashboard Widgets in Apple's Mac OS X and Yahoo! Widgets.  


> V8允许任何C++应用程序嵌入(expose)自己的对象和函数到javascript代码中。  
> 你可以决定对象和函数是否嵌入(expose)到javascript中。  
> 已经有很多应用程序这样做了， 比如 Adobe Flash, 苹果和雅虎的Dashboard Widgets。  


## How Do I Get Started?


First you'll need to download the V8 source code and build V8, following the [download and build instructions]({{site.data.link.v8_build}}). Then see [Getting Started]({{site.data.link.v8_get_started}}) for an introduction to V8 code with a quick "Hello World" example.  

> 首先， 你需要下载V8源码编译V8, 参考[下载编译介绍]({{site.data.link.v8_build}}).  
> 之后去[准备开始]({{site.data.link.v8_get_started}})页面看看V8代码介绍及"hello word"样例。  



