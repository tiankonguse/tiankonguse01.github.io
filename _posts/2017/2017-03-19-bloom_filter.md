---
layout:     post
title:      谈谈布隆过滤器(Bloom Filter)
description: 上篇文章介绍了hash算法, 这个是兄弟篇 Bloom Filter.     
keywords: 后台服务
tags: [后台服务]
categories: [程序人生]
updateData:  21:12 2017/3/19
---


## 零、背景

>  
>  声明  
>  这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/NpVzMT_0etlrVNvZ-YWQEQ)自动同步过来.  
>  如果转载请加上署名:公众号tiankonguse-code. 并附上公众号二维码.  
>  


笔者多年前看编程之美时就了解过Bloom Filter, 但是当时作为一个搞算法的ACMer, 感觉这个算法没啥的, 就是一个hash, 工作中用到了对应的思想,这里简单记录一下.  


之前在tiankonguse-code公众号里 《[字符串hash函数的本质](https://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&sn=457dbeeaf20ff02efa75f9855d10935b&idx=1&mid=2650105211)》介绍了hash算法, 其实是为它的兄弟Bloom Filter做准备的.  


这篇文章以一个问题开始慢慢讲解Bloom Filter是如何诞生的.  


## 一、问题之用户是否已存在

假设你有一个网站, 用户名是邮箱.  
新用户注册的时候我们需要判断这个邮箱是否已经注册过.  


假设我们希望在内存中来计算这个问题, 该如何计算呢?  
大家第一时间想到的是set<string>或者map<string, int>来打标记吧.   

是的, 我大学ACM比赛的时候,对于字符串为key的问题大多数情况下都是通过set和map来标记这个key是否存在过.  
这个算法很好, 但是存在一个问题: 数据量大了怎么办?  
假设我们一个邮箱的平均长度是20字节,我们最多有10亿的用户, 则我们至少需要200亿(20G)的内存.  
所以我们需要换个办法来打这个标记.  


## 二、假设我们有牛逼的hash算法


假设我们有一个牛逼的hash算法, 一亿的邮箱可以hash出10亿内不同的值, 我们可以使用数组来储存数据, 0代表不存在,1代表存在.  
这个时候我们只需要10亿乘以4字节即40亿(4G)的内存了.   

然后很多人会想到可以只是一字节甚至使用位压缩来储存数据.  
使用一字节的含义是10亿数组的类型是uint8类型的, 此时需要内存10亿(1G).  
而位压缩的含义是一个整数的每一位都用来储存数据,则需要内存1.25亿(125M).  


位压缩在ACM中也很常见,都是使用数组自己实现的, 虽然STL中已经有bitset.   


使用位压缩我们已经把内存缩小到125M了, 前提是我们有一个很牛逼的hash算法.  
事实上我们没有, 所以这个方法存在一个缺陷: 我们可能很大概率返回错的答案.  
比如一个邮箱不存在, 但是hash出来的值与一个已存在的相同, 则我们没办法区分这两种情况.  


hash冲突是一个概率问题, 当我们能够容忍这个问题是, 我们就能够解决一些问题了.  
比如 tiankonguse-code 的公众号文章在《[每秒千万级别的量是重生还是炼狱?](https://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&mid=2650105193&idx=1&sn=a4066b2994b59e78de846137344228c5&chksm=f2b36f38c5c4e62efc91687c2d29e9f8e40368d660de85d6e01018525e7a2f160152a35869c1)》的 **热key再次优化** 中介绍过.  
下面是原文:  


>  
>  之前的热key是直接使用多阶hash共享内存库实现的, key是字符串, 查找还是消耗性能的, 并且key的计数更新规则也存在问题.  
>  
>  为了性能, 自己写了一个基于共享内存的热key库, 实际储存会对key进行hash映射取模, 然后直接使用下标找到对应的数据.  
>  对于计数规则, 原先是到达周期,按比例缩小, 计数波动较大, 优化后分成环, 环内计数求和, 大大提高计数稳定性, **不过对于冲突的key,按相同key处理了** .  
>  
>  PS: 这个之前也进入TOP10瓶颈点了，优化后性能完全可以忽略了。  
>  


可见虽然hash冲突这个问题没办法避免, 但是还是有些使用场景的.   


其实我们看到这里可以对hash总结出两个结论:  

1. 如果账号存在, 则我们不可能查询为不存在  
2. 如果账号不存在, 则有概率查询为存在  



## 三、降低hash冲突的概率


上面面临的问题是hash有时候会冲突, 如果这个概率不能接受, 我们就需要优化算法来降低冲突概率了.  
很容易想到的是使用不同的hash算法多hash几个值, 是的, 就是这个方法.  


我们hash一个值冲突的概率假设都是百分之一, 则hash两个值都冲突的概率就是万分之一.  
当然这里考虑两个hash是有顺序(排列)的, 如果没有循序(组合)的话, 概率也不超过万分之5.  
而且我们hash的个数越多, 冲突概率越小, 当然对应成本可能也越高.  


这个方法其实在 tiankonguse-code 的公众号文章《[每秒千万级别的量是重生还是炼狱?](https://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&mid=2650105193&idx=1&sn=a4066b2994b59e78de846137344228c5&chksm=f2b36f38c5c4e62efc91687c2d29e9f8e40368d660de85d6e01018525e7a2f160152a35869c1)》 的小节中 **设计缓存库与缓存策略** 也谈到过.  
原文如下:  


>  
>  关于缓存，之前在《[谈谈cache](https://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&mid=2650105090&idx=1&sn=979daee3e20b01a81f396ca80bc89c5b&chksm=f2b36f53c5c4e6457ef2daf2795c6fef6fd6f34882429f5e73f17ac27ad54b26ae32d63125a8)》(公众号tiankonguse-code回复1704查看文章)曾介绍了很多策略与实践遇到各种问题。  
>  而现在主要面临一个问题: 共享内存纯粹使用多阶HASH实现，key和value共存,内存使用率极低,性能也存在很多问题。  
>  于是就有了下面的一系列优化了。   
>  ...   
>  **第三件事是对key生成多个不同的hash值,避免key冲突时进行字符串比较。**  
>  实践证明两三次就过滤所有冲突了，第三次hash和key长度的兜底比较一天也只有几次。  
>  



而我们面对判断邮箱是否存在的问题, 也可以hash出多个值, 然后对应位置设置为1, 查询时都为1才说明存在.  
而Bloom Filter的核心思想就是hash出多个值来代替普通bitset的一个值.  


当我们通过hash多个值的时候, 大大的降低了冲突的概率, 所以我们也可以适当的降低我们位压缩的内存大小了.  
之前10亿用户位压缩需要内存1.25亿(125M), 现在我们可以使用1.25千万内存(12.5M)来储存数据.  
这个需要多少个hash值与最终我们使用多大的内存是有科学公式的, 这里就不深入计算了,有兴趣的可以翻墙查看[wiki](https://en.wikipedia.org/wiki/Bloom_filter).  





## 四、如何hash多个值  


这个问题很多人原始想法是找多个hash函数不就行了吗?  
但是假设我们hash出20个值, 你能去找20个函数吗?  


所以我们需要换个方法, 看看hash的本质是什么.  
tiankonguse-code公众号的文章《[字符串hash函数的本质](https://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&sn=457dbeeaf20ff02efa75f9855d10935b&idx=1&mid=2650105211)》介绍了本质:  


>  
>  hash函数的本质是扫描字符串过程中, 根据之前的结果, 当前位置,当前字符的值使用一个公式计算出当前结果.   
>  当然稍微复杂的hash算法会考虑之前所有的的结果,位置以及字符, 甚至会迭代多次.
>  


其实本质里面已经说了方法了: **迭代多次**.  
看到这里如果还没明白的话, 只能`don't talk, show me code`了.  


```
uint32_t HashKey(const char *sKey, int iSize, uint32_t dwKey = 0) {
	uint32_t seed = 13; // 31 131 1313 13131 131313 etc..
	for (int i = 0; i < iSize; i++) {
		dwKey = dwKey * seed + sKey[i];
	}
	return dwKey;
}

void test(const char *sKey, int iSize){
    uint32_t firstHash = HashKey(sKey, iSize);
    uint32_t secondHash = HashKey(sKey, iSize, firstHash);
    uint32_t thirdHash = HashKey(sKey, iSize, secondHash);
}
```



## 五、产品说允许删除账号


我们通过hash出多个值降低了冲突的概率, 但是还面临着一个问题: 我们没办法删除数据.  
这个时候我们需要先看看Bloom Filter的本质: **通过若干位的值是否都是1来判断对应的数据是否存在.**  


删除的话不能简单的都置为0,因为这样可能影响很多数据的,本来存在的查询为不存在,违背上面的两大结论了.  


当然说到删除, 大家也会想到一个方法: 计数.  
我们使用多位来储存一个值, 每次添加数据就加1.  
这个是个不错的方法.  

加上我们使用一字节来储存一个值, 则需要1亿万内存(100M)来储存数据.   
这个内存实际上很小了, 所以我们也可以接受.  
唯一的缺点就是我们最多允许冲突255次, 而我们使用两字节,则允许65535次冲突, 达到这个的概率将很小很小了.  



## 六、参考资料

   
* [wiki Bloom filter](https://en.wikipedia.org/wiki/Bloom_filter)  
* [数学之美系列二十一 － 布隆过滤器](https://china.googleblog.com/2007/07/bloom-filter_7469.html)  




## 六、其他文章


* [UNION架构篇](http://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&mid=2650105156&idx=1&sn=3b59e3339973aab54ed29d2d86d36f9e&chksm=f2b36f15c5c4e603ce3b65570443433077d3058e66348df62572318db9fd4d1b6809c4f3e6ea&scene=21)   
* [UNION优化篇](http://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&mid=2650105193&idx=1&sn=a4066b2994b59e78de846137344228c5&chksm=f2b36f38c5c4e62efc91687c2d29e9f8e40368d660de85d6e01018525e7a2f160152a35869c1&scene=21#wechat_redirect)   
* [UNION诞生篇](http://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&mid=2650105195&idx=1&sn=7c1d170a93c8015d5a17d932248d1bf3&chksm=f2b36f3ac5c4e62c87f14792abacb96ab2fa996254619ae6785583ef54687eace0eff2db8d18&scene=21#wechat_redirect)  
* [union运营篇](http://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&mid=2650105192&idx=1&sn=3bc4e7f70ba0be17e7db7ed6f0fa29b5&chksm=f2b36f39c5c4e62f2eeca514e1ec7634145e04bc5af266dd1aa9e6eac2df63088f9d42a6f8c5&scene=21#wechat_redirect)  
* [谈谈cache](http://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&mid=2650105090&idx=1&sn=979daee3e20b01a81f396ca80bc89c5b&chksm=f2b36f53c5c4e6457ef2daf2795c6fef6fd6f34882429f5e73f17ac27ad54b26ae32d63125a8&scene=21#wechat_redirect)  
* [浪潮之巅](http://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&mid=2650105161&idx=1&sn=3972fc97bf19a091a43da872022215e4&chksm=f2b36f18c5c4e60ef3af29c0e5c848efa283bd27c153d8507a4f14ecd20545986493719d87f5&scene=21#wechat_redirect)  
* [排名算法](http://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&mid=2650105174&idx=1&sn=35e1e69fdcea3a0832eaac7e2a299c2e&chksm=f2b36f07c5c4e6115ab5c2d7f4cd9aa59ac6f545b9bb2b5583e6426bae71d4f4056a44243628&scene=21#wechat_redirect)  
* [字符串hash函数的本质](https://mp.weixin.qq.com/s?__biz=MzI2NDA0NDM1MA==&sn=457dbeeaf20ff02efa75f9855d10935b&idx=1&mid=2650105211)   

## 七、关于作者

曾是一名ACMer, 现在是鹅长视频部门的后台开发。   
这里主要记录工作中的技术架构与经验，计算机相关的技术，数学、算法、生活上好玩的东西。  
长按二维码关注作者, 了解作者发布的最新好玩的东西  

<hr>

长按图片关注公众号, 接受最新文章消息.  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/4224042967.jpg)














