---  
layout: post  
title:  perl 快速学习记录
description: 之前曾简单的写过几个perl脚本，现在又接到一个perl写的项目，于是先快速预习一下perl语法。  
tag: perl
keywords: perl
updateData:  20:06 2015/3/5
categories: [程序人生]
---  


## 前言

2014年也是这个时候，我实习的时候使用perl写过几个脚本程序，这一不小心就过了一年了，那时候学的perl语法全忘记了，现在重新记录一下。  
perl 的语法和其他语言有点不同， 依靠那几个特殊符号实现各种功能，不看看真是猜不出什么意思来。  


## perl介绍

Perl是Practical Extraction and Report Language的缩写，它是由Larry Wall设计的，并由他不断更新和维护，用于在UNIX环境下编程。  

Perl具有高级语言（如C）的强大能力和灵活性。事实上，你将看到，它的许多特性是从C语言中借用来的。  

Perl 是解释性的脚本语言，而且Perl还支持sed到Perl及awd到Perl的翻译器。

perl 的位置一般在 /usr/local/bin/perl。  

和其他脚本语言一样， perl 使用 # 来注释。  


## 类型

perl 的内置类型有整型，浮点数，字符串等。  

### 整型

perl 的整型实际上是按浮点型储存的。  
在多数计算机中，浮点寄存器可以存贮约16位数字，长于此的被丢弃。整数实为浮点数的特例。  

8进制以0打头，16进制以0x打头。  

```
$x = 12345;
$var1 = 047; #等于十进制的39
$var2 = 0x1f; #等于十进制的31
```

### 浮点型

浮点寄存器通常不能精确地存贮浮点数，从而产生误差，在运算和比较中要特别注意。  
指数的范围通常为-309到+308。  

```
$value = 9.01e+21 + 0.01 - 9.01e+21;
print ("first value is ", $value, "\n");

$value = 9.01e+21 - 9.01e+21 + 0.01;
print ("second value is ", $value, "\n");
```

### 字符串

惯用C的程序员要注意，在PERL中，字符串的末尾并不含有隐含的NULL字符，NULL字符可以出现在串的任何位置。  
和其他解释性语言一样， perl双引号内的字符串中支持简单变量替换.  

```
$number = 11;
$text = "This text contains the number $number.";
# This text contains the number 11.
```

双引号内的字符串中支持转义字符.  
要在字符串中包含双引号或反斜线，则在其前加一个反斜线，反斜线还可以取消变量替换.  

单引号字符串与双引号字符串有两个区别，一是没有变量替换功能，二是反斜线不支持转义字符，而只在包含单引号和反斜线时起作用。  
单引号另一个特性是可以跨多行。  

###  字符串和数值的互相转换

若字符串中含有非数字的字符，则从左起至第一个非数字的字符，如：  

```
$string = "43";
$number = 28;
$result = $string + $number;  # $result = 71

$result = "hello" * 5;  # $result = 0
$result = "12a34" +1;  # $result = 13
```

### 变量初始值

在PERL中，所有的简单变量都有缺省初始值：""，即空字符。  
但是建议给所有变量赋初值，否则当程序变得大而复杂后，很容易出现不可预料且很难调试的错误  



## 运算


### 算术操作符

* 加 +
* 减 -
* 乘 \*
* 除 /
* 乘幂 \*\*  基数不能为负，结果不能超出计算机表示的限制
* 取余 % 取余的操作数如不是整数，四舍五入成整数后运算；运算符右侧不能为零
* 单目负 - 单目负可用于变量 等效于乘以 -1

### 整数比较操作符
  
  
  
| 符号| 描述                                                     |
|:---:|:--------------------------------------------------------:|
| <   | 小于                                                     |
| >   | 大于                                                     |
| ==  | 等于                                                     |
| <=  | 小于等于                                                 |
| >=  | 大于等于                                                 |
| !=  | 不等于                                                   |
| <=> | 比较，返回 1(第一个值大), 0(两个值相等), -1(第二个值大)  |



### 字符串比较操作符



| 符号 | 描述                                                  |
|:---:|:--------------------------------------------------------:|
| lt | 小于                                                    |
| gt | 大于                                                    |
| eq | 等于                                                    |
| le | 小于等于                                                |
| ge |大于等于                                                 |
| ne | 不等于                                                  |
| cmp | 比较，返回1(第一个值大), 0(两个值相等), -1(第二个值大) |



