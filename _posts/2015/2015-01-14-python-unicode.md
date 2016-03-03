---  
layout: post  
title: python 中编码的再次学习
description:  之前曾研究过 python 的编码转换， 但是没有怎么详细记录。现在又遇到编码问题，记录一下。  
tags:  python post
keywords: python, post
updateData:  9:24 2015/1/14
categories: [python]
---  

## 前言

以前我在 [python 中的小问题(持续更新中)][python-problem] 中只是简单的记录了一下 python 中编码的知识。  

但是后来在使用 json.dumps 时遇到一个编码问题怎么也解决不了， 这个过程中有更深的了解了 python 的编码知识。  

当然， 那个 [json.dumps 问题][json-dump-more]， 回去睡了一觉，来之后瞬间就解决了。  


## 背景知识


在 python 中最常见的就是 类型 str 和 unicode 了。  

由于我的工作环境都是 utf8 编码， 所以我就不多说其他编码了， 这里只谈谈 utf8.  


### str 和 unicode 转换

str 和 unicode 的关系如下。  

关于 [decode][string_decode] 和 [encode][string_encode] 可以查看文档。  

```
str  -> decode -> unicode
unicode -> encode -> str
```


str是字节串，由unicode经过编码(encode)后的字节组成的  


### 声明 str 类型的字符串

```
s = '中文'
s = u'中文'.encode('utf-8')

>>> type('中文')
<type 'str'>

>>> u'中文'.encode('utf-8')
'\xe4\xb8\xad\xe6\x96\x87'
>>> len(u'中文'.encode('utf-8'))
6
```


### 声明 unicode 类型的字符串

```
s = u'中文'
s = '中文'.decode('utf-8')
s = unicode('中文', 'utf-8')

>>> type(u'中文')
<type 'unicode'>

>>> u'中文'
u'\u4e2d\u6587'
>>> len(u'中文')
2
```

### 判断类型

```
print isinstance(u'中文', unicode)

print isinstance('中文', str)
```


## 总结

在python里，string object和unicode object是两种不同的类型。  

string object是由characters组成的sequence，而unicode object是Unicode code units组成的sequence。  

string里的character是有多种编码方式的，比如单字节的ASCII，双字节的GB2312等等，再比如UTF-8。  

很明显要想解读string，必需知道string里的character是用哪种编码方式，然后才能进行。  

Unicode code unit又是什么东西呢？一个Unicode code unit是一个16-bit或者32-bit的数值，每个数值代表一个unicode符号。  


* string直接用引号来表示，unicode在引号前加一个u  
* 直接输入的string常量会用系统缺省编码方式来编码，即十六进制 '/xe4/xbd/xa0/xe5/xa5/xbd'
* len(string)返回string的字节数，len(unicode)返回的是字符数
* print unicode不会乱码。现在我们常用的Linux、Windows系统，都是支持unicode的


[json-dump-more]: http://github.tiankonguse.com/blog/2015/01/14/json-dump-more/
[string_encode]: http://www.tutorialspoint.com/python/string_encode.htm
[string_decode]: http://www.tutorialspoint.com/python/string_decode.htm
[python-problem]: http://github.tiankonguse.com/blog/2014/10/29/python-problem/#content-h2-%E7%BC%96%E7%A0%81%E6%A3%80%E6%B5%8B%20%E4%B8%8E%E8%BD%AC%E6%8D%A2%E7%BC%96%E7%A0%81