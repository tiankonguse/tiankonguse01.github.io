---   
layout:     post  
title:       Codeforces Round 522 Div2 D. Barcelonian Distance   
description: 一道简单的几何题。
keywords: 技术 
tags: [程序人生]  
categories: [程序人生]  
updateData:  00:40 2018/11/22   
published: true   
---  

 


## 一、题意

地址: http://codeforces.com/contest/1079/problem/D  

![](http://res.tiankonguse.com/images/2018/11/cf-422-div2-pro-d.png)   



题意：道路默认是只能横着走和竖着走的。现在有一条方程为  `ax+by+c=0`的路，求A点到B点的最短距离。  

## 二、分析


![](http://res.tiankonguse.com/images/2018/11/6be8c5c3a4a57c05cbb4449f6465586d063ff6d2.png)   


画图之后，我们可以看出来，A到B的较优答案有几种情况：A横着到直线、A竖着到直线、B横着到直线、B竖着到直线。  
这几种情况组合一下有四种情况，在加上A不走直线直接走网格，就有五种情况。  
我们分别计算这五种情况，计算出最小路径即可。  



---


本文首发于公众号：天空的代码世界，微信号：tiankonguse-code。  


