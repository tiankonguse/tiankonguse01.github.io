---
layout:     post
title:      Linux 命令记录(持续更新中)
category: blog
description: linux下的命令学好了，走到哪里都不怕电脑死机了。
keywords: linux, command, ls, cp, dd, pwd, mv, 语法, touch, 用户, 操作, 权限, lsblk, 优化命令, readelf, 格式, 常用命令, strings
tags: linux  command
---


linux 有很多很多，我计划按功能划分一下。

大概有基本命令，监控命令，测试命令，优化命令。


## 基本命令

### ls

ls 主要用于显示目录的内容。默认只显示为隐藏的目录和文件名。

* -1 参数(数字)可以一行显示一个文件或目录。
* -l 参数(字母)可以显示的有权限，用户，组，时间，大小以及名字。
* -a 参数可以显示隐藏的文件或目录。
* -R 参数可以递归显示子目录，一般加这个参数后会再加个 grep 来搜索满足条件的目录或文件。
* -A 参数可以不显示当前目录和父目录，即 . 和 ..
* --block-size=SIZE 当文件大时，使用这个参数可以显示指定大小的格式，小于这个大小的将显示1.
* -h 只能显示大小的单位


### cd

cd 主要用于改变当前目录到指定目录。


### mkdir

mkdir 主要用于在指定的位置创建一个目录，默认位置是当前位置。

* -p 当指定的目录不存在的时候，会自动尝试创建这个目录
* -m 设置目录的权限，一般不适用。

### cp

cp 复制文件到指定的地方

* -f 如果文件存在，直接覆盖
* -l 复制的时候只是创建一个硬链接
* -s 复制的时候只是创建一个软连接
* -r 如果复制的是目录，递归复制里面的内容


### md5sum

一般用来检查文件的完整性或用于加密一下文本。

md5 加密一般是不可逆的，虽然现在出现了破解工具，但是应用于破解密码上还是没办法做到的。

使用： md5sum 参数 文件列表

* -b 使用二进制模式读取文件
* -c 从文件里读取 MD5 sum 信息并检查它们
* -t 使用文本模式读取文件，一般在GNU系统上和二进制模式没有区别


执行md5sum后，一般输出的是 md5值和文件名。

```
skyyuan:skyyuan $ md5sum skyyuan.sh 
424c541134501ba66d28510614e95049  skyyuan.sh
```

但是一般不这样做。  
一般是将很多文件的md5值输出到一个文件内，然后需要查看哪些文件修改的时候使用md5sum的 -c 参数即可。

```
skyyuan:skyyuan $ md5sum skyyuan.sh skyyuan.bashrc > hash.md5

skyyuan:skyyuan $ cat hash.md5 
424c541134501ba66d28510614e95049  skyyuan.sh
03db1457860db6cfff643f2b514d60d8  skyyuan.bashrc

skyyuan:skyyuan $ echo " " >>  skyyuan.sh 

skyyuan:skyyuan $ md5sum -c hash.md5 
skyyuan.sh: FAILED
skyyuan.bashrc: OK
md5sum: WARNING: 1 of 2 computed checksums did NOT match
```

想得到字符串的 md5 值怎么办呢？  

```
skyyuan:demo $ echo 'tiankonguse' | md5sum
70a19872bf17b6939447f8a299f69455  -
```

有人可能会发现这个 md5 值不对， 原来 echo 输出的时候默认在输出的文本后面加上了一个换行符。    

怎么避免这个换行符呢？  


```
skyyuan:demo $ echo -n 'tiankonguse' | md5sum
77192a8e3dc5fb2b7428566f9741ebfc  -
```

这也是 md5 与 md5sum 的区别吧。  

很多人会遇着这个问题， 甚至有人猜想是由于算法不同或者位数不同的原因，没想到是多了一个换行符的原因。  

参考资料：[iteye][], [map4b][], [jiunile][].  


### dd

转换或复制文件

由于在linux中设备驱动和特殊设备可以像普通文件一样操作，所以使用 dd 命令可以操作很多设备中的数据。

默认情况下， dd 从标准输入读数据，从标准输出输出数据。  

参数 if=FILE 重定向输入  
参数 of=FILE 重定向输出  

dd可以在文件、设备、分区和卷之间复制数据

* 从CD-ROM中创建ISO磁盘镜像  

```bash
dd if=/dev/sr0 of=myCD.iso bs=2048 conv=noerror,sync
```

* 克隆一个分区到另一个  

```bash
dd if=/dev/sda2 of=/dev/sdb2 bs=4096 conv=noerror
```
* 克隆硬盘"ad0"到"ad1"  

