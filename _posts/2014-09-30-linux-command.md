---
layout:     post
title:      Linux 命令记录(持续更新中)
description: linux下的命令学好了，走到哪里都不怕电脑死机了。
keywords: linux, command, ls, cp, dd, pwd, mv, 语法, touch, 用户, 操作, 权限, lsblk, 优化命令, readelf, 格式, 常用命令, strings
tags: [linux, command]
categories: [程序人生]
updateData:   22:31 2015/5/13
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
tiankonguse:tiankonguse $ md5sum tiankonguse.sh 
424c541134501ba66d28510614e95049  tiankonguse.sh
```

但是一般不这样做。  
一般是将很多文件的md5值输出到一个文件内，然后需要查看哪些文件修改的时候使用md5sum的 -c 参数即可。

```
tiankonguse:tiankonguse $ md5sum tiankonguse.sh tiankonguse.bashrc > hash.md5

tiankonguse:tiankonguse $ cat hash.md5 
424c541134501ba66d28510614e95049  tiankonguse.sh
03db1457860db6cfff643f2b514d60d8  tiankonguse.bashrc

tiankonguse:tiankonguse $ echo " " >>  tiankonguse.sh 

tiankonguse:tiankonguse $ md5sum -c hash.md5 
tiankonguse.sh: FAILED
tiankonguse.bashrc: OK
md5sum: WARNING: 1 of 2 computed checksums did NOT match
```

想得到字符串的 md5 值怎么办呢？  

```
tiankonguse:demo $ echo 'tiankonguse' | md5sum
70a19872bf17b6939447f8a299f69455  -
```

有人可能会发现这个 md5 值不对， 原来 echo 输出的时候默认在输出的文本后面加上了一个换行符。    

怎么避免这个换行符呢？  


```
tiankonguse:demo $ echo -n 'tiankonguse' | md5sum
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
tiankonguse:~ $ uname
Linux

tiankonguse:~ $ uname -s
Linux
```

* -n 主机的网络名称或主机名称  

```
tiankonguse:~ $ uname -n
DEVNET-191-112
```

* -r 内核版本号  

```
tiankonguse:~ $ uname -r
2.6.32.57-tlinux_xenU-1.1.rc8-default
```

* -v 内核发布日期  

```
tiankonguse:~ $ uname -v
#1 SMP Wed Feb 20 17:35:10 CST 2013
```

* -m 主机的硬件名称  

```
tiankonguse:~ $ uname -m
x86_64
```

* -p 处理器类型或 unknow  

```
tiankonguse:~ $ uname -p
x86_64
```

* -i 硬件平台类型或 unknow  

```
tiankonguse:~ $ uname -i
x86_64
```

* -o 操作系统  

```
tiankonguse:~ $ uname -o
GNU/Linux
```

* -a 输出所有信息  
 
```
tiankonguse:~ $ uname -a
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
tiankonguse:~ $ ll test-pwd
lrwxrwxrwx 1 tiankonguse users 5 Oct 21 17:40 test-pwd -> test/

tiankonguse:~ $ cd test-pwd
tiankonguse:test-pwd $ 

tiankonguse:test-pwd $ pwd
/home/tiankonguse/test-pwd

tiankonguse:test-pwd $ pwd -L
/home/tiankonguse/test-pwd
```

* -P 显示真实位置

```
tiankonguse:~ $ cd test-pwd
tiankonguse:test-pwd $ 

tiankonguse:test-pwd $ pwd -P
/data/tiankonguse/test
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


### write 

给指定的用户发送消息.  

这个可以在两个终端之间聊天.  


```
tiankonguse:~ $ write tiankonguse pts/19

Message from tiankonguse@tiankonguse on pts/19 at 11:40 ...

I'm 18. <<< 18
I'm 19 . from 19
helllo . from 18
^Ctiankonguse:~ $ EOF

tiankonguse:~ $ 


tiankonguse:~ $ 
Message from tiankonguse@tiankonguse on pts/18 at 11:40 ...

tiankonguse:~ $ write tiankonguse pts/18

I'm 18. <<< 18
I'm 19 . from 19
helllo . from 18
EOF
^Ctiankonguse:~ $ 
```


### dig

DNS 查询工具

```
tiankonguse:~ $ dig github.tiankonguse.com

;; ANSWER SECTION:
github.tiankonguse.com.	300	IN	CNAME	tiankonguse.github.io.
tiankonguse.github.io.	300	IN	CNAME	github.map.fastly.net.
github.map.fastly.net.	300	IN	A	103.245.222.133

;; Query time: 10 msec
;; SERVER: 127.0.1.1#53(127.0.1.1)
;; WHEN: Sun Nov 29 21:43:22 CST 2015
;; MSG SIZE  rcvd: 137
```

 



## 监控命令


### last

列出最后登录的用户.  

比如下面的就是我执行的结果.  

```
tiankonguse:~ $ last -n 5
tiankong pts/12       :0               Fri Sep  4 11:10   still logged in   
tiankong pts/4        :0               Fri Sep  4 11:06   still logged in   
tiankong pts/3        :0               Fri Sep  4 10:28   still logged in   
tiankong :0           :0               Fri Sep  4 10:03   still logged in   
reboot   system boot  3.13.0-62-generi Fri Sep  4 09:48 - 11:11  (01:23)    

wtmp begins Wed Sep  2 00:53:03 2015
```

打开一个终端窗口,就会有一条记录.  
可以看出来,我打开了三个终端窗口.  

建议使用这个命令.  

```
tiankonguse:~ $ last -f /var/log/wtmp -Faixw -n 7
tiankonguse pts/12       Fri Sep  4 11:10:04 2015   still logged in                       0.0.0.0
tiankonguse pts/4        Fri Sep  4 11:06:18 2015   still logged in                       0.0.0.0
tiankonguse pts/3        Fri Sep  4 10:28:11 2015   still logged in                       0.0.0.0
tiankonguse :0           Fri Sep  4 10:03:51 2015   still logged in                       0.0.0.0
runlevel (to lvl 2)   Fri Sep  4 09:48:12 2015 - Fri Sep  4 11:19:32 2015  (01:31)     0.0.0.0
reboot   system boot  Fri Sep  4 09:48:12 2015 - Fri Sep  4 11:19:32 2015  (01:31)     0.0.0.0
shutdown system down  Fri Sep  4 02:20:49 2015 - Fri Sep  4 09:48:12 2015  (07:27)     0.0.0.0

wtmp begins Wed Sep  2 00:53:03 2015
```

