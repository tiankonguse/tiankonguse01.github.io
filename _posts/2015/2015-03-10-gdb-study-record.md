---
layout: post  
title: gdb 学习记录
description:  写的server遇到一种情况：log输出怎么  也不能定位到问题，只好学了一下 GDB, 发现挺实用的，现在用了两个月GDB了，记录一下。  
tags:  gdb  
keywords: gdb  
updateData:  22:54 2015/3/10
categories: [程序人生]
---



##  背景  

如果是之前， 你问我写c/c++程序都是怎么调试的， 我肯定会说输出来或者打日志就行了。  

但是后来遇到这么一种情况：使用log输出不能定位到错误，于是我只好学习了一下gdb, 结果用了之后就不能停下来了。  


## GDB 启动

一般来说GDB主要调试的是C/C++的程序。   
要调试C/C++的程序，首先在编译时，我们必须要把调试信息加到可执行文件中。   
使用编译器（cc/gcc/g++）的 -g 参数可以做到这一点。  

GDB 一般用于四种场景: 未运行的程序，已运行的程序(一般是server)，core掉的程序(需要有core文件)，不加载任何程序启动     


### 加载未运行的程序


programName 也就是你的执行文件，一般在当然目录下。  

```
gdb programName
```

### 挂载以运行的程序

如果你的程序是一个服务程序，那么你可以指定这个服务程序运行时的进程ID。  
gdb会自动attach上去，并调试他。  
programName 应该在PATH环境变量中搜索得到,或者现在就在相关目录下。  


```
gdb programName PID
```

### 加载core掉的程序  

用gdb同时调试一个运行程序和core文件，core是程序非法执行后core dump后产生的文件。  

```
gdb programName core
```
    
### 直接启动gdb

启动gdb后，就你被带入gdb的调试环境中，就可以使用gdb的命令开始调试程序了，gdb的命令可以使用help命令来查看.  

```
gdb
```


## 初级命令

gdb的命令很多，gdb把之分成许多个种类。  
help命令只是例出gdb的命令种类，如果要看种类中的命令，可以使用help <class> 命令，如：help breakpoints，查看设置断点的所有命令。  
也可以直接help <command>来查看命令的帮助。  


gdb中，输入命令时，可以不用打全命令，只用打命令的前几个字符就可以了.  
当然，命令的前几个字符应该要标志着一个唯一的命令.  
在Linux下，你可以敲击两次TAB键来补齐命令的全称，如果有重复的，那么gdb会把其例出来。  


### 启动程序

我们加载完程序，当然要启动程序了。  
我们使用 'run' 命令就可以启动了，我们也可以简写为 'r' 命令。  


这里要强调一下，我说的是启动程序，而不是继续运行程序。  
对于已经运行的程序，我们根据 PID 挂上去前程序就已经启动了， 这个时候我们就不能使用 'run' 命令了。  


### 设置断点  

如果我们没有对程序设置断点，我们执行 'r' 命令后， 发现程序马上就跑完了或者 core 掉了。  

原因是我们还没有告诉 gdb 应该到哪里停止， 默认 gdb 一直运行下去的。  


我们使用 'break' 命令可以打断点， 这个命令可以简写为 'b' 命令。  


打断点也是很大的一个知识面。  
我们先来看看 `help break` 的介绍吧。  

```
(gdb) help break 
Set breakpoint at specified line or function.
break [LOCATION] [thread THREADNUM] [if CONDITION]
LOCATION may be a line number, function name, or "*" and an address.
If a line number is specified, break at start of code for that line.
If a function is specified, break at start of code for that function.
If an address is specified, break at that exact address.
With no LOCATION, uses current execution address of the selected
stack frame.  This is useful for breaking on return to a stack frame.

THREADNUM is the number from "info threads".
CONDITION is a boolean expression.

Multiple breakpoints at one place are permitted, and useful if their
conditions are different.
```

