---  
layout: post  
title:  重返ubuntu系统
description: 新电脑买之前，我有半年的时间没有电脑，买了电脑后有三个月没安装ubuntu， 现在想想都不可思议。    
tag: ubuntu
keywords: ubuntu
updateData:  2015-03-14 18:58:13 
categories: [软件研究]
---


## 背景

我的电脑大概是[八九月份][qq804345178-5a55f12f210f0c547e1b0600]的时候，电脑就坏了，直到[一月份后期][qq804345178-5a55f12f9beecc54f9bc0e00]我才买了电脑。  
买的电脑安装的是win8系统，用到三月分，也就是几天前才安装了 ubuntu 系统。  
自此，标志的折腾正式开始了。  

当然，这篇记录只是一个流水记录，大家就当做小说来看就行了，没什么技术含量。  

这里给大家分享一个网盘吧， 适合在 linux 下使用， [dropbox][dropbox-share].  


## 安装ubuntu之前

在安装ubuntu之前，我曾想过就在windows下折腾的，但是折腾了一段时间，发现一直在做与自己想做甚远的事情 -- 安装软件，调通软件。  


### windows非安装时mysql

什么是非安装时mysql呢？  
简单的说就是下载的压缩包加压后，双击就可以使用的mysql.  


**下载mysql**  

去官网下载mysql-5.6.13-winx64.zip包。地址：[这里][mysql-downloads-5-6]


**配置**  

把安装包解压到自己指定的目录，我的解压目录为D:\mysql-5.6.13-winx64.  

进入mysql的目录， 其中my-default.ini 是默认配置文件我们可以自己新建一个my.ini。如下：  

```

[mysqld]
 
#绑定IPv4和3306端口
bind-address = 127.0.0.1
port = 3306
 
# 设置mysql的安装目录,即你解压缩安装包的位置,
basedir=D:/mysql-5.6.13-winx64
#需要注意到的是这里是斜杠"/" 而不是Windows里面的反斜杠'\"
 
# 设置mysql数据库的数据的存放目录
datadir=D:/mysql-5.6.13-winx64/data
 
# 允许最大连接数
max_connections=200
 
#设置字符集为utf8  
loose-default-character-set = utf8    
 
[client]  
#设置客户端字符集  
loose-default-character-set = utf8  
 
[WinMySQLadmin]  
Server = D:/mysql-5.6.13-winx64/bin/mysqld.exe
```


**配置环境**


windows下安装软件，主要做的事就是配置环境:系统变量和注册表。  
这里我们只需要配置一下环境变量，让系统能够找到 Mysql 即可。  


* 右击计算机  
* 属性  
* 高级系统设置  
* 环境变量
* 新建属性
* 属性名为 MYSQL_HOME
* 变量值： 自己的解压路径,如D:/mysql-5.6.13-winx64
* 在系统环境变量里编辑path 在后面添加 ;%MYSQL_HOME%\bin;
* 确定退出,关闭所有的控制台窗口


**安装myqsl服务**


开始->搜索框里->输入cmd，会看到cmd.exe -> 右击鼠标 "以管理员的身份运行"。  

输入 mysqld -install ,将mysql添加到windows的服务中.
执行成功会提示Service successfully installed.
再键入net start mysql 启动mysql服务.


>  
>  这个命令会删除mysql服务:sc delete mysql   
>  


### MySQL-python驱动


python 是一门很强大很实用的语言。  
所以我需要安装python, 而且需要连接数据库。  


要想使python可以操作mysql 就需要MySQL-python驱动，它是python 操作mysql必不可少的模块。  

下载地址: [这里][pypi-MySQL-python]  

下载MySQL-python-1.2.5.zip 文件之后直接解压。  

进入MySQL-python-1.2.5目录执行安装命令。  


```
python setup.py install
error: Microsoft Visual C++ 9.0 is required (Unable to find vcvarsall.bat). Get it from http://aka.ms/vcpython27
```

去提示的[网站][vcpython27]下载对应的软件。   

安装完 Microsoft Visual C++ 9.0 后，继续执行，提示下面错误。  

```
_mysql.c(42) : fatal error C1083: Cannot open include file: 'config-win.h': No such file or directory
```


