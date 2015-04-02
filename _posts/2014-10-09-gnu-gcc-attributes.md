---
layout:     post
title:      函数属性 __attribute__
description: 看别人的代码时，看到了函数属性，之前从来没有见过这个东西。于是查了一下资料。
keywords: 函数属性, __attribute__, 宏, cpp
tags: 函数属性 __attribute__ 宏 cpp
categories: [程序人生]
---


## 库函数中看到的宏

```cpp
#define _CRTIMP  __attribute__ ((dllimport)) 

#define __cdecl  __attribute__ ((__cdecl__))

#define __MINGW_NOTHROW __attribute__ ((__nothrow__))

#define __MINGW_ATTRIB_NORETURN __attribute__ ((__noreturn__))
```

我们可以通过cpp命令来得到指定文件内的宏定义。

```bash
cpp -E -dM test.c |sort 
```

我们还可以看到 longjmp 和 setjmp 的声明

```
 _CRTIMP void __cdecl __MINGW_NOTHROW longjmp (jmp_buf, int) __MINGW_ATTRIB_NORETURN;   
 _CRTIMP int __cdecl __MINGW_NOTHROW _setjmp (jmp_buf);
```



## \_\_attribute\_\_ 机制 

GNU C的一大特色就是\_\_attribute\_\_机制。

\_\_attribute\_\_可以设置函数属性（Function Attribute）、变量属性（Variable Attribute）和类型属性（Type Attribute）。


\_\_attribute\_\_书写特征是：\_\_attribute\_\_前后都有两个下划线，并切后面会紧跟一对原括弧，括弧里面是相应的\_\_attribute\_\_参数。

\_\_attribute\_\_语法格式为： \_\_attribute\_\_ ((attribute-list))

具体的可以参考[gnu gcc 的 属性语法][Attribute-Syntax]


## 函数属性 Function Attribute


函数属性可以帮助开发者把一些特性添加到函数声明中，从而可以使编译器在错误检查方面的功能更强大。

GNU CC需要使用 –Wall编译器来击活该功能，这是控制警告信息的一个很好的方式。

详细介绍请参考[gnu gcc 的 函数属性][Function-Attributes]


常见的属性参数

###  format

该属性可以给被声明的函数加上类似printf或者scanf的特征，它可以使编译器检查函数声明和函数实际调用参数之间的格式化字符串是否匹配。

format的语法

```
format (archetype, string-index, first-to-check)
```

format属性告诉编译器，按照printf, scanf, strftime或strfmon的参数表格式规则对该函数的参数进行检查。

* archetype 指定是哪种风格
* string-index指定传入函数的第几个参数是格式化字符串
* first-to-check 指定从函数的第几个参数开始按上述规则进行检查。

    需要特别注意的是，如果是一个类的成员函数，string-index和first-to-check需要加1.
    因为类成员函数的第一个参数实际上一个“隐身”的“this”指针。

### noreturn
    
该属性通知编译器函数从不返回值，当遇到类似函数需要返回值而却不可能运行到返回值处就已经退出来的情况，该属性可以避免出现错误信息。

C库函数中的abort（）和exit（）的声明格式就采用了这种格式

```
extern void exit(int) __attribute__((noreturn));
extern void abort(void) __attribute__((noreturn));
```

### nonnull

指定函数的某些参数不能是空指针。

```
extern void * my_memcpy (void *dest, const void *src, size_t len) __attribute__((nonnull (1, 2)));
```




### const

该属性只能用于带有数值类型参数的函数上。

当重复调用带有数值参数的函数时，由于返回值是相同的，所以此时编译器可以进行优化处理，除第一次需要运算外，其它只需要返回第一次的结果就可以了，进而可以提高效率。

该属性主要适用于没有静态状态（static state）和副作用的一些函数，并且返回值仅仅依赖输入的参数。

## 变量属性 Variable Attributes


关键字\_\_attribute\_\_也可以对变量（variable）或结构体成员（structure field）进行属性设置。

在使用\_\_attribute\_\_参数时，你也可以在参数的前后都加上"\_\_"（两个下划线），例如使用\_\_aligned\_\_而不是aligned，这样，你就可以在相应的头文件里使用它而不用关心头文件里是否有重名的宏定义。


详细介绍请参考[gnu gcc 的 变量属性][Variable-Attributes]

### aligned

该属性规定变量或结构体成员的最小的对齐格式，以字节为单位。

如果aligned后面不紧跟一个指定的数字值，那么编译器将依据你的目标机器情况使用最大最有益的对齐方式。

aligned属性使被设置的对象占用更多的空间


###  packed

使用该属性可以使得变量或者结构体成员使用最小的对齐方式，即对变量是一字节对齐，对域（field）是位对齐。

使用packed可以减小对象占用的空间。

### 其他变量

其它可选的属性值还有 cleanup，common，nocommon，deprecated，mode，section，shared，tls\_model，transparent\_union，unused，vector\_size，weak，dllimport，dlexport，详见[gnu gcc 的 变量属性][Variable-Attributes]


## 类型属性 Type Attribute

关键字\_\_attribute\_\_也可以对结构体（struct）或共用体（union）进行属性设置。

大致有六个参数值可以被设定，即：aligned, packed, transparent\_union, unused, deprecated 和 may\_alias。

详见[gnu gcc 的 类型属性][Type-Attributes]

### aligned

该属性设定一个指定大小的对齐格式（以字节为单位）


## 标签属性  Label Attributes

详见[gnu gcc 的 标签属性][Label-Attributes]


## 参考资料

* [Label-Attributes][]
* [Attribute-Syntax][]
* [Type-Attributes][]
* [Function-Attributes][]
* [Variable-Attributes][]
* [csdn-330133457][]
* [nshipster][]
* [gnu-c-attributes][]

[Label-Attributes]: https://gcc.gnu.org/onlinedocs/gcc/Label-Attributes.html#Label-Attributes
[Attribute-Syntax]: https://gcc.gnu.org/onlinedocs/gcc/Attribute-Syntax.html
[Type-Attributes]: http://gcc.gnu.org/onlinedocs/gcc-4.0.0/gcc/Type-Attributes.html#Type-Attributes
[Function-Attributes]: http://gcc.gnu.org/onlinedocs/gcc-4.0.0/gcc/Function-Attributes.html
[Variable-Attributes]: http://gcc.gnu.org/onlinedocs/gcc-4.0.0/gcc/Variable-Attributes.html#Variable-Attributes
[csdn-330133457]: http://bbs.csdn.net/topics/330133457
[nshipster]: http://nshipster.com/__attribute__/
[gnu-c-attributes]: http://www.unixwiz.net/techtips/gnu-c-attributes.html
