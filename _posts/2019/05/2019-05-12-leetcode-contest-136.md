---   
layout:     post  
title:  Leetcode第136场比赛回顾  
description: 这次做比赛依旧是考察动态规划、二分查找。  
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateData: 2019-05-12 23:24   
published: true 
wxurl: https://mp.weixin.qq.com/s/WyU9lAzilCDF6t-037cGtw  
---  


## 零、背景  


这次比赛，涉及四种题型：简单计算、贪心、动态规划、后缀树或二分查找。  


上篇文章《[Leetcode第95场比赛回顾](https://mp.weixin.qq.com/s/VfSfndvIv2lCEpIENOCq0A)》提到，我这次比赛尝试在页面上写代码，结果被坑了。  
前两道题在页面上写了半个小时，各种不顺，最后赶紧切换到本地，几分钟就过了。  
到最后一题的时候，我的解题思路是对的，但是题目有问题看错题了，最终没过。  


下面来看看这四道题吧。  


PS：上篇文章还提到，做的算法题目前没有很好的分类关系，可以使用自己的博客或者知识星球的标签来管理。  
最终决定使用知识星球来管理，这个是一个免费的知识星球，感兴趣的同学可以加入。  

![](http://res.tiankonguse.com/images/2019/05/12/001.jpg)  


## 一、困于环中的机器人  


题意：一个机器人在原点`(0,0)`，默认方向朝北，按下面三个指令行动。  


* `G` 朝当前方向前进一步  
* `L` 左转`90`度  
* `R` 右转`90`度  


机器人然后按顺序执行一串指令，并且可以重复执行下去。  
问机器人是否会在一个固定路线转圈？  


思路：既然机器人是重复执行这串指令，若在固定路线转圈，则肯定是重复若干次后，回到了原点。  
否则路线肯定不能固定。  


接下来看什么时候可以回到原点。  


如果第一次执行完一串指令后，就在原点，则可以保证是固定路线。  
如果第一次执行完执行后，不在原点，假设此时新的方向是`dir`。  
如果`dir`不是北方，则一定可以回到原点。  


证明如下：  


如果`dir`指向南方，则下一次执行完，机器人就回到原点（180度镜像原理）。  
如果`dir`指向东方或北方，则第四次执行完，机器人就回到原点（90度镜像原理）。  


所以，为了简单起见，只需要让机器人重复执行四次指令串，然后判断是否在原点即可。  
当然，也可以直接判断方向是不是北方。  


## 二、不邻接植花  


题意：有 N 个花园，按从 1 到 N 标记。在每个花园中，你打算种下四种花之一。  
paths[i] = [x, y] 描述了花园 x 到花园 y 的双向路径。  
你需要为每个花园选择一种花，使得通过路径相连的任何两个花园中的花的种类互不相同。
四种花的编号分别是`1,2,3,4`。  


思路：考虑到这道题难度是 `easy`，那果断进行贪心了。  
贪心：从左到右依次判断当前花园可以染什么色，随机选一个即可。  
判断标准：只要和前面染色的花园不冲突即可。  
就这样，我就过了这道题。  


疑问：怎么证明贪心一定正确呢？  
我们的目标不是把这道题通过，而是要理解这道题为什么可以这样做。  


有`4`种颜色，每个花园的度数最多为`3`。  
假设某个花园周围都已经染色了，会不会当前花园没法选颜色呢？  
什么时候没法选？周围把所有颜色都用完了。  
那周围用了多少个颜色？最多`3`个。  
也就是永远也用不完，即永远可以找个一个颜色来染色。  


好无聊是不是？  
但就是这样一个逻辑推理，很多人理解不了。  
甚至有大牛这道题没做出来。  



## 三、分隔数组以得到最大和  


题意：给出整数数组 A，将该数组分隔为长度最多为 K 的几个（连续）子数组。  
分隔完成后，每个子数组的中的值都会变为该子数组中的最大值。  
返回给定数组完成分隔后的最大和。  


思路：最最基础的动态规划题。  
定义`f(n)`为前`n`个数字可以得到的最大和。  
则对于最后一个数字可以划分为两部分：  


1. `[n-k+1, n]`划分为一个整体,结果为`max(n-k+1, n) * k`  
2. `[1, n-k]`递归去计算，即`f(n-k)`  


这种划分，共有`K`中情况，我们要取结果最大的那个。  
复杂度：`O(n*K)`  


思考题：这道题能继续优化吗？比如利用单调性，把复杂度优化到`O(n)`吗？  


## 四、最长重复子串  


题意：给出一个字符串 S，求重复子串的最大长度。  
注：重复子串允许两个串有部分重叠。  


PS：原题的描述有很大的问题，很容易错误的理解为两个重复子串必须连续。  
赛后看了其他人的代码，才知道是任意子串。  


思路：这道题显然是后缀数组的模板题，可是我不会后缀数组。  
看到是求最大值，于是我就往二分的方向思考，发现二分确实可以做这道题。  


对最大长度k 进行二分`log(n)`，然后判断这个长度 k 是否有答案`O(n)`。  
对于判断是否存在长度 k 的重复子串，最笨的方法需要`O(n^2*k)`的复杂度。  
使用`set`把子串存起来，后面只需要在`set`里判断子串是否出现过，此时需要`O(n*k*log(n))`的复杂度。  
而使用`hash`与滑动窗口的方法，则可以把`k`优化掉，从而变成`O(n*log(n))`的复杂度。  
综合复杂度就是`O(n*log(n)^2)`。  


这里的`hash`需要满足滑动窗口的性质，可以快速从左边出一个字符，右边快速进入一个字符，更新hash只需要`O(1)`的复杂度。  
这个方法的一种实现是把字符串当做`26`进制的数字（假设都是小写字母），然后计算出这个字符串对应十进制数字的值。  
由于数字可能很大，这里想固定的数字取模。  
由于在加减乘三个运算里先取模与后取模不影响结果，所以最终`hash`出的数字也相等。  


PS：对于后缀数组，如果有机会，后面我会进行专题讲解（目前专题讲解到二分查找了）。  


思考题：你能构造出一个`case`，使得`hash`冲突的吗？
即对于不同的两个字符串`S1`和`S2`，按照上面的`hash`运算后，得出的数字一样。  


![](http://res.tiankonguse.com/images/2019/05/12/002.png)  


## 五、最后  


这次比赛最后一题有点坑，前两天虽说简单，但是不简单逻辑推理一番，也不容易得到结论。  


PS：以后我还是在自己的 IDE 上写代码吧。 如果你不在浏览器上写代码的话，可以考虑用我的模板。  
地址：https://github.com/tiankonguse/leetcode-solutions/tree/master/include  


-EOF-  