大的方面来说断点支持 位置断点， 线程断点， 条件断点。  

位置断点的含义是我们可以再某个位置打上断点。比如在某一行，在某个函数，在某个地址上等等吧。  
线程断点我没有使用过，按文档的意思是为某个线程打断点，执行到那个线程了，则停止。  
条件断点是当指定的条件满足时，前面的断点才生效。  


比如下面结果例子

```
01  #include<cstdio>
02 
03 int sum(int a,int b) {
04    int c = a + b;
05    return c;
06 }
07 
08 int main() {
09     int a,b;
10 
11     a = 1;
12     b = 2;
13 
14     printf("sum=%d\n", sum(a,b));
15 
16     return 0;
17 }
```

```
# 在 某一行打断点
(gdb) break 12
Breakpoint 1 at 0x4005ce: file test.cpp, line 12.

# 在某个函数处打断点
(gdb) break sum
Breakpoint 2 at 0x4005ae: file test.cpp, line 4.

# 条件断点
(gdb) break 12 if a==1
Note: breakpoint 1 also set at pc 0x4005ce.
Breakpoint 3 at 0x4005ce: file test.cpp, line 12.
```

#### 设置某个文件的断点

大多数时候，我们的源码往往是多个文件的，我们直接设置行数的话，默认设置的是 main 函数所在的文件。  
这个时候我们就有设置某个文件内断点的需求了。  

```
break filename:linenum 

(gdb) break test.cpp:14
Breakpoint 4 at 0x4005d5: file test.cpp, line 14.
```

### 查看所有的断点

我们想看看有哪些断点的时候，就需要这个命令了。  
由于每个断点都有唯一的标号， 我们根据这个标号就可以管理断点了，比如删除断点。  

```
(gdb) info break
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x00000000004005ce in main() at test.cpp:12
2       breakpoint     keep y   0x00000000004005ae in sum(int, int) at test.cpp:4
3       breakpoint     keep y   0x00000000004005ce in main() at test.cpp:12
	stop only if a==1
4       breakpoint     keep y   0x00000000004005d5 in main() at test.cpp:14
```


### 列出源码

我们运行到断点的位置了，一般需要看看源码，然后进行逻辑推理的。  
不输入命令的时候，按回车默认执行上一条命令，这个查看源码时很有用。  

```
(gdb) list
2	
3	int sum(int a,int b) {
4	    int c = a + b;
5	    return c;
6	}
7	
8	int main() {
9	    int a,b;
10	
11	    a = 1;
```


### 执行单条语句

在断点处时，我们往往想运行一条语句看看情况，这个时候就需要这个命令了。  

```
next #运行一次
nexti # 运行i 次 next 命令

(gdb) next

Breakpoint 4, main () at test.cpp:14
14	    printf("sum=%d\n", sum(a,b));
```


### 继续运行程序

有时候我们查看完某个断点了，没发现问题。  
这个时候想的应该是去下个断点看看，这时候就需要继续运行命令了。  


```
(gdb) continue
Continuing.

Breakpoint 2, sum (a=1, b=2) at test.cpp:4
4	    int c = a + b;
```


### 输出函数


我们在某个断点停住了， 最想做的事查看一下变量的值是不是我们预期的值，这个时候就需要输出函数了。  
默认我们直接使用 print 命令就行了，其他的命令我没用过，但是大概意思大家一眼就可以看出来吧。  
print-object 用于输出对象，printf 主要用于格式化输出吧。  


```
print
print-object
printf


(gdb) print sum
$2 = {int (int, int)} 0x4005a4 <sum(int, int)>
(gdb) p a
$3 = 1
(gdb) p b
$4 = 2
(gdb) printf "%d-%d\n",a,b
1-2
```

### 退出程序 

GDB 查看问题，查看完了，最后要退出 GDB.  命令是很常见的 quit 命令。  
不建议使用暴力手法 `ctrl C` 来结束程序。  


