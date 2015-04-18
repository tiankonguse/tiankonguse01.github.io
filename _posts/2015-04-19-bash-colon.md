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

看到这个shell代码,我第一件个想法是难道是冒号的特殊用法?  

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


看了哪几个含义, 发现对那段代码没有用.  

```
:(){ :|:& };:
```

然后自己冷静下来分析一下, 发现这不就是一个函数的递归调用吗?  

`:` 是函数名, 然后 `:|:&` 是函数体, 对于 `;:` 应该分成一个 `;` 和 `:` .  


然后 `:|:&` 又可以看做 调用函数 `:` 后把输出重定向,然后作为函数 `:` 的输入,并后台运行.  

这样的话相当于程序死循环和无限递归了,自然系统就会有问题了.  

我们还可以简写为 `:(){ :; };:` 吧.  


下面我们在看看 bash 函数的定义  

```
Shell Function Definitions

A shell function is an object that is called like a simple command  and executes  a  compound  command with a new set of positional parameters.


Shell functions are declared as follows:  

name () compound-command [redirection]
function name [()] compound-command [redirection]

This defines a function named name.  
The reserved word  function is  optional.   
If  the  function reserved word is supplied, the parentheses are optional.   
The body of the function is the  com‐pound  command  compound-command  (see Compound Commands above).  
That command is usually a list of commands between { and },  but may  be  any command listed under Compound Commands above.   
com‐pound-command is executed whenever name is specified as the name of  a  simple  command.  When in posix mode, name may not be the name of one of the POSIX  special  builtins.    
Any  redirections (see REDIRECTION below) specified when a function is defined are performed when the function is executed.  
The exit status  of  a function  definition  is  zero unless a syntax error occurs or a readonly function with the same name already exists.  
When  exe‐cuted,  the  exit status of a function is the exit status of the last command executed in the body.  (See FUNCTIONS below.)  
```


## Compound Commands


```
Compound Commands

A  compound command is one of the following.  
In most cases a list in a command's description may be separated from the rest of the command  by one  or  more  newlines, and may be followed by a newline in place of a semicolon.

(list) list is executed in a subshell environment (see  COMMAND  EXECU‐TION  ENVIRONMENT below).  
Variable assignments and builtin com‐mands that affect the  shell's  environment  do  not  remain  in effect  after  the  command completes.  
The return status is the exit status of list.

{ list; }
list is simply executed in the current shell environment.   
list must  be  terminated with a newline or semicolon.  
This is known as a group command.  
The return status is  the  exit  status  of list.   
Note that unlike the metacharacters ( and ), { and } are reserved words and must occur where a reserved word is permitted to  be  recognized.   
Since they do not cause a word break, they must be separated from  list  by  whitespace  or  another  shell metacharacter.
```




[honghuzhilangzixin-7073312]: http://blog.csdn.net/honghuzhilangzixin/article/details/7073312
[prayer-85884]: http://www.cppblog.com/prayer/archive/2009/05/27/85884.html
