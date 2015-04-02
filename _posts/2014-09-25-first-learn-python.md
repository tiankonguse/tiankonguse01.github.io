---
layout: post
title: 初步学习Python
description: 最近由于工作需要，需要快速学习python.现在把学习的东西记录下来。
keywords: python, 语法, 教程
tags: python 语法 教程
categories: [python]
---

## python 简介

Python 是一个高级语言。

Python 是一个解释性语言。

实现一个相同的任务，Python 实现速度更快，代码量更少。

但是 Python 的运行速度很慢。

Python 又很完善的基础内置库，也有很丰富的第三方库，很多网站都是用 Python 做的，很多公司和私用 Python 开发。

Python是跨平台的。

## 安装Python

目前，Python有两个版本，一个是2.x版，一个是3.x版，这两个版本是不兼容的。

只有 windows 需要安装 python, 其他系统一般自带的有 python.

windows 用户可以去[python官网][python]下载安装。

或者点击这里下载 [python-download][] .

下载完后，双击安装即可(一直下一步)。

安装后需要配置一下 path 才可以使用。

配置完 path 之后，你就可以再终端执行 python 试试了。

注：

实际上我们安装的是 CPython解释器.
    
就像一个网页可以在不同的浏览器中打开，是由于都有网页的解释器。
    
    
## 简单尝试 python

python 很想 shell .

shell 显示的是 >, python 显示的是 >>> .

我们可以直接输入 python 命令。

比如：

```
>>> print 'hello, world!'
hello, world  
```

不过，编写程序时，一般是使用编辑器先编辑，然后再运行的。

所以我们需要一个编辑器了。我一般使用 [notepad++][notepad-p-p].

然后我们新建一个文件 hello.py。

文件内容是

```python
print 'hello, world'
```

然后执行 python hello.py 就可以看到这个脚本的输出了。


直接运行 python 脚本。

我们常见的是直接就可以运行 脚本的，而且一般会看到在脚本的第一行有这个。


```python
#!/bin/python
print 'hello, world'
```

第一行的作用就是制定默认的解释器的位置。

不过在linux 下，执行前需要有可执行权限的。

通过下面的命令可以添加执行权限。

``` bash
chmod a+x hello.py
```

## 基本语法


### 输出

```
print something[,something]*
```
something 代表一个字符串或者数字。可以输出多个字符串，使用逗号分隔即可。输出时逗号会被替换为一个空格。

当然 something 也可以是一个公式或者函数，将输出返回的结果。

### 输入

```
something = raw_input(output-something)
```

something 一般是一个变量，raw_input可以读入一个字符串,output-something 用于在输入前输出的东西，一般是输入提示语。


### 注释

以 # 开头的为注释。

### 格式

python 有个比较奇葩的语法：使用缩进来限制格式。

但是没有规定缩进使用几个空白。

常用的缩进有一个 tab 或 4 个空格。

最好的方法是坚持所有缩进都使用4个空格。


### 类型

python 直接可以处理的类型有：整数，浮点数，字符串，布尔值。

由于字符串存在转义问题，于是提供了 r'' 语法，单引号内部的东西不进行转义。这个和 shell 脚本类似。

同时，对于字符串中由换行符的情况时，使用 \n 不够清晰，于是 python 提供了 '''...''' 语法。

三个单引号内部可以直接换行，代表字符串内的换行符。

#### list

list 是一种有序的集合，可以随时添加和删除其中的元素。
可以把list理解为数组，元素之间没有关系，可以是任意类型的。

* 初始化 [valueList]
* 长度 len(list)
* 添加 append(value)
* 删除 pop(index)
* 修改 insert(index, value)

```
array = ['one', 1, 'three']
print array
#['one', 1, 'three']

print len(array)
#3

print array[1]
# 1

print array[-1]
#three
 
array.append("four");
print array
#['one', 1, 'three', 'four']
 
array.insert(1, "one1")
print array
#['one', 'one1', 1, 'three', 'four']

array.pop()
print array
#['one', 'one1', 1, 'three']
  
array.pop(1)
print array
#['one', 1, 'three']
```

#### tuple

tuple和list非常类似，但是tuple一旦初始化就不能修改.

#### dict

dict, 又名map，使用键-值（key-value）存储，具有极快的查找速度。   

#### set

在set中，没有重复的key。



### 变量

变量名必须是大小写英文、数字和_的组合，且不能用数字开头。

变量大小写区分。

变量是弱类型变量，即可以随意改变变量的类型。

```
# 定义一个整数
name = 1

# 定义一个字符串
name = "hello word"


# 定义一个数组(list)
name = []
name = ["one", [1,2]] # 数组长度为2

# 定义一个字典

name = {}
name["key"] = "value"
```

### 赋值

等号=是赋值语句，可以把任意数据类型赋值给变量。

同一个变量可以反复赋值，而且可以是不同类型的变量,即变量是弱类型变量。



### 常量

常量就是不能变的变量。

通常用全部大写的变量名表示常量。


### 格式化

%运算符就是用来格式化字符串的

* %d	整数
* %f	浮点数
* %s	字符串
* %x	十六进制整数

```
'%4d-%02d-%02d' % (2014, 9, 25)
```

### 条件判断

```
if <条件判断1>:
    <执行1>
elif <条件判断2>:
    <执行2>
elif <条件判断3>:
    <执行3>
else:
    <执行4>
```

例如

```
if 1>2:
    print "hello"
else:
    print "word"
    
if len(list):
    print "have value"
else:
    print "empty"
```

### 循环

* for...in循环，依次把list或tuple中的每个元素迭代出来
* while循环，只要条件满足，就不断循环，条件不满足时退出循环

```
while i<10:
    print i
    i = i + 1
    
for key in dict:
    val = dict[key]
    print val
```

### 函数


定义一个函数要使用def语句，依次写出函数名、括号、括号中的参数和冒号:，然后，在缩进块中编写函数体，函数的返回值用return语句返回。

注：如果想定义一个什么事也不做的空函数，可以用pass语句。实际上pass可以用来作为占位符

返回多个值

在语法上，返回一个tuple可以省略括号，而多个变量可以同时接收一个tuple，按位置赋给对应的值。

所以，Python的函数返回多值其实就是返回一个tuple

默认参数必须指向不变对象！

可变参数允许你传入0个或任意个参数，这些可变参数在函数调用时自动组装为一个tuple。

键字参数允许你传入0个或任意个含参数名的参数，这些关键字参数在函数内部自动组装为一个dict

参数定义的顺序必须是：必选参数、默认参数、可变参数和关键字参数。


```
def main(argc):
    print argc
    return 1
# end main
```


[python]: https://www.python.org
[python-download]: https://www.python.org/ftp/python/2.7.8/python-2.7.8.msi "下载链接"
[notepad-p-p]: http://notepad-plus-plus.org/ "notepad++"
