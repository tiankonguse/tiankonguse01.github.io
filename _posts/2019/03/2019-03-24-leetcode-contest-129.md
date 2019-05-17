---   
layout:     post  
title:  【算法】Leetcode 第129场比赛回顾  
description: 做了 Leetcode 上的第129场比赛，简单看一下都是什么题吧。  
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateData: 2019-03-24 23:24   
published: true 
wxurl: https://mp.weixin.qq.com/s/vp9OTJqfeidVhLxURxpi6g  
---  


## 一、背景  


之前已经写了几场比赛记录了，如第88场、第101场、第126场、第127场、第128场比赛。  
今天上午我做了第129场比赛，现在记录一下题解吧。  


PS1：今天的比赛时间比以往来的更早了一些，竟然提前一个小时开始了。  
PS2：这次先分享第一题、第三题、第四题，最后分享第二题。  
PS3：这次比赛题目的难度分级有很大的问题，尤其是第二题。  


## 二、将数组分成和相等的三个部分  


题号：1020  
题目：Partition Array Into Three Parts With Equal Sum  
地址：https://leetcode.com/problems/partition-array-into-three-parts-with-equal-sum/  
源码：https://github.com/tiankonguse/leetcode-solutions/blob/master/contest/129/A.cpp  


题意：给一个数组，求分成能否分成三个连续的子数组，使得三个子数组的和相等。  


之前做过类似的题，不过那道题是判断是否存在一个连续的前缀子数组，其和等于指定的数字。  
前缀子数组定义为这个子数组数给定数组的前缀，也就是前一部分组成的数组。  


对于前缀子数组问题，一层循环累加即可判断是否存在答案。  
而对于三个连续子数组，则可以转化为前缀子数组问题。  


当然，转化前，我们需要先判断是否存在答案，即总和`sum`是否是`3`的倍数。  
存在答案了，则子数组的和`minsum`也就确定了，都是`sum`的三分之一。  


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-001.jpg)  


之后先找到第一个前缀子数组，然后找到第二个，则存在答案，否则不存在。  


第一个很好求，对于第二个，只需要从第一个子数组之后开始查找即可。  


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-002.png)  


## 三、最佳观光组合  


题号：1021  
题目：Best Sightseeing Pair  
地址：https://leetcode.com/problems/best-sightseeing-pair/  
源码：https://github.com/tiankonguse/leetcode-solutions/blob/master/contest/129/C.cpp  


题意：给一个数组，任意挑两个位置`(i, j)`，其得分是`A[i] + A[j] + i - j`，求最大得分。  
数据范围：`[2, 50000]`  


这道题最先想到的是暴力的方法，但是复杂度是`O(n^2)`，肯定会超时。  
所以我们就想能不能更快的解决这个问题，比如`O(n log(n))`或者`O(n)`。  


如果向`O(n log(n))`的解决问题，那么问题可以转化为：对于每个`j`，我们可以二分查找找到前面的最优答案`i`。  
此时我们把公式转化一下，`j`的值固定，是`A[j]-j`；`i`的值是`A[i] + i`。  
而我们的目标是找到最大的`A[i]+i`。  


此时，我们可以发现，根本不需要二分了，对于每个`i`，公式`A[i]+i`都是固定的。  
即令`maxPre(n) = max(A[i] + i), 1<=i<=n`  
则`maxPre(n+1) = max(maxPre(n), A[n+1] + n+1)`。  


我们扫描一遍即可找到所有`j`之前的`max(A[i] + i)`。  


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-003.png)  



## 四、子串能表示从 1 到 N 数字的二进制串  


题号：1023  
题目：Binary String With Substrings Representing 1 To N  
地址：https://leetcode.com/problems/binary-string-with-substrings-representing-1-to-n/  
源码：https://github.com/tiankonguse/leetcode-solutions/blob/master/contest/129/D.cpp  


