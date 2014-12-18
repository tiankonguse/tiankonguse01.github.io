---
layout: post
title: cjson 源码阅读笔记
category: blog
description: 之前看了sphinx的源码之后，心中大概有了json实现的原型，但是没想到c语言的json实现是如此的暴力简单。      
tags:  cjson 源码 解析 序列化 自动机
keywords: cjson, 源码, 解析, 序列化, 自动机
updateData:  16:25 2014/12/18
---


## 前言


cjson 的代码只有 1000+ 行， 而且只是简单的几个函数的调用。  

而且 cjson 还有很多不完善的地方， 推荐大家看完之后自己实现一个 封装好的功能完善的 cjson 程序。  


《完》


[number-gif]: http://www.json.org/number.gif
[sphinx-json-conf]: http://github.tiankonguse.com/blog/2014/11/28/sphinx-json-conf/
[hash-table]: http://github.tiankonguse.com/blog/2014/11/04/hash-table/
[memcached-hash-table]: http://github.tiankonguse.com/blog/2014/11/07/memcached-hash-table/
[cjson]: http://sourceforge.net/projects/cjson/
[json-org]: http://www.json.org/
[json-org-zh]: http://www.json.org/json-zh.html