### 逻辑操作符

* 逻辑或：$a \|\| $b 或 $a or $b
* 逻辑与：$a && $b 或 $a and $b
* 逻辑非：! $a 或 not $a
* 逻辑异或：$a xor $b


### 位操作符 

* 位与：& 
* 位或：\|
* 位非：~
* 位异或：^
* 左移：$x << 1
* 右移：$x >> 2


>  
> 不要将&用于负整数，因为PERL将会把它们转化为无符号数  
>  


### 赋值操作符

| 符号 | 描述                                                  |
|:-----:|:-----------------------------:|
| =     | Assignment only               |
| +=    | Addition and assignment       |
| -=    | Subtraction and assignment    |
| \*=   | Multiplication and assignment |
| /=    | Division and assignment       |
| %=    | Remainder and assignment      |
| \*\*= | Exponentiation and assignment |
| &=    | Bitwise AND and assignment    |
| \|=   | Bitwise OR and assignment     |
| ^=    | Bitwise XOR and assignment    |

### 自增自减操作符

对于数字的操作，与C++中的用法相同。  
对于字符串，当结尾字符为'z'、'Z'、'9'时进位。  


>  
> 不要在变量两边都使用此种操作符：++$var-- # error  
> 不要在变量自增/减后在同一表达式中再次使用：$var2   = $var1 + ++$var1; # error  
> 不要使用--，PERL将先将字符串转换为数字再进行自减  
> 如果字符串中含有非字母且非数字的字符，或数字位于字母中，则经过++运算前值转换为数字零，因此结果为1  
>  

```
$stringvar = "abc";
$stringvar++; # $stringvar contains "abd" now

$stringvar = "aBC";
$stringvar++; # $stringvar contains "aBD" now

$stringvar = "abz";
$stringvar++; # $stringvar now contains "aca"

$stringvar = "AGZZZ";
$stringvar++; # $stringvar now contains "AHAAA" 

$stringvar = "ab4";
$stringvar++; # $stringvar now contains "ab5"

$stringvar = "bc999";
$stringvar++; # $stringvar now contains "bd000" 

$stringvar = "ab*c";
$stringvar++; # 1

$stringvar = "ab5c";
$stringvar++; # 1
```

### 字符串联结和重复操作符

* 联接: .
* 重复：x
* 联接且赋值： .=

```
$newstring = "potato" . "head"; # "potatohead"

$newstring = "t" x 2; # "potatoheadpotatohead"

$a = "be";
$a .= "witched"; # "bewitched"
```

### 逗号操作符 


与C语言类似，其前面的表达式先进行运算。  
使用此操作符的唯一理由是提高程序的可读性，将关系密切的两个表达式结合在一起。  


### 条件操作符

与C中类似，条件?值1:值2，当条件为真时取值1，为假时取值2。  

PERL 5中，还可以在赋值式左边使用条件操作符来选择被赋值的变量。  

```
$condvar == 43 ? $var1 : $var2 = 14; 
$condvar == 43 ? $var1 = 14 : $var2 = 14;
```

### 操作符的次序

| 操作符   |  描述 |
|:--------:|:--------------------:|
| ++, --   |  自增，自减 |
| -, ~, !  |  单目 |
| \*\*     |  乘方 |
| =~, !~   |  模式匹配 |
| \*, /, %, x  |  乘，除，取余，重复 |
| +, -, .  |  加，减，联接 |
| <<, >>   |  移位 |
| -e, -r, etc.  |  文件状态 |
| <, <=, >, >=, lt, le, gt, ge  |  不等比较 |
| ==, !=, <=>, eq, ne, cmp  |  相等比较 |
| &         |  位与 |
| |, ^      |  位或，位异或 |
| &&        |  逻辑与 |
| \|\|      |  逻辑或 |
| ..        |  列表范围 |
| ? and :   |  条件操作符 |
| =, +=, -=, \*=,  |  赋值 |
| ,         |  逗号操作符 |
| not       |  Low-precedence logical NOT |
| and       |  Low-precedence logical AND |
| or, xor   |  Low-precedence logical OR and XOR |


## 列表与数组


列表是包含在括号里的一序列的值，可以为任何数值，也可为空，如：(1, 5.3 , "hello" , 2)，空列表：()。  
列表存贮于数组变量中，与简单变量不同，数组变量以字符"@"打头  

