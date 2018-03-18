---   
layout:     post  
title:      从零开始学算法：了解套路长啥样   
description: 计划写一个系列来分享如何入门学习算法  
keywords: 算法  
tags: [算法]  
categories: [算法]  
updateData:  22:40 2018/03/18
published: true  
---  
 
大家好，我是tiankonguse。  
由于某些原因，经常有人想要学习算法，但是自己之前又没有相关经验，不知道从何做起。  
我思考了许久，计划写一个系列来分享如何入门学习算法。  

之前分享了《[认识算法](http://mp.weixin.qq.com/s/2CyGYZ5SFs-cLBHkxAhdyg)》，今天是第二篇：《了解套路长啥样》。  

***

在第一篇《[认识算法](http://mp.weixin.qq.com/s/2CyGYZ5SFs-cLBHkxAhdyg)》里面，我们知道了计算机和程序语言的特点。  
然后我提到了算法的套路：我们面对一道题、一个问题，首先需要知道题的含义是什么？也就是输入有什么、输出需要是什么。然后想想怎么做，即分哪些步骤把数据从输入转化为输出。  
这里面最关键的就是分步骤将输入转化为输出了。  


分步骤这个词语实际上相当抽象，这个每个步骤其实都是一个套路，不同的问题需要不同的套路来解决，而且我们的最终目标是掌握这些套路具体怎么实现。  
简单梳理一下，这些套路可以划分几个分类：  

1.数据结构  
2.DP(动态规划)  
3.图论  
4.数学（计算几何、数论、组合数学、概率等） 
5.搜索  
6.字符串  
7.博弈  
8.其他（水题、模拟、枚举、贪心、找规律）


这些分类只是根据经验进行划分的，而我们需要做的就是从简单的分类开始学起，慢慢的到难的分类。 


PS: 本来找了一个中文的练习网站，结果今天看的时候发现已经挂了。那我们还是使用PKU 或者 HDU吧。  

建议大家在这两个地方都注册一下账号。  
PKU：背景大学在线练习题库，现在改名为POJ了(http://poj.org/)  
HDU：杭电的在线练习题库(http://acm.hdu.edu.cn/)  


对于编译器，大家可以下载一个dev-c++，一个轻量级的c++编译器。 
这篇文章的题如果你做完了都AC了，可以留言告诉我。  
等你积够七篇了，可以召唤神龙了。    


其实到这里这篇文章就算分享完了。  
下篇文章开始会按照分类来具体分享。  
下面我们就来看一些题吧。  


## 第一轮：熟悉算法的世界

1.A + B Problem II http://acm.hdu.edu.cn/showproblem.php?pid=1002   
2.绝对值排序 http://acm.hdu.edu.cn/showproblem.php?pid=2020  
3.计算两点间的距离 http://acm.hdu.edu.cn/showproblem.php?pid=2001  
4.字符串统计 http://acm.hdu.edu.cn/showproblem.php?pid=2017  


如果你看了上篇文章的话，你可能会发现第一题和上篇的最后一题类似的。  
这个题的类型属于大分类模拟题，不过我们一般称为高精度题，算是模拟题的细分吧。  


对于第二题，算是排序题了。  
排序算法有很多，下篇文章单独介绍吧。  
大家可以先尝试自己做做这个排序题。  


第三题是数学题，细分是计算几何题。  
当然这个是最简单的计算几何题。  


第四题是字符串题，也是最简单的字符串题了。  



## 第二轮：难度提升


1.查找最大元素 http://acm.hdu.edu.cn/showproblem.php?pid=2025  
2.进制转换 http://acm.hdu.edu.cn/showproblem.php?pid=2031  
3.首字母变大写 http://acm.hdu.edu.cn/showproblem.php?pid=2026  
4.今年暑假不AC http://acm.hdu.edu.cn/showproblem.php?pid=2037  


这四道题难度就适当增加了。  
第一题找最大值，然后还要结合字符串的操作。  
第二题是数学题。  
第三题依旧是字符串题。  
第四题难度就增加了，属于DP题，但是由于题比较特殊，可以贪心得到答案。给大家一个提示：我们当然希望看结束时间早的节目了，因为结束的早我们皆可能多的看下一个节目嘛。  


## 第三轮：你还在吗  


1.Points on Cycle http://acm.hdu.edu.cn/showproblem.php?pid=1700  
2.ACboy needs your help again! http://acm.hdu.edu.cn/showproblem.php?pid=1702  
3.PBD http://acm.hdu.edu.cn/showproblem.php?pid=1703  
4.Rank http://acm.hdu.edu.cn/showproblem.php?pid=1704  
5.Count the grid http://acm.hdu.edu.cn/showproblem.php?pid=1705  
6.The diameter of graph http://acm.hdu.edu.cn/showproblem.php?pid=1706  


最后罗列的六道有难度的题，大家不一定可以做出来，可以尝试一下，然后再留言里面告诉我你的想法，如果AC了那就更好了。  
做题重要的不仅是想法，编码能力也很重要。  


第一题是计算几何题。告诉你圆上一点，求另外两点，使得三条边的周长最长。  
第二题是模拟题，模拟数据结构。  
第三题是找规律题，当然也可以通过分析法得到公式。  
第四题是图论题，大家可以想想怎么做。  
第五题是几何体，暴力计算即可。  
第六题又是图论题，最短路的变种。  



***

这是从零开始学算法的第二篇文章，介绍的是了解套路长啥样，已经分享完毕了。  



给大家推荐的所有题我都做了一遍，代码在这里：https://github.com/tiankonguse/ACM/tree/master/hdu  
如果你没找到代码，可能是我忘记上传了，如果你需要代码的话，可以联系我。  


大家如果有什么建议或问题可以在底部留言区留言。  
当然，你也可以加我微信找我私聊，微信号: tiankonguse。  

![](/images/tiankonguse-support.png)  


