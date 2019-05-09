---  
layout: post  
title: bash 回顾
description:  bash使用了写了三年多了,有人问我一下语法, 于是整理一个记录集, 以备后续参考.    
tags:  bash
keywords: bash
updateData:  20:31 2016/3/2
categories: [程序人生]
---  


## 前言

以前学习bash, 一般是需要用到什么功能了, 去查相关语法, 这样慢慢积累学习了大部分bash相关的知识.  

当时还创建了两个 github 项目 [bash-study]({{ site.data.link.github_tiankonguse_BashStudy }}) 
和 [BashStudy]({{ site.data.link.github_tiankonguse_bash_study }}), 后来就没怎么维护更新了, 惭愧.  



## 变量


* `${variable}` 获取变量值，简写`$variable`。当涉及变量拼接时，必须使用`{}`。如：$`{variable}_name`。  
* `variable=value` 变量赋值，`=`左右两边不能有空格。  
* 命令结果赋值。 `variable=$(ls -a)` 或者 ``varivale=`ls -a` ``。  
* 环境变量。打开shell的时候，创建环境变量。该shell创建的子进程将继承该shell的环境变量。`export`命令可以设置环境变量，供子进程继承使用。但子进程不能`export`给父进程使用。  
* 位置变量。`$0` 代表脚本名字，`$1`代表第1个参数，`$n`代表第n个参数。  
特殊符号变量。`$@` 与 `$*` 表示所有参数； `$#` 表示参数个数。  


> `$@` 与 `$*` 区别： 加入双引号后，`*`表示的参数不会被`IFS`分隔。  


## 操作符


* `= `赋值操作符，操作符两端不能有空格。  
* `(())` 类似于`let`命令，允许算是操作，同时允许类似C语言的表达式  

```
(( a++ ))
(( t = a < 45 ? 4 : 5 ))
(( i = 1;  i < 10; i++ ))
```

## 数组


* 数组赋值 `array[key]=value` 或 `array = (value1 value2 value3)`。  
* 访问数组 `${array[key]}`  
* 删除元素 `unset array[key]`  
* 删除数组 `unset array`  
* 数组长度 `${#array}`  
* 数组展开 `${array[*]}` 或 `${array[@]}`  


```
array=(1 2 3)
for item in ${array[*]}
do
    echo $item
done
```


## 退出状态码

* 取值范围`0-255`之间整数，成功返回0，失败返回非0。  
* `exit` 等价于 `exit $?`。而 `$?` 取上一条命令的返回状态码  
* `!` 不影响命令的执行，只影响命令的状态码。  


> NOTE: `!` 改变返回状态码的值。  


## 测试条件


* `if` 测试退出状态码，`0`代表成功，`1`代表失败。  
* `test` 与 `[]` 与`[[]]`  
* `-a` 逻辑与  
* `-o` 逻辑或   

```
if [ "$expr1" -a "$expr2" ]  ==> expr1 与 expr2 同时为真
if [[ "$expr1" && "$expr2" ]] ==> [[]] 可以采用&&, |
```

## 文件测试

| 符号	| 含义 | 
| `-d`	| file 为目录且存在| 
| `-e`	| file 为文件且存在| 
| `-f`	| file 为非目录普通文件且存在| 
| `-s`	| file 存在且长度不为 0| 
| `-L`	| file 为连接且存在| 
| `-r`	| file 为文件且可读| 
| `-w`	| file 为文件且可写| 
| `-x`	| file 为文件且可执行| 


## 数字测试

| 符号	| 含义| 
| `-eq`	| equal| 
| `-ne`	| not equql| 
| `-gt`	| greater than| 
| `-ge`	| greater equal| 
| `-lt`	| less than| 
| `-le`	| less equal| 

双圆括号 `(($a < $b))`；符号：`<`, `<=`, `>`, `>=`,`==`，`!=`    



## 字符串测试 

`=` 仅仅是对等号两边的字符串进行逐字匹配，等号两端必须有空格，否则相当于字符串连接了。   
`==` 在`[]`中的表现同`=`，但如果采用`[[]]`，则展现不同。  