有人说是没有编译环境的原因。    
于是指定编译环境为 mingw32  


```
setup.py install build --compiler=mingw32

building '_mysql' extension
C:\cygwin64\\bin\gcc.exe -mno-cygwin -mdll -O -Wall -Dversion_info=(1,2,5,'final
',1) -D__version__=1.2.5 -ID:\mysql-5.6.23-winx64\mysql-connector-c-6.1.5-winx64
\include -ID:\Python27\include -ID:\Python27\PC -c _mysql.c -o build\temp.win32-
2.7\Release\_mysql.o /Zl
gcc: error: /Zl: No such file or directory
gcc: error: unrecognized command line option '-mno-cygwin'
error: command 'C:\\cygwin64\\\\bin\\gcc.exe' failed with exit status 1
```

参数是vc特有的编译参数，如果使用mingw的话因为是gcc所以不支持。  
可以在setup_windows.py中去掉 `/Zl`  
  
解决方法：修改setup_windows.py  改为空的  

```
#extra_compile_args = [ '/Zl' ]
extra_compile_args = [ '' ]
```

参考资料: [这里][wklken-7253245] 和 [这里][fnng-4115607]


### 双系统


后来想着安装个双系统，于是也行动了，装了一个双系统。  

但是装完之后只能进入ubuntu, 于是按网上找的教程配置BIOS, 然后重装系统。  
这个时候我记得选的是覆盖旧的ubuntu系统，结果安装完之后，发现还是没有windows.  
然后想着算了，没有就没有吧。  
但是我安装系统时只给这个系统分配了50G的硬盘，于是想着电影资料什么的放在其他分区上。  
但是我发现windows分区没有挂载，于是想着手动挂载。但是一查，根本没有windows的那些分区。 



这个时候我意识到一个问题：安装系统是全盘安装的。  
所以不能进入windows系统了，因为根本就没有那个系统。  


简单的查看了一下，确实这这个样子。

```text
tiankonguse@tiankonguse:~$ sudo fdisk -l

WARNING: GPT (GUID Partition Table) detected on '/dev/sda'! The util fdisk doesn't support GPT. Use GNU Parted.


Disk /dev/sda: 500.1 GB, 500107862016 bytes
255 heads, 63 sectors/track, 60801 cylinders, total 976773168 sectors
Units = 扇区 of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disk identifier: 0xc34ce326

   设备 启动      起点          终点     块数   Id  系统
/dev/sda1               1   976773167   488386583+  ee  GPT
分区 1 未起始于物理扇区边界。

Disk /dev/sdb: 500.1 GB, 500107861504 bytes
255 heads, 63 sectors/track, 60801 cylinders, total 976773167 sectors
Units = 扇区 of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0xa857fc6f

   设备 启动      起点          终点     块数   Id  系统
/dev/sdb1              64   976773119   488386528    7  HPFS/NTFS/exFAT
```

但是看到上面有个 WARNING， 心里有点不爽。  
于是查了一下资料，原来这个命令比较古老了，推荐使用 parted 命令了。  


>  
>  some unix partitioner, are deperecated and GPT partition table is new and some tools doesn't work GPT.   
>  GNU parted is new and gparted is GNOME Parted  
>  
  

使用 parted 再试试， 果然只有一个分区了。  


```text
tiankonguse@tiankonguse:~$ sudo parted -l

Model: ATA ST500LT012-1DG14 (scsi)
磁盘 /dev/sda: 500GB
Sector size (logical/physical): 512B/4096B
分区表：gpt

数字  开始：  End    大小    文件系统        Name  标志
 1    1049kB  538MB  537MB   fat32                 启动
 2    538MB   496GB  495GB   ext4
 3    496GB   500GB  4214MB  linux-swap(v1)


Model: BUFFALO HD-PCU2 (scsi)
磁盘 /dev/sdb: 500GB
Sector size (logical/physical): 512B/512B
分区表：msdos

数字  开始：  End    大小   类型     文件系统  标志
 1    32.8kB  500GB  500GB  primary  ntfs
```


好吧，只有这一个系统，就用这个系统吧。  


## 安装ubuntu之后