```
(gdb) quit 
A debugging session is active.

	Inferior 1 [process 31854] will be killed.

Quit anyway? (y or n) y
```

## 中级命令


如果我们的程序稍微复杂一点， 我们就会发现使用上面的命令不足以满足我们的GDB调试需求。  

比如我们程序如果有参数，该如何传进去。怎么查看函数调用的堆栈等等吧。  


### 设置程序参数

我们的程序一般都有参数的，这些参数需要加载程序后设置。  


参数有两种设置方式：运行时设置，运行前设置。  


#### 运行前设置

比如我的程序接受一个 "-d num" 参数，代表是不是 debug 模式。  

这时就可以这样做  

```
set args -d 0
```

#### 运行时设置

我们启动程序时， 实际上可以传入相传给程序的参数的。例如  

```
r -d 0
```

### 查看程序运行参数

既然我们可以设置程序的参数，那一定可以查看设置的参数了。  

```
(gdb) set args -d 0
(gdb) show args
Argument list to give program being debugged when it is started is "-d 0".
```


### 查看函数堆栈

查看函数堆栈也是很常见的一个命令。  

```
(gdb) b sum
Breakpoint 1 at 0x4005ae: file test.cpp, line 4.
(gdb) bt
#0  sum (a=1, b=2) at test.cpp:4
#1  0x00000000004005e4 in main () at test.cpp:14
```

### 退出当前函数

有时候我们不能确保这个函数问题出在哪了，想运行完看看这个函数的结果时就需要这个函数了，运行完函数停止。  

```
(gdb) finish
Run till exit from #0  sum (a=1, b=2) at test.cpp:4
0x00000000004005e4 in main () at test.cpp:14
14	    printf("sum=%d\n", sum(a,b));
Value returned is $1 = 3
```


### 进入一个函数

有时候我们在一个函数调用处打断点了，想进入函数看看，怎么办呢？  

```
(gdb) b 14
Breakpoint 1 at 0x4005d5: file test.cpp, line 14.
(gdb) l 14
9	    int a,b;
10	
11	    a = 1;
12	    b = 2;
13	
14	    printf("sum=%d\n", sum(a,b));
15	
16	    return 0;
17	}
(gdb) r
Starting program: /data/skyyuan/a.out 

Breakpoint 1, main () at test.cpp:14
14	    printf("sum=%d\n", sum(a,b));
```

我们使用 step 函数就可以做到这件事。  

```
(gdb) step
sum (a=1, b=2) at test.cpp:4
4	    int c = a + b;
(gdb) l 4
1	#include<cstdio>
2	
3	int sum(int a,int b) {
4	    int c = a + b;
5	    return c;
6	}
7	
8	int main() {
9	    int a,b;
10		
```


### 删除断点

有时候我们确保一段代码没有问题了，就需要删除那段代码相关的断点了。  


```
(gdb) info breakpoints 
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x00000000004005d5 in main() at test.cpp:14
	breakpoint already hit 1 time
2       breakpoint     keep y   0x00000000004005c7 in main() at test.cpp:11
3       breakpoint     keep y   0x00000000004005ce in main() at test.cpp:12

(gdb) delete 2

(gdb) info breakpoints 
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x00000000004005d5 in main() at test.cpp:14
	breakpoint already hit 1 time
3       breakpoint     keep y   0x00000000004005ce in main() at test.cpp:12
```

### 自动提示名字

有时候我们的函数名很多，我们只记住前几个，但是前几个有不能唯一确定这个函数，这个时候就需要自动提示名字了。  
其实就是按两次TAB键， 这个在命令行中都是这样吧。  

```
(gdb) p su<TAB><TAB>
sub_epsilon_src_nodes  sub_magnitudes         sub_n.S                submul_1.S             sum(int, int)
```

### 指定源码位置

有时候我们的源码在多个目录下，这个时候就要指定源码的目录了。  

```
directory ../include/;
directory ../src/;
```

