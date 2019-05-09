---
layout:     post
title:      Linux下恢复删除的文件
description: 周五发生了好几件事,有必要简单的记录一下.
keywords: linux, 恢复
tags: [linux, 恢复]
categories: [程序人生]
updateData:   16:05 2015/9/13
---

<!-- ![image](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2339100698.png) -->


## 前言的前言

最近在忙一些没有意义的东西:收集互联网数据,什么CSND账号呀, QQ群关系呀, 12306账号呀什么的.  
后果是我那 cache 的关键一篇记录迟迟没有写出来, 算了, 收集数据的事暂时不做了, 下周抽时间继续做cache的事情吧.  


## 前言

** 第一件事 **  

9月11日, 周五, 好声音又要开始了. 
 
以前我每个周五都是十二点之后才走的, 因为我负责的打点系统在好声音视频出来后, 需要确认打点是否正常.  
这个打点系统目前平均访问是每分钟200K, 峰值是每分钟450K.后续会上几个功能, 峰值应该会突破每分钟500K.  
若干天前, 由于我有优先级更高的项目, 打点这个项目交接给另一个同事了, 从此我终于可以抽一个完整的时间做自己的需求了.  
下午那位同事发布了打点相关的东西, 运维对他说今晚上很多老板都在关注好声音,需要他晚上也关注一下,结果下午吃饭的时候他就不见了.   
晚上编辑说打点有问题了...

** 第二件事 **  

下午, DBA找我说有些SQL执行了两个小时了,导致主从同步延迟很多.  

** 第三件事 **  

晚上, 一个同事要走了, 做了一个月的项目要整理一下好交接出去.  
结果删除没有用的文件时, 路径多了一个空格, 导致整个项目的代码被删除, 坑爹的是他从来没提交过SVN.  


## 奋斗到天亮

---

### 第一件事  


对于打点那个项目, 编辑说出问题那一刻, 我就知道是哪里的问题了.  
当时那位同事做那块逻辑时, 我给他交代了两个注意点: 1.注意修改时间 2.批量操作时,参考能量瓶打点的批量操作逻辑.  
我拉取SVN, 看了看相关代码, 我心里面无话可说, 我交代的注意点他都没有按我说的来做.  
不管那么多, 先修复问题再说, 然后找测试, leader, 总监, 运维一层层的审批, 最后发布, 浪费不少精力和时间.  

---  

### 第二件事  


DBA找我得时候, 我猜想是autodata出问题了, 毕竟autodata里面全是各种like, 左值, 子查询等sql语句.  
但是我稍微观察了一下, 发现sql来源竟然不是autodata, 于是赶紧查看来源ip, 再查查ip所在机器属于谁负责.  
结果发现是搜索小组负责的, 于是拉取那个组的运维, 组长等人.  
后来, 问题严重到主从同步延迟两个小时了, 于是搜索小组把相关任务停止, DBA手动杀死相关SQL, 才得到缓解.  
后来, 慢慢的恢复正常了.  

---   

### 第三件事  


那位同事误删项目时, 我以为是清除cmake的临时文件时误操作的, 结果是管理项目时误操作导致的.  
比如有个 bulid 目录, 你想删除 bulid 下的东西, 一般是进入bulid目录, 然后删除即可.  

```
kyyuan@skyyuan-PC3:test $ tree
.
├── bulid
│   └── tml
└── file

1 directory, 2 files

skyyuan@skyyuan-PC3:test $ cd bulid/

skyyuan@skyyuan-PC3:bulid $ rm -rf *

skyyuan@skyyuan-PC3:bulid $ cd ..

skyyuan@skyyuan-PC3:test $ tree
.
├── bulid
└── file

1 directory, 1 file
```


但是这位同事没有进入到相关目录, 然后通过路径来删除的.  