安装ubuntu之后，第一件事是下载chrome浏览器，但是被墙了，下载不了。  
还好， ubuntu自带firefox浏览器，于是使用firefox自带的代理设置加上自己的ssh顺利翻墙，然后下载了chrome浏览器。  


### firefox代理翻墙

首先是启动自己的ssh代理  

```
ssh -D 7070 myusername@myVPSHost:myVPSPort
```

然后在firefox 中配置一下，指定使用代理上网。  

* 右上角的菜单
* 首选项
* 高级
* 网络
* 连接里面的设置
* 手动设置代理
* 在 SOCKS 主机中填上 127.0.0.1 7070
* 选择 SOCKS V5


这里的 7070 是自己连接ssh时指定的端口，这个按自己习惯设置的。  


当然，如果你没有自己的ssh的话， 可以网上搜一下免费的临时的ssh, 我这里就帮不上这个忙了。  

参考资料: [这里][freaks-firefox-ssh-tunnel] 和 [这里][calomel-firefox_ssh_proxy]  


### chrome 代理上网

chrome 代理是需要chrome插件的， 但是安装这个插件需要先翻墙的。  
这就陷入了一个死循环，必须先打破一个才能成功进行下去。  


当然，打破的肯定是先翻墙啦，比如设置整个电脑全部翻墙。  
当然，我没有这么干的， 这样做会影响我其他的东西的， 我其他窗口还在下载东西的。  


那能不能chrome这个不通过插件翻墙呢？  
当然可以的，chrome自己本身就支持这个功能。  
当然，我是通过命令行启动chrome时指定这个代理的，命令大概如下。  


```
google-chrome --proxy-server="socks5://127.0.0.1:7070"
```

然后chrome就可以翻墙了，然后安装 SwitchySharp 插件。  
当然，我实际上第一件事是登录google账号，这样我的所有配置以及插件就自动同步过来了，插件也自动安装了。  

最后一步是配置一下 SwitchySharp 插件，使用代理访问指定网站即可。  



### ubuntu安装软件

安装了ubuntu, 要做的应该就是安装一下常用软件吧。  

幸好之前我曾记录下来了，大家可以google搜索得到的。  

比如这个搜索链接: [这里][google-search]， 搜索命令如下  

```
site:tiankonguse.com ubuntu 软件
```

大概有这么一些记录。  

* [ubuntu 安装的软件记录][record-613]  
* [记录下自己 ubuntu 上的软件][record-503]
* [ubuntu 得到安装软件的名字][record-168]
* [记录 ubuntu 命令行启动软件][record-81]


当然，我把安装记录到出来给大家了。  

```
tiankonguse@tiankonguse:~$ history | grep install
    9  sudo apt-get install fcitx fcitx-googlepinyin 
   27  sudo apt-get install git
   50  sudo apt-get install vim ctags
   52  sudo apt-get install python python-mysqldb python-twisted xclip vim-gnome astyle python-setuptools
   53  sudo easy_install -ZU autopep8
   55  sudo apt-get install mysql-server mysql-workbench
   56  sudo apt-get install apache2
   57  sudo apt-get install php5 phpmyadmin
   69  sudo apt-get install openssh-server
   75  sudo apt-get install make
   76  sudo apt-get install subversion
   77  sudo apt-get install protobuf-compiler libprotobuf-dev
   78  sudo apt-get install libboost-all-dev
   79  sudo apt-get install libpoco-dev
   80  sudo apt-get install myunity
   81  sudo apt-get install conky-all
   82  sudo apt-get install shutter
   83  sudo apt-get install ibus-googlepinyin
   84  sudo apt-get install bleachbit
   85  sudo apt-get install dia
   86  sudo apt-get install synergy
   88  sudo apt-get install banshee
   89  sudo apt-get install playonlinux
   90  sudo apt-get install mplayer
   91  sudo apt-get install audacious
   92  sudo apt-get install deluge
   93  sudo apt-get install filezilla
   94  sudo apt-get install rar unrar p7zip p7zip-rar p7zip-full
  105  sudo apt-get install ntfs-config
  171  sudo apt-get install libgtk-3-0 libgtk2.0-0
  197  sudo apt-get install libgtk2.0-0:i386 libxxf86vm1:i386 libsm6:i386 libglib2.0-dev libcanberra-gtk-module:i386 gtk2-engines-murrine:i386
  199  sudo apt-get install gsetroot 
  201  sudo apt-get install anypaper
  203  sudo apt-get install eterm
  215  history | grep install > install.txt
```


