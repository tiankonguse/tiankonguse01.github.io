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




## 监控命令

### lsblk

文档中就一句话 `list block devices`, 列出块设备。

在 DESCRIPTION 里还可以了解到 lsblk 是从 sysfs 文件系统中得到你想要的信息。

默认情况下显示树状信息。

下面介绍一下常用的几个参数

* -b 以bytes 为单位显示块大小，默认以 human-readable 的方式显示
* -m 显示设备的拥有者，组和模式。



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



[elf-layout]: http://upload.wikimedia.org/wikipedia/commons/7/77/Elf-layout--en.svg
[elf]: http://en.wikipedia.org/wiki/Executable_and_Linkable_Format