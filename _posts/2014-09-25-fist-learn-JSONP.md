---
layout: post
title: 初步认识JSONP
description: 一个同事在纠结ajax中url为什么要写callback, 指定了callback却又没有被调用的问题，我于是搜索了一下资料，原来是JSONP捣的鬼。
keywords: JSONP, callback, javascript
tags: JSONP callback javascript
categories: [前端技术]
---

## 历史的根源

刚来公司的时候，写了一个ajax动态获取数据，却发现返回的数据是个 xml,于是向 hades 询问怎么得到 json.

hades告诉我需要加上 otype=json 和 callback=? 才行。

然后我按他说的加上后果然可以了。


当时我想，可能是后台根据这两个参数才可以正常的返回 json 吧。

但是之后抓包的时候，发现参数callback的值被 jquery 替换为一个类似于 jQuery19105458447074051946_1411608092776 的名字了，而且每次后边的数字都不一样。

不过我也没去管这个，就天天看着包中的 callback 也就习惯了。

## 意外的时光

后来 ronniemeng 告诉我她写 callback 没有被调用。


原来她写成这个样子了

```javascript
!function() {
	function test(d) {
		// do something
	}
	$.ajax("/getdata?callback=test&otype=json");
}();
```

然后，我告诉他，callback 不能这样用，一般把回调函数写成参数。

```
$.ajax("/getdata?callback=?&otype=json", function(d) {
	// do something
});
```

然后 ronniemeng 说果然可以了。

然后就没然后了。


## 历史的转折

再后来， arik 要写个页面了。需要使用 ajax 来获取数据。

他之前没有写过 ajax, 所以他发现调用 ajax 后得到的东西没有生效。

```
$.ajax("/getdata");
```

有人告诉他要在url中加上 callback=?&otype=json .

他想调用自己的回调函数，但是没有调用。

我说必须要有 callback , 且值一定要是 问号。

然后我想问什么呢？


## 寻找原因

对于 otype 这个参数，可以说通，指定返回数据的格式。

凡是对于 callback , 值为 问号 时， jquery 帮我们填充为随机名字了。

也就是这个 callback 与 jquery 有关。

然后我发现，不指定 callback 时， 返回的是一个 javascript 语句，而不是一个 json.

```
outputJson={data:"hello word"}
```

而指定 callback=? 时，返回的是

```
jQuery19107279077793937176_1411609585826({data:"hello word"})
```

指定 callback=test 时，返回的是

```
test({data:"hello word"});
```


然后我定义一个全局的 test 函数，发现竟然回调这个 test 了。

```
function test(d) {
	// do something
}
$.ajax("/getdata?callback=test&otype=json");
```

这是个大发现呀，回调函数可以被调用，但是必须是全局函数。

然后根据全局函数这个关键字，终于 google 到相关资料了。

## 历史的祸根

原来这里面有个东西叫做 JSONP 。

JSONP 是 JSON With Padding 的缩写。

简单的说就是

1. 请求数据时加个回调参数 callback=parseResponse
2. 返回的数据需要时一个回调调用 parseResponse(jsonData)

这样设计的好处就不多说了，或者粘一个网上说的好处和坏处吧。

```
优势：

回调问题。只要发出 script 请求，自动等待 callback 回调就好，并且精准得能秒杀 onload 等方案。

跨域问题。因为浏览器的同源策略，跨域一直是前端的难题。跨域与安全息息相关，JSONP 没有破坏安全性，同时却具备了全面跨域能力。巧妙而实用。

协作问题。后端专注与数据处理与输出，前端专注与数据展现。除了 JSON 数据本身的格式约定，其他约定仅仅需要一个 P 就好。

劣势：

无中间状态。不像 XHR（XMLHttpRequest） 那样，有丰富的 status 、readyState 等属性，可以很精准地知道各种状态。

只能 GET。不像 XHR 那样，可以全方位支持 GET、POST、PUT、DELETE。

只能异步。XHR 是可以同步的，估计很多人没用过，同步其实是 XHR 的默认行为（省略 open 的第三个参数就代表同步）。
```


说说一些问题吧。

parseResponse  必须是一个全局函数。

这个很不友好，每个 ajax 都要有一个全局函数(我们的环境所限)。


jQuery 帮我们解决了这个全局函数命名的问题。


还是我告诉别人的解决方法：

```
$.ajax("/getdata?callback=?&otype=json", function(d) {
	// do something
});
```

这个实际上和那个自己指定回调等价。
调用前 jquery 会帮我们创建 类似于 jQuery19107279077793937176_1411609585827 的函数，回调结束后，这个函数名回收。


## 历史的结局


看到最后，感觉很滑稽。

找了半天，发现自己一开始使用的就是完美的解决方法。

但是之前一直是只知道这么用，但是不知道为什么。

现在是还是这么用，但是知道了为什么，都是 JSONP 捣的鬼。

<完>
