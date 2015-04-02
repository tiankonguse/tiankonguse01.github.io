---
layout: post
title: 初步学习Python高级语法
description: 最近由于工作需要，需要快速学习python的高级语法.现在把学习的东西记录下来。
keywords: python, 语法, 教程
tags: python 语法 教程
categories: [python]
---

## python 高级特性

### 切片

切片取一个list或tuple的部分元素是非常常见的操作。

假设有下面的list,要取前三个数据。

```
L = ['Michael', 'Sarah', 'Tracy', 'Bob', 'Jack']
```

最笨的方法

```
[L[0], L[1], L[2]]
```

循环方法

```
r = []
n = 3
for i in range(n):
    r.append(L[i])
```
    
切片方法

```
L[0:3]
```

省略0索引的方法

```
L[:3]
```


取倒数的两个

```
L[-2:]
# ['Bob', 'Jack']
```

指定等差
取偶数个

```
L[:10:2]
```

### 迭代

如果给定一个list或tuple，我们可以通过for循环来遍历这个list或tuple，这种遍历我们成为迭代（Iteration）。

在Python中，迭代是通过for ... in来完成的.

dict 也可以使用 for in 来迭代。但是由于 dict 有 key 和 value ,且dict是依靠 key 来储存的，所以迭代出的是 key.

如果想得到key 和 val,可以使用下面的方法。

```
d = {'a': 1, 'b': 2, 'c': 3}
for value in d.itervalues():
    print value
    
for k, v in d.iteritems():
    print "key:",key,",value:",value
```

字符串也是可迭代.

```
for ch in 'ABC':
    print ch
```

当我们使用for循环时，只要作用于一个可迭代对象，for循环就可以正常运行

那么，如何判断一个对象是可迭代对象呢？

方法是通过collections模块的Iterable类型判断：


```
from collections import Iterable
isinstance('abc', Iterable) # True
isinstance(123, Iterable) # False
```

对 list 迭代，得到下标和值。

```
for i, value in enumerate(['A', 'B', 'C']):
    print i, value
```

### 列表生成式

```
[x * x for x in range(1, 11)] # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

例如列出当前目录下的所有文件和目录名

```
import os # 导入os模块，模块的概念后面讲到
[d for d in os.listdir('.')] # os.listdir可以列出文件和目录

```

## 函数式编程

函数式编程就是一种抽象程度很高的编程范式，纯粹的函数式编程语言编写的函数没有变量，因此，任意一个函数，只要输入是确定的，输出就是确定的，这种纯函数我们称之为没有副作用。

而允许使用变量的程序设计语言，由于函数内部的变量状态不确定，同样的输入，可能得到不同的输出，因此，这种函数是有副作用的。

函数式编程的一个特点就是，允许把函数本身作为参数传入另一个函数，还允许返回一个函数！


### map 函数

比如我们有一个函数f(x)=x^2，要把这个函数作用在一个list [1, 2, 3, 4, 5, 6, 7, 8, 9]上


```
def f(x):
    return x * x
map(f, [1, 2, 3, 4, 5, 6, 7, 8, 9]) # [1, 4, 9, 16, 25, 36, 49, 64, 81]
```


### reduce 函数

reduce把结果继续和序列的下一个元素做累积计算


比方说对一个序列求和

```
def add(x, y):
    return x + y
reduce(add, [1, 3, 5, 7, 9]) # 25
```

字符串转化为整数的函数

```
def fn(x, y):
    return x * 10 + y
    
def char2num(s):
    return {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}[s]
    
def str2int(s):
    return reduce(fn, map(char2num, s))
```

### 排序算法

```
# 内置类型默认排序
sorted([36, 5, 12, 9, 21]) # [5, 9, 12, 21, 36]

# 自定义排序函数
def reversed_cmp(x, y):
    if x > y:
        return -1
    if x < y:
        return 1
    return 0

sorted([36, 5, 12, 9, 21], reversed_cmp) #[36, 21, 12, 9, 5]
```

### 函数作为返回值

```
def lazy_sum(*args):
    def sum():
        ax = 0
        for n in args:
            ax = ax + n
        return ax
    return sum
```
我们在函数lazy_sum中又定义了函数sum，并且，内部函数sum可以引用外部函数lazy_sum的参数和局部变量，当lazy_sum返回函数sum时，相关参数和变量都保存在返回的函数中，这种称为“闭包（Closure）”的程序结构拥有极大的威力。


### 匿名函数

关键字lambda表示匿名函数

匿名函数有个限制，就是只能有一个表达式，不用写return，返回值就是该表达式的结果。

用匿名函数有个好处，因为函数没有名字，不必担心函数名冲突。

此外，匿名函数也是一个函数对象，也可以把匿名函数赋值给一个变量，再利用变量来调用该函数


```
def char2num(s):
    return {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}[s]

def str2int(s):
    return reduce(lambda x,y: x*10+y, map(char2num, s))
```

### 装饰器

由于函数也是一个对象，而且函数对象可以被赋值给变量，所以，通过变量也能调用该函数。

函数对象有一个__name__属性，可以拿到函数的名字.

假设我们要增强函数的功能，但又不希望修改函数的定义，这种在代码运行期间动态增加功能的方式，称之为“装饰器”（Decorator）。

本质上，decorator就是一个返回函数的高阶函数。

借助Python的@语法，把decorator置于函数的定义处.

Python内置的functools.wraps把原始函数的__name__等属性复制到wrapper()函数中.



```
import functools

def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        print 'call %s():' % func.__name__
        return func(*args, **kw)
    return wrapper
    
    
@log
def now():
    print '2013-12-25'
```


### 偏函数

```
import functools
int2 = functools.partial(int, base=2);
```
等价于

```
def partial(func, base):
    def wrapper(args):
        return func(args, base);
    return wrapper

int2 = partial(int, 2);

print int('10',2);

print int2('10');
```

只不过，偏函数是依赖参数的名字来自动填充的，而高级函数必须知道具体的函数参数列表。


## 模块

在Python中，一个.py文件就称之为一个模块（Module）

为了避免模块名冲突，Python又引入了按目录来组织模块的方法，称为包（Package）。

引入了包以后，只要顶层的包名不与别人冲突，那所有模块都不会与别人冲突。

每一个包目录下面都会有一个__init__.py的文件，这个文件是必须存在的，否则，Python就把这个目录当成普通目录，而不是一个包。

__init__.py可以是空文件，也可以有Python代码，因为__init__.py本身就是一个模块



导入模块

```
import sys
```

导入模块时，还可以使用别名

```
try:
    import cStringIO as StringIO
except ImportError: # 导入失败会捕获到ImportError
    import StringIO
```

作用域


正常的函数和变量名是公开的（public），可以被直接引用

Python并没有一种方法可以完全限制访问private函数或变量，但是，从编程习惯上不应该引用private函数或变量。


模块搜索路径

一是直接修改sys.path，添加要搜索的目录
第二种方法是设置环境变量PYTHONPATH，该环境变量的内容会被自动添加到模块搜索路径中。