```
@array = (1, 2, 3);
```


>  
>  因为PERL用@和$来区分数组变量和简单变量，所以同一个名字可以同时用于数组变量和简单变量  
>  数组变量创建时初始值为空列表：()。  
>  

### 数组的存取 

对数组中的值通过下标存取，第一个元素下标为0。  
试图访问不存在的数组元素，则结果为NULL.  
如果给超出数组大小的元素赋值，则数组自动增长，原来没有的元素值为NULL。  

```
@array = (1, 2, 3, 4);
$scalar = $array[0];

$array[3] = 5; # now @array is (1,2,3,5)

$scalar = $array[4]; # now $scalar = null;

$array[6] = 17; # now @array is (1,2,3,5,"","",17)
```

### 数组间拷贝

```
@result = @original; 
```

### 用数组给列表赋值

```
@list1 = (2, 3, 4);
@list2 = (1, @list1, 5); # @list2 = (1, 2, 3, 4, 5)
```

### 数组对简单变量的赋值


```
@array = (5, 7, 11);
($var1, $var2) = @array; # $var1 = 5, $var2 = 7, 11被忽略

@array = (5, 7);
($var1, $var2, $var3) = @array; # $var1 = 5, $var2 = 7, $var3 ="" (null)
```

### 字符串中的方括号和变量替换

```
"$var[0]"  #为数组@var的第一个元素。
"$var\[0]" #将字符"["转义，等价于"$var". "[0]"，$var被变量替换，[0]保持不变。
"${var}[0]"  #亦等价于"$var" ."[0]"。
"$\{var}" #则取消了大括号的变量替换功能，包含文字：${var}.
```

### 列表范围

```
#用于整数
(1..10) = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
(2, 5..7, 11) = (2, 5, 6, 7, 11)
(3..3) = (3)

#用于实数
(2.1..5.3) = (2.1, 3.1 ,4.1, 5.1)
(4.5..1.6) = ()

#用于字符串
("aaa".."aad") = ("aaa","aab", "aac", "aad")
@day_of_month = ("01".."31")

#可包含变量或表达式
($var1..$var2+5)

#小技巧
$fred = "Fred";
print (("Hello, " . $fred . "!\n") x 2);  # "Hello, Fred!\nHello, Fred! \n"
```

### 数组的输出

```
@array = (1, 2, 3);
print (@array, "\n"); #123

@array = (1, 2, 3);
print ("@array\n"); #1 2 3
```

### 列表/数组的长度

当数组变量出现在预期简单变量出现的地方，则PERL解释器取其长度。  

```
@array = (1, 2, 3);
$scalar = @array; # $scalar = 3,即@array的长度
($scalar) = @array; # $scalar = 1,即@array第一个元素的值

#以数组的长度为循环次数可如下编程
$count = 1;
while ($count <= @array) {
    print ("element $count: $array[$count-1]\n");
    $count++;
}
```

### 子数组 

```
@array = (1, 2, 3, 4, 5);
@subarray = @array[0,1]; # @subarray = (1, 2)
@subarray2 = @array[1..3]; # @subarray2 = (2,3,4)

@array[0,1] = ("string", 46); # @array =("string",46,3,4,5) now 
@array[0..3] = (11, 22, 33, 44); # @array = (11,22,33,44,5) now
@array[1,2,3] = @array[3,2,4]; # @array = (11,44,33,5,5) now
@array[0..2] = @array[3,4]; # @array = (5,5,"",5,5) now


@array[1,2] = @array[2,1]; #用子数组形式来交换元素
```

### 有关数组的库函数


#### sort按字符顺序排序

```
@array = ("this", "is", "a","test");
@array2 = sort(@array); # @array2 = ("a","is", "test", "this")
@array = (70, 100, 8);
@array = sort(@array); # @array = (100, 70, 8) now
```

#### reverse反转数组

```
@array2 = reverse(@array);
@array2 = reverse sort (@array);
```

### chop数组去尾

chop的意义是去掉STDIN（键盘）输入字符串时最后一个字符--换行符。  
而如果它作用到数组上，则将数组中每一个元素都做如此处理。  

```
@list = ("rabbit", "12345","quartz");
chop (@list); # @list = ("rabbi", "1234","quart") now
```

### join/split连接/拆分

join的第一个参数是连接所用的中间字符，其余则为待连接的字符数组。  

