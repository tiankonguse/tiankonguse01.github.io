---
layout: post
title: 上传文件遇到的一个问题
description:  以前，我一直在模仿。现在看来是时候去学习背后的一些东西了。  
tags:  CORS javascript 跨域
keywords: CORS, javascript, 跨域
updateData:  19:37 2015/1/11
categories: [前端技术]
---



## 前言  

以前，一直没有去了解浏览器发送请求时的具体原理，只是简单的执行 jQuery 的 get, post 或者 ajax 三个函数。  

直到上周， 同事在做一个项目， 需要上传图片， 于是找我帮忙看看为什么，我于是走上了一条不归路。  

 
## 背景介绍  


我们使用的是 jQuery 的 fileUpload 插件来上传图片的。  

代码如下  


    <form id="fileupload"  method="POST" enctype="multipart/form-data" target="fileupload-iframe">  
        <input type="file" name="files[]" multiple="">  
    <form>  
    <iframe frameborder="0" style="height: 0px; width: 0px; position: absolute;" id="fileupload-iframe" ></iframe>  
    <button type="submit" class="btn btn-primary" id="start">start</button>  
    <script>  
    (function () {
        $("#fileupload").fileupload({  
            add : function(e, data) {
                //do something  
                $("#start").click(function() {
                    data.submit();  
                    return false;  

                });  
            }
        });  
    })()  
    </script>  



最初的时候我问跨域了吗？ 他说没有。  

然后我就想：既然没跨域， 那就是代码哪里写的不对的原因了。  

于是一顿修改， 后来发现怎么调都不行。  

然后总结一下是这个样子：  

> 使用 jsnop 方式发送请求(服务端只接受 jsonp)， POST 数据不能发送出去， 原因是 jsonp 使用的是 GET 请求。   
> 使用 POST 请求方式发送， 数据可以发过去， 但是返回的数据会解析失败， 因为服务器返回的是 jsonp 数据。    

于是得出结论: 这个是矛盾的， 根本解决不了。  

然后我又问自己， 真的不可以吗？  
于是我使用 php 快速写了一个文件上传的测试代码， 结果在我这怎么写都能正常上传。  

这是我意识到可能他骗我了， 可能是跨域问题。  

于是去看一下， 页面地址和服务器地址是不同的子域名，然后我告诉他不同的子域名也是跨域的。  

好的， 现在确定是跨域了， 但是问题还是不能解决。 因为上面的矛盾与跨域没有关系， 服务器只接受 jsonp , 即使 post 数据过去， 返回也解析失败。  


于是我跟 组长说：这个不可能实现， jsonp 是 get, 具体实现方式是在 iframe 里插入 `<script>` 标签实现的.  

于是我把问题丢给了组长。  

他认为现在的浏览器应该支持跨域了， 只是需要服务器端配置好， 请求的时候也配置好合适的参数才行。  

我说我都配置过了， 都不行。  

于是他在哪里研究了一番，后来他说可以了， 原来它把很多没有必要的东西删了。  

删完之后是这个样子  


    <input id="fileupload" type="file" name="files[]" multiple="">  
    <button type="submit" class="btn btn-primary" id="start">start</button>  
    <script>  
    (function () {
        $("#fileupload").fileupload({  
            add : function(e, data) {
                //do something  
                $("#start").click(function() {
                    data.submit();  
                    return false;  

                });  
            }
        });  
    })()  
    </script>  



为什么不要 form 和 iframe 呢？  

因为那个方法是通过 在 iframe 里插入 `<script>` 标签实现的跨域的，既然不能选择那个方法， 那就不需要哪些 dom 了。  

当然， 他在浏览器端和 服务器端都配置很对参数， 那些实际上默认就行了。  

他做的最重要的一件事是当服务器把请求的包传回来的时候， 他把 jsnop 修改成 json 了。  

好吧， 我看到这， 意识到即使是 jsonp, 我也有办法了， 我设置一下 dataType , 设为值 text 不就行了嘛？  

之前我曾想着设置为 xml 试试， 但是一直没事， 现在看在使用 xml 试试的话应该也会成功的。  

所以这个问题的解决方案就是服务端支持返回json格式的代码就行了，也就是修改服务器端的代码， 如果服务器段我们不能控制，那只好使用 text 或 xml 的方式先得到数据， 然后再手动转化为 json 吧?  

好了， 背景介绍完了。  


## 一个疑惑  


其实， 我之前的问题不是这个， 我知道跨域 POST 的时候会有两个请求， 一个是 OPETION , 一个是 POST.  

而我的请求一直没有那个 OPETION 请求包。  

