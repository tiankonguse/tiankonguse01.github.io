---  
layout: post  
title: rsync 原生的无密码同步方法记录
description:  前几天记录了使用rsync的基本语法， 但是那个运行时需要手动输入密码， 很不方便，现在记录一下无密码同步。 
tags:  rsync
keywords: rsync
updateData:  23:06 2015/1/16
categories: [程序人生]
---  

## 前言

之前记录了 [rsync 简单使用记录][rsync-first], 现在来记录一下实用的 东西 - 无密码同步。  

无密码同步的好处时可以把同步写到脚本里面或者 crontab 里面， 方便后来自动同步。  

当然这里的无密码并不是我们可以不使用密码就自动同步， 而是我们获得了远程服务器的信任或者我们把密码存到了文件内。  


## 正文


最简单的是使用 [expect 登录][google_rsync_expect]， 这里不介绍这个。  

当然也有人介绍 [shh][google_rsync_ssh] 这个方法， 这里也不多介绍。  

这里主要介绍使用 rsync 原生的不使用密码同步文件。  

### 基本命令

之前曾介绍过[基本][rsync-first]的使用方法。  


```
rsync -arv   src dst

# 本地到远程
rsync -arv    /data/rsync_test/   tiankonguse@192.168.10.12:/data/rsync_test/ 

# 远程到本地
rsync -arv     tiankonguse@192.168.10.12:/data/rsync_test/    /data/rsync_test/
```

由于基本的命令需要手动输入密码， 所以这里需要找到无密码的方法了。  


### 原生配置


网上都可以看到关于 rsync 的一系列使用方法， 从安装到使用， 但是网上的那些都是一些记录流程， 但是没有说为什么。  

他们都说需要使用 `--password-file` , 但是我用了不行。  


```
echo password > /etc/rsyncd.passwd
rsync -arv   --password-file=/etc/rsyncd.passwd  /data/rsync_test/   tiankonguse@192.168.10.12:/data/rsync_test/

The --password-file option may only be used when accessing an rsync daemon.
rsync error: syntax or usage error (code 1) at main.c(1238) [sender=3.0.6]
```

这里看到一个词 `rsync daemon`, [官网文档][rsyncd_conf]里了解到， 对于远程 rsync 的路径， 我们需要使用一个别名来代替， 然后别名在 rsync 的配置文件配好。  

例如  

```
echo password > /etc/rsyncd.passwd
rsync -arv   --password-file=/etc/rsyncd.passwd  /data/rsync_test/   tiankonguse@192.168.10.12:rsync_test
```


配置文件路径可以在 rsync 的后台程序启动的时候指定， 不过大家都是存在 `/etc/rsyncd.conf`, 可能默认路径就是这个吧。  

`/etc/rsyncd.conf` 内的配置大概如下


```
read only = false 
write_only = false
transfer logging = true 
log format = %t %a %m %f %b
log file = /var/log/rsync.log               
pid file = /var/run/rsyncd.pid             
hosts allow=*
secrets file = /etc/rsyncd.secrets   


[rsync_test]
path = /data/rsync_test/ 
auth users =  tiankonguse
```

`/etc/rsyncd.secrets` 是用户名和密码。  

```
cat /etc/rsyncd.secrets
tiankonguse:password
```


最后重启 rsync 即可。  


```
rsync --daemon --config=/etc/rsyncd.conf
```

### 简单解释


这里大家可能会有个疑问: 我们指定一个 rsync_test， 服务端的 rsync 怎么知道我们给他发数据或要数据了呢？  

实际上， 我们使用了 别名这种方式时， 很多信息都默认了。  

什么意思呢？  

假设 rsync 是一个网络程序， 已经绑定了自己的端口， 这样就容易解释 rsync 了。    


rsync 都绑定了自己机器上的 873 端口 ， 然后一直等待别人来通信。  

我们执行 `rsync -arv   --password-file=/etc/rsyncd.passwd  /data/rsync_test/   tiankonguse@192.168.10.12:rsync_test` 时，大概含义如下：  

本地 rsync 链接到 远程服务器 192.168.10.12:873 这个网络服务上。  

然后本地 rsync 把 别名 rsync_test 传给远程服务器。  

服务器读取到 rsync_test 的配置信息， 会想本地 rsync 要用户名和密码。  

本地 rsync 会发送用户名 `tiankonguse` 和 密码 `/etc/rsyncd.passwd` 发给服务器来进行身份验证。  

服务器接受到 用户名和密码后， 读取 `/etc/rsyncd.secrets` 进行核对身份。  

验证通过， 服务器会把 本地目录 `/data/rsync_test/` 下面的数据传给远程服务器， 至于储存的位置， 在 配置文件中配置好的 `path = /data/rsync_test/ ` .  

这样我们就可以顺利的把数据同步给服务器了， 至于从服务器拉数据， 是一个道理。  


## 遇到的问题


使用过程中，肯定会遇到很多问题，这里也记录一下吧。  


### auth failed on module

```
@ERROR: auth failed on module *** 
rsync error: error starting client-server protocol (code 5) at main.c(1503) [receiver=3.0.6]
```

这个需要检查配置的的密码了。  

由于客户端和服务器段都有配置，所以都要检查。  


> 服务器密码文件 /etc/rsyncd.secrets 格式为： username:password
> 客服端密码文件 password.rsync 格式为：password


### password file must not be other-accessible


```
password file must not be other-accessible 
continuing without password file 
```

一般密码是不能明文的，我们既然明文了， 就需要一般用户不能查看到。  

所以需要给密码文件很高很高的权限， 比如 600 权限。  

```
服务器密码文件 /etc/rsyncd.secrets 权限为600： chmod 600
客服端密码文件 password.rsync 权限为600：chmod 600
```


### failed to create pid file File exists 

```
failed to create pid file /var/run/rsyncd.pid: File exists
```


我们启动 rsync 时，一般会遇到下面的错误提示， 那是由于 rsync 后来程序已经在运行了， 所以需要我们先把它杀死。 


```
skyyuan:~ $ ps -ef | grep rsync | grep -v grep
root      9771     1  0 Jan14 ?        00:00:00 rsync --daemon --config=/etc/rsyncd.conf
kill 9771
rsync --daemon --config=/etc/rsyncd.conf
```

[rsyncd_conf]: https://rsync.samba.org/ftp/rsync/rsyncd.conf.html
[google_rsync_ssh]: https://www.google.com.hk/search?q=rsync+ssh
[google_rsync_expect]: https://www.google.com.hk/search?q=rsync+expect
[rsync-first]: http://github.tiankonguse.com/blog/2015/01/13/rsync-first/