参数大概意思如下:  

* -f 指定从那个文件加载登录信息, 默认 `/var/log/wtmp`  
* -n num 指定显示最近几条信息, -num 含义相同  
* -F 显示完整的登录和退出时间日期  
* -d 把登录ip转化为登录的host, 默认不使用
* -a hostname 在最后一列显示  
* -i 显示ip, 不显示host
* -x 显示关机和level变动的信息  
* -w 显示完整的名字和域名  


显示ip这个参数很重要, 我们可以根据ip来判断我们的服务器有没有非法登录.  


### iftop

这个命令用于显示出口流量.  

```
sudo iftop -np
```

### ps

查看当前进程的信息.  

这个命令输出的东西较多, 我常会加个 grep 来搜搜我想要的进程的信息.  

```
tiankonguse:~ $ ps aux | grep -v "root\|tianko\|nobody"
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
syslog     841  0.0  0.0 255840  1576 ?        Ssl  09:48   0:00 rsyslogd
message+   846  0.0  0.0  40236  2524 ?        Ss   09:48   0:02 dbus-daemon --system --fork
kernoops  1191  0.0  0.0  37140  1008 ?        Ss   09:48   0:00 /usr/sbin/kerneloops
whoopsie  1208  0.0  0.1 361204  5132 ?        Ssl  09:48   0:00 whoopsie
redis     1230  0.0  0.1  36992  7316 ?        Ssl  09:48   0:02 /usr/bin/redis-server 127.0.0.1:6379       
mysql     1280  0.0  1.4 492752 58516 ?        Ssl  09:48   0:05 /usr/sbin/mysqld
www-data  1974  0.0  0.1 315036  6208 ?        S    09:48   0:00 /usr/sbin/apache2 -k start
www-data  1975  0.0  0.1 315036  6208 ?        S    09:48   0:00 /usr/sbin/apache2 -k start
www-data  1976  0.0  0.1 315036  6208 ?        S    09:48   0:00 /usr/sbin/apache2 -k start
www-data  1977  0.0  0.1 315036  6208 ?        S    09:48   0:00 /usr/sbin/apache2 -k start
www-data  1978  0.0  0.1 315036  6208 ?        S    09:48   0:00 /usr/sbin/apache2 -k start
rtkit     2226  0.0  0.0 168912  1300 ?        SNl  09:48   0:00 /usr/lib/rtkit/rtkit-daemon
colord    2381  0.0  0.1 301508  5736 ?        Sl   09:48   0:00 /usr/lib/colord/colord
lp        4663  0.0  0.0  63156  2220 ?        S    10:11   0:00 /usr/lib/cups/notifier/dbus dbus:// 
lp        4664  0.0  0.0  63156  2220 ?        S    10:11   0:00 /usr/lib/cups/notifier/dbus dbus://
```

### lsblk

文档中就一句话 `list block devices`, 列出块设备。

在 DESCRIPTION 里还可以了解到 lsblk 是从 sysfs 文件系统中得到你想要的信息。

默认情况下显示树状信息。

下面介绍一下常用的几个参数

* -b 以bytes 为单位显示块大小，默认以 human-readable 的方式显示
* -m 显示设备的拥有者，组和模式。



### telnet

有时候我们需要查看一台服务器的 是否正常工作， 可以使用 telnet 来尝试连接一下。  

客户端查看指定ip的端口是否正常  


```
telnet 127.0.0.1 5555
```

### strace

strace跟踪程序的每个系统调用.  


网络通信的时候，我们怀疑IO有问题，这个时候就可以使用 strace 来查看一下在 IO 的哪一步出现问题了。  

```
strace -s 3000 -tt  ./server
```

但是有时候我们的程序已经在运行了，这个时候我们就需要通过端口来监听这个 server 的 OI 情况了。  

```
strace -p 80 -s 3000 -tt 
```

有时候想把结果输出到文件怎么办呢？使用 `-o` 参数。  

```
strace -s 3000 -tt  -o strace.log ./server
```

### ltrace

ltrace能够跟踪进程的库函数调用.  

它会显现出哪个库函数被调用.  

默认不显示系统调用函数，不过加上 `-S` 参数就可以输出系统函数了。  



### tcpdump

有时候我们 server 的 IO 有问题了， 我们确定是网络 IO 的问题。  

这个时候就可以抓取指定端口的包来看看哪里的问题了。  

```
sudo tcpdump -ieth1 -Xlpns0 port 5555

-i     Listen on interface.  If unspecified, tcpdump searches the system interface list for the lowest numbered, configured up interface (excluding loopback).
-X     When parsing and printing, in addition to printing the headers of each packet, print the data of each packet (minus its link  level  header) in hex and ASCII.  This is very handy for analysing new protocols.
```

如果是本机到本机的测试，就会发现不能抓到包了。  
原因是本机间通信，根本没有走接口eth1， 所以我们需要换一个接口。没错，即使本地的 lo 。  

```
sudo tcpdump -ilo -Xlpns0 port 5555
```

