---   
layout:     post  
title:      找到数组中重复的数字   
description: 这不是一道异或题，但依旧很简单。  
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateData:  23:59 2017/8/20  
published: true  
---  
  
  
>   
> 大家好，这里是tiankonguse的公众号(tiankonguse-code)。    
> tiankonguse曾是一名ACMer，现在是鹅厂视频部门的后台开发。    
> 这里主要记录算法，数学，计算机技术等好玩的东西。   
>      
> 这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/Cte5aGAGuwAQ5tmQXTPhGw)自动同步过来。    
> 如果转载请加上署名：公众号tiankonguse-code，并附上公众号二维码，谢谢。  
>   
>    
  

## 零、背景

今天台风鸽子来了，然后又飞走了。  
趁着还早，抽几分钟分享一道简单的算法题。  


## 题意

给一个数组，有n个数，值在[1,n]之间，出现的数字要么出现一次要么两次。  
求不额外开辟数组空间且使用`O(n)`算法求出所有的重复数字.  


## 分析

第一眼看到这道题的时候，还以为是异或题。  
结果一看有多个重复的数字，还使用O(n)算法, 就没有思路了.  


此时反复读题3边，发现特殊之处在于n个数字的值都是[1,n]之间。  
那突破口就在这里了。  


由于n个数字的值都不大于n, 我们就可以通过置换的方案,将值是谁的数字置换到值所在的位置。  
这样顶多置换N次所有位置的值都肯定和位置这个数字相等了。  


那怎么判断是否重复呢？置换前先判断所在位置是否已经存在相等的值，已存在，则找到一对重复值，然后两个位置的值都值空即可。  


## 代码

```
vector<int> findDuplicates(vector<int>& nums) {
    
    #define GET_VALUE(pos) nums[pos - 1]
    #define SET_VALUE(pos, value) nums[pos - 1] = value
    
    vector<int> ans;
    int nowPos = 0, realPos = 0;
    
    //由于最多有N个数字, while循环累计执行N次, for循环也执行N次,总共执行2N次
    for(nowPos = 1; nowPos <= nums.size(); nowPos++){
        while(GET_VALUE(nowPos) != nowPos && GET_VALUE(nowPos) != 0){
            realPos = GET_VALUE(nowPos);
            
            //找到一对相等的
            if(GET_VALUE(realPos) == GET_VALUE(nowPos)){
                ans.push_back(GET_VALUE(nowPos));
                SET_VALUE(realPos, 0);
                SET_VALUE(nowPos, 0);
            }else{
                std::swap(GET_VALUE(nowPos), GET_VALUE(realPos));
            }
            
        }
    }
    
    return ans;
}
```

## 八、总结

这道题虽然不是一道异或题,但依旧是一道简单题。    

  
对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
欢迎大家加入看各种算法的思路。  

![](/images/tiankonguse-algorithms.png)  
  
  
长按图片关注公众号，阅读不一样的技术文章。   
  
![](/images/tiankonguse-code.gif)  
  
  