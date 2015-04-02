---
layout:     post
title:      c 语言中嵌入 asm
description: 以前在acm比赛的时候，经常听说某些人在代码中嵌入汇编把题水过去，今天查了一下资料。
keywords: c 语言, asm, 嵌入式, 汇编
tags: c 语言 asm 嵌入式 汇编
categories: [程序人生]
---


## \_\_asm\_\_  与 asm

在网上查询资料时，有的是用 asm 嵌入汇编，有的是用\_\_asm\_\_ 嵌入汇编。

后来在 gnu gcc 的官网的[alternative keywords][Alternate-Keywords]文档中发现原来它们是一个意思，而且建议使用\_\_asm\_\_ 。

-ansi and the various -std options disable certain keywords.

-ansi 和 -std 选项可以禁用某些关键字。

在编译的时候使用 -ansi 或 -std 参数就会使 asm, typeof 和 inline 变为无效。

解决这个问题的方法是在每个有问题的关键字的前面和后面加上 \_\_ .

例如 使用 \_\_asm\_\_ 代替 asm, 使用 \_\_inline\_\_ 代替 inline.


其他 c 编译器 不接受 alternative keywords，所以一般需要重新定义这些关键字。

```cpp
 #ifndef __GNUC__
 #define __asm__ asm
 #endif
```

## 基本的 Asm 

这个小节主要参考 [Basic-Asm][].

asm 关键字允许我们在C代码中嵌入汇编指令。

### 语法

```
asm [ volatile ] ( AssemblerInstructions )
```

为了兼容性，一般使用 \_\_asm\_\_  替代 asm.


```
__asm__  [ volatile ] ( AssemblerInstructions )
```

### 限定符

可选的限定符没有什么效果，因为默认就是 volatile。

### 参数

参数就是汇编解释器可以识别的指令。

一般C编译器不对参数做任何处理，只是copy输出到汇编程序文件里面。

唯一的区别是寄存器的表示有点不同： 扩展汇编用 %%eax ，基本汇编用 %eax。

### 备注

使用扩展汇编会代码量更少，更安全，执行效率更高。

在 c 函数之外嵌入汇编时必须用基本汇编。

## 扩展汇编

这个小节主要参考[Extended-Asm][].

### 语法

```
__asm__  [volatile] ( AssemblerTemplate : [OutputOperands] [ : [InputOperands] [ : [Clobbers] ] ] )
__asm__  [volatile] goto ( AssemblerTemplate : : [InputOperands] : [Clobbers] : GotoLabels )
```

使用分号分割操作数。


### 参数

* AssemblerTemplate 汇编代码
* OutputOperands 输出操作数，使用逗号分隔
* InputOperands  输入操作数，使用逗号分隔
* Clobbers 寄存器或一些改变的变量，使用逗号分隔
* GotoLabels 汇编代码中可能使用的C语言中的 标签。

### 备注

```
     int src = 1;
     int dst;
     
     asm ("mov %1, %0\n\t"
         "add $1, %0"
         : "=r" (dst)
         : "r" (src));
     
     printf("%d\n", dst); //2
```

## 其他知识

关于其他知识，请自己查看官方的 [c语言中嵌入汇编][Using-Assembly-Language-with-C] 的文档.


[Extended-Asm]: https://gcc.gnu.org/onlinedocs/gcc/Extended-Asm.html#Extended-Asm
[Basic-Asm]: https://gcc.gnu.org/onlinedocs/gcc/Basic-Asm.html#Basic-Asm
[Using-Assembly-Language-with-C]: https://gcc.gnu.org/onlinedocs/gcc/Using-Assembly-Language-with-C.html#Using-Assembly-Language-with-C
[Alternate-Keywords]: https://gcc.gnu.org/onlinedocs/gcc/Alternate-Keywords.html#Alternate-Keywords
