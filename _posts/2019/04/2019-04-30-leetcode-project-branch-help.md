---   
layout:     post  
title:  《互动编程》代码管理初步指南  
description: git 代码管理其实是有门槛的，这里简单介绍一下。  
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateData: 2019-04-30 23:24   
published: true 
wxurl: https://mp.weixin.qq.com/s/WyU9lAzilCDF6t-037cGtw  
---  



## 一、背景  


前几天，启动了《[Leetcode算法互动编程](https://mp.weixin.qq.com/s/V1IeDxJibC30wyK9nJwp_w)》项目，后来做《[Leetcode第134场比赛回顾](https://mp.weixin.qq.com/s/SjT3CsmIZZthMmfU58ZbTg)》时，也体验了一下 github 的协同开发项目。  


发现当多个人同时来提交代码时，分支的合并与同步是一个很大的问题。  
很容易就发生冲突了，进而一不小心无法合并到主干了。  
所以这里计划写一篇文章来探讨这些问题。  


## 二、理想操作  


理想情况下，我们的操作是 Fork 项目、创建自己的分支、做题加代码、提交 Pull request、等待被合并。  
步骤如下：  

1. Fork Leetcode互动编程项目  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-001.png)  


2. 创建自己的专有分支  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-002.png)  


3.在自己的分支下添加自己的代码  


注意：请在自己的分支下写代码！  
注意：请在自己的分支下写代码！  
注意：请在自己的分支下写代码！  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-003.png)  


4.进行 Pull request  


这里要做的是：将你的项目下的你的分支 合并到 原项目 的 master 分支。  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-004.png)  


5.等待原项目的负责人合并代码  

此时，整个流程图像这个样子。  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-005.jpg)  


## 三、正常情况    


是的，理想情况只有第一次可能会遇到（Fork 后马上提交 Pull request）。  


正常情况是，你做完题要提交 Pull request 的时候，原项目的 Master 已经 Commit 了很多次了。  


这个时候，我们就需要先将原项目同步到自己项目的Master，然后与自己的分支合并，最后再提交  Pull request。  


大概步骤如下：  


1. 第一步是同步原项目 Master  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-006.png)  


点击 Merge pull request、接着点击 Confirm merge。  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-007.png)  


此时可以发现，你的项目多了一次提交。  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-008.png)  


2.第二步你的项目的Master同步到你的分支  


选择从你的 master 分支 合并到 from开发分支。  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-009.png)  


之后，你在确认合并（选择第一个 Merge pull request选项）。  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-010.png)  


之后，你可以在你的 from开发分支共可以看到至少四个提交：  


1.之前自己的提交  
2.原项目的提交（可能有多条）  
3.原项目同步到自己master的提交  
4.自己master同步到from开发分支的提交。  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-011.png)  


3. 在分支里做题，进行提交 Pull request  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-012.png)  


4. 原项目负责人合并代码  


此时，在合并页面将会看到你有四次提交，甚至更多次的提交。  
这里的四个提交是由于 github 默认是 no-ff 默认导致的，即合并的时候，即使两个分支一模一样，也会创建一个空的提交。  


项目负责人肯定不希望将你的这些提交记录全部体现在原项目里，而仅仅希望展现一次提交。  
此时，项目负责人可能有两种选择：一种是 Squash 方式合并，一种是 Rebase 方式合并。  


这里我选择的是 Squash 保留一个记录。  
在 github 上，Rebase 与 Squash 的区别我没看出来，毕竟提交者的分支我没有权限修改。    
如果谁有相关看法可以留言告诉我(github上的区别，不是命令行上的)。  


## 四、事情并没有结束  


如果你继续使用上一小节的操作来进行一遍，一会发现提交记录一直在累积。  
比如我操作了一下，原项目的四个提交，加上三次同步合并新增三次提交，共有七个提交了。  


![](http://res.tiankonguse.com/images/2019/04/30/leetcode-project-branch-013.png)  


如果在操作一遍，就会变成 10 个提交了。  


这是因为你的分支上的记录始终都存在。  
所以这里不能直接合并，建议大家每次先将原先的分支删除，然后从 master 创建新的分支来提交代码。  


那有没有想过解决方法吗？  
当然有了，不过这个需要使用命令行来操作。  
使用命令行的时候，可以不创建新的提交，就可以原项目到你的项目，master到你的分支的同步。  
而原项目如果没有变更，也可以不创建新的提交完成合并。


不过当你的分支有多次提交时，原项目合并时只会生成一个提交，这里会导致下一轮同步不一致（旧的提交依旧存在，像上面那样不断累加）。
这个一般也需要在本地先创建临时分支进行 rebase 合并，然后将合并后的提交推送到 原项目。  


不过这种高级的操作我也在学习中，这里暂时就不献丑了，后面我操作熟悉了可以整理一份文档来。  


这段说的比较抽象，总结一下就是：每次提交前，请从 master 创建分支来提交，请不要使用旧分支来提交（你会git 相关命令除外）。



-EOF-  