```
$string = join(" ", "this", "is","a", "string"); # 结果为"this is a string"
@list = ("words","and");
$string = join("::", @list, "colons"); #结果为"words::and::colons"
@array = split(/::/,$string); # @array = ("words","and", "colons") now
```


## 文件操作


### 打开、关闭文件

打开文件时必须决定访问模式，在PERL中有三种访问模式：读、写和添加。  



```
# 返回值用来确定打开文件的操作是否成功，当其成功时返回非零值，失败时返回零
open(FILE1,"file1"); #读

# 写模式将原文件覆盖，原有内容丢失
open(outfile,">outfile"); # 写模式 

# 添加模式则在原文件的末尾处继续添加内容
open(appendfile, ">>appendfile")； # 添加模式 

#  关闭文件
close(MYFILE);
```

### 读文件

`<STDIN>`为标准输入文件，通常为键盘输入，不需要打开。  

```
# 从文件中读取一行数据,文件指针向后移动一行
$line = <MYFILE>;  

# 把文件的全部内容读入数组
# 文件的每一行(含回车符)为数组的一个元素
@array = <MYFILE>;
```

### 写文件

`STDOUT`、`STDERR`为标准输出和标准错误文件，通常为屏幕，且不需要打开。  

```
open(OUTFILE, ">outfile");
print OUTFILE ("Here is an output line.\n");
```


### 判断文件状态 

至直接看例子比较清晰一点。  

下面是判断文件是否存在的例子。  

```
if (-e "/path/file1") {
    print STDERR ("File file1 exists.\n");
}
```

下面是所有的文件测试操作符。  

| 操作符 | 描述 |
|:--------:|:--------------------:|
| -b | 是否为块设备 |
| -c | 是否为字符设备 |
| -d | 是否为目录 |
| -e | 是否存在 |
| -f | 是否为普通文件 |
| -g | 是否设置了setgid位 |
| -k | 是否设置了sticky位 |
| -l | 是否为符号链接 |
| -o | 是否拥有该文件 |
| -p | 是否为管道 |
| -r | 是否可读 |
| -s | 是否非空 |
| -t | 是否表示终端 |
| -u | 是否设置了setuid位 |
| -w | 是否可写 |
| -x | 是否可执行 |
| -z | 是否为空文件 |
| -A | 距上次访问多长时间 |
| -B | 是否为二进制文件 |
| -C | 距上次访问文件的inode多长时间 |
| -M | 距上次修改多长时间 |
| -O | 是否只为“真正的用户”所拥有 |
| -R | 是否只有“真正的用户”可读 |
| -S | 是否为socket |
| -T | 是否为文本文件 |
| -W | 是否只有"真正的用户"可写 |
| -X | 是否只有"真正的用户"可执行 |


### 命令行参数


象C一样，PERL也有存储命令行参数的数组@ARGV，可以用来分别处理各个命令行参数。  

与C不同的是，`$ARGV[0]`是第一个参数，而不是程序名本身。

```
$var = $ARGV[0]; # 第一个参数
$numargs = @ARGV; # 参数的个数
```

PERL中，`<>`操作符实际上是对数组`@ARGV`的隐含的引用，其工作原理为：

1. 当PERL解释器第一次看到<>时，打开以`$ARGV[0]`为文件名的文件；
2. 执行动作`shift(@ARGV);` 即把数组`@ARGV`的元素向前移动一个，其元素数量即减少了一个。
3. `<>`操作符读取在第一步打开的文件中的所有行。
4. 读完后，解释器回到第一步重复。

如下面的例子是把一个文件列表的内容全部打印出来。  

```
@ARGV = ("myfile1", "myfile2"); #实际上由命令行参数赋值
while ($line = <>) {
    print ($line);
} 
```

### 打开管道

用程序的形式也可以象命令行一样打开和使用管道。  

```
# 打开一个管道，发送到MESSAGE的输出成为命令"mail dave"的输入
open (MESSAGE, "| mail dave"); 
print MESSAGE ("Hi, Dave! Your Perl program sent this!\n");
close (MESSAGE);
```


## 模式匹配


模式匹配 简单的理解就是正则表达式。  
主要用于在字符串中查找特定序列的字符。  

例如 `split`函数将字符串按空格分成多个单词

```
@array = split(/ /, $line);
```


### 匹配操作符

