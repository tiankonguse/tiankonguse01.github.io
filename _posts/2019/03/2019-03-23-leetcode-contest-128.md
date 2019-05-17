---   
layout:     post  
title:  【算法】Leetcode 第128场比赛回顾  
description: 做了 Leetcode 上的第128场比赛，简单看一下都是什么题吧。  
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateData: 2019-03-09 23:24   
published: true 
wxurl: https://mp.weixin.qq.com/s/sEVM7NfgqwzrYxxvzUlUJQ  
---  


## 一、背景  


之前已经写了几场比赛记录了，如第88场、第101场、第126场、第127场比赛。  
上周团队一起做了第128场比赛，现在记录一下题解吧。  


## 二、十进制整数的反码  


题号：1012   
题目：Complement of Base 10 Integer  
地址：https://leetcode.com/problems/complement-of-base-10-integer/  
源码：https://github.com/tiankonguse/leetcode-solutions/blob/master/contest/128/A.cpp  


题意：给一个十进制整数`N`，求其二进制表示的反码对应的十进制整数。  


例如，`5`的二进制是`101`，反码就是`010`，对应十进制`2`。  


对于这道题，有两个方法。  


第一个方法就是按照题意，进行模拟。  
第一步十进制转二进制。  
第二步二进制翻转得到新二进制。  
第三步新二进制转十进制。  


![](http://res.tiankonguse.com/images/2019/03/leecode-128-001.png)  


第二个方法，就需要仔细观察这道题了。  


还是看`5`这个例子，二进制是`101`,反码是`010`，相加就是`111`。  
我们如果先得到`111`的话，减去`101`，就可以得到`010`。  
使用十进制表示先得到`7`，减去`5`，就得到答案`2`。  


那如何得到`111`呢，也可以简单计算得到是`2^bit(n) - 1`。  


![](http://res.tiankonguse.com/images/2019/03/leecode-128-002.png)  


## 三、总持续时间可被 60 整除的歌曲  


题号：1013  
题目：Pairs of Songs With Total Durations Divisible by 60  
地址：https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60/  
源码：https://github.com/tiankonguse/leetcode-solutions/blob/master/contest/128/B.cpp  


题意：给一堆歌曲的时长，求满足任意挑两首歌曲其总时长是`60`的倍数的组合数量。  


歌曲总共有`60000`首，如果循环暴力计算的话，复杂度将是`O(n^2)`，显然不可接受。  


考虑到取模数字是`60`，那么对于数字`N`和`N+60`对我们来说是没区别的。  
所以我们可以先对所有数字按`60`取模分类，统计其个数。  


则对于取模为`1`的，肯定需要和取模为`59`的进行匹配，而匹配总量则是两个数字的个数。  
对于`1` 到 `29`都可以这样计算。  
而对于`0`和 `30`，则需要在自己的集合里面匹配，所以匹配总量是集合里任意挑两个，即`C(n, 2)`。  


![](http://res.tiankonguse.com/images/2019/03/leecode-128-003.png)  


## 四、在 D 天内送达包裹的能力  


题号：1014  
题目：Capacity To Ship Packages Within D Days  
地址：https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/  
源码：https://github.com/tiankonguse/leetcode-solutions/blob/master/contest/128/C.cpp  


题意：给`N`个有顺序的包裹以及每个包裹的重量，传输带每天运输一次包裹，但传输带有承受重量。假设我们要在`D`天内运输完包裹，其最低的承受重量。  


假设我们已经知道了一个承受重量值，如何求最低多少天可以运输完呢？  
这个很快可以想到，扫描一遍即可判断（之前好像分享过这个类型的题）。  


具体扫描法就是扫描有序的包裹。  
如果传输带可以放下，则进入下个包裹。  
如果放不下了，则天数加一，用新的传输带来放当天的包裹。  
这样循环到最后时，我们就计算出了最低需要几天可以运输完。  


现在是求指定天数，求最低承受重量。  
可以想到的就是枚举每个重量，来判断是否满足答案。  
这个时候复杂度就是`O(sum(weights) * N)`，其中`sum(weights)`为包裹的总重量，`N`为包裹的总个数。  
面对这个复杂度，根据题意的数据显然太高了，所以需要进行优化。  


其实，面对最优问题，二分往往是一个很好的优化方向。  
这道题求最低的承受重量恰恰可以二分。  
承受重量可以二分`max(weights[i])` 到 `sum(weights)`。  
这个区间内，前半段是`D`天内无法完成运输，后半段是可以完成运输，而区间的分界线就是最优答案。  


![](http://res.tiankonguse.com/images/2019/03/leecode-128-004.png)  


## 五、至少有 1 位重复的数字  


题号：1015  
题目：Numbers With Repeated Digits  
地址：https://leetcode.com/problems/numbers-with-repeated-digits/  
源码：https://github.com/tiankonguse/leetcode-solutions/blob/master/contest/128/A.cpp  


题意：给一个十进制正整数`N`，求小于等于`N`且至少有一位重复数字的正整数个数。  


这道题和之前比赛《[Leetcode 第101场比赛](https://mp.weixin.qq.com/s/pxxku3_Ld4BFGmPM6cM-Fw)》的第三题 最大为 N 的数字组合 很类似。  
那道题是求满足集合内元素组成的数字个数，这道题是位数有重复的个数。  


面对这道题，也有两个方法。  
第一种就是直接计算有重复的答案，另一种是先计算不重复的答案，然后相减即可。  
两种其实是等价的，这里使用先计算不重复的答案，然后相减来讲解。  


小于等于`N`的数字里面，不重复的个数分两类：  


第一类是位数小于`bit(N)`的，此时那些位置是随便填充，但不能重复，所以是一个排列。  
考虑到首尾不能是前缀`0`，所以答案是`9 * A(9, bit - 1)`。  


第二类是位数等于`bit(N)`的，此时也分两种。  
第一种是小于当前数字，只要不重复，之后的随便填充，答案是`A(leftNum, leftBit)`。  
第二种是等于当前数字的，之后的待确定，需要递归判断。  


![](http://res.tiankonguse.com/images/2019/03/leecode-128-005.png)  


## 六、最后  


这次比赛其实题都比较简单，可惜我敲代码的速度太慢，最后一题差几分钟才敲完。  
现在看看整场比赛，前两道题比较简单，第三题二分，第四题递归，都算是比较简单的题。  
尤其是最后一道题，感兴趣的可以去看看之前讲解的集合内挑数字的那道题，两道题其实是一模一样的。  


PS：我的所有`leetcode`代码都分开放在 github 上。  
地址是： https://github.com/tiankonguse/leetcode-solutions  
感兴趣的可以去看相关题的源代码。  


![](http://res.tiankonguse.com/images/2019/03/leecode-128-006.png)  


PS2：听说今天腾讯的上海机房光纤被挖断了。  
之前各个产品和项目的`PPT`上都宣称自己各种高可靠、异地部署等各种`999%`的容灾，此时检验`PPT`的时候到了。  


-EOF-  


  
