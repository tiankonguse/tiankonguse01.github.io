---  
layout: post  
title:  ubuntu安装dropbox
description: 电脑上的东西必须需要备份的，在ubuntu下，还是dropbox这个工具最好。   
tag: ubuntu
keywords: ubuntu
updateData:  2015-03-15 00:55:22 
categories: [软件研究]
---

## 背景

在 windows 下的话，我一直使用百度网盘，在ubuntu下虽然也有开源的百度网盘，但是要自动同步还是挺难得。  
但是有一个很多人都在用，那就是 dropbox.  

如果你还没有 dropbox 的话，赶紧注册一个吧。  

注册地址是[这里][my-dropbox].  


## 安装 dropbox


dropbox 的官网介绍的安装方法很简单。  


1. 下载安装程序源代码 (tar.bz2)
2. 解压缩 `tar xjf ./nautilus-dropbox-1.4.0.tar.bz2`
3. 安装 `cd ./nautilus-dropbox-1.4.0; ./configure; make; make install;`


可惜，这个在国内行不通了。  


不管怎样，我们先把源码下载下来吧。[下载地址][nautilus-dropbox-1].    


安装的时候，会发现安装失败了，这时由于 dropbox 依赖一些库和软件我们还没有安装。  

根据错误提示，安装对应的软件就行了。  


```
dropbox start -i
```


我安装的有这些软件。  

```
sudo apt-get install libnautilus-extension
sudo apt-get install libnautilus-extension-dev 
sudo apt-get install docutils-common 
sudo apt-get install autoconf
sudo apt-get install aclocal-1.11
sudo apt-get install aclock.app 
sudo apt-get install awk
sudo apt-get install gawk
sudo apt-get install gcc
sudo apt-get install proxychains
sudo apt-get install gstm
```


安装完之后，我们运行 dropbox ,发现 dropbox 提示我们需要下载东西，然后下载进度一直是0.  

至于为什么进度一直0很好解释，下载的东西被墙了。  


## 下载 dropbox daemon


经过简单的搜索，在 [这里][blog-448160-380724] 发现 dropbox 启动时，会检查一个目录里的东西是否存在，不存在了去下载那个目录的东西。  

所以这个东西我们也可以自己先下载的。  

下载链接只有两个: [一个32位][plat-32]， [一个64位][plat-64] 的。  

自己根据自己的系统下载对应的文件即可。  

下载完后，解压缩后的名字应该是 .dropbox-dist, 然后放在个人目录 `~/` 下面即可。  


## 代理神器 proxychains


下载完后，再次启动 dropbox, 发现连接服务失败。  

这时我们需要让 dropbox 使用代理工作了。  

后来在 [这里][ssh-ubuntu-dropbox] 发现可以使用 proxychains 来代理命令行启动的软件，于是安装之。 

```
sudo apt-get install proxychains
```

配置也很简单，加上自己ssh代理的信息即可。  

```
sudo vi /etc/proxychains.conf

socks5 127.0.0.1 7070
```

然后在代理下启动我们的 dropbox.  

```
sudo proxychains dropbox start -i
```

登录，选择同步目录。  

哈哈，结束了。  



[ssh-ubuntu-dropbox]: http://nocapricorn.appspot.com/2011/02/11/ssh-ubuntu-dropbox.html
[plat-64]: http://www.getdropbox.com/download?plat=lnx.x86_64
[plat-32]: http://www.getdropbox.com/download?plat=lnx.x86
[blog-448160-380724]: http://blog.sciencenet.cn/blog-448160-380724.html
[nautilus-dropbox-1]: https://www.dropbox.com/download?dl=packages/nautilus-dropbox-1.4.0.tar.bz2
[my-dropbox]: https://db.tt/g3XXhSe7
[dropbox-help]: https://www.dropbox.com/help/247