`=~` 检验匹配
`=~` 检验不匹配

```
$var = "abcd";

$result = $var =~ /bc/; # 非零值
$result = $var =~ /cb/; # 0
```

### 模式中的特殊字符

和其他语言的正则表达式类似。  


*   `+`   匹配一个或多个相同的字符
*   `*`    匹配0个、1个或多个相同字符
*   `?`   匹配0个或1个该字符
*   `[]`   匹配一组字符中的一个
*   `[^]` 表示除其之外的所有字符
*   转义字符    特殊意义的字符其前加斜线"\\"
*   `^` 或 `\A`  仅匹配串首
*   `$` 或 `\Z`  仅匹配串尾
*   `\b`  匹配单词边界
*   `\B`  单词内部匹配
*   `\d`	任意数字  [0-9] 
*   `\D`	除数字外的任意字符  [^0-9] 
*   `\w`	任意单词字符  [_0-9a-zA-Z] 
*   `\W`	任意非单词字符  [^_0-9a-zA-Z] 
*   `\s`	空白  [ \\r\\t\\n\\f] 
*   `\S`	非空白  [^ \\r\\t\\n\\f] 
*   `.`   匹配任意字符 
*   `{a,b}` 匹配指定数目的字符 
*   `|`  指定多个选择来匹配模式，从左到右一个一个匹配

### 模式的部分重用

当模式中匹配相同的部分出现多次时，可用括号括起来，用`\n`来多次引用，以简化表达式  

```
$pattern = "\d{2}([\W])\d{2}\1\d{2}"

"12-05-92" =~ /$pattern/;  #true
"26.11.87" =~ /$pattern/;  #true
"07 04 92" =~ /$pattern/;  #true
"07 04-92" =~ /$pattern/;  #false
```


### 指定模式定界符


缺省的，模式定界符为反斜线`/`，但其可用字母m自行指定  
当用字母'作为定界符时，不做变量替换  
当用特殊字符作为定界符时，其转义功能或特殊功能即不能使用  


```
m!/u/jqpublic/perl/prog1! #等价于/\/u\/jqpublic\/perl\/prog1/
```

### 模式次序变量

在模式匹配后调用重用部分的结果可用变量`$n`，全部的结果用变量`$&`。  

```
$string = "This string contains the number 25.11.";
 $string =~ /-?(\d+)\.?(\d+)/; # 匹配结果为25.11
 $integerpart = $1; # now $integerpart = 25
 $decimalpart = $2; # now $decimalpart = 11
 $totalpart = $&; # now totalpart = 25.11
```

### 模式匹配选项


| 选项 | 描述 |
|:--------:|:--------------------:|
| g | 匹配所有可能的模式 |
| i | 忽略大小写 |
| m | 将串视为多行 |
| o | 只赋值一次 |
| s | 将串视为单行 |
| x | 忽略模式中的空白 |


### 替换操作符

语法为`s/pattern/replacement/`，其效果为将字符串中与pattern匹配的部分换成replacement。  

```
$string = "abc123def";
$string =~ s/123/456/; # now $string = "abc456def";
```

## 控制结构

### 条件判断

```
if ( <expression>) {
    # statement_block_1
}elsif ( <expression> ) {
    # statement_block_2
}else{
    # statement_block_3
}
```

### 循环

```
#while循环 
while ( <expression> ) {
    # statement_block
}

#until循环 
until ( <expression> ) {
    # statement_block
}

#类C的for循环
for ($count=1; $count <= 5; $count++) {
    # statements inside the loop go here
}


#列表(数组)循环

foreach localvar (listexpr) {
    #statement_block;
}

# 等价于
foreach $word (@words) {
    if ($word eq "the") {
      print ("found the word 'the'\n"); 
    }
}


# do循环
#至少执行一次循环
do {
    statement_block
} while_or_until (condexpr);
```

>  
> foreach循环变量localvar是个局部变量  
> 如果在此之前它已有值，则循环后仍恢复该值  
>  


在循环中改变局部变量，相应的数组变量也会改变  

```
@list = (1, 2, 3, 4, 5);
foreach $temp (@list) {
    if ($temp == 2) {
        $temp = 20;
    }
}

#@list已变成了(1, 20, 3, 4, 5)。
```

### 循环控制

