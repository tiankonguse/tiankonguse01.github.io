---   
layout:     post  
title:       Codeforces Round 522 Div2 B. Personalized Cup 
description: 输入一个字符串，按矩形输出。   
keywords: 技术 
tags: [程序人生]  
categories: [程序人生]  
updateData:  00:40 2018/11/21   
published: true   
---  

 


## 一、题意

地址: http://codeforces.com/contest/1079/problem/B  

![](http://res.tiankonguse.com/images/2018/11/cf-422-div2-pro-b.png)   



题意：输入一个字符串，按矩形输出。  
要求1：每行最多20个字符，列数不超过5列（换言之输入不超过100个字符）。  
要求2：如果字符不能完整的填充矩形的时候，每行相差的个数不能多于一个，空白使用`*`填充。  
要求3：优先行数最少，其次列数最少。  

## 二、分析

由于行数最好，直接除以 `20` 就可以计算出列数。  
由于各列之间空白相差不能超过1，可以总字符除以列数计算出每列至少有多少个字符。剩余的个数不超过列数，从上到下每列一个分完即可。  
 

![](http://res.tiankonguse.com/images/2018/11/cf-422-div2-b.png) 



---


本文首发于公众号：天空的代码世界，微信号：tiankonguse-code。  


