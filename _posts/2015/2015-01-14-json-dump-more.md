---  
layout: post  
title: python 中 json 序列化的一些问题
description:  一直使用 json.dumps 来序列化对象，但是昨天遇到一个中文编码问题，于是发现猜到一个坑。
tags:  python post
keywords: python, post
updateData:  9:24 2015/1/14
categories: [python]
---  

## 前言

以前我在 [python 中的小问题(持续更新中)][python-problem] 中只是简单的记录了一下 python 中 json 的操作。  
我更在 [Python 下 json 的基本操作与转换][python-json] 中做了详细的记录， 但是那些都是我使用过的操作记录。  

对于未遇到的操作和坑， 那里自然就没有记录了。  

现在又遇到一个 json.dumps 中由特殊字符，尤其是中文时的问题。  


## 正文

### 默认序列化

最简单的 json.dumps 莫过于参数全部默认了。  

```
item = {}
item["value"] = "test"
    
json.dumps(item)
```

### 紧凑型序列化

但是我们输出 序列化后的字符串后发现， 有很多没用的空白，这个输出时有助于我们查看数据， 但是用来数据传输和数据储存时， 有这些无效的空白显然是不明智的选择。  

于是我们可以加上一些参数来取消这些空白。  

即紧凑型序列化。  

```
item = {}
item["value"] = "test"
    
json.dumps(item, separators=(',',':'))
```

### 编码问题

做一个项目，刚开始前一直以为是 http post 的问题， 最后花了一张问题链， 用二分判断问题出现了哪一步， 最后断定问题出在了  json.dumps 的中文上。  

我使用了几个月的python, 投入使用的python程序大大小小有几十个，竟然没遇到这种情况？

背景是这样，这次我的 json 中有中文时，然后我把序列化后的 字符串当做 post 数据传给服务器， 服务器竟然读中文数据时，读到空字符串。  

当然， 那可能是 服务器端 字符串转化 json 的函数实现的不全面(后来读了服务器端源码， 发现那个json parse 不支持 \uxxxx 的字符串， 但是不会报错，会按空处理)。  



现在处于这个一种情况， 服务器段不支持 unicode 所以， 但是 json.dumps 是特殊字符又默认是 unicode， 这个如果能够转化为二进制就可以解决了。  

结果发现 json.dumps 还真支持这个功能， 加上 ensure_ascii 参数即可。  


```
item = {}
item["value"] = "test"
    
json.dumps(item, separators=(',',':'), ensure_ascii=False)
```


[python-json]: http://github.tiankonguse.com/blog/2014/09/29/python-json/
[python-problem]: http://github.tiankonguse.com/blog/2014/10/29/python-problem/#content-h2-%E5%AD%97%E7%AC%A6%E4%B8%B2%20%E4%B8%8E%20json%20%E8%BD%AC%E5%8C%96