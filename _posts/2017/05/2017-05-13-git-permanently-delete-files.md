---  
layout:     post  
title:      git永久删除文件记录
description: 前年我把我的书签导出来放在github上了,安全组的同事找过来说需要删掉,于是了解了一下怎么从git上永久删除文件.           
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateData:  16:49 2017/5/13 
published: true  
---  
  
  
>   
> 大家好，这里是tiankonguse的公众号(tiankonguse-code)。    
> tiankonguse曾是一名ACMer，现在是鹅厂视频部门的后台开发。    
> 这里主要记录算法，数学，计算机技术等好玩的东西。   
>      
> 这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/kjuZuB6l80e49rP_cJEr_g)自动同步过来。    
> 如果转载请加上署名：公众号tiankonguse-code，并附上公众号二维码，谢谢。    
>    
  

## 零、背景


前年我在github上创建了一个项目[everyday-bookmarks](https://github.com/tiankonguse/everyday-bookmarks).  
用于储存每天遇到的需要加入书签的网页.  
后来加入了几个公司内网的网页, 在外这些地址是无效的,因为这些域名是内部域名.   
但是安全小组的同事找过来, 说几个链接需要删除, 于是我就查询了一下怎么永久从github上删除曾经提交的东西.  
  

## 一、版本控制的特性

git是一个版本控制软件, 所以就有一个特性了：保存了历史上的所有操作, 可以还原到历史上的任何一个时间点。  
这个功能对于项目来说很好，可以回到过去的任何时间点。  
但是对于一些错误的操作，比如把密码等机密文件传上去了，比如把一个很大的文件传上去了，我们后面即使删除了这些，那些删除的还是可以还原回来的。  
但是我们的目的是想彻底删除那些文件，使用任何操作都不能还原那些文件。  
所以这里需要找到一个方法来彻底删除文件。  


## 二、版本控制的原理

git会为每一个文件生成一个SHA-1值,有一个key-value储存系统储存这个映射关系.  
然后使用一个树形的索引来标示项目这个目录树.  
有版本的目录树如下图:  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/4225621194.png)


假设我们删除文件,然后新提交一个版本, 只是新版本的目录树没有指向那个文件,但是文件对象还在的.  
然后我们版本回退的时候,还是可以找到那个文件的.  



## 三、彻底删除


上面看了git的版本控制原理,那我们就可以根据这个原理来彻底删除文件了.  

我们需要找到那个文件,先从树形索引中把文件全部删除, 再从具体的key-value储存中删除即可.  

删除树形索引命令如下:  

```
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch PATH-TO-YOUR-FILE-WITH-SENSITIVE-DATA' --prune-empty --tag-name-filter cat -- --all
echo "YOUR-FILE-WITH-SENSITIVE-DATA" >> .gitignore
git add .gitignore
git commit -m "Add YOUR-FILE-WITH-SENSITIVE-DATA to .gitignore"
git push origin --force --all
git push origin --force --tags
```

索引删除后, key-value储存系统中虽然储存了对应的数据, 但是没有对应的key了, 相当于一种内存泄露了.  
所以需要把这里面的内容也删了, 这里成为垃圾回收.  

```
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now
```


## 四、结语


好了，看到这里差不多就可以彻底删除git的历史记录了.  

参考资料: 

1. [Removing sensitive data from a repository](https://help.github.com/articles/removing-sensitive-data-from-a-repository/)   
2. [Git 内部原理 - Git 对象](https://git-scm.com/book/zh/v1/Git-%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86-Git-%E5%AF%B9%E8%B1%A1)


对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
小密圈这周接受免费加入，欢迎大家加入看各种算法的思路。  

![](http://res.tiankonguse.com/images/suanfa_xiaomiquan.jpg)  
  
  
长按图片关注公众号，接受最新文章消息。   
  
![](http://res.tiankonguse.com/images/weixin-50cm.jpg)  
  
  
  