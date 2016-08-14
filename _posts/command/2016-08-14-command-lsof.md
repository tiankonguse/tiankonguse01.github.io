---  
layout: post  
title: lsof命令详解
description: lsof在linux中是一个很重要的命令，这里简单记录一下．  
updateData:  13:48 2016/8/14
categories: [linux]
---  



## 介绍

`lsof`全名`list open files`,含义为显示打开的文件列表．  
我们都是知道，在linux的世界里，所有的事物都是文件，　对事物的操作就是对文件的操作．  
比如设备是文件，目录是文件，socket是文件．我们通过lsof命令可以得到很多有用的信息．  


```
tiankonguse:~ $ lsof -i -n
COMMAND   PID        USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
ssh      3860 tiankonguse    3u  IPv4 277226      0t0  TCP 192.168.31.137:55470->52.175.36.207:ssh (ESTABLISHED)
ssh      3860 tiankonguse    4u  IPv6 277256      0t0  TCP [::1]:7070 (LISTEN)
ssh      3860 tiankonguse    5u  IPv4 277257      0t0  TCP 127.0.0.1:7070 (LISTEN)
ssh      3860 tiankonguse    9u  IPv4 392596      0t0  TCP 127.0.0.1:7070->127.0.0.1:47308 (CLOSE_WAIT)
ssh      3860 tiankonguse   10u  IPv4 425556      0t0  TCP 127.0.0.1:7070->127.0.0.1:47424 (ESTABLISHED)
ssh      3860 tiankonguse   11u  IPv4 474716      0t0  TCP 127.0.0.1:7070->127.0.0.1:47436 (ESTABLISHED)
chrome  31615 tiankonguse  102u  IPv4 474141      0t0  TCP 192.168.31.137:54857->220.181.76.72:http (CLOSE_WAIT)
chrome  31615 tiankonguse  103u  IPv4 424629      0t0  TCP 127.0.0.1:47424->127.0.0.1:7070 (ESTABLISHED)
chrome  31615 tiankonguse  104u  IPv4 432692      0t0  TCP 192.168.31.137:36335->203.208.50.175:https (ESTABLISHED)
chrome  31615 tiankonguse  106u  IPv4 476207      0t0  TCP 127.0.0.1:47436->127.0.0.1:7070 (ESTABLISHED)
chrome  31615 tiankonguse  111u  IPv4 273013      0t0  UDP *:mdns
```


## 字段介绍


`lsof`默认显示字段有`COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME`.  

含义如下:  

* `COMMAND` 程序命令,默认以9个字符长度显示的命令名称。可使用+c参数指定显示的宽度，若+c后跟的参数为零，则显示命令的全名  
* `PID` 进程id  
* `PPID` 父进程的IP号，默认不显示，当使用-R参数可打开。  
* `PGID` 进程组的ID编号，默认也不会显示，当使用-g参数时可打开。  
* `USER` 命令的执行UID或系统中登陆的用户名称。默认显示为用户名，当使用-l参数时，可显示UID。  
* `FD` 文件描述符  
* `TYPE` IPv4的包,IPv6包，DIR 目录，LINK 链接文件等  
* `DEVICE` 使用`character special`、`block special`表示的设备号  
* `SIZE/OFF` 文件的大小，如果不能用大小表示的，会留空。使用`-s`参数控制。  
* `NODE` 本地文件的node码，或者协议，如TCP等  
* `NAME` 挂载点和文件的全路径（链接会被解析为实际路径），或者连接双方的地址和端口、状态等  



## 使用  

### 查看端口

