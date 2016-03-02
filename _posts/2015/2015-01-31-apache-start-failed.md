---
layout: post  
title: apache 启动失败问题记录  
description:  一个下午，突然收到编辑反馈，sphinx搜索不到数据， 我简单看了一下，一台机器上的apache挂了，于是想法解决了问题。  
tags:  apache php
keywords: apache,php  
updateData:  21:23 2015/1/31 
categories: [软件研究]
---



##  背景  

我们这个 sphinx 搜索起初采用两台机器容灾的。由于是内网系统，公司不想内网系统提供 vip 来容灾， 再加上这边很多基础服务都没有提供，我们只好使用dns 自动来容灾。  

这样的坏处很明显：一台机器挂了， 我使用域名访问就有 二分之一的几率是不正常的。  

对于这个， 比较好的解决方案是加个中间层：中间层来负载均衡，自动切换挂掉的机器。  

我想遇到这件事后，运维也开始做这个了吧。  


但是现在问题已经出现了， 我们需要先让其他人正常使用，于是手动把使用这个服务的系统全部修改一下，即把域名换成正常运行的那台机器的ip。  


然后再看看，挂掉的那台机器怎么回事， 怎么修复。  


## 故障现象  

最外层的现象是：使用向外提供的搜索域名偶尔不能返回结果。  

由于这个域名只对应两个ip, 于是使用ip访问一下服务， 定位到一台机器不能正常返回结果。  


我登陆那台机器， 使用 php 命令运行我的php文件， 正常返回了结果。  

于是我给运维说我之前遇到过这个问题：是由于有两个版本的php的原因, 还把我之前的[记录][tiankonguse-php-zmq-protobuf]发给他。  

想着应该过一会就解决了吧。  

结果过了半个小时，我看了看，还是没有解决。  

他说已经把旧的版本卸了，还是不行。  


于是我上去看了看， 发现原来 apache 根本没有启动。  

于是启动，但是没有任何输出， 搜一下进程， 不存在。  

重启一下，提示进程不存在。  


```
./apachectl start  
#无反应.  

./apachectl restart  
httpd not running, trying to start  

./apachectl stop  
httpd (pid 17907?) not running  
```

遇到问题，一般先去看日志，但是日志只有 Apache 启动和关闭的错误信息， 而且启动和关闭在同一秒内执行的。  

难道运维配置 apache 的时候配置错了？  

检查一下 Apache 的配置文件， 没有错误。  

```
./apachectl configtest  
Syntax OK  

./apachectl restart  
httpd not running, trying to start  


ps -ef|grep httpd  
root  1322  1261   0 10:30:39 pts/9       0:00 grep httpd  
```

不过看日志的时候，有一个 warning.  

```
Init: Session Cache is not configured [hint: SSLSessionCache] 
```

不管那么多了， 我先检查一下 apache 文件是否被修改了。  

于是先去正常的机器， 执行 md5 来得到所有文件的 md5.  

```
md5sum * > md5.log  
```

然后把文件上传的有问题的机器， 执行 md5 检查。  

```
md5sum -c md5.log  
```

结果文件完全一样。  


唯一的不一样是：有故障那台机器的 apache 模块比较多。  

于是我让运维把多余的模块全卸了，要和正常的那台机器保持一致。  


后来，他说卸完了，还是不行。  


于是我干脆把 php 模块也从 apache 配置中删了， 结果 apache 正常了。  


好吧， 确认问题出在 php 上了。  


于是我去 php 的位置看看， 发现两个机器的 php模块也不同。  

```
[正常机器 /etc/php.d]$ ll | wc -l  
19  

[故障机器 /etc/php.d]# ll | wc -l  
43  
```

于是先 md5 检查一下， 发现一样的模块 md5 全部相同， 只是有故障的机器多了很多模块。  

很简单， 告诉运维把多余的全删了。  


删完之后， 发现浏览器返回信息了，但是貌似模块删多了，提示如下。  


```
PHP Fatal error:  Class 'DOMDocument' not found in XXX on line 110  
```


于是让运维安装这个模块， 然后一切都正常了。  

这个时候， 我打开[这个页面][bluechilli-1786480]， 发现和我一样的问题，但是有点晚了，我们已经解决问题了。  


我把那个页面的重要的话引用出来吧。  

> 开始以为是版本不匹配的问题，但是在网上﻿并没有找到apache和PHP的匹配版本的信息。  
>  
> 后来在PHP的主站上发现有人提到apache与PHP的冲突，是PHP的个别扩展功能的问题。  
>  
> 于是在安装PHP的时候，先把所有的Extentions都变为了差X，然后只选择了MSQLi,OpenSSL  
>  
> 等几个自己觉得有用的扩展，结果安装完成后，再启动apache就没有问题了。  


再后来， 运维查看系统日志时， 发现了 apache 的错误日志在 系统日志 `var/log/message` 里面。  

好吧， 以后查问题还要去`var/log/message` 里面去看看。  


## 故障原因及解决方案


上面的最主要的故障原因是安装 php 时， php 的某些模块和 apache 的模块冲突的缘故。  


解决方案就是找到对应的模块， 删除之。   





[bluechilli-1786480]: http://www.cnblogs.com/bluechilli/archive/2010/07/27/1786480.html  
[tiankonguse-php-zmq-protobuf]: http://github.tiankonguse.com/blog/2014/12/28/php-zmq-protobuf/#content-h2-%E9%81%97%E7%95%99%E9%97%AE%E9%A2%98  
