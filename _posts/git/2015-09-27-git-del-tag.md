---
layout:     post
title:      git 删除 tag
description: 最近逐渐的使用 git 的 tag 来管理项目, 不小心增加了一个tag, 想删除,发现怎么也删除不了. 现在记录一下.  
keywords: git, delte tag, 管理项目
tags: [git, delte tag, 管理项目]
categories: [程序人生]
updateData:  10:34 2015/09/27
---

## 前言

最近准备打造一个子集的chrome扩展.  在开发过程中, 每实现一个功能, 都需要标记一下, 以防出现意外时可以快速回滚.  
于是现在我使用 git 的 tag 来管理这个项目.  

***

## 问题


在使用项目管理时, 想查看一下tag的帮助文档,发现误增加了一个tag, 而且还推送到服务器去了.  

```
tiankonguse:personal-chrome-extensions $ git tag help

tiankonguse:personal-chrome-extensions $ git tag 
help
v0.0.0.1
v0.0.0.2
v0.0.0.3
```

现在要做的是删除那个多余的 tag.  

```
tiankonguse:personal-chrome-extensions $ git tag
help
v0.0.0.1
v0.0.0.2
v0.0.0.3
```



但是之前每怎么用过 git 的 tag, 使用平常的命令发现删除不了远程tag.  


```
tiankonguse:personal-chrome-extensions $ git tag -d help
已删除 tag 'help'（曾为 f8f4f58）

tiankonguse:personal-chrome-extensions $ git tag
v0.0.0.1
v0.0.0.2
v0.0.0.3

tiankonguse:personal-chrome-extensions $ git push origin --tag
Username for 'https://github.com': tiankonguse
Password for 'https://tiankonguse@github.com': 
Everything up-to-date

tiankonguse:personal-chrome-extensions $ git pull origin 
来自 https://github.com/tiankonguse/personal-chrome-extensions
 * [新tag]           help       -> help
Already up-to-date.

tiankonguse:personal-chrome-extensions $ git tag
help
v0.0.0.1
v0.0.0.2
v0.0.0.3
```

***

## 解决方案

git 的 tag 不像文件管理那样, 本地操作后, 直接 push就可以了.  

我们需要指明要删除这个tag.  

目前我查到的有下面两个方法.  

### 远程删除命令

本地删除后, 执行一下远程命令`git push origin --delete tag <tagname>`即可.  

```
#删除本地tag
tiankonguse:personal-chrome-extensions $ git tag -d help
已删除 tag 'help'（曾为 f8f4f58）

#删除远程tag
tiankonguse:personal-chrome-extensions $ git push origin --delete tag help
To https://github.com/tiankonguse/personal-chrome-extensions.git
 - [deleted]         help
```


### 推送空tag到远程

另一个方法是删除本地的tag, 然后把本地的这个tag推送到远程服务器.  
由于本地的删除了, 推送到服务上时, 服务器上的也会删除.  


```
tiankonguse:personal-chrome-extensions $ git tag -d help
已删除 tag 'help'（曾为 f8f4f58）

tiankonguse:personal-chrome-extensions $ git push origin :refs/tags/help
To https://github.com/tiankonguse/personal-chrome-extensions.git
 - [deleted]         help
```


## 参考资料

* [Git查看、删除、重命名远程分支和tag](http://zengrong.net/post/1746.htm)
* [git删除tag](http://tech.yingbo.miao.fm/git-tag-delet-229.html)


