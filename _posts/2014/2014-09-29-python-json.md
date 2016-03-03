---
layout : post 
title : Python 下 json 的基本操作与转换
description : 我现在编程，有两个库不能缺少：1.json库, 2.正则表达式库。现在需要使用 json 了。查了一下资料，记录下来。
keywords: json, 正则表达式, http 请求, python, 字符串, 转换
tags: [json, 正则表达式, http, python, 字符串, 转换]
categories: [程序人生, python]
---

## json 背景

我现在编程，有两个库不能缺少：1.json库, 2.正则表达式库。

当然，对于数据库，http请求这些一般都提供的有，所以不提那些库。


使用 json 一般有这个几个需求：

1. 数据操作
2. 转化为字符串
3. 字符串转化为 json


于是我去 [官网][doc-python-json] 查了一下资料，记录下来。

## JSON 数据操作

json 的数据操作没什么好说的，一切皆对象.


## json 转 字符串


一般使用 json.dumps 即可。

```
json.dumps(['foo', {'bar': ('baz', None, 1.0, 2)}])
'["foo", {"bar": ["baz", null, 1.0, 2]}]'
```
但是直接使用 dumps 会有个问题，得到的字符串不是紧凑的。

这样很浪费空间。

所以一般使用紧凑形的字符串。

加上 separators 参数即可

```
json.dumps([1,2,3,{'4': 5, '6': 7}], separators=(',',':'))
'[1,2,3,{"4":5,"6":7}]'
```

## 字符串转 json

解析 json 一般使用  json.loads 函数。

```
json.loads('["foo", {"bar":["baz", null, 1.0, 2]}]')
[u'foo', {u'bar': [u'baz', None, 1.0, 2]}]
```

[doc-python-json]: https://docs.python.org/2/library/json.html
