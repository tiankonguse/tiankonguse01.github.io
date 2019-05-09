---  
layout:     post  
title:      协议之Google Protocol Buffer
description: 看了这个协议， 发现这个协议并不是一个理想的协议， 也没啥讲的.  
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateData:  21:55 2017/7/15
published: true  
---  
  
  
>   
> 大家好，这里是tiankonguse的公众号(tiankonguse-code)。    
> tiankonguse曾是一名ACMer，现在是鹅厂视频部门的后台开发。    
> 这里主要记录算法，数学，计算机技术等好玩的东西。   
>      
> 这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/vN7Ubq5tMYw9_Yv0fj6-8w)自动同步过来。    
> 如果转载请加上署名：公众号tiankonguse-code，并附上公众号二维码，谢谢。    
>    
  
  
## 零、背景

之前在《[什么是协议](https://mp.weixin.qq.com/s/kjuZuB6l80e49rP_cJEr_g)》介绍了协议的一些理论知识， 里面提到业务应用中都是使用自描述应用协议来传输数据的。   
后来在《[解读RSA公钥私钥储存格式](http://mp.weixin.qq.com/s/GL8KS7KO7YifXjtd6G9XwQ)》提到这些自描述应用协议其实都属于ASN.1标准， 也就是这个标准的一种实现方案。   


而Google的Protocol Buffer也符合ASN.1标准， 今天我们就简单看看这个协议吧。  


## 一、闲谈

这个周五给同事说通信前业务的结构化数据都会先序列化(encode)，收到数据后会反序列化(decode)。  
然后他们问为什么要序列化， 直接传结构不就行了吗?   

我的答案是一下几点:  

1. 平台无关  
2. 语言无关   
3. 可灵活扩展   
4. 解耦  


有了上面三个优点， 这个协议得到的系列化数据可以用来数据储存或者网络通信， 还可以随意为协议增加字段。  
好了，不多说这个了。   


## 二、协议的格式

之前我曾介绍过《[每秒千万每天万亿级别服务之诞生](http://mp.weixin.qq.com/s/6taVob0DFx7K5QK-l4nmxQ)》中提到我的这个服务使用Protocol Buffer协议来传输数据的。  
我就以这个服务的协议当做例子来讲解吧。  
为了简单， 无关的字段我都删除了， 只保留重要的字段。  


```
package tv;

// 请求结构
message DSReq {
    optional int32 idtype       = 2 [default = 1]; // id的类型，视频，专辑
    repeated string ids         = 3; // 请求的id
    repeated string fields      = 4; // 请求的字段
    optional uint32 platform    = 10; // 平台
    optional string appver      = 11; // 版本
}

// 响应结构
message DSGetRsp {
    optional sint32 errorno     = 1 [default = 0];  // 错误码， 0标识成功
    optional string errormsg    = 2; // 出错信息
    repeated DataSet results    = 3; // 结果集
}
```


一些基本语法需要简单介绍一下， 主要介绍和c++语言的对应关系。  


* `package` 代表 `namespace`    
* `message` 代表`clase`。    
* `optional`代表这个字段是可选的    
* `required`代表这个字段必填    
* `repeated`代表这个是一个数组   
* 等号后面的编号在一个message中需要唯一， 序列化时只储存这个编号，不储存实际的名字。  
* `default`含义为设置默认值。  


选填和必填的含义后面会解释。  
上面的语法就是Protocol Buffer的所有语法。  


有点心的朋友应该会有疑问:怎么只有array没有map呢?  
如果了解过lisp语言的话， 可以知道， 我们只有有基础数据结构， 哪些复杂的数据结构都可以使用基础的数据结构表示的。  
所以Protocol Buffer中map也可以使用array和基础的class来标示。  


比如class有两个值: 第一个是key值， 第二个是value值。  
这样key值就是map的key值， value值就是map的value了。  
缺点是这里查找的时候是`O(N)`的， 这也成为Protocol Buffer使用不方便的一大诟病。  


公司内也是因为这个自定义了一套类似于Protocol Buffer的协议， 支持map， 不过这是后话了。  
protobuf后来虽然增加了map (unordered_map)， 但是大家都使用的旧版本，所以推广变得很难很难了。  


## 三、一般的自描述协议

一个二进制一般对应一个message， 所以我们只需要介绍怎么识别一个message， 如果message中的变量也是message类型， 递归即可。  
对于每一个变量， 使用PTLV格式表示。 P代表位置，T代表类型，L代表长度，V代表这个类型的值。  


位置可以使用一个字节表示(先假设个数不超过256个)， 类型也使用一字节表示。  
对于基本类型， 如数字类型， 浮点类型， 不需要储存长度了， 后面直接是定长的数据。  
对于string类型， 后面有四字节代表长度， 后面的字节和长度保持一直。  
对于message类型， 不需要长度，直接递归储存value的值。  
对于数组，先有四字节代表数组的元素个数， 后面递归的去识别每一个元素结构。  


看到上面有些人可能会对于message类型和数组类型有一些疑问。  
比如message类型和数组的总大小有没有储存， message有没有开始和结束表示位。  
或者数据有没有压缩，编号能不能乱序等等有一大堆问题迎面而来。  
这里我们先不解释这些， 因为不同的协议会选择不同的特性， 我们先看看Protocol Buffer是怎么实现的。  



## 四、源码阅读到放弃

Protocol Buffer的代码特别多， 本来一个很简单的转换功能， 实现的特别复杂， 公司内的协议就简单多了， 一个文件几行代码就搞定了。  
不管怎样， 代码我还是翻了一遍， 下面来聊聊具体的储存格式吧。  


看一个协议时， 只需要看序列化协议就行了， 其他的都是序列化的重复表示。  



上面可以看出来对于PTLV中的前两个是必不可少的。  
但是如果分别使用四字节来储存位置和类型的话，每个字段都要浪费八字节。  
所以这里进行了压缩， 类型不超过8个， 使用低三位表示， 位置使用高29位标示， 这样位置上限就是`2^29`个， 我们肯定用不完的。  
压缩为四字节整数后， 调用`WriteVarint32ToArray`函数写到buf中去了。  


对于int32， int64， float， double都会按32位或者64位整数储存， 都会调用`WriteVarint64ToArray`写入到buf中。  
对于string， 类型是`WIRETYPE_LENGTH_DELIMITED`， 随后写入四字节长度， 最后写入具体的字符串。  
对于messag， 类型也是`WIRETYPE_LENGTH_DELIMITED`， 然后写入四字节的message的大小， 然后递归协议Message结构。  
最后是数组了。这里直接循环储存每一个元素， 这个是个比较新颖的地方， 原来世界上本来没有数组，同一个位置有多个相同的元素后就产生了数组。  


看到这里Protocol Buffer的序列化大概就看完了，可以发现一个问题：序列化后的数据没办法区分整数和浮点数，也没办法区分string和message。  
甚至没办法知道数组的个数， 这个对于业务来说， 自己想自动识别序列化后的数据就变得不可能了。  


假设我们没有Protocol Buffer的协议， 只有一串二进制， 我们只能得到第一层的结构: 位置， 压缩的类型， 压缩的值。  
这个对于想深入使用Protocol Buffer的人来说就变得不友好了。  
比如我想做个自动化的Protocol Buffer转json的服务， 没有协议就做不到了。  


不过还好， 假设我有了协议文件， 自己写一个语法分析引擎分析协议， 然后就可以自动解析出json了。  


## 六、潜在漏洞

上面提到对于messag当做序列化的string处理了。  
也就是不断的读PTLV来适配数据。  
那对于下面的结构就会有问题了。  


```
message MetaData {
    optional uint32 third    = 3; 
    optional uint32 fouth    = 4; // 平台
};
message Data {
    optional uint32 first      = 1;
    optional uint32 second     = 2;
    optional MetaData third    = 3;
    optional uint32 fouth      = 4;
};
```

我们读完`MetaData`的`third`后， 不能确定接下来的`fouth`是谁的。  
当然解决方案也很简单， 每个message都对应字节流中的一个区间， 检查接下来的流是否在这个区间内就行了。  
赶紧看看内部协议有没有这个漏洞，看之后发现内部协议有一个结束类型， 这样就避免了那个问题。  

不过内部协议有个弊端， message中变量的位置必须是递增的， 而Protocol Buffer是自探测位置和类型的， 位置可以打乱。  


## 七、总结


好了，不管怎么Protocol Buffer还是看完了，后续就可以自己去管理这个二进制流了。  



对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
小密圈这周接受免费加入，欢迎大家加入看各种算法的思路。  

![](/images/suanfa_xiaomiquan.jpg)  
  
  
长按图片关注公众号，接受最新文章消息。   
  
![](/images/weixin-50cm.jpg)  
  
  
  