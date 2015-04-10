---
layout: page
title: 关于 tiankonguse 的一些东西
description: tiankonguse 的博客历史与个人经历
keywords:  About, Author, Site, tiankonguse, Jekyll, GitHub, Chrome, Firefox, Safari, IE, MS, Contact, Change, Log, SEO
isContact: true
updateData:  21:25 2015/4/2
---

## 关于 tiankonguse

我是 tiankonguse, 一个安静的程序员。  

关于我的介绍，可以看看[这里][lab-kirichik]  

大学四年 acmer,期间用php写过一些小系统。  

现在专注于c++方向的东西。  


简单的说就是一直坐着自己喜欢做的事：看书，学习新的知识，研究算法，看漫画，一周偶尔看一场电影。



## 关于看书


{% for bookState in site.data.book %}
### {{ bookState.name }}
{% for book in bookState.list %}
{% if book.bookLink %}
*  [{{ book.bookName }}][{{book.bookLink}}] {{ book.readTime }} {% if book.readLink %}[读书笔记][{{ book.readLink }}]{% endif %}
{% else %}
*  {{ book.bookName }} {{ book.readTime }} {% if book.readLink %}[读书笔记][{{ book.readLink }}]{% endif %}
{% endif %}
{% endfor %}
{% endfor %}




## 关于电影和电视剧


### 看过

* 《中国合伙人》 2014-11-02晚上 [QQ空间记录][qzone-china-people]
* 《蜘蛛侠》三部曲 2014-11-08晚上 [QQ空间记录][5a55f12fd7055f54d7060400]
* 《蝙蝠侠》三部曲 2014-11-10 ~ 2014-11-11 
* 《钢铁侠》二部曲 2014-11-13 ~ 2014-11-15 
* 《匆匆那年》2014-12
* 《有种你爱我》2015-01
* 《有一个地方只有我们知道》 2015-02
* 《千里千寻》 2015-02-20, 2015-03-21
* 《霍比特人3：五军之战》 2015-03-14
* 《狼图腾》2015-03-14
* 《五十五度灰》 2015-03-14
* 《鸟人》 2015-03-14
* 《吸血鬼日记1》已看完
* 《吸血鬼日记2》已看完
* 《吸血鬼日记3》已看完
* 《吸血鬼日记4》已看完i
* 《艋舺》2015-03-26
* 《星际穿越》2015-04-05
* 《天空之城》2015-04-06~2015-04-07


### 在看

* 《吸血鬼日记5》在看


### 计划看的电影


* 《1942》
* 《第四公民》
* 《禁闭岛》

## 关于我听的音乐

### 最常听的音乐

* 《明天你好》 牛奶@咖啡
* 《习惯了寂寞》 牛奶@咖啡
* 《老男孩》
* 《我的好兄弟》
* 《拯救》
* 《知足》
* 《最初的梦想》

### 偶尔听的音乐

* 《Yesterday Once More》
* 《同桌的你》
* 《Say You Say Me》
* 《如果没有你》
* 《Right Here Waiting》
* 《海阔天空》

### 尝试听的音乐

* 《make love out of nothing at all》


## 关于动漫和漫画 

* 《火影忍者》看完
* 《死神》看完
* 《魔法禁书目录1》看完
* 《魔法禁书目录2》看了部分，放弃看了
* 《海贼王》在看


## 关于论文

* 看论文 《The Use of Smart Meter Data to Forecast Electricity Demand》 2010-11-11晚

## 关于这个网站

这个网站托管在[github][github-tiankonguse]上。   


## 关于 tiankonguse 的记录集

大概 2010 年起，我不再写个人感情的故事了，因为那年我高考结束进入大学了。    
2010 年之前我都是在[QQ空间写东西][qzone]的，不过现在已经找不到写的那些东西了。    
2010年到2012年，自己在QQ空间主要写自己大学的[个人情感][qzone]。    
2011年之后，在[博客园][cnblogs]写算法相关的东西。    
当然，那个时候也用 [csdn][],不过后来不知怎么了，改版后写的东西就没有了。 
2010~2012年期间, 我申请网上的免费域名和免费主机搭建了asp网站。  
2013 年前半年开始，我买了自己的域名和主机，使用php纯手写了自己的第一个博客，然后在[自己的博客][firstblog]上记录东西。    
2013 年后半年也开始开启了 [wordpress 博客][wordpress], 不过我只专门在那上面写过几篇文章，剩下的都是从我的其他博客哪里导进去的。    
同样是2013 年，我重写了自己做的第一个博客，然后就一直在那上面写东西，现在我称她为[记录集][record]。    
2014 年，我使用了一段 [iteye][] 来记录文章，当然都会和我的[记录集][record]保持同步。    
工作后的2014 年，我开始使用 [github][] 来记录我想记录下来的东西。    


如果喜欢我的文章，可以赠一本书。

![zhifubao_code][]



## 读书使人快乐

![book-list][]



[zhifubao_code]: /images/zhifubao_code.jpg
[5a55f12fd7055f54d7060400]: http://user.qzone.qq.com/804345178/mood/5a55f12fd7055f54d7060400.1
[book-list]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/430766252.png
[qzone-china-people]: http://user.qzone.qq.com/804345178/mood/5a55f12f770d55540bcc0300.
[github-tiankonguse]: https://github.com/tiankonguse/tiankonguse.github.io
[Computer-Parables-Enlightenment-in-the-Information-Age]: http://github.tiankonguse.com/blog/2014/11/01/Computer-Parables-Enlightenment-in-the-Information-Age/
[the-ten-of-programming]: http://github.tiankonguse.com/blog/2014/10/31/the-ten-of-programming/
[the-tao-of-programming]: http://github.tiankonguse.com/blog/2014/10/29/the-tao-of-programming/
[csdn]: http://blog.csdn.net/tiankonguse
[github]: http://github.tiankonguse.com/
[iteye]: http://tiankonguse.iteye.com/
[record]: http://tiankonguse.com/record/
[wordpress]: http://tiankonguse.com/blog/
[firstblog]: http://tiankonguse.com/firstblog/
[cnblogs]: http://www.cnblogs.com/tiankonguse/
[qzone]: http://user.qzone.qq.com/804345178/
[On-Top-of-Tides]: http://github.tiankonguse.com/blog/2014/10/22/On-Top-of-Tides/
[lab-kirichik]: http://tiankonguse.com/lab/kirichik/
[douban-Learning-SQL]: http://book.douban.com/subject/4872454/
[douban-High-Performance-MySQL-3rd]: http://book.douban.com/subject/23008813/
[douban-MySQL-High-Availability]: http://book.douban.com/subject/6847455/
[douban-SQL-Antipatterns]: http://book.douban.com/subject/6800774/
[douban-mysql-3729677]: http://book.douban.com/subject/3729677/
