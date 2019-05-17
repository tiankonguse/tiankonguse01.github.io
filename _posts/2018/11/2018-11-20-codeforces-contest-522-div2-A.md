---   
layout:     post  
title:       Codeforces Round 522 Div2 A. Kitchen Utensils 
description:  英语是硬伤，这道题我看了N遍，依旧没明白。  
keywords: 技术 
tags: [程序人生]  
categories: [程序人生]  
updateData:  23:40 2018/11/20   
published: true   
---  

 


## 一、题意

地址： http://codeforces.com/contest/1079/problem/A  

![](http://res.tiankonguse.com/images/2018/11/cf-422-div2-pro-a.png)    

英语是硬伤，这道题我看了N遍，依旧没明白。  
最后反复看样例与样例说明，终于看懂了。  


题意：所有人吃了 a 轮套餐，每轮套餐有 b 个餐具。每轮套餐所有人吃的都一样。    
由于有些人偷走了一下餐具，计算最少有多少个餐具。  

## 二、分析


输入是每个餐具剩余的个数 left 和人数 k 。  
根据餐具的最大个数，可以计算出最少吃了几轮套餐 `loopNum = max(b) / k` 。  
计算出餐具总是： `allB = loopNum * k  * b`  
被偷走的餐具：  `allB - left`  

![](http://res.tiankonguse.com/images/2018/11/cf-422-div2-a.png) 



---


本文首发于公众号：天空的代码世界，微信号：tiankonguse-code。  


