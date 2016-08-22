---  
layout: post  
title: http chunked包记录
description: http协议包比较简单, 最近遇到chunked包的一个问题, 记录一下
updateData:  21:31 2016/8/17
categories: [http]
---  


## 背景

http协议是一种文本协议, 文本协议有一个先天优势: 容易理解,容易阅读.  
之前使用http协议的时候, 收到的包都有`Conent-Length`, 所以判断包是否收完直接判断长度即可.  
今天同事说自己http包解包后有问题, 于是帮忙看了一下, 发现是chunked包, [tcpdump](http://github.tiankonguse.com/blog/2016/08/13/tcpdump.html)抓包之后发现包被分片了.  
这里了解一下chunked包, 顺便记录下业务该怎么处理chunked包.  



首先看一个知识点, 首先去[RFC](https://tools.ietf.org/html/rfc2616#section-3.6.1)和[维基百科](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)看看.  
看完实际上就可以不用看我这篇文章了, 那上面写的比我这详细多了.  
但是为了自己后续快速回顾知识点, 这里还是记录一下.    


## 安全性前提

一般http的包头很小, 所以很多人都会假设包头肯定在第一个tcp包头.  
这样其实是不合理的,我们应该按照http的协议来找包头.  

```
bool checkCompleteHttpHead(const char *buf,int len){
    if(strnstr(buf, "\r\n\r\n", len) == NULL){   
        return 0; 
    }else{
        return 1;
    }
}
```




## Content-Length


在有`Content-Length`的时候, 我们只需要找到`Content-Length`, 然后就可以计算出包长了.   

由于`Content-Length`类型的包是一个包体连续的包, 所以直接取自己的数据即可.  
比如我们返回的数据都是json, 所以一般都是直接去json数据.当然标准的做法应该是分析包头,得到包头和包体.  

>  
> 当然上面的方法是错误的, 我们应该选分析包头, 是否正确的返回数据.    
>  

## Transfer-Encoding

`Transfer-Encoding`是chunked的包是http的另一种数据传输机制, 当网络传输的时候, 可能会进行分片, 每个片头会记录每个分片的大小.  

### 格式

* 如果一个HTTP消息（请求消息或应答消息）的Transfer-Encoding消息头的值为chunked，那么，消息体由数量未定的块组成，并以最后一个大小为0的块为结束。  
* 每一个非空的块都以该块包含数据的字节数（字节数以十六进制表示）开始，跟随一个CRLF （回车及换行），然后是数据本身，最后块CRLF结束。  
* 最后一块是单行，由块大小（0），一些可选的填充白空格，以及CRLF。最后一块不再包含任何数据，但是可以发送可选的尾部，包括消息头字段。  
* 消息最后以CRLF结尾。   

### 样例

```
HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked

25
This is the data in the first chunk
1C
and this is the second one
3
con
8
sequence
0
```

###检查包完整性

根据上面的协议, 最后一个分片是`0\r\n\r\n`, 所以我们可以检查是否有这个字符串来判断是都得到完整的包.  

```
if(!strncmp(pEnd,"0\r\n\r\n",5)){
    return len;
}else{
    return 0;
}
```


### 应用

这种方式的包对于我们应用来说, 其实有点麻烦的.  
收到一个http包后, 我们需要解析包, 而不能像`Content-Length`那样直接find包体的前缀和后缀来得到自己想要的数据啦.   
这时候我们需要处理chunked包, 去掉多余的分片标示的相关字符.  

```
string strHttpRsp = "", strRspBody = "";

//填充http包到string, 回包是个json
strHttpRsp.assign(data, len);

string::size_type stPos = strHttpRsp.find_first_of('{');
if (stPos == string::npos) {
    return -__LINE__;
}

string::size_type stEndPos;

//去掉包体中 "\r\n1500\r\n" 这样的字符
while (stPos < strHttpRsp.length()) { 
    stEndPos = strHttpRsp.find("\r\n", stPos);
    if (stEndPos == string::npos || strHttpRsp.length() <= stEndPos + 2) {
        //最后一行
        strRspBody += strHttpRsp.substr(stPos);
        break;
    } else {
        //找到下一个字节数前面的\r\n
        strRspBody += strHttpRsp.substr(stPos, stEndPos - stPos);
        
        //跳过字节数
        stPos = strHttpRsp.find("\r\n", stEndPos + 2);
        if (stPos != string::npos && stPos < strHttpRsp.length() - 2) {
        //跳过字节数后面的\r\n
            stPos += 2;
        } else {
            break;
        }
    }
}

stEndPos = strHttpRsp.find_last_of('}');
if (stEndPos == string::npos){
    return -__LINE__;
}
strHttpResponse = strRspBody.substr(0, stEndPos + 1);
```





