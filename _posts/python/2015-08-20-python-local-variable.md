---  
layout: post  
title: python 中局部变量
description:  之前没遇到过python的局部变量问题, 也就不知道局部变量与全局变量冲突时会怎么样, 现在简单了解了一下.
tags:  python 局部变量
keywords: python, 局部变量
updateData:  14:34 2015/8/20
categories: [python]
---  

## 前言

之前没有遇到过函数内的变量与全局变量冲突的问题.  
最近写一个python脚本时, 需要在函数内重置一个对象, 于是简单的使用 `m = {}` 来清空对象,结果发现没有生效.  
现在查一下 [文档](https://docs.python.org/2/tutorial/controlflow.html#defining-functions) 来了解一下为什么.  

## 背景知识

我写了下面的代码, 发现变量里总是没数据.  

```

m = {}

def add(k, v):
    m[k]=v

def addHelp():
    add("first", 1);
    add("second", 2);
    add("third", 3);

def main():
    m = {}
    
    addHelp()
    print m
    
if __name__ == "__main__": 
    main()
```

然后我就猜想到可能是局部变量的问题了.  

对于局部变量,还是看看官方的文档比较好.

```
The execution of a function introduces a new symbol table used for the local variables of the function. 
More precisely, all variable assignments in a function store the value in the local symbol table; 
whereas variable references first look in the local symbol table, then in the local symbol tables of enclosing functions, then in the global symbol table, and finally in the table of built-in names. 
Thus, global variables cannot be directly assigned a value within a function (unless named in a global statement), although they may be referenced.
```

简单的说就是, 如果你在函数内声明了变量, 它既是局部变量了, 外部是看不到这个变量的.

当你使用一个变量时, 会先查找函数的作用域, 然后是全局作用域, 最后是内置作用域.  

了解了这个, 那就好办了, 我想要的是清空操作, 那就执行清空函数吧.  

```
def main():
    m.clear()
    
    addHelp()
    print m
```

## 测试程序

查了文档, 问题也解决了, 不再系统的测试一下, 总感觉还处于理论阶段, 实践了才心里踏实点.  


### 测试1

声明一个同名的全局变量和局部变量.  

```
x = 50

def func():
    x = 2
    print 'end func x = ', x

def main():
    print "begin main x = ", x
    func()
    print "end main x = ", x
    
if __name__ == "__main__": 
    main()
```

这个遵循上面的文档, 输出了正常的结果.  

```
begin main x =  50
end func x =  2
end main x =  50
```

### 测试2


```
x = 50

def func():
    print 'begin func x = ', x
    x = 2
    print 'end func x = ', x

def main():
    print "begin main x = ", x
    func()
    print "end main x = ", x
    
if __name__ == "__main__": 
    main()
```

这个我们在定义前输出那个变量, 它会怎么样呢?  

大概可以猜到两种情况: 

1. 输出全局变量
2. 报错, 未定义(这个和 javascript 类型)


执行后发现输出了未定义.  

这说明了符号表预先就生成了, 所以不会去全局作用域查找这个变量了.  
函数内的作用域还没开始, 所以就是未定义了.  

```
skyyuan:test $ ./testLocalVariable.py 
begin main x =  50
begin func x = 
Traceback (most recent call last):
  File "./testLocalVariable.py", line 43, in <module>
    main()
  File "./testLocalVariable.py", line 39, in main
    func()
  File "./testLocalVariable.py", line 33, in func
    print 'begin func x = ', x
UnboundLocalError: local variable 'x' referenced before assignment
```