### 安装QQ

我以前用的是龙井QQ的，于是这次就又试了试，结果不行了。  

```
tiankonguse@tiankonguse:~/下载/linuxqq_v1.0.2_i386$ ./QQLnk 
./qq: error while loading shared libraries: libgtk-x11-2.0.so.0: cannot open shared object file: No such file or directory

tiankonguse@tiankonguse:~/下载/linuxqq_v1.0.2_i386$ ldd qq
	linux-gate.so.1 =>  (0xf77ae000)
	libX11.so.6 => /usr/lib/i386-linux-gnu/libX11.so.6 (0xf7656000)
	libdl.so.2 => /lib/i386-linux-gnu/libdl.so.2 (0xf7651000)
	libc.so.6 => /lib/i386-linux-gnu/libc.so.6 (0xf74a2000)
	libgtk-x11-2.0.so.0 => not found
	libgdk-x11-2.0.so.0 => not found
	libatk-1.0.so.0 => not found
	libgio-2.0.so.0 => /usr/lib/i386-linux-gnu/libgio-2.0.so.0 (0xf7321000)
	libpangoft2-1.0.so.0 => not found
	libgdk_pixbuf-2.0.so.0 => not found
	libpangocairo-1.0.so.0 => not found
	libcairo.so.2 => not found
	libpango-1.0.so.0 => not found
	libfreetype.so.6 => /usr/lib/i386-linux-gnu/libfreetype.so.6 (0xf727f000)
	libfontconfig.so.1 => /usr/lib/i386-linux-gnu/libfontconfig.so.1 (0xf7244000)
	libgobject-2.0.so.0 => /usr/lib/i386-linux-gnu/libgobject-2.0.so.0 (0xf71f2000)
	libgmodule-2.0.so.0 => /usr/lib/i386-linux-gnu/libgmodule-2.0.so.0 (0xf71ed000)
	libgthread-2.0.so.0 => /usr/lib/i386-linux-gnu/libgthread-2.0.so.0 (0xf71ea000)
	librt.so.1 => /lib/i386-linux-gnu/librt.so.1 (0xf71e0000)
	libglib-2.0.so.0 => /lib/i386-linux-gnu/libglib-2.0.so.0 (0xf70d4000)
	libstdc++.so.6 => /usr/lib/i386-linux-gnu/libstdc++.so.6 (0xf6feb000)
	libm.so.6 => /lib/i386-linux-gnu/libm.so.6 (0xf6fa5000)
	libgcc_s.so.1 => /lib/i386-linux-gnu/libgcc_s.so.1 (0xf6f88000)
	libpthread.so.0 => /lib/i386-linux-gnu/libpthread.so.0 (0xf6f6b000)
	libxcb.so.1 => /usr/lib/i386-linux-gnu/libxcb.so.1 (0xf6f49000)
	/lib/ld-linux.so.2 (0xf77af000)
	libz.so.1 => /lib/i386-linux-gnu/libz.so.1 (0xf6f2f000)
	libselinux.so.1 => /lib/i386-linux-gnu/libselinux.so.1 (0xf6f0c000)
	libresolv.so.2 => /lib/i386-linux-gnu/libresolv.so.2 (0xf6ef4000)
	libpng12.so.0 => /lib/i386-linux-gnu/libpng12.so.0 (0xf6ecb000)
	libexpat.so.1 => /lib/i386-linux-gnu/libexpat.so.1 (0xf6ea2000)
	libffi.so.6 => /usr/lib/i386-linux-gnu/libffi.so.6 (0xf6e9b000)
	libpcre.so.3 => /lib/i386-linux-gnu/libpcre.so.3 (0xf6e5d000)
	libXau.so.6 => /usr/lib/i386-linux-gnu/libXau.so.6 (0xf6e59000)
	libXdmcp.so.6 => /usr/lib/i386-linux-gnu/libXdmcp.so.6 (0xf6e51000)


```

尝试安装，结果提示已经安装了， 再[论坛][ubuntu-13-10-64-bit-machinarium-error-while-loading-shared-libraries-libgtk-x1]上找到需要安装i386版本的。  