```bash
dd if=/dev/ad0 of=/dev/ad1 bs=1M conv=noerror
```

* 复制软盘的前两个扇区  

```bash
dd if=/dev/fd0 of=MBRboot.img bs=512 count=2
```

* 创建整个x86主引导记录的镜像

```bash
dd if=/dev/sda of=MBR.img bs=512 count=1
```

* 创建仅含主引导记录引导代码的镜像 

```bash
dd if=/dev/sda of=MBR_boot.img bs=446 count=1
```

* 用零擦除磁盘  

```bash
dd if=/dev/zero of=/dev/sda bs=4k
```

* 随机数据生成文件  

```bash
dd if=/dev/urandom of=myrandom bs=100 count=1
```

* 将文件转换为大写 

```bash
dd if=filename of=filename1 conv=ucase
```

* 创建任意大小的空文件  

```bash
dd if=/dev/zero of=mytestfile.out bs=1 count=0 seek=1G
```


### uname

打印出系统信息。

* -s 默认参数，打印出内核名字  

```
skyyuan:~ $ uname
Linux

skyyuan:~ $ uname -s
Linux
```

* -n 主机的网络名称或主机名称  

```
skyyuan:~ $ uname -n
DEVNET-191-112
```

* -r 内核版本号  

```
skyyuan:~ $ uname -r
2.6.32.57-tlinux_xenU-1.1.rc8-default
```

* -v 内核发布日期  

```
skyyuan:~ $ uname -v
#1 SMP Wed Feb 20 17:35:10 CST 2013
```

* -m 主机的硬件名称  

```
skyyuan:~ $ uname -m
x86_64
```

* -p 处理器类型或 unknow  

```
skyyuan:~ $ uname -p
x86_64
```

* -i 硬件平台类型或 unknow  

```
skyyuan:~ $ uname -i
x86_64
```

* -o 操作系统  

```
skyyuan:~ $ uname -o
GNU/Linux
```

* -a 输出所有信息  
 
```
skyyuan:~ $ uname -a
Linux DEVNET-191-112 2.6.32.57-tlinux_xenU-1.1.rc8-default #1 SMP Wed Feb 20 17:35:10 CST 2013 x86_64 x86_64 x86_64 GNU/Linux
```


### history

显示带行号的命令历史列表

* 显示最近 n 个命令  

```
history n
```

* 清空历史列表  

```
history -c
```

* 删除指定行数的历史  

```
history -d lineNumber
```

* 导入历史记录   

```
history -r historyFileName
```

* 增量导入历史记录  

```
history -n historyFileName
```

* 覆盖历史记录 

```
history -w historyFileName
```

### pwd

打印当前或活动的目录

* -L 显示当前位置，不管是不是软连接

```
skyyuan:~ $ ll test-pwd
lrwxrwxrwx 1 skyyuan users 5 Oct 21 17:40 test-pwd -> test/

skyyuan:~ $ cd test-pwd
skyyuan:test-pwd $ 

skyyuan:test-pwd $ pwd
/home/skyyuan/test-pwd

skyyuan:test-pwd $ pwd -L
/home/skyyuan/test-pwd
```

* -P 显示真实位置

```
skyyuan:~ $ cd test-pwd
skyyuan:test-pwd $ 

skyyuan:test-pwd $ pwd -P
/data/skyyuan/test
```

### mv

移动或者重命名文件

#### 语法

```
mv  SOURCE DEST
```


#### 参数

* -f 覆盖的时候不用确认
* -i 覆盖的时候确认
* -n 如果文件存在，不覆盖
* -b 对每个存在的目标文件进行备份

### touch

改变文件修改(access and modification)的时间戳

文件不存在的时候会创建一个空文件。

默认修改的时间为当前时间

* -a 只修改 access 时间 
* -c 文件不存在的时候不创建文件
* -d 指定时间作为当前的时间
* -m 只修改 modification 时间 
* -r 使用指定文件的时间作为当前时间
* -t 使用指定的时间作为当前时间


### chmod

修改文件的模式位，比如我主要用于修改文件的权限



#### 用户

* u表示文件主人
* g 表示文件文件所在组
* o 表示其他人 
* a 代表所有人




#### 操作 

* + 添加这个权限
* - 取消这个权限
* = 设置这个权限，其他权限全部取消

#### 权限

* r 表可读 r=4
* w 表可写 w=2
* x 表可以运行 x=1


#### 样例

```
#用户，组，其他人都添加读权限
chmod ugo+r filename


#自己添加运行权限
chmod u+x filenmame 

#同组的人添加执行权限
chmod g+x filename 

#三个数字分别为 档案拥有者、群组、其他
chmod 644 filename
```