题意：给一个二进制串`S`和正整数`N`，问所有小于等于`N`的数字对应的二进制是否都是`S`的子串。  
数据范围：字符串长度`[1,1000]`，`N`的范围`[1,10^9]`。  


看到`N`的数据范围，我们肯定不能枚举所有小于等于`N`的数字了。  


但是考虑到，小于等于`N`的数字对应的二进制串是互不相同的 
而我们的二进制子串最大有`1000*(1000+1)/2`个。  
当`N`大于二进制子串总个数时，肯定是没有答案的。  


所以到这里，`N`的数据范围就变成了`[1, S^2]`，令`S = 1000`。  


此时枚举小于等于`N`的数字，然后判断是不是子串就可行了。  


此时，暴力查找子串的话，复杂度就是`O(S^2 * S * log(N))`。  
查找子串可以使用`KMP`优化，则复杂度变成了`O(S^2 * S)`。  
由于子串是多次查询的，此时也可以使用字典表前缀树来优化，则复杂度是`O(S^2 * log(N))`。  


前面是枚举所有的整数，由于整数一个都不能少，所以复杂度比较高。  
而我们枚举所有的子串，并统计得到不同整数的个数的话，如果有答案，则个数肯定等于`N`。  
此时复杂度则降为`O(S * log(N))`，算是最优了。  


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-004.png)  


## 五、可被 K 整除的最小整数  


题号：1022  
题目：Smallest Integer Divisible by K  
地址：https://leetcode.com/problems/smallest-integer-divisible-by-k/  
源码：https://github.com/tiankonguse/leetcode-solutions/blob/master/contest/129/B.cpp  


题意：给一个正整数`K`，判断是否存在一个整数`N`，`N`的十进制数字全是`1`，并且`N`可以正整除`K`，即`N%K=0`。  


这道题转化一下就是，给一个`K`，存在一个数`A`，使得`A*K == N`，且`N`满足条件。  


面对这道题，想到的第一种方法就是搜索出满足答案的数字`A`。  
首先，我们可以确定`K`的个位只能是`1,2,7,9`，因为其他数字和任何数字相乘各位都不是`1`。  


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-005.png)  


其次对于答案`A`的个数数字，可以根据`K`的个位数字`k0`来唯一决定了。  
因为其他数字与任何数字相乘，不能得到个位是`1`的乘积来。  
例如`K`的个位是`3`，则`A`的个位只能是`7`，其他的都不能得到数字`1`。


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-006.png)  


到第二位时，就变得复杂了。  
因为有进位，我们不再是得到`1`，而可能是任意数字，但这个数字根据之前的计算可以唯一确定。  
使用公式表达就是求一个数字`p`，使得`(k0 * p + preSum)%10 == 1`。  


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-007.png)  


公式转化一下，就是`(k0 * p)%10 == (11 - preSum%10)%10`。  
此时，可以里利用上面计算的映射表，实现一个`dfs`来找到答案。  
但是有一个致命的问题：`dfs`如果不能终止怎么办？  


不管那么多了，先提交再说。  
暴力搜索竟然过了，当然，这个是在结束比赛的时候提交的。  


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-009.png)  


既然暴力搜索可以过，代表一定存在答案，那反过来，枚举`1`的个数应该也可以过。  
假设`sum`是答案，且`sum`由`sum0 * 10 + 1`组成。  
因为`sum%K == 0`，所以我们可以推出`(sum0%K * 10 + 1)%K == 0`。  
所以累计计算的时候，需要不断的模`K`防止`sum`越界。  


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-010.png)  


那接下来的问题是：为什么？  
怎么证明答案一定可以在`O(n)`的复杂度计算出来。  


这个还是需要看我们的暴力搜索逻辑。  
面对关键的方程式`preSum = (preSum + K*P)/10`，假设其是收敛的，我们可以证明最多在`K`次循环内可以收敛到`0`。  


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-008.png)  