```
tiankonguse@tiankonguse:~/下载/linuxqq_v1.0.2_i386$ sudo apt-get install libgtk2.0-0
升级了 0 个软件包，新安装了 0 个软件包，要卸载 0 个软件包，有 0 个软件包未被升级。


tiankonguse@tiankonguse:~/下载/linuxqq_v1.0.2_i386$ sudo apt-get install libgtk2.0-0:i386
升级了 0 个软件包，新安装了 15 个软件包，要卸载 0 个软件包，有 0 个软件包未被升级。

tiankonguse@tiankonguse:~/下载/linuxqq_v1.0.2_i386$ ldd qq
	linux-gate.so.1 =>  (0xf7702000)
	libX11.so.6 => /usr/lib/i386-linux-gnu/libX11.so.6 (0xf75aa000)
	libdl.so.2 => /lib/i386-linux-gnu/libdl.so.2 (0xf75a5000)
	libc.so.6 => /lib/i386-linux-gnu/libc.so.6 (0xf73f6000)
	libgtk-x11-2.0.so.0 => /usr/lib/i386-linux-gnu/libgtk-x11-2.0.so.0 (0xf6f87000)
	libgdk-x11-2.0.so.0 => /usr/lib/i386-linux-gnu/libgdk-x11-2.0.so.0 (0xf6ed8000)
	libatk-1.0.so.0 => /usr/lib/i386-linux-gnu/libatk-1.0.so.0 (0xf6eb7000)
	libgio-2.0.so.0 => /usr/lib/i386-linux-gnu/libgio-2.0.so.0 (0xf6d36000)
	libpangoft2-1.0.so.0 => /usr/lib/i386-linux-gnu/libpangoft2-1.0.so.0 (0xf6d1f000)
	libgdk_pixbuf-2.0.so.0 => /usr/lib/i386-linux-gnu/libgdk_pixbuf-2.0.so.0 (0xf6cfc000)
	libpangocairo-1.0.so.0 => /usr/lib/i386-linux-gnu/libpangocairo-1.0.so.0 (0xf6cef000)
	libcairo.so.2 => /usr/lib/i386-linux-gnu/libcairo.so.2 (0xf6bcc000)
	libpango-1.0.so.0 => /usr/lib/i386-linux-gnu/libpango-1.0.so.0 (0xf6b7f000)
	libfreetype.so.6 => /usr/lib/i386-linux-gnu/libfreetype.so.6 (0xf6ade000)
	libfontconfig.so.1 => /usr/lib/i386-linux-gnu/libfontconfig.so.1 (0xf6aa3000)
	libgobject-2.0.so.0 => /usr/lib/i386-linux-gnu/libgobject-2.0.so.0 (0xf6a51000)
	libgmodule-2.0.so.0 => /usr/lib/i386-linux-gnu/libgmodule-2.0.so.0 (0xf6a4c000)
	libgthread-2.0.so.0 => /usr/lib/i386-linux-gnu/libgthread-2.0.so.0 (0xf6a49000)
	librt.so.1 => /lib/i386-linux-gnu/librt.so.1 (0xf6a3f000)
	libglib-2.0.so.0 => /lib/i386-linux-gnu/libglib-2.0.so.0 (0xf6933000)
	libstdc++.so.6 => /usr/lib/i386-linux-gnu/libstdc++.so.6 (0xf684a000)
	libm.so.6 => /lib/i386-linux-gnu/libm.so.6 (0xf6804000)
	libgcc_s.so.1 => /lib/i386-linux-gnu/libgcc_s.so.1 (0xf67e7000)
	libpthread.so.0 => /lib/i386-linux-gnu/libpthread.so.0 (0xf67ca000)
	libxcb.so.1 => /usr/lib/i386-linux-gnu/libxcb.so.1 (0xf67a8000)
	/lib/ld-linux.so.2 (0xf7703000)
	libXfixes.so.3 => /usr/lib/i386-linux-gnu/libXfixes.so.3 (0xf67a2000)
	libXrender.so.1 => /usr/lib/i386-linux-gnu/libXrender.so.1 (0xf6797000)
	libXinerama.so.1 => /usr/lib/i386-linux-gnu/libXinerama.so.1 (0xf6793000)
	libXi.so.6 => /usr/lib/i386-linux-gnu/libXi.so.6 (0xf6781000)
	libXrandr.so.2 => /usr/lib/i386-linux-gnu/libXrandr.so.2 (0xf6776000)
	libXcursor.so.1 => /usr/lib/i386-linux-gnu/libXcursor.so.1 (0xf676b000)
	libXcomposite.so.1 => /usr/lib/i386-linux-gnu/libXcomposite.so.1 (0xf6767000)
	libXdamage.so.1 => /usr/lib/i386-linux-gnu/libXdamage.so.1 (0xf6763000)
	libXext.so.6 => /usr/lib/i386-linux-gnu/libXext.so.6 (0xf674f000)
	libz.so.1 => /lib/i386-linux-gnu/libz.so.1 (0xf6735000)
	libselinux.so.1 => /lib/i386-linux-gnu/libselinux.so.1 (0xf6712000)
	libresolv.so.2 => /lib/i386-linux-gnu/libresolv.so.2 (0xf66fa000)
	libharfbuzz.so.0 => /usr/lib/i386-linux-gnu/libharfbuzz.so.0 (0xf66a4000)
	libpixman-1.so.0 => /usr/lib/i386-linux-gnu/libpixman-1.so.0 (0xf65f9000)
	libpng12.so.0 => /lib/i386-linux-gnu/libpng12.so.0 (0xf65d1000)
	libxcb-shm.so.0 => /usr/lib/i386-linux-gnu/libxcb-shm.so.0 (0xf65cd000)
	libxcb-render.so.0 => /usr/lib/i386-linux-gnu/libxcb-render.so.0 (0xf65c3000)
	libthai.so.0 => /usr/lib/i386-linux-gnu/libthai.so.0 (0xf65b9000)
	libexpat.so.1 => /lib/i386-linux-gnu/libexpat.so.1 (0xf658f000)
	libffi.so.6 => /usr/lib/i386-linux-gnu/libffi.so.6 (0xf6588000)
	libpcre.so.3 => /lib/i386-linux-gnu/libpcre.so.3 (0xf654a000)
	libXau.so.6 => /usr/lib/i386-linux-gnu/libXau.so.6 (0xf6546000)
	libXdmcp.so.6 => /usr/lib/i386-linux-gnu/libXdmcp.so.6 (0xf653f000)
	libgraphite2.so.3 => /usr/lib/i386-linux-gnu/libgraphite2.so.3 (0xf6522000)
	libdatrie.so.1 => /usr/lib/i386-linux-gnu/libdatrie.so.1 (0xf6519000)
```