### chown

改变文件的用户名和组名。  

这个命令的好处：

1. 将一个目录的拥有权转移给一个用户  
2. 多人属于同一个组，一个文件权限转移到一个组，是的这个组的所有人都有权限操作这个文件。  



### rename

这个函数经常用来批量修改文件名。  

```
rename [options] expression replacement file...
```


比如我们有一批文件 `foo1, ..., foo9, foo10, ..., foo278`, 我们想在数字前面加上前导0， 怎么做呢？  

```
rename foo foo0 foo?
rename foo foo0 foo??
```

可以看出来， 问号是占位符，代表任何字符。  


想批量修改文件的后缀，下面的命令就可以  

```
rename .html .md *.html
```

这些替换是比较简单的替换， 但有时候我们想进行复杂的替换， 怎么办呢？  

如果能够进行正则替换就好了。  

比如想要把下面的文件替换一下。  

```
Friends - 6x03 - Tow Ross' Denial.srt
Friends - 6x20 - Tow Mac and C.H.E.E.S.E..srt
Friends - 6x05 - Tow Joey's Porshe.srt

=>

S06E03.srt
S06E20.srt
S06E05.srt
```

[stackoverflow][rename-files-using-regular-expression-in-linux] 上说下面的就可以， 即常见的正则替换， 但是我运行失败了，提示不存在 n 这个参数，可能我这个版本的 linux 没有这个功能吧。  

```
rename -n 's/(\w+) - (\d{1})x(\d{2}).*$/S0$2E$3\.srt/' *.srt
```




## 监控命令

### lsblk

文档中就一句话 `list block devices`, 列出块设备。

在 DESCRIPTION 里还可以了解到 lsblk 是从 sysfs 文件系统中得到你想要的信息。

默认情况下显示树状信息。

下面介绍一下常用的几个参数

* -b 以bytes 为单位显示块大小，默认以 human-readable 的方式显示
* -m 显示设备的拥有者，组和模式。


### netstat

netstat 功能复杂，我用一个记录一个吧。  

前端时间写了一个 server, 使用 TCP 通信。  

有时候需要查看一下这个 server 对应端口的情况，于是使用下面的命令查看。  

服务端检查一个端口  

```
netstat -alpn | grep 5555

-l, --listening
    Show only listening sockets.  (These are omitted by default.)

-a, --all
    Show both listening and non-listening (for TCP this means established connections) sockets.  With the --interfaces option, show interfaces that are not marked
    
-p, --program
    Show the PID and name of the program to which each socket belongs.
    
--numeric , -n
    Show numerical addresses instead of trying to determine symbolic host, port or user names.
```

### telnet

有时候我们需要查看一台服务器的 是否正常工作， 可以使用 telnet 来尝试连接一下。  

客户端查看指定ip的端口是否正常  


```
telnet 127.0.0.1 5555
```

### strace

网络通信的时候，我们怀疑IO有问题，这个时候就可以使用 strace 来查看一下在 IO 的哪一步出现问题了。  

```
strace -s 3000 -tt  ./server
```

但是有时候我们的程序已经在运行了，这个时候我们就需要通过端口来监听这个 server 的 OI 情况了。  

```
strace -p 80 -s 3000 -tt 
```

### tcpdump

有时候我们 server 的 IO 有问题了， 我们确定是网络 IO 的问题。  

这个时候就可以抓取指定端口的包来看看哪里的问题了。  

```
sudo tcpdump -ieth1 -Xlpns0 port 5555

-i     Listen on interface.  If unspecified, tcpdump searches the system interface list for the lowest numbered, configured up interface (excluding loopback).
-X     When parsing and printing, in addition to printing the headers of each packet, print the data of each packet (minus its link  level  header) in hex and ASCII.  This is very handy for analysing new protocols.
```



## 优化命令


### readelf 

作用很明显，是显示elf格式文件的信息

ELF，全称 Executable and Linkable Format(可执行和可链接格式). 具体可参考 [wiki][elf].

#### 格式

* ELF文件的组成：ELF header
* 程序头：描述段信息
* Section头：链接与重定位需要的数据
* 程序头与Section头需要的数据.text .data

可以参考这张图片 ![ELF][elf-layout]


含义如下

* 代码(.text)
* 数据
    - .data 初始化了的全局静态变量和局部静态变量
    - .bss 未初始化的全局变量和局部静态变量
    - .rodata 只读数据(字符串常量)