### 切换当前目录

有时候我们在比较深的一个目录， 使用 `..` 来指定目录的话将会很长很长，于是我们有了切换当前目录的需求了。   
幸运的是 GDB 有 `cd` 这个命令。  


```
cd ..
```

### 显示当前目录

这个和 shell 命令一样， 是 `pwd` 命令。  

```
(gdb) pwd
Working directory /data.
```

### 运行环境

默认搜索程序的位置在当前路径和  path 中查找， 使用 path 可以设置查找位置。  
使用 `show paths` 或者 `path` 可以查看当前 path.  
当然我们也可以设置环境变量和查看环境变量。  

```
(gdb) show paths
Executable and object file path: /home/skyyuan/bin:/usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin
(gdb) path .
Executable and object file path: /data:/home/skyyuan/bin:/usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin

set environment varname [=value]
show environment [varname]
```


## 高级命令

### 暂停 恢复程序运行

上面初级命令简单的介绍了设置断点的方法，这里系统的罗列一下暂停程序的方法。  

调试程序中，暂停程序运行是必须的，GDB可以方便地暂停程序的运行。  
你可以设置程序的在哪行停住，在什么条件下停住，在收到什么信号时停往等等。  
以便于你查看运行时的变量，以及运行时的流程  


当进程被gdb停住时，你可以使用info program 来查看程序的是否在运行，进程号，被暂停的原因。  


在gdb中，我们可以有以下几种暂停方式：断点（BreakPoint）、观察点（WatchPoint）、捕捉点（CatchPoint）、信号（Signals）、线程停止（Thread Stops）。  


#### 设置断点 BreakPoint


我们用break命令来设置断点。正面有几点设置断点的方法：  

* `break <function>`  在进入指定函数时停住。C++中可以使用class::function或function(type,type)格式来指定函数名。
* `break <linenum>` 在指定行号停住。
* `break +/-offset`   在当前行号的前面或后面的offset行停住。offiset为自然数。
* `break filename:linenum`  在源文件filename的linenum行处停住。
* `break filename:function`  在源文件filename的function函数的入口处停住。
* `break *address` 在程序运行的内存地址处停住。
* `break`  break命令没有参数时，表示在下一条指令处停住。
* `break ... if <condition>` ...可以是上述的参数，condition表示条件，在条件成立时停住。  
  比如在循环境体中，可以设置break if i=100，表示当i为100时停住程序。


#### 设置观察点 WatchPoint

观察点一般来观察某个表达式（变量也是一种表达式）的值是否有变化了，如果有变化，马上停住程序。  

我们有下面的几种方法来设置观察点：  

    
* `watch <expr>` 为表达式（变量）expr设置一个观察点。一量表达式值有变化时，马上停住程序。
* `rwatch <expr>` 当表达式（变量）expr被读时，停住程序。
* `awatch <expr>` 当表达式（变量）的值被读或被写时，停住程序。
* `info watchpoints` 列出当前所设置了的所有观察点。


#### 设置捕捉点CatchPoint

你可设置捕捉点来补捉程序运行时的一些事件。  
如：载入共享库（动态链接库）或是C++的异常。设置捕捉点的格式为：  

```    
catch <event>
```

当event发生时，停住程序。event可以是下面的内容：

1. `throw` 一个C++抛出的异常。（throw为关键字）
2. `catch` 一个C++捕捉到的异常。（catch为关键字）
3. `exec` 调用系统调用exec时。（exec为关键字，目前此功能只在HP-UX下有用）
4. `fork` 调用系统调用fork时。（fork为关键字，目前此功能只在HP-UX下有用）
5. `vfork` 调用系统调用vfork时。（vfork为关键字，目前此功能只在HP-UX下有用）
6. `load` 或 `load <libname>` 载入共享库（动态链接库）时。（load为关键字，目前此功能只在HP-UX下有用）
7. `unload` 或 `unload <libname>` 卸载共享库（动态链接库）时。（unload为关键字，目前此功能只在HP-UX下有用）