关于tcpdump的详细讲解请阅读[tcpdump命令详解](http://github.tiankonguse.com/blog/2016/08/13/tcpdump.html).  


### pmap

Pmap 提供了进程的内存映射，pmap命令用于显示一个或多个进程的内存状态。  

```
pmap PIDList
```

* Address: 内存开始地址  
* Kbytes: 占用内存的字节数（KB）  
* RSS: 保留内存的字节数（KB）  
* Dirty: 脏页的字节数（包括共享和私有的）（KB）  
* Mode: 内存的权限：read、write、execute、shared、private (写时复制)  
* Mapping: 占用内存的文件、或[anon]（分配的内存）、或[stack]（堆栈）  
* Offset: 文件偏移  
* Device: 设备名 (major:minor)  


参考资料：  

* [Linux Pmap Command - Find How Much Memory Process Use][pmap-command]


### gprof

gprof 可以为 Linux平台上的程序精确分析性能瓶颈。  

gprof精确地给出函数被调用的时间和次数，给出函数调用关系。  


** 原理 **  

通过在编译和链接程序的时候（使用 -pg 编译和链接选项），gcc 在你应用程序的每个函数中都加入了一个名为mcount ( or  “_mcount”  , or  “__mcount” , 依赖于编译器或操作系统)的函数，也就是说你的应用程序里的每一个函数都会调用mcount, 而mcount 会在内存中保存一张函数调用图，并通过函数调用堆栈的形式查找子函数和父函数的地址。这张调用图也保存了所有与函数相关的调用时间，调用次数等等的所有信息。

** 使用流程 **
 
1. 在编译和链接时 加上-pg选项。一般我们可以加在 makefile 中。
2. 执行编译的二进制程序。执行参数和方式同以前。
3. 在程序运行目录下 生成 gmon.out 文件。如果原来有gmon.out 文件，将会被重写。
4. 结束进程。这时 gmon.out 会再次被刷新。
5. 用 gprof 工具分析 gmon.out 文件。



参考资料：  

* [GNU gprof][gprof-doc]


### top


TOP命令是Linux下常用的性能分析工具，能够实时显示系统中各个进程的资源占用状况。  

TOP是一个动态显示过程,即可以通过用户按键来不断刷新当前状态.  

如果在前台执行该命令,它将独占前台,直到用户终止该程序为止.  

比较准确的说,top命令提供了实时的对系统处理器的状态监视.  

它将显示系统中CPU最“敏感”的任务列表.  

该命令可以按CPU使用.内存使用和执行时间对任务进行排序  

而且该命令的很多特性都可以通过交互式命令或者在个人定制文件中进行设定.

top的具体介绍请参考[这里](http://github.tiankonguse.com/blog/2015/11/02/linux-command-top/).  

#### 详细说明

```
top - 11:10:38 up 143 days, 18:38,  1 user,  load average: 0.46, 0.39, 0.36
Tasks: 514 total,   1 running, 513 sleeping,   0 stopped,   0 zombie
Cpu(s):  1.6%us,  0.1%sy,  0.0%ni, 98.3%id,  0.0%wa,  0.0%hi,  0.0%si,  0.0%st
Mem:  65807288k total, 14324108k used, 51483180k free,  1405276k buffers
Swap:  2088952k total,        0k used,  2088952k free, 11722016k cached

  PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND                                                                                                                                                                                            
15463 user_00   20   0 1408m 329m 303m S 37.4  0.5   9:04.74 searchd
```





### free

free的输出一共有四行，第四行为交换区的信息，分别是交换的总量（total），使用量（used）和有多少空闲的交换区（free）。  


* total:总计物理内存的大小。
* used:已使用多大。
* free:可用有多少。
* Shared:多个进程共享的内存总额。
* Buffers/cached:磁盘缓存的大小。


### vmstat


vmstat 命令是最常见的Linux/Unix监控工具。  
vmstat 是一个查看虚拟内存（Virtual Memory）使用状况的工具。  
vmstat 可以展现给定时间间隔的服务器的状态值,包括服务器的CPU使用率，内存使用，虚拟内存交换情况,IO读写情况。  


** 虚拟内存运行原理**   


在系统中运行的每个进程都需要使用到内存，但不是每个进程都需要每时每刻使用系统分配的内存空间。  
当系统运行所需内存超过实际的物理内存，内核会释放某些进程所占用但未使用的部分或所有物理内存，将这部分资料存储在磁盘上直到进程下一次调用，并将释放出的内存提供给有需要的进程使用。  


在Linux内存管理中，主要是通过“调页Paging”和“交换Swapping”来完成上述的内存调度。  
调页算法是将内存中最近不常使用的页面换到磁盘上，把活动页面保留在内存中供进程使用。  
交换技术是将整个进程，而不是部分页面，全部交换到磁盘上。  


分页(Page)写入磁盘的过程被称作Page-Out，分页(Page)从磁盘重新回到内存的过程被称作Page-In。  
当内核需要一个分页时，但发现此分页不在物理内存中(因为已经被Page-Out了)，此时就发生了分页错误（Page Fault）。  


当系统内核发现可运行内存变少时，就会通过Page-Out来释放一部分物理内存。  
经管Page-Out不是经常发生，但是如果Page-out频繁不断的发生，直到当内核管理分页的时间超过运行程式的时间时，系统效能会急剧下降。  
这时的系统已经运行非常慢或进入暂停状态，这种状态亦被称作thrashing(颠簸)。  


** vmstat 命令使用 **  

一般 vmstat 工具的使用是通过两个数字参数来完成的.  


* delay：刷新时间间隔(单位是秒)。如果不指定，只显示一条结果。  
* count：刷新次数。如果不指定刷新次数，但指定了刷新时间间隔，这时刷新次数为无穷。   


```
tiankonguse:~ $ vmstat 2 2
procs -----------memory---------- ---swap-- -----io---- -system-- -----cpu------
 r  b   swpd  free    buff   cache    si   so    bi    bo   in   cs us sy id wa st
 0  0    0    1487748 449828 945348    0    0     0     2    0    1  3 11 86  0  1
 1  0    0    1485748 449828 945372    0    0     0     2 1040 3384  1  2 97  0  0
```

各列的含义如下  


* r     表示运行队列中进程数量，当这个值超过了CPU数目，就会出现CPU瓶颈了  
        这个也和top的负载有关系，一般负载超过了3就比较高，超过了5就高，超过了10就不正常了，服务器的状态很危险  
        top的负载类似每秒的运行队列。如果运行队列过大，表示你的CPU很繁忙，一般会造成CPU使用率很高  
* b     表示阻塞的进程(等待IO的进程数量)  
* swpd  虚拟内存已使用的大小，如果大于0，表示你的机器物理内存不足了，如果不是程序内存泄露的原因，那么你该升级内存了或者把耗内存的任务迁移到其他机器  
* free  空闲的物理内存的大小  
* buff  用作缓冲的内存大小 Linux/Unix系统是用来存储，目录里面有什么内容，权限等的缓存  
* cache 用作缓存的内存大小 cache直接用来记忆我们打开的文件,给文件做缓冲  
* si    每秒从磁盘读入虚拟内存的大小，如果这个值大于0，表示物理内存不够用或者内存泄露了，要查找耗内存进程解决掉  
* so    每秒虚拟内存写入磁盘的大小，如果这个值大于0，同上  
* bi    块设备每秒接收的块数量，这里的块设备是指系统上所有的磁盘和其他块设备，默认块大小是1024byte  
* bo    块设备每秒发送的块数量  
* in    每秒CPU的中断次数，包括时间中断  
* cs    每秒上下文切换次数    
        例如我们调用系统函数，就要进行上下文切换，线程的切换，也要进程上下文切换，这个值要越小越好，太大了，要考虑调低线程或者进程的数目    
        例如在apache和nginx这种web服务器中，我们一般做性能测试时会进行几千并发甚至几万并发的测试，选择web服务器的进程可以由进程或者线程的峰值一直下调，压测，直到cs到一个比较小的值，这个进程和线程数就是比较合适的值了。    
        系统调用也是，每次调用系统函数，我们的代码就会进入内核空间，导致上下文切换，这个是很耗资源，也要尽量避免频繁调用系统函数。    
        上下文切换次数过多表示你的CPU大部分浪费在上下文切换，导致CPU干正经事的时间少了，CPU没有充分利用，是不可取的。    
* us    用户CPU时间。
* sy    系统CPU时间，如果太高，表示系统调用时间长，例如是IO操作频繁。
* id    空闲 CPU时间，一般来说，id + us + sy = 100, id是空闲CPU使用率，us是用户CPU使用率，sy是系统CPU使用率。
* wt    等待IO CPU时间。



<span class="red">也有人说 si 和 so 是交换区与内存的传送数据，而不是磁盘与内存传送数据。 </span>  



### iostat


Linux系统中的 iostat是I/O statistics（输入/输出统计）的缩写，iostat工具将对系统的磁盘操作活动进行监视。  
它的特点是汇报磁盘活动统计情况，同时也会汇报出CPU使用情况。  
同vmstat一样，iostat也有一个弱点，就是它不能对某个进程进行深入分析，仅对系统的整体情况进行分析。  


** 用途 **  

通过iostat方便查看CPU、网卡、tty设备、磁盘、CD-ROM 等等设备的活动情况,	负载信息。  


** 参数含义 **  

* interval 刷新间隔  
* count 刷新次数  
* -C 显示CPU使用情况  
* -d 显示磁盘使用情况  
* -k 以 KB 为单位显示  
* -m 以 M 为单位显示  
* -N 显示磁盘阵列(LVM) 信息  
* -n 显示NFS 使用情况  
* -p[磁盘] 显示磁盘和分区的情况  
* -t 显示终端和CPU的信息  
* -x 显示详细信息  
* -V 显示版本信息  


```
tiankonguse:~ $ iostat      
Linux 2.6.18-128.el5 (tiankonguse) 	01/04/15 	_i686_

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           2.67    0.02   10.54    0.02    0.74   86.04

Device:            tps   Blk_read/s   Blk_wrtn/s   Blk_read   Blk_wrtn
xvda              5.91         1.33        90.37    5977617  406137792
xvda1             0.75         0.70        10.18    3158228   45768376
xvda2             0.00         0.00         0.00        766          0
xvda3             5.16         0.63        80.19    2818399  360369416
xvdb              3.60         2.01       119.58    9046878  537397888
xvdb1             3.60         2.01       119.58    9046550  537397888
```

** avg-cpu 字段含义 **  

* %user：CPU处在用户模式下的时间百分比。  
* %nice：CPU处在带NICE值的用户模式下的时间百分比。  
* %system：CPU处在系统模式下的时间百分比。  
* %iowait：CPU等待输入输出完成时间的百分比。  
* %steal：管理程序维护另一个虚拟处理器时，虚拟CPU的无意识等待时间百分比。  
* %idle：CPU空闲时间百分比。  

> 如果%iowait的值过高，表示硬盘存在I/O瓶颈，%idle值高，表示CPU较空闲，如果%idle值高但系统响应慢时，有可能是CPU等待分配内存，此时应加大内存容量。  
> %idle值如果持续低于10，那么系统的CPU处理能力相对较低，表明系统中最需要解决的资源是CPU。  


** Device 字段含义 **  

* tps 该设备每秒的传输次数
* Blk_read/s 每秒从设备（drive expressed）读取的数据量
* Blk_wrtn/s 每秒向设备（drive expressed）写入的数据量
* Blk_read 读取的总数据量
* kB_wrtn 写入的总数量数据量



* rrqm/s:  每秒进行 merge 的读操作数目。即 rmerge/s  
* wrqm/s:  每秒进行 merge 的写操作数目。即 wmerge/s  
* r/s:  每秒完成的读 I/O 设备次数。即 rio/s  
* w/s:  每秒完成的写 I/O 设备次数。即 wio/s  
* rsec/s:  每秒读扇区数。即 rsect/s  
* wsec/s:  每秒写扇区数。即 wsect/s  
* rkB/s:  每秒读K字节数。是 rsect/s 的一半，因为每扇区大小为512字节。  
* wkB/s:  每秒写K字节数。是 wsect/s 的一半。  
* avgrq-sz:  平均每次设备I/O操作的数据大小 (扇区)。  
* avgqu-sz:  平均I/O队列长度。  
* await:  平均每次设备I/O操作的等待时间 (毫秒)。  
* svctm: 平均每次设备I/O操作的服务时间 (毫秒)。  
* %util:  一秒中有百分之多少的时间用于 I/O 操作，即被io消耗的cpu百分比  


> 如果 %util 接近 100%，说明产生的I/O请求太多，I/O系统已经满负荷，该磁盘可能存在瓶颈。  
> 如果 svctm 比较接近 await，说明 I/O 几乎没有等待时间  
> 如果 await 远大于 svctm，说明I/O 队列太长，io响应太慢，则需要进行必要优化。  
> 如果avgqu-sz比较大，也表示有当量io在等待。  



> LISTEN和LISTENING的状态只有用-a或者-l才能看到  



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
* readelf  -d libunionapi.a | grep TEXTREL 判断库是否是可以重定向的, 搜到了就是没有PIC的



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

print the strings of printable characters in files.  
打印出文件中可以打印的字符串.  

默认打印条件:  

* at least 4 characters long(最少四个字符)  `-min-len`,`-n min-len`,`--bytes=min-len`指定长度  
* the initialized and loaded sections of object files(object文件只输出initialized段和loaded段) `-a`,`--all`,`-`扫描所有段  
* 


一般获取二进制文件里面的字符串常量.  
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


### gdb


** 断点 **  

```
# 设置断点
break [行号]
break [函数名]
break [行号] if [条件]


# 删除断点
delete [行号]
```


** 运行 **  

```
# 开始运行程序
r [程序的输入参数（如果有的话）]


# 从当前断点继续运行程序
continue
```

** 变量 **  

```
watch [变量]

# 这条语句会显示所有的局部变量以及它们的值
info locals


# 显示特定变量的值
p [变量]


# 显示变量的类型
ptype [变量]


# 覆盖变量的值。
# 注意：你不能创建一个新的变量或改变变量的类型
set var [变量] = [新的值]
```

** 回溯功能 **  

```
回溯功能（backtrace）可以让我们知道程序如何到达这条语句的。
```


** 单步调试 **  

```
# 单步调试：运行到下一条语句，有可能进入到一个函数里面。
step

# 直接运行下一条语句，而不进入子函数内部。
next
```


** 退出GDB **  


```
# 退出GDB
quit
```

> gdb中，大多数的命令单词都可以简写为一个字母。    


## 软件命令

### 录制视频

kazam, recordmydesktop, xvidcap


### 视频转换

```
mencoder record.ogv -nosound -ovc lavc -lavcopts vcodec=mpeg4 -o record.mp4
```

### mplayer

可以播放视频, 也可以将视频转为图片

```
mplayer -ao null tabs.mp4 -vo jpeg:outdir=./tabs  
```


### convert

这个命令功能很多.  

### 静态图片转gif图片


```
# -delay n     迟延n*10毫秒
# -loop  n     播放n轮, 0表示不断地重复播放
# -pause n  停止
# -resize  xx% 或 xxx * yyy 缩放 
```

### 通信

* ftp 文件传输协议
* login 登陆命令 
* rsync 同步文件 
* scp 传输文件
* sftp 安全传输文件 
* ssh 执行远程机器的命令

### 比较

* cmp 按字节比较两个文件  
* comm 比较两个排序的文件
* diff 按行比较两个文件
* diff3 比较三个文件
* sdiff 比较合并两个文件


### 文件管理

* cat Concatenate files or display them.
* chattr Change attributes on an ext2 file
* chgrp Change group of files.
* chmod Change access modes on files.
* chown Change ownership of files.
* chsh Change login shell.
* cp Copy files.
* csplit Split a file into pieces with a specific size or at specific locations.
* dd Copy files in raw disk form.
* file Determine a file’s type.
* head Show the first few lines of a file.
* hexdump Display files in hexadecimal format.
* less Display files by screenful, forward and backward.
* ln Create filename aliases.
* ls List files and directories.
* md5sum Compute MD5 checksum.
* merge Merge changes from different files.
* mkdir Create a directory.
* more Display files by screenful, forward only.
* mv Move or rename files or directories.
* newgrp Change current group.
* od Display files in octal format.
* pwd Print working directory.
* rm Remove files.
* rmdir Remove directories.
* sha1sum Compute SHA1 checksum
* shred Securely delete files.
* split Split files evenly.
* tac Print lines of a file in reverse order
* tail Show the last few lines of a file.
* tailf Follow the growth of a logfile.
* touch Update file timestamps and create the file if it doesn’t exist.
* wc Count lines, words, and characters.


### 媒体

* cdparanoia Rip a CD while providing extra features.
* cdrdao Copy a CD.
* eject Eject a removable disk or tape.
* genisoimage Generate a binary image from a directory tree.
* icedax Rip a CD or DVD to create a computer-friendly WAV format.
* readom Read or write a data CD or DVD.
* volname Provide the volume name of a CD-ROM.
* wodim Record to a CD or DVD

### 打印

* lpq Show status of print jobs.
* lpr Send to the printer.
* lprm Remove print job.
* lpstat Get printer status.
* pr Format and paginate for printing.
* accept Tell printer daemon to accept jobs.
* lpadmin Configure printer and class queues.
* lpinfo Show available printers and drivers.
* lpmove Move a print job to a different queue.
* reject Tell printer daemon to reject jobs.
* tunelp Tune the printer parameters.



### 编程命令

* ar Create and update library files.
* as Generate object file.
* bison Generate parsing tables.
* cpp Preprocess C code.
* flex Lexical analyzer.
* g++ GNU C++ compiler.
* gcc GNU C compiler.
* ld Link editor.
* ldd Print shared library dependencies.
* m4 Macro processor.
* make Create programs.
* ranlib Regenerate archive symbol table.
* rpcgen Translate RPC to C code.
* yacc Generate parsing tables


### 维护与定位

* ctags Generate symbol list for use with thevi editor.
* etags Generate symbol list for use with the Emacs editor.
* gdb GNU debugger.
* git Scalable, distributed revision control system.
* gprof Display object file’s profile data.
* make Maintain, update, and regenerate related programs and files.
* nm Display object file’s symbol table.
* objcopy Copy and translate object files.
* objdump Display information about object files.
* patch Apply patches to source code.
* pmap Print the memory map of a process.
* size Print the size of an object file in bytes.
* strace Trace system calls and signals.
* strip Strip symbols from an object file.
* svn Subversion revision control system
* badblocks Search for bad blocks.
* chroot Change root directory.

### 搜索

* apropos Search manpages for topic.
* egrep Extended version of grep.
* fgrep Search files for literal words.
* find Search the system for files by name and take a range of possible actions.
* grep Search files for text patterns.
* locate Search a preexisting database to show where files are on the system.
* look Search file for string at the beginning of lines.
* updatedb Update thelocate database.
* whereis Find command.
* which Print pathname of a command


### shell

* basename Remove leading directory components from a path.
* echo Repeat command-line arguments on the output.
* envsubst Substitute the value of environment variables into strings.
* expr Perform arithmetic and comparisons.
* mktemp Generate temporary filename and create the file.
* printf Format and print command-line arguments.
* sleep Pause during processing.
* test Test a condition.


### 储存

* bunzip2 Expand compressed.bz2 files.
* bzip2 Compress files to free up space.
* cpio Create and unpack file archives.
* gunzip Expand compressed (.gz and.Z) files.
* gzip Compress files to free up space.
* tar Copy files to or restore files from an archive medium.
* zcat Display contents of compressed files.
* zforce Force gzip files to have.gz extension

### 系统状态

* at Execute commands later.
* atq Show jobs queued byat.
* atrm Remove job queued byat.
* crontab Automate commands.
* date Display or set date.
* df Show free disk space.
* du Show disk usage.
* env Show environment variables.
* finger Display information about users.
* free Show free and used memory.
* hostname Display the system’s hostname.
* kill Terminate a running command.
* printenv Show environment variables.
* ps Show processes.
* quota Display disk usage and limits.
* stat Display file or filesystem status.
* stty Set or display terminal settings.
* top Display tasks currently running.
* tty Display filename of the terminal connected to standard input.
* uname Display system information.
* uptime Show how long the system has been running.
* vmstat Show virtual memory statistics.
* who Show who is logged in.

### 文本处理


* col Process control characters.
* cut Select columns for display.  
  切割文本, 常用的是`-d`参数和`-f`参数.  
  `-d`参数用于指定分割符, 特殊字符可以使用引号引起来.  
  `-f`参数用于指定输出第几个字段.多个字段使用逗号分隔.可以使用区间语法.    
* emacs Work environment with powerful text-editing capabilities.
* ex Line editor underlyingvi.
* expand Convert tabs to spaces.
* fmt Produce roughly uniform line lengths.
* fold Break lines.
* gawk Process lines or records one by one.  
  处理文本神器.  
  分割文本后, 得到指定位置的文本: `sudo tcpdump  -iany -nlp | awk '{print $3}'`  
  指定分隔符: `echo "10.123.127.129.50791" | awk -F'.' '{print $5}'`  
* groff Format troff input.
* gs Display PostScript or PDF file.
* ispell Interactively check spelling.
* join Merge different columns into a database.
* paste Merge columns or switch order.
* rev Print lines in reverse.
* sed Noninteractive text editor.
* sort Sort or merge files.
* tr Translate (redefine) characters.
* unexpand Convert spaces to tabs.
* uniq Find repeated or unique lines in a file.
* vi Visual text editor.
* vim Enhanced version of vi.


### 其他

* bc Arbitrary precision calculator.
  计算字符串公式.  
  例如`echo "1+1"|bc`将输出`2`.  
* cal Display calendar.
  输出一个日历.例如  
  
```
tiankonguse::~> cal 3
                                 3                                 

       January               February                 March        
Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa
    1  2  3  4  5  6                1  2  3                1  2  3
 7  8  9 10 11 12 13    4  5  6  7  8  9 10    4  5  6  7  8  9 10
14 15 16 17 18 19 20   11 12 13 14 15 16 17   11 12 13 14 15 16 17
21 22 23 24 25 26 27   18 19 20 21 22 23 24   18 19 20 21 22 23 24
28 29 30 31            25 26 27 28            25 26 27 28 29 30 31

        April                   May                   June         
Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa
 1  2  3  4  5  6  7          1  2  3  4  5                   1  2
 8  9 10 11 12 13 14    6  7  8  9 10 11 12    3  4  5  6  7  8  9
15 16 17 18 19 20 21   13 14 15 16 17 18 19   10 11 12 13 14 15 16
22 23 24 25 26 27 28   20 21 22 23 24 25 26   17 18 19 20 21 22 23
29 30                  27 28 29 30 31         24 25 26 27 28 29 30

        July                  August                September      
Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa
 1  2  3  4  5  6  7             1  2  3  4                      1
 8  9 10 11 12 13 14    5  6  7  8  9 10 11    2  3  4  5  6  7  8
15 16 17 18 19 20 21   12 13 14 15 16 17 18    9 10 11 12 13 14 15
22 23 24 25 26 27 28   19 20 21 22 23 24 25   16 17 18 19 20 21 22
29 30 31               26 27 28 29 30 31      23 24 25 26 27 28 29
                                              30
       October               November               December       
Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa
    1  2  3  4  5  6                1  2  3                      1
 7  8  9 10 11 12 13    4  5  6  7  8  9 10    2  3  4  5  6  7  8
14 15 16 17 18 19 20   11 12 13 14 15 16 17    9 10 11 12 13 14 15
21 22 23 24 25 26 27   18 19 20 21 22 23 24   16 17 18 19 20 21 22
28 29 30 31            25 26 27 28 29 30      23 24 25 26 27 28 29
                                              30 31
```

* clear Clear the screen.
* info Get command information from the GNU hypertext reader.
* man Get information on a command.
* nice Reduce a job’s priority.
* nohup Launch a command that will continue to run after logging out.
* openvt Run a program on the next available virtual terminal.
* passwd Set your login password.
* script Produce a transcript of your login session.
* su Become a different user, often the superuser.
* sudo Execute an authorized command as root or another user.
* tee Simultaneously store output in file and send to screen.
* time Time the execution of a command.
* wall Send a message to all terminals.
* whoami Print the current user id.
* xargs Process many arguments in manageable portions.
* hwclock Manage hardware clock.
* rdate Get time from network time server.
* anacron Schedule commands for periodic execution.
* atrun Schedule commands for later execution.
* cron Schedule commands for specific times.
* dmesg Print bootup messages after the system is up.
  dmesg 会记录一些系统异常的关键信息.  
  有时候程序core了或者异常了, 都可以从这里面找到信息.  
  比如下面的错误信息, 我们往往需要知道发生的真实时间, 由于dmesg记录的是开机到现在是时间,所以我们需要简单的计算一下.  
  
```
tiankonguse:~> dmesg  | tail  -1
[24419533.393616] Out of memory: kill process 669 (searchd) score 13488918 or a child
tiankonguse:~> date -d "1970-01-01 UTC `echo "$(date +%s)-$(cat /proc/uptime|cut -f 1 -d' ')+24419533.393616"|bc ` seconds"
Sat Mar 12 08:30:40 CST 2016
```

* ldconfig Update library links and do caching.
* logger Send messages to the system logger.
* logrotate Compress and rotate system logs.
* run-parts Run all scripts in a directory.


### 守护进程

* apmd Advanced Power Management daemon.
* atd Queue commands for later execution.
* bootpd Internet Boot Protocol daemon.
* cupsd Printer daemon.
* ftpd File Transfer Protocol daemon.
* imapd IMAP mailbox server daemon.
* klogd Manage syslogd.
* mountd NFS mount request server.
* named Internet domain nameserver.
* nfsd NFS daemon.
* pppd Maintain Point-to-Point Protocol (PPP) network connections.
* rdistd Remote file distribution server.
* rexecd Remote execution server.
* rlogind rlogin server.
* routed Routing daemon.
* rpc.rusersd Remote users server.
* rpc.statd NFS status daemon.
* rshd Remote shell server.
* rsyslogd Alternate system logging daemon.
* rwhod Remote who server.
* sshd Secure shell daemon.
* syslogd System logging daemon.
* xinetd Extended Internet services daemon. Starts other services as needed.
* ypbind NIS binder process.
* yppasswdd NIS password modification server.
* ypserv NIS server process.


### 硬件

* agetty Start user session at terminal.
* arp Manage the ARP cache.
* fdisk Maintain disk partitions.
* hdparm Get and set hard drive parameters.
* kbdrate Manage the keyboard’s repeat rate.
* ramsize Print information about RAM disk.
* setkeycodes Change keyboard scancode-to-keycode mappings.
* slattach Attach serial lines as network interfaces.


### host

* arch Print machine architecture.
* dig Query Internet domain nameservers.
* domainname Print NIS domain name.
* free Print memory usage.
* host Print host and zone information.
* hostname Print or set hostname.
* uname Print host information.


### install

* cpio Copy files to and from archives.
* install Copy files into locations providing user access and set permissions.
* rdist Distribute files to remote systems.
* tar Copy files to or restore files from an archive medium.

### Mail

* formail Convert input to mail format.
* mailq Print a summary of the mail queue.
* makemap Update sendmail’s database maps.
* newaliases Rebuild sendmail’s alias database.
* rmail Handle uucp mail.
* sendmail Send and receive mail.

### 文件系统 

* debugfs Debug ext2 filesystem.
* dosfsck Check and repair a DOS or VFAT filesystem.
* dump Back up data from a filesystem.
* dumpe2fs Print information about superblock and blocks group.
* e2fsck Check and repair an ext2 filesystem.
* e2image Store disaster-recovery data for an ext2 filesystem.
* e2label Label an ext2 filesystem.
* edquota Edit filesystem quotas with vim.
* fdformat Format floppy disk.
* fsck Another name for e2fsck.
* fsck.ext2 Check and repair an ext2 filesystem.
* mke2fs Make a new ext2 filesystem.
* mkfs Make a new filesystem.
* mkfs.ext2 Another name for mke2fs.
* mkfs.ext3 Yet another name for mke2fs.
* mklost+found Make lost+found directory.
* mkraid Set up a RAID device.
* mkswap Designate swapspace.
* mount Mount a filesystem
* quotacheck Audit stored quota information.
* quotaon Enforce quotas.
* quotaoff Do not enforce quotas.
* quotastats Display kernel quota statistics.
* rdev Describe or change values for root filesystem.
* repquota Display quota summary.
* resize2fs Enlarge or shrink an ext2 filesystem.
* restore Restore data from a dump to a filesystem.
* rootflags List or set flags to use in mounting root filesystem.
* setquota Edit filesystem quotas.
* showmount List exported directories on a remote host.
* swapoff Cease using device for swapping.
* swapon Begin using device for swapping.
* sync Write filesystem buffers to disk.
* tune2fs Manage an ext2 filesystem.
* umount Unmount a filesystem.
* warnquota Mail disk usage warnings to users.

### 内核

* depmod Create module dependency listing.
* lsmod List kernel modules.
* modinfo Print kernel module information.
* modprobe Load and remove a module and its dependent modules.
* sysctl Examine or modify kernel parameters at runtime.
* chkconfig Manage which services run in a runlevel.
* ctrlaltdel Shut down and then soft reboot system.
* halt Stop or shut down system.
* initctl Manage the Upstart init daemon.
* reboot Shut down and then hard reboot system.
* runlevel Print system runlevel.
* shutdown Shut down system.
* telinit Change the current runlevel.
* uptime Display uptimes of local machines.

### 网络 

* ifconfig Manage network interfaces.
* iptables Administer firewall facilities (2.4 kernel).
* named Translate between domain names and IP addresses.
* nameif Assign names to network devices.
* netstat Print network status.


如果我们的计算机有时候接收到的数据报会导致出错数据删除或故障，我们不必感到奇怪， TCP/IP可以容许这些类型的错误，并能够自动重发数据报。  

但如果累计的出错情况数目占到所接收的IP数据报相当大的百分比，或者它的数目正迅速增加，那么我们就应该使用Netstat查一查为什么会出现这些情况了。

> 当然后人说 netstat 已经被ss命令和ip命令所取代.  

**用途**  

netstat 命令用于显示各种网络相关信息，如网络连接，路由表，接口状态 (Interface Statistics)，masquerade 连接，多播成员 (Multicast Memberships) 等等。  


**参数说明**  

* -a (all)显示所有选项，默认不显示LISTEN相关  
* -t (tcp)仅显示tcp相关选项  
* -u (udp)仅显示udp相关选项  
* -n 拒绝显示别名，能显示数字的全部转化成数字。  
* -l 仅列出有在 Listen (监听) 的服務状态  
* -p 显示建立相关链接的程序名  
* -r 显示路由信息，路由表  
* -e 显示扩展信息，例如uid等  
* -s 按各个协议进行统计  
* -c 每隔一个固定时间，执行该netstat命令  


**实用命令实例**

* 列出所有端口 `netstat -a`
* 列出所有 tcp 端口 `netstat -at`
* 列出所有 udp 端口 `netstat -au`
* 只显示监听端口 `netstat -l`
* 只列出所有监听 tcp 端口 `netstat -lt`
* 只列出所有监听 udp 端口 `netstat -lu`
* 只列出所有监听 UNIX 端口 `netstat -lx`
* 显示所有端口的统计信息 `netstat -s`
* 显示 TCP 或 UDP 端口的统计信息 `netstat -st 或 -su`
* 显示核心路由信息 `netstat -r`
* 找出程序运行的端口 `netstat -ap | grep 程序名`
* TCP各种状态列表 `netstat -nat |awk '{print $6}'|sort|uniq -c'`


**demo**  

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

* lsof

有时候我们只有服务端的ip和端口, 这时候需要找到哪个客户端在使用我们的服务.  
tcpdump可以很快找到客户端ip和端口, 但是这个端口是变化的, 该怎么找呢?  
lsof就这个命令就可以帮助我们快速找到.  

客户端一般会主动端口链接, 这个链接信息在客户端依旧保存一段时间, 这个时候我们通过grep端口或者服务端ip就可以找到进程名.  

```
user_00@V_172_27_32_89_tlinux:~> lsof | grep 33392
dataloade 30652    user_00   38u     IPv4         2337110260                   TCP 172.27.32.89:33392->10.185.16.50:8561 (ESTABLISHED)

user_00@V_172_27_32_89_tlinux:~> lsof | grep 10.185.16.50
dataloade 30652    user_00   38u     IPv4         2337110260                   TCP 
```

* nfsstat Print statistics for NFS and RPC.
* nsupdate Submit dynamic DNS update requests.
* portmap Map daemons to ports (renamed rpcbind).
* rarp Manage RARP table.
* rndc Send commands to a BIND nameserver.
* route Manage routing tables.
* routed Dynamically keep routing tables up to date.
* rpcbind Map daemons to ports (replaces portmap).
* rpcinfo Report RPC information.
* traceroute Trace network route to remote host.
* arp Manipulate address resolution protocol tables.
* dig Query domain nameservers.
* ftpd Server for file transfers.
* host Print host and zone information.
* ip Network configuration tool with Cisco IOS-like syntax. Replaces ifconfig, route, and arp on some systems.
* ifconfig Configure network interface parameters.
* ping Check that a remote host is online and responding.
* pppd Create PPP serial connection.
* quagga Routing daemon.
* rdate Notify time server that date has changed.
* slattach Attach serial lines as network interfaces.
* sshd Server for secure shell connections.
* telnetd Server for Telnet sessions from remote hosts.
* tftpd Server for restricted set of file transfers.
* zebra Routing daemon.


### 进程管理

* fuser Identify processes using file or filesystem.
* renice Change the priority of running processes.
* top Show most CPU-intensive processes.
* vmstat Print virtual-memory statistics and process statistics.


### 用户 

* chpasswd Change multiple passwords.
* groupadd Add a new group.
* groupdel Delete a group.
* groupmod Modify groups.
* grpck Check the integrity of group system files.
* grpconv Convert group file to shadow group file.
* lastlog Generate report of last user login times.
* newusers Add new users in a batch.
* pwck Check the integrity of password system files.
* pwconv Convert password file to shadow passwords.
* rusers Print who-style information on remote machines.
* rwall Print a message to remote users.
* useradd Add a new user.
* userdel Delete a user and that user’s home directory.
* usermod Modify a user’s information.
* w List logged-in users.
* wall Write to all users.
* whoami Show how you are currently logged in.


### NFS and NIS

* domainname Set or display name of current NIS domain.
* makedbm Rebuild NIS databases.
* rpcbind DARPA port to RPC program number mapper.
* portmap The old name for rpcbind.
* rpcinfo Report RPC information.
* ypbind Connect to NIS server.
* ypcat Print values in NIS database.
* ypinit Build new NIS databases.
* ypmatch Print value of one or more NIS keys.
* yppasswd Change user password in NIS database.
* yppasswdd Update NIS database in response to yppasswd.
* yppoll Determine version of NIS map at NIS server.
* yppush Propagate NIS map.
* ypserv NIS server daemon.
* ypset Point ypbind at a specific server.
* yptest Check NIS configuration.
* ypwhich Display name of NIS server or map master.
* ypxfr Transfer NIS database from server to local host.



## 参考资料

[How to debug a C/C++ program with GDB command-line debugger][gdb-command-line-debugger]




[pan-1915453531]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3749942154.png
[gprof-doc]: https://sourceware.org/binutils/docs-2.17/gprof/index.html
[gdb-command-line-debugger]: http://xmodulo.com/gdb-command-line-debugger.html
[pmap-command]: http://linoxide.com/linux-command/pmap-command/
[iteye]: http://wolfdream.iteye.com/blog/1543481
[map4b]: http://www.map4b.com/2011/10/23/php-md5-vs-linux-md5sum/
[jiunile]: http://blog.jiunile.com/php%E7%9A%84md5%E4%B8%8Elinux%E7%9A%84md5sum%E7%9A%84%E5%8C%BA%E5%88%AB.html
[rename-files-using-regular-expression-in-linux]: http://stackoverflow.com/questions/11809666/rename-files-using-regular-expression-in-linux
[elf-layout]: http://upload.wikimedia.org/wikipedia/commons/7/77/Elf-layout--en.svg
[elf]: http://en.wikipedia.org/wiki/Executable_and_Linkable_Format