然后继续运行QQ, 还是报错。  

```
tiankonguse@tiankonguse:~/下载/linuxqq_v1.0.2_i386$ ./QQLnk 
Gtk-Message: Failed to load module "overlay-scrollbar"
Gtk-Message: Failed to load module "unity-gtk-module"

((qq:7008)): Gtk-WARNING **: 无法在模块路径中找到主题引擎：“murrine”，
Gtk-Message: Failed to load module "canberra-gtk-module"

((qq:7008)): GdkPixbuf-CRITICAL **: gdk_pixbuf_add_alpha: assertion 'GDK_IS_PIXBUF (pixbuf)' failed
((qq:7008)): GLib-GObject-CRITICAL **: g_object_ref: assertion 'G_IS_OBJECT (object)' failed
((qq:7008)): GLib-GObject-CRITICAL **: g_object_unref: assertion 'G_IS_OBJECT (object)' failed
((qq:7008)): GLib-GObject-CRITICAL **: Object class GtkComboBoxEx doesn't implement property 'editing-canceled' from interface 'GtkCellEditable'
((qq:7008)): GLib-GObject-CRITICAL **: Object class GtkEntryEx doesn't implement property 'editing-canceled' from interface 'GtkCellEditable'
((qq:7008)): GLib-GObject-WARNING **: Attempt to add property GtkSettings::gtk-buttonex-images after class was initialised
((qq:7008)): GLib-GObject-WARNING **: Attempt to add property GtkSettings::gtk-entryex-password-hint-timeout after class was initialised
((qq:7008)): GLib-GObject-WARNING **: Attempt to add property GtkSettings::gtk-entryex-select-on-focus after class was initialised
UDP  failed, try TCP mode... 
```



