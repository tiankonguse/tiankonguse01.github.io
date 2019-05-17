---   
layout:     post  
title:  《算法互动编程》操作指南（二）
description: 之前提到使用github页面操作有问题，这里教你另外两个方法。    
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateData: 2019-05-02 23:24   
published: true 
wxurl: https://mp.weixin.qq.com/s/WyU9lAzilCDF6t-037cGtw  
---  


## 一、背景  


之前已经写了两篇文章，分别是《[代码管理指南](https://mp.weixin.qq.com/s/NYAGJvHuCEtLh8fWHOzujw)》和《[三个原则](https://mp.weixin.qq.com/s/sOk4eAOs7jggEb2bpgNEwg)》来说明通过 github 互动编程时遇到的问题。  
同时提到，使用软件或者命令行来操作，就不存在那些问题。  


这篇就来介绍一下如何使用软件和命令行完美解决这个问题。


## 二、分支规范  


为了更好地互动编程，大家 Fork 项目之后，会维护三个分支，名字和功能如下。  


1.master 分支：默认分支，需要和原项目保存完全一致。  
2.base 分支：名字格式是 base-{昵称}，后续你的所有变更都提交在这个分支上。  
3.from 分支：名字格式是 from-{昵称}，每次进行 PR 时从 master 分支创建出来，然后把 base 分支合并上来，然后进行 PR，当 PR 结束的时候，需要删除 。  


对于不熟悉 git 的同学，建议都通过 github 页面进行创建。  


## 三、操作说明  


1.安装  


请去 https://desktop.github.com/   下载安装软件 或者 自己搭建命令行环境。  


2. 拉去自己 Fork 的项目  


命令行： `git clone url`  
软件如下：  


![](http://res.tiankonguse.com/images/2019/05/02/001.png)  


3. 同步原项目代码  


命令行：  


```
1. git remote add upstream https://github.com/tiankonguse/leetcode-solutions.git  
2. git fetch upstream master  #拉去最新数据  
3. git merge upstream/master  #合并  
4. git push origin master #推送到 github  
```


PS：正常同步时，你可以看到 Fast-forward 这个词。  
如果不是这个词，说明你的项目有问题，可以删除重新 Fork。  


软件操作步骤：  

```
1.切换到master分支  
2.菜单->Branch->Merge in Current Brabck  
3. 弹出的选择框里选择 upstream/master （代表原项目）  
```


![](http://res.tiankonguse.com/images/2019/05/02/002.png)  


目前，只是修改的本地 master，还需要同步到远程  


![](http://res.tiankonguse.com/images/2019/05/02/003.png)  


4. 同步开发分支  


由于原项目可能有更新，所以你的分支也需要同步这个更新。  
这个可以通过 github 的页面来完成同步（会新增一个提交），也可以通过软件或命令行来同步（不会新增提交）。  
如果没出现冲突代表正常，出现冲突代表你修改了不属于你的文件。  



```
git checkout base-{昵称}
git merge master
git push origin base-{昵称}
```


5. 创建新的提交分支  


可以通过 github 的页面，基于 master 分支来创建新的提交分支。  
也可以通过软件或者命令行来操作。  


```
git checkout master
git branch -d from-{昵称} # 删除本地分支
git push origin --delete from-{昵称} #删除远程分支

git checkout -b from-{昵称} #创建本地分支
git merge base-{昵称} # 你的最新修改合并到提交分支
git push origin from-tiankongever #提交分支提交到 github页面
```


之后，在 github 页面发起 pull request 操作。  


## 四、最后


好了，除了向原项目发起 pull request ，其他操作建议大家都在命令行里练习一下。  
刚开始对于不熟悉 git 的同学会比较有挑战性，希望不会难倒你。  
如果有任何疑问，可以加 QQ 群来反馈问题。  



-EOF-  