```
tcatch <event> 
```

只设置一次捕捉点，当程序停住以后，应点被自动删除。  
        
      
### 查看运行时数据

在你调试程序时，当程序被停住时，你可以使用print命令（简写命令为p），或是同义命令inspect来查看当前程序的运行数据。

print命令的格式如下。  


```    
print <expr>
print /<f> <expr>        
```     

`<expr>`是表达式，是你所调试的程序的语言的表达式（GDB可以调试多种编程语言），`<f>`是输出的格式。  
比如，如果要把表达式按16进制的格式输出，那么就是/x。  



#### 表达式

print和许多GDB的命令一样，可以接受一个表达式，GDB会根据当前的程序运行的数据来计算这个表达式，既然是表达式，那么就可以是当前程序运行中的const常量、变量、函数等内容。可惜的是GDB不能使用你在程序中所定义的宏。  
    
表达式的语法应该是当前所调试的语言的语法，由于C/C++是一种大众型的语言，所以，本文中的例子都是关于C/C++的。  
    
在表达式中，有几种GDB所支持的操作符，它们可以用在任何一种语言中。  
    
* `@`是一个和数组有关的操作符，在后面会有更详细的说明。
* `::` 指定一个在文件或是一个函数中的变量。
* `{<type>} <addr>`  表示一个指向内存地址<addr>的类型为type的一个对象。


#### 程序变量

在GDB中，你可以随时查看以下三种变量的值：  

1、全局变量（所有文件可见的）
2、静态全局变量（当前文件可见的）
3、局部变量（当前Scope可见的）
        
如果你的局部变量和全局变量发生冲突（也就是重名），一般情况下是局部变量会隐藏全局变量。  
也就是说，如果一个全局变量和一个函数中的局部变量同名时，如果当前停止点在函数中，用print显示出的变量的值会是函数中的局部变量的值。  
如果此时你想查看全局变量的值时，你可以使用“::”操作符：  

```    
file::variable
function::variable
```

可以通过这种形式指定你所想查看的变量，是哪个文件中的或是哪个函数中的。

例如，查看文件f2.c中的全局变量x的值：  

```
p 'f2.c'::x
```
   
当然，“::”操作符会和C++中的发生冲突，GDB能自动识别“::” 是否C++的操作符，所以你不必担心在调试C++程序时会出现异常。  
    
另外，需要注意的是，如果你的程序编译时开启了优化选项，那么在用GDB调试被优化过的程序时，可能会发生某些变量不能访问，或是取值错误码的情况。  
这个是很正常的，因为优化程序会删改你的程序，整理你程序的语句顺序，剔除一些无意义的变量等，所以在GDB调试这种程序时，运行时的指令和你所编写指令就有不一样，也就会出现你所想象不到的结果。  
对付这种情况时，需要在编译程序时关闭编译优化。  
一般来说，几乎所有的编译器都支持编译优化的开关，例如，GNU的C/C++编译器GCC，你可以使用“-gstabs”选项来解决这个问题。  
关于编译器的参数，还请查看编译器的使用说明文档。  


#### 数组

有时候，你需要查看一段连续的内存空间的值。  
比如数组的一段，或是动态分配的数据的大小。  
你可以使用GDB的“@”操作符，“@”的左边是第一个内存的地址的值，“@”的右边则你你想查看内存的长度。  

例如，你的程序中有这样的语句：

```
int *array = (int *) malloc (len * sizeof (int));
```

于是，在GDB调试过程中，你可以以如下命令显示出这个动态数组的取值：`p *array@len`

@的左边是数组的首地址的值，也就是变量array所指向的内容，右边则是数据的长度，其保存在变量len中，其输出结果，大约是下面这个样子的：

```
(gdb) p *array@len
$1 = {2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40}
```

