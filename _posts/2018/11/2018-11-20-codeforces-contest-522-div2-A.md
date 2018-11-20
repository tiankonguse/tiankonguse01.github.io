---   
layout:     post  
title:       Codeforces Round 522 Div2 A. Kitchen Utensils 
description: 不论宣称如何完美的解决方案，都会引入另一个更复杂的问题。      
keywords: 技术 
tags: [技术]  
categories: [技术]  
updateData:  23:40 2018/11/20   
published: true   
---  

 


## 一、题意

```
The king's birthday dinner was attended by kk guests. The dinner was quite a success: every person has eaten several dishes (though the number of dishes was the same for every person) and every dish was served alongside with a new set of kitchen utensils.  

All types of utensils in the kingdom are numbered from 11 to 100100. It is known that every set of utensils is the same and consist of different types of utensils, although every particular type may appear in the set at most once. For example, a valid set of utensils can be composed of one fork, one spoon and one knife.  

After the dinner was over and the guests were dismissed, the king wondered what minimum possible number of utensils could be stolen. Unfortunately, the king has forgotten how many dishes have been served for every guest but he knows the list of all the utensils left after the dinner. Your task is to find the minimum possible number of stolen utensils.  
```

英语是硬伤，这道题我看了N遍，依旧没明白。  
最后反复看样例与样例说明，终于看懂了。  


题意：所有人吃了 a 轮套餐，每轮套餐有 b 个餐具。每轮套餐所有人吃的都一样。    
由于有些人偷走了一下餐具，计算最少有多少个餐具。  

## 二、分析


输入是每个餐具剩余的个数 left 和人数 k 。  
根据餐具的最大个数，可以计算出最少吃了几轮套餐 `loopNum = max(b) / k` 。  
计算出餐具总是： `allB = loopNum * k  * b`  
被偷走的餐具：  `allB - left`  

![](cf-422-div2-a.png) 



---


本文首发于公众号：天空的代码世界，微信号：tiankonguse-code。  