* 符号表(symble table)
    - 包括：函数名、全局变量名、函数静态变量名
    - 不包括：数据类型名、局部自动变量名
* 其它(重定位、加载、动态链接、调试等信息)


#### 作用

现在作为 Linux 的目标文件格式.
作为一种可移植的目标文件格式，可以在Intel体系结构上的很多操作系统中使用，从而减少重新编码和重新编译程序的需要


#### 类型


* 可重定位文件（Relocatable File）
    包含适合于与其他目标文件链接来创建可执行文件或者共享目标文件的代码和数据。
* 可执行文件（Executable File） 
    包含适合于执行的一个程序，此文件规定了exec() 如何创建一个程序的进程映像。
* 共享目标文件（Shared Object File）
    包含可在两种上下文中链接的代码和数据。
    首先链接编辑器可以将它和其它可重定位文件和共享目标文件一起处理，生成另外一个目标文件。
    其次，动态链接器（Dynamic Linker）可能将它与某个可执行文件以及其它共享目标一起组合，创建进程映像。

#### 常用命令

* readelf -h 查看ELF文件头
* readelf -a 查看ELF所有信息
* readelf -s 查看ELF文件中的符号表
* readelf -x .data .rodata.bss.text 查看指定节区


### objdump

常用来显示来自目标文件的信息  
比如查看程序时32位的还是64位的。

例如下面的architecture就可以看出是多少位的。

```
tiankonguse:src $ objdump -f  a.out 

a.out:     file format elf64-x86-64
architecture: i386:x86-64, flags 0x00000112:
EXEC_P, HAS_SYMS, D_PAGED
start address 0x0000000000400830
```

具体还可以干什么，可以参考文档。

```
  -a  Display archive header information
  -f  Display the contents of the overall file header
  -p  Display object format specific file header contents
  -h  Display the contents of the section headers  目标文件的所有段概括
  -x  Display the contents of all headers  以某种分类信息的形式把目标文档的数据组织
  -d  Display assembler contents of executable sections 反汇编目标文件
  -D  Display assembler contents of all sections
  -S  Intermix source code with disassembly
  -s  Display the full contents of all sections requested ELF文件节区内容
  -g  Display debug information in object file
  -e  Display debug information using ctags style
  -G  Display (in raw form) any STABS info in the file
  -W  Display DWARF info in the file
  -t  Display the contents of the symbol table(s) 标文件的符号表
  -T  Display the contents of the dynamic symbol table
  -r  Display the relocation entries in the file
  -R  Display the dynamic relocation entries in the file
  -v  Display this program's version number
  -i  List object formats and architectures supported
  -H  Display this information
```

### strings

获取二进制文件里面的字符串常量.  
搜索二进制文件中的字符串，比如检查KEY泄露.  

```
strings –f *| grep '^.\{16\}$'
```

### nm

nm 命令常用来获取二进制文件里面包含的符号(函数、变量)。  
nm 命令常用来解决程序编译时undefined reference的错误，以及mutiple definition的错误  

### ldd

ldd 用来显示程序需要使用的动态库和实际使用的动态库.  
一般可以解决运行库不匹配的问题。  

```
tiankonguse $ ldd /bin/ls
        ntdll.dll => /cygdrive/c/windows/SYSTEM32/ntdll.dll (0x774a0000)
        kernel32.dll => /cygdrive/c/windows/system32/kernel32.dll (0x77380000)
        KERNELBASE.dll => /cygdrive/c/windows/system32/KERNELBASE.dll (0x7fefdb80000)
        cygwin1.dll => /usr/bin/cygwin1.dll (0x180040000)
        cygintl-8.dll => /usr/bin/cygintl-8.dll (0x3ee930000)
        cygiconv-2.dll => /usr/bin/cygiconv-2.dll (0x3f03e0000)
```


### strip


strip 用来去除二进制文件里面包含的符号  
这样做可以减小目标文件大小，去除调试信息。  



[iteye]: http://wolfdream.iteye.com/blog/1543481
[map4b]: http://www.map4b.com/2011/10/23/php-md5-vs-linux-md5sum/
[jiunile]: http://blog.jiunile.com/php%E7%9A%84md5%E4%B8%8Elinux%E7%9A%84md5sum%E7%9A%84%E5%8C%BA%E5%88%AB.html
[rename-files-using-regular-expression-in-linux]: http://stackoverflow.com/questions/11809666/rename-files-using-regular-expression-in-linux
[elf-layout]: http://upload.wikimedia.org/wikipedia/commons/7/77/Elf-layout--en.svg
[elf]: http://en.wikipedia.org/wiki/Executable_and_Linkable_Format