如果是静态数组的话，可以直接用print数组名，就可以显示数组中所有数据的内容了。  


### 输出格式

一般来说，GDB会根据变量的类型输出变量的值。  
但你也可以自定义GDB的输出的格式。  
例如，你想输出一个整数的十六进制，或是二进制来查看这个整型变量的中的位的情况。  
要做到这样，你可以使用GDB的数据显示格式：
    
* x  按十六进制格式显示变量。
* d  按十进制格式显示变量。
* u  按十六进制格式显示无符号整型。
* o  按八进制格式显示变量。
* t  按二进制格式显示变量。 
* a  按十六进制格式显示变量。
* c  按字符格式显示变量。
* f  按浮点数格式显示变量。


```
(gdb) p i
$21 = 101    

(gdb) p/a i
$22 = 0x65

(gdb) p/c i
$23 = 101 'e'

(gdb) p/f i
$24 = 1.41531145e-43

(gdb) p/x i
$25 = 0x65

(gdb) p/t i
$26 = 1100101
```


### 查看内存

你可以使用examine memory命令（简写是x）来查看内存地址中的值。  
x命令的语法如下所示：  

```
(gdb) help x
Examine memory: x/FMT ADDRESS.

ADDRESS is an expression for the memory address to examine.

FMT is a repeat count followed by a format letter and a size letter.

Format letters are o(octal), x(hex), d(decimal), u(unsigned decimal),t(binary), f(float), a(address), i(instruction), c(char), s(string) and z(hex, zero padded on the left).
    
Size letters are b(byte), h(halfword), w(word), g(giant, 8 bytes).
    
The specified number of objects of the specified size are printed according to the format.

Defaults for format and size letters are those previously used.

Default count is 1.  

Default address is following last thing printed with this command or "print".

#简写如下
x/<n/f/u> <addr> 
```

* n 是一个正整数，表示显示内存的长度，也就是说从当前地址向后显示几个地址的内容。  
* f 表示显示的格式，参见上面。如果地址所指的是字符串，那么格式可以是s，如果地十是指令地址，那么格式可以是i。  
* u 表示从当前地址往后请求的字节数，如果不指定的话，GDB默认是4个bytes。  
  u参数可以用下面的字符来代替，b表示单字节，h表示双字节，w表示四字节，g表示八字节。  
  当我们指定了字节长度后，GDB会从指内存定的内存地址开始，读写指定字节，并把其当作一个值取出来。  
  <addr>表示一个内存地址。

n/f/u三个参数可以一起使用。例如：

命令：`x/3uh 0x54320` 表示，从内存地址0x54320读取内容，h表示以双字节为一个单位，3表示三个单位，u表示按十六进制显示。
    
#### 自动显示

你可以设置一些自动显示的变量，当程序停住时，或是在你单步跟踪时，这些变量会自动显示。  
相关的GDB命令是display。  

```
display <expr> 
display/<fmt> <expr> 
display/<fmt> <addr>
```

expr是一个表达式，fmt表示显示的格式，addr表示内存地址，当你用display设定好了一个或多个表达式后，只要你的程序被停下来，GDB会自动显示你所设置的这些表达式的值。  

格式i和s同样被display支持，一个非常有用的命令是：`display/i $pc`    
$pc是GDB的环境变量，表示着指令的地址，/i则表示输出格式为机器指令码，也就是汇编。  
于是当程序停下后，就会出现源代码和机器指令码相对应的情形，这是一个很有意思的功能。  

下面是一些和display相关的GDB命令：

```
undisplay <dnums...>
delete display <dnums...>
```

删除自动显示，dnums意为所设置好了的自动显式的编号。  
如果要同时删除几个，编号可以用空格分隔，如果要删除一个范围内的编号，可以用减号表示（如：2-5）  

```
disable display <dnums...>
enable display <dnums...>
```

disable和enalbe不删除自动显示的设置，而只是让其失效和恢复。  

```
info display
```