退出循环为last，与C中的break作用相同  
执行下一个循环为next，与C中的continue作用相同  
PERL特有的一个命令是redo，其含义是重复此次循环，即循环变量不变，回到循环起始点  
但要注意，redo命令在do循环中不起作用。  


### 单行条件 

语法为statement keyword condexpr。  

其中keyword可为if、unless、while或until  


虽然条件判断写在后面，但却是先执行的。如：

```
print ("This is zero.\n") if ($var == 0);
print ("This is zero.\n") unless ($var != 0);
print ("Not zero yet.\n") while ($var-- > 0);
print ("Not zero yet.\n") until ($var-- == 0);
```


## 子程序

子程序即执行一个特殊任务的一段分离的代码，它可以使减少重复代码且使程序易读。  
PERL中，子程序可以出现在程序的任何地方。  

缺省的，子程序中最后一个语句的值将用作返回值。   
语句return (retval);也可以推出子程序并返回值retval，retval可以为列表。  

```
sub subroutine{
    statements;
}
```

调用函数在定义函数之前的话，需要加 & 特殊符号。  

```
# 使用在定义之前
sub subname1{

}

subname1;

# 使用在定义之后
&subname2;

#也可以使用 do 调用

do subname2()

sub subname2{

}

# 使用在定义之后， 不过之前有声明
sub subname3;

subname3;

sub subname3{

}
```


### 局部变量

子程序中局部变量的定义有两种方法：my和local。  
其区别是：my定义的变量只在该子程序中存在；而local定义的变量不存在于主程序中，但存在于该子程序和该子程序调用的子程序中(在PERL4中没有my)。  

定义时可以给其赋值，如：

```
my($scalar) = 43;
local(@array) = (1, 2, 3);
```

### 子程序参数

`@_`代表参数列表  
参数为数组时，子程序只将它赋给一个数组变量。  


```
&sub1(&number1, $number2, $nubmer3);

sub sub1{
    my($number1, $number2, $number3) = @_;
}


&addlist (@mylist);
&addlist ("14", "6", "11");
&addlist ($value1, @sublist, $value2);

sub addlist {
    my (@list) = @_;
}
```

简单变量和数组变量可以同时传递  

```
&twoargs(47, @mylist); # 47赋给$scalar，@mylist赋给@list
&twoargs(@mylist); # @mylist的第一个元素赋给$scalar，其余的元素赋给@list

sub twoargs {
    my ($scalar, @list) = @_;
}
```

### 递归子程序


PERL中，子程序可以互相调用，其调用方法与上述相同，当调用该子程序本身时，即成了递归子程序。  
递归子程序有两个条件：1、除了不被子程序改变的变量外，所有的变量必须的局部的；2、该子程序要含有停止调用本身的代码。  


### 用别名传递数组参数

用前面讲到的调用方法`&my_sub(@array)`将把数组`@array`的数据拷贝到子程序中的变量`@_`中，当数组很大时，将会花费较多的资源和时间，而用别名传递将不做这些工作，而对该数组直接操作。  

```
@myarray = (1, 2, 3, 4, 5);
&my_sub(*myarray);
sub my_sub {
    my (*subarray) = @_;
}
```

此方法类似于C语言中的传递数组的起始地址指针，但并不一样，在定义数组的别名之后，如果有同名的简单变量，则对该变量也是起作用的。  

```
$foo = 26;
@foo = ("here's", "a", "list");
&testsub (*foo);

sub testsub {
    local (*printarray) = @_;
    $printarray = 61; # 当子程序执行完，主程序中的$foo的值已经成了61，而不再是26了。
}
```

用别名的方法可以传递多个数组  

```
@array1 = (1, 2, 3);
@array2 = (4, 5, 6);
&two_array_sub (*array1, *array2);
sub two_array_sub {
    my (*subarray1, *subarray2) = @_;
} 
```

### 预定义的子程序

PERL5预定义了三个子程序，分别在特定的时间执行，它们是：BEGIN子程序在程序启动时被调用；END子程序在程序结束时被调用；AUTOLOAD子程序在找不到某个子程序时被调用。  

你可以自己定义它们，以在特定时间执行所需要的动作。  

```
BEGIN {
    print("Hi! Welcome to Perl!\n");
}
AUTOLOAD{
    print("subroutine $AUTOLOAD not found\n"); # 变量$AUTOLOAD即未找到的子程序名
    print("arguments passed: @_\n");
}
```

