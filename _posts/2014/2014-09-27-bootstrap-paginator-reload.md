---
layout: post
title: bootstrap-paginator 页面总是刷新的问题
description: github 的静态页面添加了分页功能，可是页面总是自动摔刷新。
keywords: 刷新, bootstrap, paginator, github, 分页
tags: 刷新 bootstrap paginator github 分页
categories: [前端技术]
---

## 问题现象

使用 bootstrap-paginator 分页，但是页面总是自动刷新。

于是猜测 onPageChanged  会在第一次加载的时候，执行一次。

```
 onPageChanged : function(e, oldPage, newPage) {
    if(newPage > 1){
        window.location.href=url+"page"+newPage;
    }else{
        window.location.href=url;
    }
},
```


## 查找资料

其实这个问题我之前遇到过，于是尝试找找看。

结果在 [这里][1] 找到了。


## 问题解决

加个判断是不是第一次加载，是的话不做任何操作。

```
var first = true;
if(nowPage == 1){
    first = false;
}
            
        
onPageChanged : function(e, oldPage, newPage) {
    if(first == true){
        first = false;
        return;
    }
    if(newPage > 1){
        window.location.href=url+"page"+newPage;
    }else{
        window.location.href=url;
    }
```                 


[1]: http://tiankonguse.com/record/record.php?id=703