查看display设置的自动显示的信息。  
GDB会打出一张表格，向你报告当然调试中设置了多少个自动显示设置，其中包括，设置的编号，表达式，是否enable。  


### 维护停止点



上面说了如何设置程序的停止点，GDB中的停止点也就是上述的三类。在GDB中，如果你觉得已定义好的停止点没有用了，你可以使用delete、clear、disable、enable这几个命令来进行维护。

* `clear` 清除所有的已定义的停止点。
* `clear <function>`
* `clear <filename:function>` 清除所有设置在函数上的停止点。
* `clear <linenum>`
* `clear <filename:linenum>` 清除所有设置在指定行上的停止点。
* `delete [breakpoints] [range...]` 删除指定的断点，breakpoints为断点号。
  如果不指定断点号，则表示删除所有的断点。range 表示断点号的范围（如：3-7）。其简写命令为d。


比删除更好的一种方法是disable停止点，disable了的停止点，GDB不会删除，当你还需要时，enable即可，就好像回收站一样。  

* `disable [breakpoints] [range...]` disable所指定的停止点，breakpoints为停止点号。如果什么都不指定，表示disable所有的停止点。简写命令是dis.
* `enable [breakpoints] [range...]` enable所指定的停止点，breakpoints为停止点号。
* `enable [breakpoints] once range...` enable所指定的停止点一次，当程序停止后，该停止点马上被GDB自动disable。
* `enable [breakpoints] delete range...` enable所指定的停止点一次，当程序停止后，该停止点马上被GDB自动删除。

 

### 恢复程序运行和单步调试

当程序被停住了，你可以用continue命令恢复程序的运行直到程序结束，或下一个断点到来。也可以使用step或next命令单步跟踪程序。  

* `continue [ignore-count]`
  `c [ignore-count]`
  `fg [ignore-count]`
  恢复程序运行，直到程序结束，或是下一个断点到来。  
  ignore-count表示忽略其后的断点次数。continue，c，fg三个命令都是一样的意思。
* `step <count>`
  单步跟踪，如果有函数调用，他会进入该函数。  
  进入函数的前提是，此函数被编译有debug信息。  
  很像VC等工具中的step in。  
  后面可以加count也可以不加，不加表示一条条地执行，加表示执行后面的count条指令，然后再停住。
* `next <count>`
  同样单步跟踪，如果有函数调用，他不会进入该函数。
  很像VC等工具中的step over。  
  后面可以加count也可以不加，不加表示一条条地执行，加表示执行后面的count条指令，然后再停住。
* `set step-mode`
  `set step-mode on`
  打开step-mode模式，于是，在进行单步跟踪时，程序不会因为没有debug信息而不停住。这个参数有很利于查看机器码。
* `set step-mod off` 关闭step-mode模式。
* `finish` 运行程序，直到当前函数完成返回。并打印函数返回时的堆栈地址和返回值及参数值等信息。
* `until` 或 u 当你厌倦了在一个循环体内单步跟踪时，这个命令可以运行程序直到退出循环体。
* `stepi` 或 si
  `nexti` 或 ni
  单步跟踪一条机器指令！
  一条程序代码有可能由数条机器指令完成，stepi和nexti可以单步执行机器指令。
  与之一样有相同功能的命令是“display/i $pc” ，当运行完这个命令后，单步跟踪会在打出程序代码的同时打出机器指令（也就是汇编代码）

### 进入子进程

对于后台server, 一般都是使用守护进程或者 fork一个子进程，然后父进程退出的。  
这时我们就需要能够进入子进程了。  

设置下面的参数即可。  

```
set follow-fork-mode child
```
  
### 修改变量值


修改被调试程序运行时的变量值，在GDB中很容易实现，使用GDB的print命令即可完成。如：  

```
(gdb) print x=4
```

x=4这个表达式是C/C++的语法，意为把变量x的值修改为4  