组长说他看了[ CORS 的文档][Access_control_CORS]后解决问题的， 于是我也去看了一下这个文档， 然后找到了答案。  

现在就来讲解一下 CORS， 答案就在里面。    
 

 
## CORS 的背景 

> Cross-site HTTP requests are HTTP requests for resources from a different domain than the domain of the resource making the request.    

跨站 HTTP 请求(Cross-site HTTP request)是跨域的 HTTP 请求。  


> Cross-site HTTP requests initiated from within scripts have been subject to well-known restrictions, for well-understood security reasons.   
  

出于安全考虑，浏览器会限制脚本中发起的跨站请求。  


> The Web Applications Working Group within the W3C has recommended the new Cross-Origin Resource Sharing (CORS) mechanism, which provides a way for web servers to support cross-site access controls, which enable secure cross-site data transfers.   


W3C 的 Web 应用工作组推荐了一种新的机制，即跨源资源共享.  这种机制让Web应用服务器能支持跨站访问控制，从而使得安全地进行跨站数据传输成为可能.    


这里需要了解一个词：跨域。  

不同的子域名，或者端口不同都是跨域的。  

具体可以参考 [wiki][Same-origin_policy].  


## access control scenarios  


### Simple requests  


>A simple cross-site request is one that:  
>
> Only uses GET, HEAD or POST. If POST is used to send data to the server, the Content-Type of the data sent to the server with the HTTP POST request is one of application/x-www-form-urlencoded, multipart/form-data, or text/plain.  
>
> Does not set custom headers with the HTTP Request (such as X-Modified, etc.)  
>


什么意思呢？  

只使用 GET, HEAD 或者 POST 请求方法。  
如果使用 POST 向服务器端传送数据，则数据类型(Content-Type)只能是 application/x-www-form-urlencoded, multipart/form-data 或 text/plain中的一种。  

当然， 服务器段还要配置 `Access-Control-Allow-Origin:*` 来接受任何客户端的请求， 由于我的服务端已经默认配置了， 所以我不需要担心这个问题了。  


### Preflighted requests  

不同于上面讨论的简单请求，“预请求”要求必须先发送一个 OPTIONS 请求给目的站点，来查明这个跨站请求对于目的站点是不是安全可接受的。  

这样做，是因为跨站请求可能会对目的站点的数据造成破坏。   

当请求具备以下条件，就会被当成预请求处理：  


>
> It uses methods other than GET, HEAD or POST.  
>
>  Also, if POST is used to send request data with a Content-Type other than application/x-www-form-urlencoded, multipart/form-data, or text/plain, e.g. 
>  
>  if the POST request sends an XML payload to the server using application/xml or text/xml, then the request is preflighted.  
>  
> It sets custom headers in the request (e.g. the request uses a header such as X-PINGOTHER)  
>


重点在这里： 使用 POST，但请求数据为 application/x-www-form-urlencoded, multipart/form-data 或者 text/plain 以外的数据类型。  

而我的请求在 form 里， 幸运的是 form 还有 multipart/form-data  这个字段， 于是我永远也不可能触发 Preflighted requests。  

悲剧呀。  

看到这， 图片不能成功上传的第二个原因就在这个 `multipart/form-data` 上了， 把它删了就可以了。  


### Requests with credentials  

XMLHttpRequest和访问控制功能，最有趣的特性就是，发送凭证请求（HTTP Cookies和验证信息）的功能。  

一般而言，对于跨站请求，浏览器是不会发送凭证信息的。  

但如果将XMLHttpRequest的一个特殊标志位设置为true，浏览器就将允许该请求的发送。  

如果服务器端的响应中，如果没有返回Access-Control-Allow-Credentials: true的响应头，那么浏览器将不会把响应结果传递给发出请求的脚步程序，以保证信息的安全。  


## 解决问题  

文档看到这， 应该就可以解决问题了。  

需要做三件事：  

* 不使用 jsnp 发送数据, 返回的数据需要时 json 格式  
* 服务器段配置 `Access-Control-Allow-Origin` , 代表接受这个客户端  
* 请求的包头不能有 application/x-www-form-urlencoded, multipart/form-data 或者 text/plain。  


## 参考文档  

* [HTTP access control (CORS)][Access_control_CORS]  
* [jQuery File Upload Demo][jQuery-File-Upload]  

[Same-origin_policy]: http://en.wikipedia.org/wiki/Same-origin_policy
[jQuery-File-Upload]: https://blueimp.github.io/jQuery-File-Upload/  
[Access_control_CORS]: https://developer.mozilla.org/en/docs/Web/HTTP/Access_control_CORS 