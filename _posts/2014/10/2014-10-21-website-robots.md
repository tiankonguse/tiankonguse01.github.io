---
layout:     post
title:      网站中使用的 robots.txt 
description: 之前看到 robots.txt 的规则，但是为了简单，就直接只放禁止访问的网站列表，就然也生效了，现在需要使用正确的语法来禁止抓取某些内容了。
keywords: 网站, robots, 搜索引擎
tags: 网站 robots 搜索引擎
categories: [前端技术]
---

## robots.txt 认识

robots.txt 文件主要用于阻止搜索引擎访问自己网站上的某些网址。

## 语法

```
User-agent: 下面的规则应用到搜索引擎的名字，*代表所有的搜索引擎
Disallow: 要阻止的网址
Allow: 在一个被阻止的目录下的子目录中，想要允许抓取的网址
```

## 分析

一般情况下，User-agent 都会填写为 \*.  

Disallow 常用于那些404的网址或确实不想让搜索引擎抓的网址。  

从 Allow 中我们可以看出来，搜索引擎会遍历我们的所有目录，即使那个目录被禁止访问。


## 使用

比如你想禁用那些网址就写上那些网址

```
ser-agent: *
Disallow:/
Disallow:/blog/2014/10/20/python-update-invalid/
Disallow:http://github.tiankonguse.com/blog/2014/10/20/2014-acm-anshan-h/
Disallow:http://github.tiankonguse.com/blog/2014/10/18/javascript-note-lib/
Disallow:http://github.tiankonguse.com/blog/2014/10/15/javascript-refactor/
```

