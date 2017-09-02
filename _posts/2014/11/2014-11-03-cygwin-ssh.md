---
layout:     post
title:      cygwin ssh与乱码
description: 使用 cygwin 可以再windowws下模拟 linux,但是cygwin会中文乱码，还有ssh有问题，于是找了一下解决方法。
keywords: cygwin, ssh, 乱码, windows
tags: cygwin ssh 乱码 windows
categories: [软件研究]
---

## cygwin ssh


原先使用 cygwin 来模拟linux, 但是 cygwin 中文乱码且不能输入中文，于是尝试使用 Xshell 通过ssh链接 cygwin 来使用中文。


但是发现 sshd 服务没有启动，于是手动启动，然后报错“对 CYGWIN sshd 服务启动后停止”。

然后在[这里][cnblogs-2772643]考到一个解决方案，但是没有尝试，因为他提醒我了去看日志。

于是我去看了看日志，发现日志里提示

```
/etc/sshd_config no such file or directory
```

这个，去看看 sshd_config吗发现确实不存在，但是手动创建的时候有提示已存在。

好吧，没权限看见。

最后再 cygwin 的[邮件列表][cygwin-mail]中找到了答案


```
#重新执行ssh-host-config
skyyuan@skyyuan-PC3:~ $ ssh-host-config

#然后启动 ssh即可。
skyyuan@skyyuan-PC3:~ $ cygrunsrv  --start sshd

```

## cygwin 显示中文

[参考资料][starstroll-1376624]

修改 ~/.inputrc 文件


```
set meta-flag on
set convert-meta off
set input-meta on
set output-meta on 
```



[starstroll-1376624]: http://www.cnblogs.com/starstroll/archive/2009/01/15/1376624.html
[cygwin-mail]: http://cygwin.com/ml/cygwin/2011-11/msg00067.html
[cnblogs-2772643]: http://www.cnblogs.com/tiga/archive/2012/11/16/2772643.html