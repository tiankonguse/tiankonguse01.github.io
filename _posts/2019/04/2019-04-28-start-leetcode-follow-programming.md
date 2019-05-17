---   
layout:     post  
title:  启动《Leetcode算法互动编程》项目  
description: 昨天突发臆想，计划发起一个算法互动编程项目，今天正式开始。    
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateData: 2019-04-28 23:24   
published: true 
wxurl: https://mp.weixin.qq.com/s/WyU9lAzilCDF6t-037cGtw  
---  


![](http://res.tiankonguse.com/images/2019/04/28/20190428230001.jpg)  


## 一、背景  


昨天在《[计划发起一个练习算法项目](https://mp.weixin.qq.com/s/ThqNvzMQAmOI69j7t4mG8Q)》里提到，一个人学习算法理论是枯燥的，一个人刷题敲代码也是枯燥的。  
于是想找一些像学习算法的人，一起来刷题，这个项目叫做《Leetcode算法互动编程》。  


初期，我会不断的分享各种算法文章，并罗列一些简单的实践题。  
大家可以跟随着我的实践题来做题。做完之后按照这个项目的规则来进行互动，这样我们就知道你在努力学习算法了。  


到后期，可以一起参加比赛。  
比赛结束了，如果大家有兴趣，也可以来讨论你对某道题的想法，从而来互相学习。  


这篇文章主要来介绍一下如何参加到这个项目来。  


## 二、基本步骤  


1. 注册 github.com 账号。    
2. 使用浏览器打开 https://github.com/tiankonguse/leetcode-solutions  
3. 在页面右上角找到 fork 按钮，将该仓库 Fork 到你自己的账户中。  
4. 把代码拉取到本地(你也可以到时候上传文件，或者页面上创建文件)。  
   命令行：`git clone https://github.com/tiankonguse/leetcode-solutions.git`  
   IDE工具：使用 [Desktop for Github](https://desktop.github.com/) 将 [leetcode-solutions](https://github.com/tiankonguse/leetcode-solutions.git) 这个你 Fork 过来的仓库克隆到本地。  
5. 找到 tiankonguse-code 这个公众号，看最新一篇算法相关的文章，里面会提供几道题，尽量独立去做出来，一道题超过半小时没做出来，可以尝试看题解。如果都做完了，可以向前继续找其他文章。  
6. 自己做的题按照 `/problemset/题目/leetcode昵称-题目.代码语言后缀` 的格式放入到你 Fork 的项目里。  
  具体参考 [计划发起一个练习算法项目](https://mp.weixin.qq.com/s/ThqNvzMQAmOI69j7t4mG8Q) 这篇文章的截图。  
7. 将这些代码提交到自己的 github 仓库里。  
8. 将你的代码进行 Pull Request，来互动并记录你曾做过这道题。  


## 三、Pull Request 互动    

建议进行 pull request 之前，先参考下一小节《如何保持自己 Fork 的仓库与原仓库同步》来将代码保持同步。  


这里假设你已经在你的仓库里按照规范提交了你的代码。  


1. 创建新分支（如果存在先删除），命名为 from-<昵称>, 然后点击 Create Branch 建立新分支。  

注2：这个文档说明是比较简单粗暴，如果你自己已经会 github 相关操作，就不需要删除分支。  


![](https://raw.githubusercontent.com/tiankonguse/leetcode-solutions/master/images/pull-request-create-branch.png)  


2. 切换到新分支，点击 pull request 。  


![](https://raw.githubusercontent.com/tiankonguse/leetcode-solutions/master/images/pull-request-click-pull-button.png)  


3. 输入一个简洁的标题，内容罗列自己做的题目列表，并点击 Create pull request。  

注意输入标题之上的两行文字，第一行是 tiankonguse/leetcode-solutions ，base  是 master, 第二行是自己的仓库，compare 是 自己创建的分支。    


![](https://raw.githubusercontent.com/tiankonguse/leetcode-solutions/master/images/pull-request-create-again.png)  


4. 随后，Github 用户 @tiankonguse 即 leetcode-solutions 仓库的管理员，会收到一个 pull request 请求通知。  
如果管理员确认这个 Pull request 没问题，就会点击 Merge pull request 来通过这次合并。  


注意实现：


> 提交 Pull request 之前，必须先将你的 Fork 的 master 与原仓库同步  
> Pull request 之前，请创建一个新的分支  
> 提交时标题尽量简短且清楚地说明你在做什么，并在内容里罗列这一次做的题目列表  
> 耐心等待回复。  


## 四、自己 Fork 的仓库与 原仓库同步   



1. 在你 Fork 页面中如下图所示，点击 Compare 链接：


点击 Compare 之前，请确保当前分支是 master。


![](https://raw.githubusercontent.com/tiankonguse/leetcode-solutions/master/images/sync_fork_compare.png)


2. 将左边的 base repository 更改成当前自己的 Fork，在图示中即为 {你的昵称}/leetcode-solutions


如果上一步骤忘记切换为 master 分支，这一步骤还来得及补救，在左边的 base 里面选择 master。


![](https://raw.githubusercontent.com/tiankonguse/leetcode-solutions/master/images/sync_fork_choose_base_repository.png)


3. 这时候，页面会显示 Comparing changes， 点击 compare across forks 链接。


![](https://raw.githubusercontent.com/tiankonguse/leetcode-solutions/master/images/sync-fork-compare-across-forks.png)


4. 将右边的 head repository 更改成 tiankonguse/leetcode-solutions ，在图示中即为


![](https://raw.githubusercontent.com/tiankonguse/leetcode-solutions/master/images/sync-fork-choose-head-repository.png)


5. 此时你会看到比较结果。 然后点击 Create pull request（含义为将最新的 leetcode-solutions 合并到自己的项目中）


![](https://raw.githubusercontent.com/tiankonguse/leetcode-solutions/master/images/sync-fork-create-pull-request.png)


6. 你在 Pull requests 标签页里会看到你刚刚提交的 Pull request，点击 Merge pull request 按钮。


![](https://raw.githubusercontent.com/tiankonguse/leetcode-solutions/master/images/sync-fork-merge-pull-request.png)


7. 同意并合并之后，你的 Fork 与 远程最新的 leetcode-solutions 保持一致了。


![](https://raw.githubusercontent.com/tiankonguse/leetcode-solutions/master/images/sync-fork-finish.png)



当然，有时会出现一些你无法解决的问题，那么，还有一个最后的方法：


将你的 Fork 删除，而后重新到 https://github.com/tiankonguse/leetcode-solutions 页面拉取最新的代码。


## 五、最后  


上面介绍了参加这个项目的基本步骤和两个互动的教程。  


如果你感兴趣，建议马上参考这个文档教程来做第一道题：Two-sum，并走完全部流程。  


一旦你跨出了第一步，你就超越了大部分人。  


再看一下这张图：  


![](http://res.tiankonguse.com/images/2019/04/28/20190428230001.jpg)  


-EOF-  