大家可以看上图，每次计算其实只与`preSum` 有关，我们可以证明`preSum`肯定小于`K`。  
证明如下：  
前提`preSum0=0 < k，0 <= p <= 9`  
零、`preSum1 = (preSum0 + k*p)/10`
一、`preSum0 + k*p < k + p*k`  
二、`preSum0 + k*p < 10*k`
三、`(pre + k*p)/10 < k`  
四、`preSum1 < k`  



前面是假设收敛可以证明循环有限，有限了就可以找到答案。  
那假设不成立呢？即会不会形成死循环，从而不会收敛。  
例如 `preSum`计算若干次后，又回到了自己这个值。  


这时候还需要分析`preSum1`和`preSum`的关系了。  
我们知道，`preSum`可以唯一的推出`preSum1`，那逆着会怎么样呢？  
经过简单计算，发现这个公式是可逆的，而且逆向的`preSum`也是唯一的。  


此时假设有环，则肯定指向第一个`preSum`即等于`0`，也代表找到答案。  
所以这里就证明了，在找到答案之前，是不可能形成死循环的。  


这里的必然存在答案是使用`preSum1`和`preSum`的关系证明。  
那有没有数学的证明公式呢？  
还真有！  


定义`bit(n)`代表`n`个`1`组成的数字。  
假设`bit(1) ~ bit(k)`都不能整除`k`，则他们模`k`后属于集合`[1,k-1]`。  


根据容斥原理，肯定有两个数字取模到一个余数了，假设是`bit(i)`与`bit(j)`。  
即`bit(i)%K == bit(j)%K`  
调整一下顺序，可以得到`(bit(i) - bit(j))%K == 0`。  


由于`bit(x)`的位置上全是`1`  
可以得到`bit(i)-bit(j) = bit(i-j)*10^(j)`。  
也就是前面有`i-j`个`1`，后面有`j`个`0`。  


由于`(bit(i) - bit(j))%K == 0`  
我们可以得到`bit(i-j)*10^(j) % K == 0`  
由于`K`的个位是`1,3,7,9`其中一个，所以`K`不可能是`2`和`5`的倍数。  
进而得到`10`与`K`互质。  
因此`bit(i-j)%K == 0`  
假设不成立，因此`1~k`内存在答案。  


看到这里，其实我们一直在证明如果`K`的个位是`1,3,7,9`时，循环`K`次肯定可以找到答案。  
也是就是证明，这道题在`O(k)`复杂度内可以计算出来。  


那有没有更优的算法呢？  
还是看题目：求最小的`n`使得`bit(n)%K == 0`。  
扩大`9`倍可以得到：`9*bit(n) % (9K) == 0`  
转化为`10`的倍数可以得到`(10^(n+1) - 1) % (9K) == 0`  
即`10^(n+1) % (9K) == 1`  


这个就是经典的欧拉问题了。  
通过欧拉函数，我们可以在`O(sqrt(n))`复杂度内计算出答案。  
由于我们计算的是`9K`的欧拉函数，而对于`K`，之间的关系又是确定的（这里不证明）。  
即答案是`9K`欧拉函数的其中一个约数。  
这个可以枚举所有约数来找到  
综合复杂度`O(sqrt(n))`  



## 六、最后  


这次比赛很坑。  
第二题的难度实际上属于`hard`的，缺标记为`medium`，并放在第二个。  


比赛的时候，10分钟做完第一题，第二题做了40分钟，一直在纠结会不会死循环。  
后来看时间不够了，赶紧做第三题和第四题，发现是水题，就赶紧过了。  
剩余的时间就都耗在第二题了。  


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-011.png)  


另外，我的`leetcode`模板根据使用的体验，准备做一个较大的优化。  
模板地址：https://github.com/tiankonguse/leetcode-solutions/tree/master/include  


具体优化即使不需要编写`test`函数了，已经使用宏封装好了。  
另外，头文件等与题无关的代码都移动到了`base.h`里面去了。  


![](http://res.tiankonguse.com/images/2019/03/leetcode-129-012.png)  


-EOF-  


  
