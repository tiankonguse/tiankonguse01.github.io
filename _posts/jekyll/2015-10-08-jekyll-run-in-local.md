---  
layout: post
title:  在本地运行jekyll网站
category: [程序人生]
description: 使用github来当作自己的记录集后,每次有改动时都要提交了才能看到结果,于是尝试在本地搭建一个jekyll环境.    
tags: [github, jekyll]
keywords: [github, jekyll]
updateData:   23:54 2015/10/08
---

## 前言

最近一年多, 一直使用[github](https://github.com/tiankonguse/tiankonguse.github.io) 来当作自己的 [记录集](http://github.tiankonguse.com/),俗称博客.  
使用github当作记录集有一个问题就是:网站有任何改动, 只有提交了才能看到效果.  
如果发现有问题了, 需要修改后再次提交.  
这也是为什么我的提交次数很高的缘故. [1](https://github.com/tiankonguse/tiankonguse.github.io/commits/master).  


实际上刚开始搭建 自己的 [记录集](http://github.tiankonguse.com/)时, 我在我的电脑上搭建了一个本地的jekyll环境, 然是后来换电脑了, 就再也没搭建了.  
现在重新搭建一下, 顺便记录一下.  


## 环境准备

由于我使用的是 ubuntu 系统, 所以安装很简单, 一条命令即可.  

```
sudo apt-get install jekyll
```

当然, 你也可以去下载源码编译安装,这里就不做介绍了.  
```


## 网站准备

之前我有[三篇很水的记录](https://www.google.com/search?&q=site%3Atiankonguse.com+jekyll), 大家可以简单的看一下.  

* [Jekyll 模板 简单语法 笔记](http://github.tiankonguse.com/blog/2014/09/26/jekyll-base-record/)  
* [在github上制作一个轻量级免费的静态网站](http://github.tiankonguse.com/blog/2014/07/10/make-github-website/)  
* [Jekyll 语法简单笔记](http://github.tiankonguse.com/blog/2014/11/10/jekyll-study/)  



## 运行网站

网站搭建好了, 环境准备好了, 我们就需要生成页面了.  

关于执行命令时遇到的一些问题, 可以参考下面的常见问题.  


生成网页命令:  

```
tiankonguse:tiankonguse.github.io $ sudo jekyll serve --watch
Configuration file: /home/tiankonguse/github/tiankonguse.github.io/_config.yml
            Source: .
       Destination: ./_site
      Generating... 

  Populating LSI... 
Rebuilding index... 
                                        done.
 Auto-regeneration: enabled for '.'
Configuration file: /home/tiankonguse/github/tiankonguse.github.io/_config.yml
    Server address: http://127.0.0.1:80//
  Server running... press ctrl-c to stop.
```



## 常见问题

### Layout nil 不存在

有时会遇到这样一个警告:   

```
Build Warning: Layout 'nil' requested in atom.xml does not exist.
```
  

原因是我们使用旧版的语法, 新版本使用 `null` 代替了 [2](https://github.com/jekyll/jekyll/issues/2712).  
所以我们把 `nil` 换成 `null` 即可.  


### Auto-regeneration 不再支持

这个也是新版本不支持的缘故.注释`auto`配置即可`#auto: true`   

```
Deprecation: Auto-regeneration can no longer be set from your configuration file(s). Use the --[no-]watch/-w command-line option instead.

```

### pygments 被命名为 highlighter

这个还是新版本的缘故.  

注释掉 `pygments: true`, 增加 `highlighter: pygments`即可.  

```
Deprecation: The 'pygments' configuration option has been renamed to 'highlighter'. Please update your config file accordingly. The allowed values are 'rouge', 'pygments' or null.
```

### Name or service not known


这个是由于我们配置的域名或者host错了,改成`host: 127.0.0.1`.  


```
jekyll 2.5.3 | Error:  getaddrinfo: Name or service not known
```


### Permission denied

这是由于我们缺少权限, 使用`sudo`即可.  


```
jekyll 2.5.3 | Error:  Permission denied - bind(2)
```

