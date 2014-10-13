---
layout:     post
title:      Linux 命令记录(持续更新中)
category: blog
description: linux下的命令学好了，走到哪里都不怕电脑死机了。
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


## 监控命令

### lsblk

文档中就一句话 `list block devices`, 列出块设备。

在 DESCRIPTION 里还可以了解到 lsblk 是从 sysfs 文件系统中得到你想要的信息。

默认情况下显示树状信息。

下面介绍一下常用的几个参数

* -b 以bytes 为单位显示块大小，默认以 human-readable 的方式显示
* -m 显示设备的拥有者，组和模式。



## 测试命令


## 优化命令
