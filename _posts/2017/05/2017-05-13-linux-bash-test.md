---  
layout:     post  
title:      linux下bash的测试比较
description: 这个是基本常识, 这里简单记录一下.  
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateData:  19:10 2017/5/13 
published: true  
---  
  
  
>   
> 大家好，这里是tiankonguse的公众号(tiankonguse-code)。    
> tiankonguse曾是一名ACMer，现在是鹅厂视频部门的后台开发。    
> 这里主要记录算法，数学，计算机技术等好玩的东西。   
>      
> 这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/kjuZuB6l80e49rP_cJEr_g)自动同步过来。    
> 如果转载请加上署名：公众号tiankonguse-code，并附上公众号二维码，谢谢。    
>    
  

## 零、背景

bash中的测试或者比较函数很常用，但是自己有时候会记错，所以这里简单记录一下。  


## 一、测试操作符


### 1. 数字比较操作符

可以用 `-eq`、 `-ne`、`-lt`、 `-le`、 `-gt` 或 `-ge` 比较算术值，它们分别表示等于、不等于、小于、小于等于、大于、大于等于。  

```
$ ((test 3 -gt 4) && echo True) || echo false
false

$ ((test 3 -lt 4) && echo True) || echo false
True

$ test 3 -gt 4; echo $?
1

$ test 5 -gt 4; echo $?
0
```

### 2. 字母比较操作符

可以分别用操作符 `=`、 `!=`、`<` 和 `>` 比较字符串是否相等、不相等或者第一个字符串的排序在第二个字符串的前面或后面。  
shell 也用 `<` 和 `>` 操作符进行重定向，所以必须用 `\<` 或 `\>` 加以转义。 
`-n` 符串非空返回 `True`（或者根本没有操作符）。  
`-z` 测试 `null` 字符串。    


```
$ test "abc" = "def" ;echo $?
1

$ test "abc" = "abc" ;echo $?
0
```
### 3. 条件运算

`EXPR1 -a EXPR2` 如果 expr1 和 expr2 都为真则为真。  
`EXPR1 && EXPR2` 如果 expr1 和 expr2 都为真则为真。
`EXPR1 -o EXPR2` 如果 expr1 和 expr2 有一个为真则为真。  
`EXPR1 || EXPR2` 如果 expr1 和 expr2 有一个为真则为真。  
单目操作符 `!` 可以使测试的意义相反。  


### 4. 其他操作符

* `-a file`  如果文件存在则为真。  
* `-b file`  如果文件为块特殊文件则为真。  
* `-c file`  如果文件为字符特殊文件则为真。  
* `-d file`  如果文件为目录则为真。  
* `-e file`  如果文件存在则为真。  
* `-f file`  如果文件存在且为常规文件则为真。  
* `-g file`  如果文件的组属性设置打开则为真。  
* `-h file`  如果文件为符号链接则为真。  
* `-L file`  如果文件为符号链接则为真。  
* `-k file`  如果文件的粘滞 (sticky) 位设定则为真。  
* `-p file`  如果文件为命名管道则为真。  
* `-r file`  如果文件对于您是可读的则为真。  
* `-s file`  如果文件存在且不为空则为真。  
* `-S file`  如果文件是套接字则为真。  
* `-t file`   如果文件描述符在一个终端上打开则为真。  
* `-u file`  如果文件的用户数行设置打开则为真。  
* `-w file`  如果文件对您是可写的则为真  
* `-x file`  如果文件对您是可执行的则为真。  
* `-O file`  如果文件是被您所有的则为真。  
* `-G file`  如果文件被您的组所有则为真。  
* `-N file`  如果文件上次被读取之后修改过则为真。 
* `file1 -nt file2`	测试 file1 是否比 file2 更新。修改日期将用于这次和下次比较。
* `file1 -ot file2`	测试 file1 是否比 file2 旧。
* `file1 -ef file2`	测试 file1 是不是 file2 的硬链接。


## 二、条件测试

bash 的 if 命令是个复合命令，它测试一个测试或命令（$?）的返回值，并根据返回值为 True（0）或 False（不为 0）进行分支。   

`[]`中的测试命令需要转义, 因为shell 通常要在子 shell 中运行括号中的表达式。  

```
$ test "a" != "$HOME" -a 3 -ge 4 ; echo $?
1

$ [ ! \( "a" = "$HOME" -o 3 -lt 4 \) ]; echo $?
1

$ [ ! \( "a" = "$HOME" -o '(' 3 -lt 4 ')' ")" ]; echo $?
1

$ [ ! "(" "a" = "$HOME" -o '(' 3 -lt 4 ')' ")" ]; echo $?
1
```

  
 
`(( ))`复合命令 计算算术表达式，如果表达式求值为 0，则设置退出状态为 1；如果求值为非 0 值，则设置为 0  
不需要对 `(( ))` 之间的操作符转义。  


```
$ let x=2 y=2**3 z=y*3;echo $? $x $y $z
0 2 8 24

$ (( w=(y/x) + ( (~ ++x) & 0x0f ) )); echo $? $x $y $w
0 3 8 16

$ (( w=(y/x) + ( (~ ++x) & 0x0f ) )); echo $? $x $y $w
0 4 8 13
```

利用复合命令 `[[ ]]` 可以对文件名和字符串使用更自然的语法,且不需要转义。    

```
$ [[ ( -d "$HOME" ) && ( -w "$HOME" ) ]] &&  echo "home is a writable directory"
home is a writable directory

```

也就是简单的条件可以放到`[]`中, 复杂的条件需要放在`[[]]`中, 数学运算放在`(())`中.  

## 四、结语


好了，看到这里差不多就记录完条件测试的语法了.  

参考资料: 

1. [Linux 技巧: Bash 测试和比较函数](https://www.ibm.com/developerworks/cn/linux/l-bash-test.html)


对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
小密圈这周接受免费加入，欢迎大家加入看各种算法的思路。  

![](/images/suanfa_xiaomiquan.jpg)  
  
  
长按图片关注公众号，接受最新文章消息。   
  
![](/images/weixin-50cm.jpg)  
  
  
  