```
skyyuan@skyyuan-PC3:test $ touch bulid/tmp

skyyuan@skyyuan-PC3:test $ tree
.
├── bulid
│   └── tmp
└── file

1 directory, 2 files

skyyuan@skyyuan-PC3:test $ rm -rf bulid/*

skyyuan@skyyuan-PC3:test $ tree
.
├── bulid
└── file

1 directory, 1 file
```

那样虽然可以做到删除文件, 但是如果不小心在星号前面多打了一个空格, 后果不堪设想.  

```
skyyuan@skyyuan-PC3:test $ touch bulid/tmp

skyyuan@skyyuan-PC3:test $ tree
.
├── bulid
│   └── tmp
└── file

1 directory, 2 files

skyyuan@skyyuan-PC3:test $ rm -rf bulid/ *

skyyuan@skyyuan-PC3:test $ tree
.

0 directories, 0 files
```


大概这位同事在管理项目时, 就是类似的发生悲剧的.  

不过幸运的是, 这台机器有两个磁盘, 系统在小磁盘上, 数据在大磁盘上.  
这里可以把大磁盘卸载了, 来慢慢恢复数据.  

```
root@10.123.10.23:[~]: parted --list
Disk /dev/vda: 19.3GB

Number  Start   End     Size    Type     File system  标志
 1      32.3kB  9994MB  9994MB  primary  ext3         启动
 2      9994MB  12.1GB  2147MB  primary
 3      12.1GB  19.3GB  7181MB  primary


Disk /dev/vdb: 195GB

Number  Start   End    Size   Type     File system  标志
 1      32.3kB  195GB  195GB  primary  ext3
```


网上搜索linux文件恢复, 搜到的都是foremost, extundelete, scalpel, testdisk, phtorec 等相关教程.  

试了之后发现都不理想, 后来加上 ext3 这个关键字, 搜到了 ext3grep 这个工具.  

然后下载源码安装.  

```
wget https://ext3grep.googlecode.com/files/ext3grep-0.10.2.tar.gz
tar zxvf ext3grep-0.10.1.tar.gz
cd ext3grep-0.10.1
./configure
make
make install
```

然后卸载磁盘.  

```

root@10.123.10.23:[/]: df -k
文件系统	         1K-块      已用      可用 已用% 挂载点
/dev/vda1              9606084   5634124   3483988  62% /
tmpfs                  8085312       880   8084432   1% /dev/shm
/dev/vdb1            187846260  88430136  89874096  50% /data

root@10.123.10.23:[/]: fuser -k /data
root@10.123.10.23:[/]: umount /data
```


然后扫描磁盘上的所有节点.  
大概会跑几十分钟吧.  

```
root@10.123.10.23:[/]: ext3grep /dev/vdb1 --ls --inode 2
Running ext3grep version 0.10.2
WARNING: I don\'t know what EXT3_FEATURE_COMPAT_EXT_ATTR is.
WARNING: EXT3_FEATURE_INCOMPAT_RECOVER is set. This either means that your partition is still mounted, and/or the file system is in an unclean state.
Number of groups: 1456
Loading group metadata... done
Minimum / maximum journal block: 23790082 / 23823397
Loading journal descriptors... sorting... done
...
...
```

看着节点一个一个的扫描, 心里面逐渐的稳定下来.  

突然发现这样一个错误:  

```
WARNING: Failed to open file 'locate_output'. See locate.cc
ERROR: dir_inode_to_block(1589385) returned -1.
ext3grep: init_directories.cc:82: bool init_directories_action(const ext3_dir_entry_2&, const Inode&, bool, bool, bool, bool, bool, bool, Parent*, void*): Assertion .
已放弃
```


