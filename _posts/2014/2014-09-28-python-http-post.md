---
layout : post 
title : Python 下发送 post 类型的 http请求
description : 最近遇到了发送 http 请求的需求，但是请求时会发送一个很大的数据，使用get会有个瓶颈，于是查查资料改为post请求。
keywords: http, python, post 请求, Request, urlencode, urlopen
tags: [http, python, post, 请求, Request, urlencode, urlopen]
categories: [程序人生, python]
---



## 基本 http 请求


对于基本的 http 请求，也就是参数写在 url 中的请求，就几行代码就搞定了。

```
req = urllib2.Request(url)
page = urllib2.urlopen(req);
ret_str = page.read();
```

## Request 对象了解

查查 python 的[官方文档][doc-python-Request]，发现 Request 是一个对象。

```
class urllib2.Request(url[, data][, headers][, origin_req_host][, unverifiable])
```

This class is an abstraction of a URL request.

这个类是 URL 请求的一个抽象类。


url should be a string containing a valid URL.
url 需要是一个包含有效 URL 的 字符串。


data may be a string specifying additional data to send to the server, or None if no such data is needed. 

data 可能是一个发送给服务器的 字符串类型的附加数据，或者如果不需要这样的数据的话将会是 None.


Currently HTTP requests are the only ones that use data; 

当前的http请求时唯一的可以使用数据的请求。


the HTTP request will be a POST instead of a GET when the data parameter is provided. 

如果 提供 data 的参数的话， HTTP 请求将会是使用 POST 代替 GET 请求。


data should be a buffer in the standard application/x-www-form-urlencoded format. 

data 需要时一个标准的 application/x-www-form-urlencoded 格式的 缓存。


The urllib.urlencode() function takes a mapping or sequence of 2-tuples and returns a string in this format.

urllib.urlencode() 函数会接受一个 map 或者 2-tuples 作为参数， 然后返回一个格式化的字符串。


headers should be a ...

剩下的不翻译了，因为到这里需要的很多信息已经得到了。

## urlopen 对象 了解

```
urllib2.urlopen(url[, data][, timeout])
```

关于 urlopen 的 url 和 data 的说明，和 Request 的说明一样，所以这里不多写了。

urlopen 返回的是一个 file 对象。



## POST 请求


上面的文档说的很清楚

```
如果 提供 data 的参数的话， HTTP 请求将会是使用 POST 代替 GET 请求。
```

所以，我们只需要在 Request 或 urlopen 里面指定 data 参数即可。


但是还有一个问题：data的参数需要时 urllib.urlencode() 编码后的字符串。

所以我们需要把需要穿的post字典传入 urlencode 编码即可。



## 动态添加 POST 数据

其实 Request 对象有一个 add_data 方法，可以动态添加 POST 数据。

```
Request.add_data(data)
Set the Request data to data. 
This is ignored by all handlers except HTTP handlers — and there it should be a byte string, and will change the request to be POST rather than GET.
```

所以，动态添加POST数据的代码变为下面的样子

```
req = urllib2.Request(url);
req.add_data(data);
page = urllib2.urlopen(req);
ret_str = page.read();
```


[doc-python-Request]: https://docs.python.org/2/library/urllib2.html#urllib2.Request