若同一个预定义子程序定义了多个，则BEGIN顺序执行，END逆序执行。  

## 关联数组/哈希表

可以用任意简单变量值来访问其元素，这种数组叫做关联数组，也叫哈希表。  
为了区分关联数组变量与普通的数组变量，Perl使用`%`作为其首字符，而数组变量以`@`打头。  
与其它变量名一样，%后的第一个字符必须为字母，后续字符可以为字母、数字或下划线。  


关联数组的下标可以为任何简单/标量值，访问单个元素时以`$`符号打头，下标用大括号围起来。  

```
$fruit{"bananas"}
$number{3.14159}
$integer{-7}

#简单变量也可作为下标
$fruit{$my_fruit}
```

创建一个关联数组元素最简单的方法是赋值，如语句`$fruit{"bananas"} = 1；`  
把1赋给关联数组`%fruit`下标为bananas的元素，如果该元素不存在，则被创建，如果数组`%fruit`从未使用过，也被创建。  

可以用单个赋值语句创建关联数组  

```
#下标为apples的元素，值为17
#下标为bananas的元素，值为9
#下标为oranges的元素，值为none
%fruit = ("apples",17,"bananas",9,"oranges","none");

#用列表给关联数组赋值时，Perl5允许使用"=>"或","来分隔下标与值，用"=>"可读性更好些
%fruit = ("apples"=>17,"bananas"=>9,"oranges"=>"none");
```

数组变量创建关联数组,其元素数目应该为偶数  

```
@fruit = ("apples",17,"bananas",9,"oranges","none");
%fruit = @fruit;
```

反之，可以把关联数组赋给数组变量  

```
#此语句中元素次序未定义，那么数组变量@fruit可能为("grapes",11,"lemons",27)或("lemons",27,"grapes",11)。
%fruit = ("grapes",11,"lemons",27);
@fruit = %fruit;
```

### 元素的增删

增加元素已经讲过，可以通过给一个未出现过的元素赋值来向关联数组中增加新元素  
删除元素的方法是用内嵌函数delete  

```
delete ($fruit{"lime"});
```

### 列出数组的索引和值

keys()函数返回关联数组下标的列表  
内嵌函数values()返回关联数组值的列表  


### 用关联数组循环

Perl提供一种更有效的循环方式，使用内嵌函数each()  

each()函数每次返回一个双元素的列表，其第一个元素为下标，第二个元素为相应的值，最后返回一个空列表。  
注意：千万不要在each()循环中添加或删除元素，否则会产生不可预料的后果。  
    
    
```
%records = ("Maris", 61, "Aaron", 755, "Young", 511);
while (($holder, $record) = each(%records)) {
  # stuff goes here
}
```

### 用关联数组创建数据结构

用关联数组可以模拟在其它高级语言中常见的多种数据结构，如实现：链表、结构和树。

链表是一种比较简单的数据结构，可以按一定的次序存贮值。  
每个元素含有两个域，一个是值，一个是引用（或称指针），指向链表中下一个元素。  
一个特殊的头指针指向链表的第一个元素。
在Perl中，链表很容易用关联数组实现，因为一个元素的值可以作为下一个元素的索引。  



许多编程语言可以定义结构(structure)，即一组数据的集合。  
结构中的每个元素有其自己的名字，并通过该名字来访问。  
Perl不直接提供结构这种数据结构，但可以用关联数组来模拟。  


另一个经常使用的数据结构是树。  
树与链表类似，但每个节点指向的元素多于一个。  
最简单的树是二叉树，每个节点指向另外两个元素，称为左子节点和右子节点（或称孩子），每个子节点又指向两个孙子节点，依此类推。  
注：此处所说的树像上述链表一样是单向的，每个节点指向其子节点，但子节点并不指向父节点。  



## 格式化输出


### 显示打印格式

打印格式的显示有两步：1、将系统变量$~设成所要使用的格式 2、调用函数write  

### 打印格式


| 格式 | 值域含义 |
|:--------:|:------------:|
| @<<< | 左对齐输出 |
| @>>> | 右对齐输出 |
| @\|\|\| | 中对齐输出 |
| @##.##   | 固定精度数字   |
| @\* | 多行文本 |


### 输出到其它文件

缺省地，函数write将结果输出到标准输出文件STDOUT，我们也可以使它将结果输出到任意其它的文件中。  

