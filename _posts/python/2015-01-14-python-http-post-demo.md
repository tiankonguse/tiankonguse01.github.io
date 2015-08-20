---  
layout: post  
title: python 发送 post 请求
description:  之前曾记录过post请求，但是那个是阅读文档得到的，现在这个是经验得到的。
tags:  python post
keywords: python, post
updateData:  9:24 2015/1/14
categories: [python]
---  

## 前言

之前曾记录过 [Python 下发送 post 类型的 http请求][python-http-post], 今天发现那篇记录竟然没有记录我一直使用的发送 post 的方法， 于是重新记录一下。  

这个代码会更新到 [python 中的小问题(持续更新中)][python-problem] 里面。  

## 正文

这里只给一个样例吧， 看看就知道了。  

关于具体解释请看我的上一篇 post 记录 - [Python 下发送 post 类型的 http请求][python-http-post].  


```python
try:

    item = {}
    item["value"] = "测试"
    
    postdata = {}
    postdata["data"] = json.dumps(item, ensure_ascii=False)
    
    postdata["username"] = "tiankonguse"
    
    encodedata = urllib.urlencode(postdata)
    
    req = urllib2.Request(url, encodedata)
    
    page = urllib2.urlopen(req)
    
    ret_str = page.read()
    
    print ret_str
except urllib2.HTTPError, e:
    print('(%s)http request error code - %s.' % (url, e.code))
except urllib2.URLError, e:
    print('(%s)http request error reason - %s.' % (url, e.reason))
except Exception:                                                                                       
    print('(%s)http request generic exception: %s.' % (url, traceback.format_exc()))
```

## 两个坑

看了上面的代码， 不一样的地方有两个：

```python
json.dumps(item, ensure_ascii=False)
urllib.urlencode(postdata)
```

由于 python 默认是 unicode 编码， 所以 json.dumps 时， 特殊字符将会以 unicode 编码， 即是 "\uXXXX" 的形式， 这样的数据传给其他语言就可能不能正常识别了([我的服务器端恰好不能识别][json-dump-more])。  

第二个就是 postdata 数据需要进行 urlencode， ，否则 value 如果有 `&`  的话，将会是一个难以发现的 bug.  


[json-dump-more]: http://github.tiankonguse.com/blog/2015/01/14/json-dump-more/
[python-problem]: http://github.tiankonguse.com/blog/2014/10/29/python-problem/
[python-http-post]: http://github.tiankonguse.com/blog/2014/10/29/python-problem/#content-h2-http%20%E8%AF%B7%E6%B1%82