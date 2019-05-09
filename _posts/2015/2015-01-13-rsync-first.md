---  
layout: post  
title: rsync 简单使用记录
description:  工作需要使用 rsync， 简单记录一下。  
tags:  rsync
keywords: rsync
updateData:  19:37 2015/1/11
categories: [程序人生]
---  


## 前言

很早之前就听说过 rsync 这个东西， 但是一直没有使用它的场景。  

现在需要给其他人定时推送数据了， 简单学习一下怎么使用 rsync 吧。  


## 语法介绍

从 [文档][man-rsync]里可以看到 rsync 是干什么的。  


>  a fast, versatile, remote (and local) file-copying tool


一个快速的，万能的，远程或本地文件拷贝工具。  

当然，也可以看 [wiki][wiki-rsync] 上对 rsync 的介绍。  


不过，最好去[官网][rsync-samba] 看看。  


### 默认命令

假设你配置好了 rsync, 你只需要下面一个命令就可以同步数据了。  

```
rsync filename remoteIp:remotePath
```


1. 只要目的端的文件内容和源端不一样，就会触发数据同步。
2. rsync默认不会同步文件的 modify time ，即目的端的文件的 modify time 默认是同步时间。
3. 如果目的端没有此文件，那么权限会保持与源端一致；如果目的端有此文件，则权限不会随着源端变更。
4. 只要rsync有对源文件的读权限，且对目标路径有写权限，rsync就能确保目的端文件同步到和源端一致。
5. rsync只能以登陆目的端的账号来创建文件，它没有能力保持目的端文件的输主和属组和源端一致。（root权限除外）


### modify time 选项

使用 -t 参数即可将 modify time 同步过去。  

```
rsync -t filename remoteIp:remotePath
```

这个参数的弊端是：只通过修改时间的时间戳来判断文件是否修改。即目标文件和源文件的修改时间戳相同时，即使内容不同，也不会同步的。  


### 更新全部数据

-I 参数可以更新全部数据， 由于全量更新，所以更新时间可能很长。  

目标的修改时间为同步时间。


```
rsync -I filename remoteIp:remotePath
```

### 压缩传输

如果同步的数据比较大或网络不好的话， 先压缩在同步数据是比较好的选择。  

```
rsync -z filename remoteIp:remotePath
```

### 同步目录

默认是不同步目录的，当需要同步目录时，加上 -r 参数。  

```
rsync -r foldername remoteIp:remotePath
```


### 同步软链接

默认不同步软链接的， -l 参数可以启动同步软链接。  

```
rsync -l filename remoteIp:remotePath
```  


### 同步权限

上面曾介绍了权限的同步规则， 但是有时候想保持权限保持一致， 这个时候就需要 -p 参数了。  

```
rsync -p filename remoteIp:remotePath
```  


### 同步用户与组

-g 代表组， -o 代表用户。  

```
rsync -go filename remoteIp:remotePath
```  


### 全部同步

-a 参数可以用不 -rlptgoD 的功能。  

```
rsync -a filename remoteIp:remotePath
``` 


### 删除同步

有时候源文件被删除了， 那目标文件怎么处理呢？  

这里有三个命令可以使用。

1. –delete：如果源端没有此文件，那么目的端删除之。
2. –delete-excluded：专门指定一些要在目的端删除的文件。
3. –delete-after：默认情况下，rsync是先清理目的端的文件再开始数据同步；如果使用此选项，则rsync会先进行数据同步，都完成后再删除那些需要清理的文件。


### 屏蔽同步

有时候我们同步了一个目录， 但是又不想同步那个目录里的某些文件，这时候就需要屏蔽同步功能了。  


* –exclude 参数屏蔽指定的文件
* –exclude-from 屏蔽文件存在一个文件内，然后通过这个参数加载这个文件

### 断点续传

有时候由于某些原因，同步了，使用参数 –partial 断点续传将节省一些时间。  


## 常用命令


上面介绍了一些基本命令，一般人都没有耐心看下去， 这里简单的介绍一下常用的命令吧。  


### 最基本的命令

```
rsync -arv   src dst

# 本地到远程
rsync -arv    /data/rsync_test/   tiankonguse@192.168.10.12:/data/rsync_test/ 

# 远程到本地
rsync -arv     tiankonguse@192.168.10.12:/data/rsync_test/    /data/rsync_test/
```


### 服务器备份脚本

```
#!/bin/sh

# This script does personal backups to a rsync backup server. You will end up
# with a 7 day rotating incremental backup. The incrementals will go
# into subdirectories named after the day of the week, and the current
# full backup goes into a directory called "current"

# directory to backup
BDIR=/home/$USER

# excludes file - this contains a wildcard pattern per line of files to exclude
EXCLUDES=$HOME/cron/excludes

# the name of the backup machine
BSERVER=owl

# your password on the backup server
export RSYNC_PASSWORD=XXXXXX


########################################################################

BACKUPDIR=`date +%A`
OPTS="--force --ignore-errors --delete-excluded --exclude-from=$EXCLUDES 
      --delete --backup --backup-dir=/$BACKUPDIR -a"

export PATH=$PATH:/bin:/usr/bin:/usr/local/bin

# the following line clears the last weeks incremental directory
[ -d $HOME/emptydir ] || mkdir $HOME/emptydir
rsync --delete -a $HOME/emptydir/ $BSERVER::$USER/$BACKUPDIR/
rmdir $HOME/emptydir

# now the actual transfer
rsync $OPTS $BDIR $BSERVER::$USER/current
```




[roclinux]: http://roclinux.cn/?p=2643
[rsync-samba]: http://rsync.samba.org/
[wiki-rsync]: http://en.wikipedia.org/wiki/Rsync
[man-rsync]: http://rsync.samba.org/ftp/rsync/rsync.html