心里面一惊, 赶紧google怎么回事,
在 [google group](https://groups.google.com/forum/#!topic/ext3grep/ATeKVz3zWGY) 上发现需要加上 `--accept-all` 参数.  
加上后发现还是存在这样的问题, 有人说先把旧的文件删除, 于是删除重新来, 不报这个错误了.  


```
root@10.123.10.23:[/recovery]: ll
总用量 2808
-rw-r--r-- 1 root root  124904  9月 13 18:08 scan.log
-rw-r--r-- 1 root root 2737031  9月 13 17:27 vdb1.ext3grep.stage1

root@10.123.10.23:[/recovery]: mv vdb1.ext3grep.stage1 vdb1.ext3grep.stage1.bak01

root@10.123.10.23:[/recovery]: ll
总用量 2808
-rw-r--r-- 1 root root  124904  9月 13 18:08 scan.log
-rw-r--r-- 1 root root 2737031  9月 13 17:27 vdb1.ext3grep.stage1.bak01

root@10.123.10.23:[/recovery]: ext3grep /dev/vdb1 --accept-all --ls --inode 2  > scan.log
WARNING: Failed to open file 'locate_output'. See locate.cc

root@10.123.10.23:[/recovery]: 
```



然后一般我们是根据名字来恢复文件的, 所以我们需要先找到我们的文件.  


```
root@10.123.10.23:[/home/skyyuan/test]: ll screenshot_hash.cpp 
-rwxr--r-- 1 skyyuan users 730  9月  9 11:01 screenshot_hash.cpp

root@10.123.10.23:[/recovery]: ext3grep  /dev/vdb1 --dump-names | grep screenshot_hash.cpp
skyyuan/skyyuan/.vim/view/~=+test=+screenshot_hash.cpp=
skyyuan/test/screenshot_hash.cpp
skyyuan/test/screenshot_hash.cpp~
```


这个时候我们可以搜索可以恢复的文件路径, 然后恢复之.  

```
root@10.123.10.23:[/recovery]: ext3grep /dev/vdb1 --restore-file skyyuan/test/screenshot_hash.cpp
Running ext3grep version 0.10.2
WARNING: I don\'t know what EXT3_FEATURE_COMPAT_EXT_ATTR is.
WARNING: EXT3_FEATURE_INCOMPAT_RECOVER is set. This either means that your partition is still mounted, and/or the file system is in an unclean state.
Number of groups: 1456
Minimum / maximum journal block: 23790082 / 23823397
Loading journal descriptors... sorting... done
The oldest inode block that is still in the journal, appears to be from 13246709 = Wed Jun  3 15:38:29 1970
Journal transaction 884563 wraps around, some data blocks might have been lost of this transaction.
Number of descriptors in journal: 31536; min / max sequence numbers: 883887 / 885058
Writing output to directory RESTORED_FILES/
Loading vdb1.ext3grep.stage2.........................................................................................................................................e
Restoring skyyuan/test/screenshot_hash.cpp

root@10.123.10.23:[/recovery]: ll
总用量 16992
drwxr-xr-x 3 root root     4096  9月 13 18:23 RESTORED_FILES
-rw-r--r-- 1 root root   325248  9月 13 18:19 scan.log
-rw-r--r-- 1 root root  2737059  9月 13 18:18 vdb1.ext3grep.stage1
-rw-r--r-- 1 root root  2737031  9月 13 17:27 vdb1.ext3grep.stage1.bak01
-rw-r--r-- 1 root root 11554133  9月 13 18:19 vdb1.ext3grep.stage2

root@10.123.10.23:[/recovery]: ll RESTORED_FILES
总用量 4
drwxr-x--- 3 root root 4096  9月 13 18:23 skyyuan
root@10.123.10.23:[/recovery]: tree RESTORED_FILES/
RESTORED_FILES/
└── skyyuan
    └── test
        └── screenshot_hash.cpp

2 directories, 1 file
```


恢复完了, 我们再把磁盘挂上去.  

```
mount /dev/vdb1 /data
```


最后, 在编译程序, 运行之后发现正常, 什么也不管, 赶紧提交SVN.  


## 尾记

这个周五, 一直忙到半夜2点多才回去, 这些事故与问题实际上和我都没有关系, 但是加入进来学到不少东西.  


[ext3grep](https://github.com/tiankonguse/ext3grep/)的源码我已经在我的github上存了一份, 对源码感兴趣的可以来看看.  



