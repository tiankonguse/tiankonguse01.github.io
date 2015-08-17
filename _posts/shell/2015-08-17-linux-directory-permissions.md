---  
layout: post  
title:  linux下目录的权限问题
description: 遇到一个linux目录不可读的权限问题,查了资料,原来目录必须有可读和可执行权限才能访问.
updateData:  13:34 2015/8/17
keywords: linux,目录,权限
tags: [linux,目录,权限]
categories: [程序人生]
---  

## 背景

最近在做一个网站, 写静态文件时, 为了实时生效,我想建个软连接.  
网站使用的是user_00用户运行的, 我的个人目录在skyyuan用户下.  
于是,我就像下面的样子建了一个软连接.  

```
skyyuan:templates $ ln -s /data/skyyuan/mediaplat/media.cm.com/templates/ele_flow_prj_page  /data/release/qqlive/media.cm.com/templates/ele_flow_prj_page
skyyuan:templates $ ll ele_flow_prj_page
lrwxrwxrwx 1 user_00 users 64  7月 13 10:08 ele_flow_prj_page -> /data/skyyuan/mediaplat/media.cm.com/templates/ele_flow_prj_page/
```

但是运行网站,却发现没有生效.  
于是查找了一下原因,记录一下.  

## 问题原因

没建软连接之前网站是可以使用的,建了之后不能使用,说明问题在软链接上.  
又由于之前在其他开发机上建过软连接,所以知道肯定支持软链接的方式的.  
于是猜测是权限问题了.  

于是什么也没想,先给最高权限试试  

```
skyyuan:templates $ chmod -R 777 /data/skyyuan/mediaplat/media.cm.com/templates/ele_flow_prj_page/
skyyuan:templates $ ll /data/skyyuan/mediaplat/media.cm.com/templates/ele_flow_prj_page/
总用量 8.0K
-rwxrwxrwx 1 skyyuan users 7.4K  1月 29 2015 ele_flow_prj_page.cs*
```

结果还是不行,这个...  


于是换成 user_00 用户,去查看一下那个文件.竟然提示我没有权限!!!  

```
user_00@10.123.10.23:[templates]: ll /data/skyyuan/mediaplat/media.cm.com/templates/ele_flow_prj_page
ls: 无法访问/data/skyyuan/mediaplat/media.cm.com/templates/ele_flow_prj_page: 权限不够
```


这, 难道父目录没有读权限?  

```
user_00@10.123.10.23:[templates]: ll -d /data/skyyuan/mediaplat/media.cm.com/templates/ele_flow_prj_page
drwx------ 3 skyyuan users 4096  8月 17 11:28 /data/skyyuan/mediaplat/media.cm.com/templates/ele_flow_prj_page
```

好吧, 我的目录下的文件竟然是 `700`权限, 怪不得网站建了软连接不能使用呢.  

于是去用户目录,增加读权限.  


```
chmod -R 740 /data/skyyuan
```

竟然还是提示没有权限,然后查了[资料](http://vbird.dic.ksu.edu.tw/linux_basic/0210filepermission.php), 发现目录必须有可读可执行权限才能访问, 于是换成 `750` 权限就OK了.  



## 问题总结

上面涉及到了linux下的几个基础知识,这里回顾一下.  


** 创建链接 **  

`ln` 命令可以创建文件的软链接和硬链接.  

`-s` 参数用于创建软链接.  


** 显示文件 **  

`ls` 命令用于显示文件的信息, 比如权限.  

`-l` 参数用于显示文件的基本信息:权限,修改时间,大小等.  
`-d` 参数用于显示目录的基本信息,默认显示目录内的文件列表的信息.  


** 修改权限 **  

`chmod` 用于修改文件的权限.  

一个目录想要提供给其他用户使用, 这个目录到根目录之间的所有目录都需要有可读和可执行权限.  