在[论坛][ubuntu-65]上搜索到，还要安装一些东西。  

```
sudo apt-get install libgtk2.0-0:i386 libxxf86vm1:i386 libsm6:i386 libglib2.0-dev libcanberra-gtk-module:i386 gtk2-engines-murrine:i386
sudo apt-get install anypaper gsetroot eterm
```


终于不报错了，却提示权限不够。  


```
tiankonguse@tiankonguse:~/下载/linuxqq_v1.0.2_i386$ ./QQLnk

Gtk-Message: Failed to load module "overlay-scrollbar"
Gtk-Message: Failed to load module "unity-gtk-module"
IPC_OpenServer: bind: 权限不够
IPC_OpenClient: connect: 拒绝连接
IPC_Send: 错误的文件描述符
```


管理员权限，却又拒绝连接。  

```
tiankonguse@tiankonguse:~/下载/linuxqq_v1.0.2_i386$ sudo ./qq
[CServer]: 拒绝连接
```

想起来我这个QQ在公司设置有安全保护的，于是使用我的一个普通QQ登录，然后弹出一个提示框，说我的QQ版本太旧被淘汰了。。  

```
Dear User, your version of the software will be obsolete soon.
Please download the lastest version to avoid interruption of service.
Think you!(http://im.qq.com/qq/dlqq.shtml)
```

最后我把QQ卸载了。  

```
tiankonguse@tiankonguse:~/下载$ rm -r linuxqq_v1.0.2_i386

tiankonguse@tiankonguse:~/下载$ dpkg -l | grep qq
ii      wine-qq2013-longeneteam     2013.11.20      al   Wine 1.7.6 patched for qq2013. Contact us (www.longene.org),if the deb package does not work.

tiankonguse@tiankonguse:~/下载$ sudo dpkg -r wine-qq2013-longeneteam 
(正在读取数据库 ... 系统当前共安装有 246517 个文件和目录。)
正在卸载 wine-qq2013-longeneteam (2013.11.20) ...
```


## 后记

好了，其实作为程序员，敲代码的时候还是少登录QQ比较好，所以我就没想这怎么安装一个QQ了。  
好了，不多说了，自己还有很多事要做呢，开始干活了。  



[dropbox-share]: https://db.tt/g3XXhSe7
[ubuntu-65]: http://forum.ubuntu.org.cn/viewtopic.php?f=65&t=388329
[ubuntu-13-10-64-bit-machinarium-error-while-loading-shared-libraries-libgtk-x1]: http://askubuntu.com/questions/356605/ubuntu-13-10-64-bit-machinarium-error-while-loading-shared-libraries-libgtk-x1
[record-81]: http://tiankonguse.com/record/record.php?id=81
[record-168]: http://tiankonguse.com/record/record.php?id=168
[record-503]: http://tiankonguse.com/record/record.php?id=503
[record-613]: http://tiankonguse.com/record/record.php?id=613
[google-search]: https://www.google.com/search?q=site%3Atiankonguse.com+ubuntu+%E8%BD%AF%E4%BB%B6
[wklken-7253245]: http://blog.csdn.net/wklken/article/details/7253245
[fnng-4115607]: http://www.cnblogs.com/fnng/p/4115607.html
[vcpython27]: http://aka.ms/vcpython27
[pypi-MySQL-python]: https://pypi.python.org/pypi/MySQL-python/
[mysql-downloads-5-6]: http://dev.mysql.com/downloads/mysql/5.6.html
[freaks-firefox-ssh-tunnel]: http://wiki.freaks-unidos.net/weblogs/azul/firefox-ssh-tunnel
[calomel-firefox_ssh_proxy]: https://calomel.org/firefox_ssh_proxy.html
[qq804345178-5a55f12f9beecc54f9bc0e00]: http://user.qzone.qq.com/804345178/mood/5a55f12f9beecc54f9bc0e00.1
[qq804345178-5a55f12f210f0c547e1b0600]: http://user.qzone.qq.com/804345178/mood/5a55f12f210f0c547e1b0600.1