最简单的方法就是把文件变量作为参数传递给write，这样，write就用缺省的名为MYFILE的打印格式输出到文件MYFILE中，但是这样就不能用$~变量来改变所使用的打印格式。  

系统变量`$~`只对缺省文件变量起作用，我们可以改变缺省文件变量，改变`$~`，再调用write  

当select改变缺省文件变量时，它返回当前缺省文件变量的内部表示，这样我们就可以创建子程序，按自己的想法输出，又不影响程序的其它部分  

```
select (MYFILE);
 $~ = "MYFORMAT";
 write;
```

### 格式化长字符串

我们已经学过值域`@*`可以输出多行文本，但它完全将字符串原样输出，不加以格式化。  
在Perl中对长字符串（包含换行）进行格式化的值域定义很简单，只需把打头的`@`字符换成`^`就行了，这种文本格式化中，Perl解释器在一行中放置尽可能多的单词。  
每当输出一行文本，被输出的子串就从变量中删除，再次在域值中使用该变量就把剩下的字符串继续按格式输出。  
当内容已输出完毕，该变量就成了空串，再输出就会输出空行，为避免输出空行，可以在值域格式行首加一个~字符。

### 用printf格式化输出

它与C语言中的printf基本上是相同的。  
printf有两个参数，一个是字符串，其中含有一个或多个域值形式，另一个是与各域值相对应的变量值按一定格式替换  


| 域值   | 含义 |
|:--------:|:------------:|
| %c | 单个字符 |
| %d | 十进制整数 |
| %e | 科学计数法形式的浮点数   |
| %f | 普通形式（定点）浮点数 |
| %g | 紧缩形式浮点数 |
| %o | 八进制整数 |
| %s | 字符串 |
| %u | 无符号整数 |
| %x | 十六进制整数 |


## Perl5中的引用/指针

引用就是指针，可以指向变量、数组、哈希表（也叫关联数组）甚至子程序。  
Pascal或C程序员应该对引用（即指针）的概念很熟悉，引用就是某值的地址，对其的使用则取决于程序员和语言的规定。  
在Perl中，可以把引用称为指针，二者是通用的，无差别的。引用在创建复杂数据方面十分有用。


Perl5中的两种引用类型为硬引用和符号引用。  
符号引用含有变量的名字，它对运行时创建变量名并定位很有用，基本上，符号引用就象文件名或UNIX系统中的软链接。  
而硬引用则象文件系统中的硬链接。
Perl4只允许符号引用，给使用造成一些困难。  
例如，只允许通过名字对包的符号名哈希表（名为_main{}）建立索引。  
Perl5则允许数据的硬引用，方便多了。


硬引用跟踪引用的计数，当其数为零时，Perl自动将被引用的项目释放，如果该项目是对象，则析构释放到内存池中。  
Perl本身就是个面向对象的语言，因为Perl中的任何东西都是对象，包和模块使得对象更易于使用。  
简单变量的硬引用很简单，对于非简单变量的引用，你必须显式地解除引用并告诉其应如何做，详见《第 章Perl中的面向对象编程》。


任何简单变量均可保存硬引用。  
因为数组和哈希表含有多个简单变量，所以可以建立多种组合而成的复杂的数据结构，如数组的数组、哈希表的数组、子程序的哈希表等等。  
只要你理解其实只是在用简单变量在工作，就应该可以正确的在最复杂的结构中正确地解除引用。  


反斜线操作符与C语言中传递地址的操作符&功能类似。  
一般是用`\`创建变量又一个新的引用。  
引用变量存的是变量的地址，而不是值本身，要获得值，形式为两个$符号  


>  
> 指针就是地址，通过指针可以访问该地址处存贮的数据。  
> 如果指针指向了无效的地址，就会得到不正确的数据。  
> 通常情况下，Perl会返回NULL值，但不该依赖于此，一定要在程序中把所有的指针正确地初始化，指向有效的数据项。
>  



关于Perl语言应该记住的最重要的一点可能是：Perl中的数组和哈希表始终是一维的。  
因此，数组和哈希表只保存标量值，不直接存贮数组或其它的复杂数据结构。  
数组的成员要么是数（或字符串）要么是引用。  
对数组和哈希表可以象对简单变量一样使用反斜线操作符  



<完>

## 参考资料

* [Perl 5教程][man-perl]


[man-perl]: http://man.ddvip.com/web/perl/index.htm
