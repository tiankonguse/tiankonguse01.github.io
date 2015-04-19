---  
layout: post
title:  bash中的冒号
category: [shell]  
description: 前段时间有人在群上发了一个shell命令,问谁敢运行,还说最好在虚拟里运行.于是我研究了一下.  
tags: [shell, linux, bash]
keywords: [shell, linux, bash]
updateData:  2015-04-19 00:45:59 
---


## 前言

先来shell命令吧.  

```
:(){ :|:& };:
```

## shell中的冒号

看到这个shell代码,我第一个想法是难道是冒号的特殊用法?  

于是查询了一下冒号的用法.  


### 变量默认值

当变量VAR没有声明或者为NULL时，将VAR设置为默认值DEFAULT。  


```
${VAR:=DEFAULT}
```

例如下面的测试代码  

```
tiankonguse@tiankonguse:~$ base="hello"

tiankonguse@tiankonguse:~$ echo ${first:="word"}
word
tiankonguse@tiankonguse:~$ echo $first
word

tiankonguse@tiankonguse:~$ second="tiankonguse"
tiankonguse@tiankonguse:~$ echo $second
tiankonguse

tiankonguse@tiankonguse:~$ echo ${second:="word"}
tiankonguse
```

### 空语句

学过 python 的人都知道 python 中有 pass 这个语法.  

bash 中的冒号也有这个作用.  

```
if [ $today == "2011-08-29" ]; then  
    :  
else  
    echo $today;
fi  
```

### 清空文件

```
: > test
```


## shell 函数


看了那几个冒号的作用, 发现那段代码都不符合.  

```
:(){ :|:& };:
```

然后自己冷静下来分析一下, 发现这不就是一个函数的递归定义然后调用吗?  


### 分析

`:(){ :|:& }` 是函数定义.  

`:` 是函数调用.  

多条 bash 语句写在同一行时,就需要使逗号分隔了.  


在函数定义中, `:|:&` 是函数体.  

然后 `:|:&` 又可以看做 调用函数 `:` 后把输出作为函数 `:` 的输入,并后台运行.  

这样的话相当于程序死循环和无限递归了,自然系统就会有问题了.  

我们还可以简写为 `:(){ :; };:` 吧.  


### bash 内的特殊字符

之前我曾总结过, bash 内特殊字符有这些. [特殊字符和引用][bash-study-command-1]   

当然, 那个文档是去年4月份整理的,那时候才学疏浅的我不知道有没有总结错误.  

我们就假设没错把, 那样的话, 里面没有看到冒号,所以我们可以使用冒号当做函数名字了.  

### 测试

```
tiankonguse@tiankonguse:~$ :(){ echo "tiankonguse $FUNCNAME"; };:;
tiankonguse :
```


类似的字符还有很多, 比如  

```
tiankonguse@tiankonguse:~$ .(){ echo "tiankonguse $FUNCNAME"; };.;
tiankonguse .
```

## 参考资料

* [我的bash学习笔记][bash-study]  


[bash-study-command-1]: https://github.com/tiankonguse/bash-study/blob/master/command.md#%E7%89%B9%E6%AE%8A%E5%AD%97%E7%AC%A6%E5%92%8C%E5%BC%95%E7%94%A8
[bash-study]: https://github.com/tiankonguse/bash-study
[honghuzhilangzixin-7073312]: http://blog.csdn.net/honghuzhilangzixin/article/details/7073312
[prayer-85884]: http://www.cppblog.com/prayer/archive/2009/05/27/85884.html