```
[[ "$a" == a* ]] 相当于正则，匹配以a开头的字符串
[[ "$a" == "a*" ]] 关闭正则，逐字匹配

code> a="aabb"; if [[ $a == a* ]]; then echo "got"; else echo "not"; fi
out > got

code> a="aabb"; if [[ $a == "a*" ]]; then echo "got"; else echo "not"; fi
out > not
```
 
`!=` 同`==`使用方式，判断不等。   
`<` 与 `>` 通过ascll码进行大小比较。`[]` 中必须转义，因为`[]`相当于shell表达式，不转义，相当于重定向。  


```
[[ "$a" < "$b" ]] 或 [ "$a" \< "$b" ]
```

`-z` 字符串为空   
`-n` 字符串非空。 `if [ -z "$a" ]`  

## [] 与 [[]] 


`[]` 相当于test命令，为shell的一个内置命令。 
`[[]]` 为一个关键字，非命令。


## 循环与分支

* `for arg in [list]; do command; done`
* `for ((i=min; i <= max; i+=step)) do command; done`
* `while [condition] do command; done`
* `until [ condition ] do command done`
* `casc "$variable" in "$condition") command;; esac`


```
var="spch2008"
case $var in
    "spch2009" | "spch2010") echo "condition 1";;
     spch*) echo "condition2";;
     *) echo "last condition";;
esac
```

## 引号

shell中输入命令，得到一个命令行，该命令行被shell解析。对于一个命令行中的字符，shell将其分成两种。一种是普通文字，一种是元字符，对shell来说，具有特定功能的保留字。  

* 单引号: 单引号内所有元字符被关闭。 
* 双引号: 双引号大部分元字符功能被关闭，仅保留`$`, `` ` ``,`\`三种。   
* 反斜线: `\`之后的单一元字符功能被关闭。

`IFS` 域分隔符，IFS用于拆分command line中的每个单词。如果要还原字符的本义，即关闭元字符功能，则需要使用引号。  


```
code> line="one two three"; for word in $line; do echo $word; done
out > one
      two
      three

code> line="one two three"; for word in "$line"; do echo $word; done
out > one two three
```

## 元字符  


|元字符| 含义|
|`=`	|赋值|
|`>`	|重定向|
|`|`	|管道|
|`&`	|重定向文件描述符 或 置于后台|


## 命令替换

`\` 与 `()` ：可将一个命令的输出转入另一个上下文中；也可以作为另一个命令的参数；也可以用来设置变量；还可以为for循环产生参数列表。  


```
files=`ls *.txt`
files=$(ls *.txt)

variable=`cat file`
variable=`<file`

for file in `ls *.sh`; do echo $file; done
```


## 操作变量


* 取长度 `${#string}, ${#array}`  
* 截取 `${string:position:len}`

```
string=spch2008
echo ${string:4:4}
echo ${string:4}         #位置4到最后
echo ${string:(-4)}     #从后向前计算索引，负数加括号或则空格
echo ${string: -4}

out > 2008
```

## 函数及返回值


* 函数定义：`function name() { } `  
* 返回数字：`return`  

```
function name()
{
    return 100
}

name
echo $?   #取得返回值 100
```


* 返回字符串：`echo`  

```
function name()
{
    echo "hello "$1
}
var=`name Tom`
echo $var
```

## 特殊变量


`.` 类似于C中的`#include`，引入shell文件  


```
. func.sh # 有空格，引入另一个shell文件
```


`:` 空语句   
`$$` 当前脚本的进程ID    
`$!` 最近一个执行命令的后台进程ID  

```
echo $$
./a.out &
echo $!

out > 18180 和 18181
```

`()` 命令集，展开一个新的进程执行命令集。  

## 注释


单行采用`#`，若一行不足以写完，另一行以`#+`代表承接上一行。

```
#  one line
#+ one line more
```


## 算术操作


**整数操作**  


`let` shell内置操作，计算表达式值   
`expr`一个命令，类似`let`，用于计算表达式值，但`expr`直接输出结果，而不是保存在变量中。  

```
num_a=10
let result=num_a*2
echo $result

expr $num_a \* 2
```

> NOTE: `expr` 操作符两侧必须留有空格；`*`必须被转义，因为`*`被shell展开，因此需要转义，将`*`传递给`expr`。   


**浮点操作**  


```
echo "3*2" | bc
echo "$num * 3" | bc

code> echo "scale=2; 3/4" | bc     # 设置精度
out > .75
```



