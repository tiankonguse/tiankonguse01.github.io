---
layout: post
title: 初步学习 ruby
description: 最近半年一直使用 github 当做自己的网站，但是时间久了，文章多了，发现文章需要归档，分类，于是想着写个插件来完成分类和归档。又由于github 使用的是 Jekyll 模板引擎，而 Jekyll  是基于 ruby 的，于是需要了解一下 ruby 的基本语法。
tags: ruby  教程 学习笔记 ruby Jekyll
keywords: ruby, 教程, 学习笔记, ruby, Jekyll
updateData: 23:07 2014/12/1
categories: [程序人生]
---

![ruby1][]
![ruby2][]


## 前言

我这里的记录主要面向至少已经掌握一两种编程语言的同学。  
记录的比较简单，而且会随着以后 ruby 的使用而更新这篇文章。  

## 环境

ruby 的安装这里就不讲了。  
一般执行 ruby 有两种方法： 命令行方式和脚本方式。  
命令行方式和其他脚本语言不同，不是输入 ruby, 而是输入 irb 命令。  

### 命令行方式


```
skyyuan@skyyuan-PC3:~ $ irb
irb(main):001:0> "hello word"
=> "hello word"
irb(main):002:0> puts("hello word")
hello word
=> nil
```

其中 `=>` 后面代表上一个命令的返回值。  
所以第一个命令只有一个返回值，第二个命令有先输出一句话，然后输出返回值。  


### 脚本文件方式

```
skyyuan@skyyuan-PC3:~ $ cat test.rb
puts("hello word");

skyyuan@skyyuan-PC3:~ $ ruby ./test.rb
hello word
```

当然，如果在文件的第一行指定 ruby 的位置， 则可以直接执行。  

```
skyyuan@skyyuan-PC3:~ $ cat test.rb
#! /bin/ruby
puts("hello word");

skyyuan@skyyuan-PC3:~ $ ./test.rb
hello word
```


## 基本语法

### 输出

puts 可以输出一个字符串

### 变量 与 赋值

和其他语言一样，直接赋值即可。  
一般情况下脚本语言的类型都是弱类型。  
变量不需要声明即可使用。  

```
ans = "hello word";
ans = 3 * 6;
```


### 计算

加法  

```
ans = a + b
```

乘法  

```
ans = a * b
```

幂乘  

等价于c语言的 `pow(a, b)`

```
a**b
```  

开方  

```
Math.sqrt(a) 
```

## 函数

函数使用 def 定义， 所有的块都使用 end 结束。  
函数参数可以指定默认值。  
`#{}` 的作用时格式化字符串时，一个占位符，里面的名字是一个变量。  
调用函数没有参数时，直接一个名字即可。  
有参数时，可以加上括号， 也可以直接列在函数名字后面。  

```
def fun(name = "World")
    puts "Hello #{name}!"
end

fun; 
=> Hello World!

fun("tiankonguse");
=>Hello tiankonguse!

fun "tiankonguse"
=>Hello tiankonguse!
```

## 类


initialize 是类的构造函数。  
`@ name` 是类的成员变量，默认是私有的。  
还有，我们访问类的成员需要加个 `@` 符号。    


```
class Greeter
    def initialize(name = "World")
        @ name = name
    end
    def say
        puts "hello #{@ name}!"
    end
end
```

### 判断是不是公有成员

想要判断一个成员是不是共有的可以使用下面的方法  


```
g = Greeter.new()

g.respond_to?("say")
=> true

g.respond_to?("name")
=> false
```


### 公有成员

想要是一个成员变量为共有的，只需要用下面的方法即可。  
另外 ruby 的class 可以分开写，会自动合并的。  

```
class Greeter
    attr_accessor :name
end
```

### 赋值与取值


对于一个变量 name，实际上我们有两个操作：赋值、取值。  
赋值是 `name=`, 取值是 `name` 。  

比如可以测是否是公有的。  

```
g.respond_to?("name")
=> true

g.respond_to?("name=")
=> true
```


## 数组

```
names = ["Albert", "Brenda", "Charles", "Dave", "Engelbert"]

puts(names.join(", "));
```

## 循环

ruby 的循环可以理解为 js 的回调函数，参数是数组的值。  
而且 ruby 没有 for 和 while 循环。    

```
names.each do |name|
    puts "Hello #{name}!"
end
```
等价于

```
names.each(function(name){
    console.log("Hello " + name);
});
```

## 安全开关

对于脚本，一般会有一个命令。  

比如 python 有下面的命令

```
if __name__ == "__main__": 
    main()
```

而 ruby 是 

```
if __FILE__ == $0
```

## 参考资料

[ruby 官网文档][ruby-documentation]


[ruby-documentation]: https://www.ruby-lang.org/en/documentation/
[ruby1]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1777921927.jpg
[ruby2]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1780973295.jpg