```
tiankonguse:~ $ lsof -i :80
COMMAND   PID        USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
chrome  31615 tiankonguse  102u  IPv4 537284      0t0  TCP 192.168.31.137:41976->117.79.92.146:http (CLOSE_WAIT)
chrome  31615 tiankonguse  104u  IPv4 539670      0t0  TCP 192.168.31.137:34899->151.101.16.133:http (ESTABLISHED)
chrome  31615 tiankonguse  105u  IPv4 539781      0t0  TCP 192.168.31.137:60814->93-46-8-89.ip105.fastwebnet.it:http (SYN_SENT)
chrome  31615 tiankonguse  118u  IPv4 537818      0t0  TCP 192.168.31.137:34900->151.101.16.133:http (ESTABLISHED)
chrome  31615 tiankonguse  122u  IPv4 537900      0t0  TCP 192.168.31.137:60815->93-46-8-89.ip105.fastwebnet.it:http (SYN_SENT)
chrome  31615 tiankonguse  124u  IPv4 538905      0t0  TCP 192.168.31.137:41978->117.79.92.146:http (CLOSE_WAIT)
chrome  31615 tiankonguse  128u  IPv4 538906      0t0  TCP 192.168.31.137:41979->117.79.92.146:http (CLOSE_WAIT)
chrome  31615 tiankonguse  155u  IPv4 539020      0t0  TCP 192.168.31.137:34901->151.101.16.133:http (ESTABLISHED)
chrome  31615 tiankonguse  170u  IPv4 539036      0t0  TCP 192.168.31.137:58368->220.181.7.190:http (CLOSE_WAIT)
chrome  31615 tiankonguse  174u  IPv4 539021      0t0  TCP 192.168.31.137:34902->151.101.16.133:http (ESTABLISHED)
chrome  31615 tiankonguse  183u  IPv4 539022      0t0  TCP 192.168.31.137:34903->151.101.16.133:http (ESTABLISHED)
chrome  31615 tiankonguse  184u  IPv4 539023      0t0  TCP 192.168.31.137:34904->151.101.16.133:http (ESTABLISHED)
```

### 查看进程名

```
tiankonguse:~ $ lsof -c chrome | more
lsof: WARNING: can't stat() ext4 file system /var/lib/docker/aufs
      Output information may be incomplete.
COMMAND   PID        USER   FD      TYPE             DEVICE SIZE/OFF     NODE NAME
chrome   1880 tiankonguse  cwd       DIR                0,3        0    24098 /proc/31953/fdinfo
chrome   1880 tiankonguse  rtd       DIR                0,3        0    24098 /proc/31953/fdinfo
chrome   1880 tiankonguse  txt       REG                8,2 99609936 24248328 /opt/google/chrome/chrome
chrome   1880 tiankonguse  DEL       REG               0,21             52587 /run/shm/.com.google.Chrome.SE37st
```

### 查看进程号

```
tiankonguse:~ $ lsof -p 2127
lsof: WARNING: can't stat() ext4 file system /var/lib/docker/aufs
      Output information may be incomplete.
COMMAND  PID USER   FD      TYPE DEVICE SIZE/OFF NODE NAME
apache2 2127 root  cwd   unknown                      /proc/2127/cwd (readlink: Permission denied)
apache2 2127 root  rtd   unknown                      /proc/2127/root (readlink: Permission denied)
apache2 2127 root  txt   unknown                      /proc/2127/exe (readlink: Permission denied)
apache2 2127 root NOFD                                /proc/2127/fd (opendir: Permission denied)

```

### 查看进程组

```
tiankonguse:~ $ lsof -g 2127
lsof: WARNING: can't stat() ext4 file system /var/lib/docker/aufs
      Output information may be incomplete.
COMMAND  PID PGID     USER   FD      TYPE DEVICE SIZE/OFF NODE NAME
apache2 2127 2127     root  cwd   unknown                      /proc/2127/cwd (readlink: Permission denied)
apache2 2127 2127     root  rtd   unknown                      /proc/2127/root (readlink: Permission denied)
apache2 2127 2127     root  txt   unknown                      /proc/2127/exe (readlink: Permission denied)
apache2 2127 2127     root NOFD                                /proc/2127/fd (opendir: Permission denied)
apache2 2156 2127 www-data  cwd   unknown                      /proc/2156/cwd (readlink: Permission denied)
apache2 2156 2127 www-data  rtd   unknown                      /proc/2156/root (readlink: Permission denied)
apache2 2156 2127 www-data  txt   unknown                      /proc/2156/exe (readlink: Permission denied)
...
```

### 查看目录


```
lsof +D /home/
```


### 万能的其他

grep搜索，　如找到那些被删除但是没释放的文件．  

```
lsof | grep xxx
```