在某些时候，很有可能你的变量和GDB中的参数冲突，如：

```
(gdb) whatis width
type = double
(gdb) p width
$4 = 13
(gdb) set width=47
Invalid syntax in expression.
```

因为，set width是GDB的命令，所以，出现了“Invalid syntax in expression”的设置错误.  
此时，你可以使用set var命令来告诉GDB，width不是你GDB的参数，而是程序的变量名，如：  

```
(gdb) set var width=47
```

另外，还可能有些情况，GDB并不报告这种错误，所以保险起见，在你改变程序变量取值时，最好都使用set var格式的GDB命令。  

### 跳转执行

一般来说，被调试程序会按照程序代码的运行顺序依次执行。  
GDB提供了乱序执行的功能，也就是说，GDB可以修改程序的执行顺序，可以让程序执行随意跳跃。  
这个功能可以由GDB的jump命令来完：

```
jump <linespec>
```

指定下一条语句的运行点。<linespce>可以是文件的行号，可以是file:line格式，可以是+num这种偏移量格式。  
表式着下一条运行语句从哪里开始。  

```
jump <address>
```

这里的<address>是代码行的内存地址。  


注意，jump命令不会改变当前的程序栈中的内容，所以，当你从一个函数跳到另一个函数时，当函数运行完返回时进行弹栈操作时必然会发生错误，可能结果还是非常奇怪的，甚至于产生程序Core Dump。  
所以最好是同一个函数中进行跳转。


熟悉汇编的人都知道，程序运行时，有一个寄存器用于保存当前代码所在的内存地址。  
所以，jump命令也就是改变了这个寄存器中的值。  
于是，你可以使用“set $pc”来更改跳转执行的地址。如：`set $pc = 0x485`  


### 反向调试


使用调试器时最常用的功能就是step, next, continue，这几个调试命令都是“往下执行”的。  
但是很多时候会有这种需求：你在调试的过程中多跳过了几步而错过中间过程，这时候不得不重头调试一遍，非常麻烦。  
而GDB从7.0版本开始支持反向调试功能，也就是允许你倒退着运行程序，或者说撤销程序执行的步骤从而会到以前的状态。  
 
 
直观地来看，加入你正在使用GDB7.0以上版本的调试器并且运行在支持反向调试的平台，你就可以用以下几条命令来调试程序：  

* `reverse-continue` 反向运行程序知道遇到一个能使程序中断的事件（比如断点，观察点，异常）。
* `reverse-step` 反向运行程序到上一次被执行的源代码行。
* `reverse-stepi` 反向运行程序到上一条机器指令
* `reverse-next` 反向运行到上一次被执行的源代码行，但是不进入函数。
* `reverse-nexti` 反向运行到上一条机器指令，除非这条指令用来返回一个函数调用、整个函数将会被反向执行。
* `reverse-finish` 反向运行程序回到调用当前函数的地方。
* `set exec-direction [forward | reverse]` 设置程序运行方向，可以用平常的命令step和continue等来执行反向的调试命令。
 
上面的反向运行也可以理解为撤销后面运行的语句所产生的效果，回到以前的状态。  

## 参考资料

* [Reverse Debugging with GDB][ReverseDebug]
* [ubuntu gdb wiki][wiki-ubuntu-gdb]
* [使用gdb调试程序详解][vimer-2009-gdb]



[ReverseDebug]: http://sourceware.org/gdb/wiki/ReverseDebug
[wiki-ubuntu-gdb]: http://wiki.ubuntu.org.cn/index.php?title=%E7%94%A8GDB%E8%B0%83%E8%AF%95%E7%A8%8B%E5%BA%8F&variant=zh-hans  
[vimer-2009-gdb]: http://www.vimer.cn/2009/11/%E4%BD%BF%E7%94%A8gdb%E8%B0%83%E8%AF%95%E7%A8%8B%E5%BA%8F%E8%AF%A6%E8%A7%A3.html
