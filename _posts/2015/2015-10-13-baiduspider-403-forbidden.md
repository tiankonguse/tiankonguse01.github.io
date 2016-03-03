---  
layout: post
title:  百度蜘蛛被github拒绝了
category: [程序人生]
description: 之前做这个博客主要为了记录生活的点点滴滴, 所以并没有在意SEO什么的, 今天发现百度蜘蛛被github拒绝了
tags: [github, 程序人生]
keywords: [github, 程序人生]
updateData:   23:54 2015/10/13
---


## 背景

很早之前曾在百度的站长平台提交了 [sitemap](http://github.tiankonguse.com/sitemap.txt), 之后就不管它了.  
今天无意见发现百度几乎搜不到自己的记录集, 于是进入百度的站长平台, 发现百度没收录我的几篇记录, 后来找到原因了.  
github 直接把百度蜘蛛的请求拒绝掉了.  

如下图:  

```
以下是百度Spider抓取结果及页面信息：
提交网址：	http://github.tiankonguse.com/
抓取网址：	http://github.tiankonguse.com/
抓取UA：	Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)
抓取时间：	2015-10-13 14:19:13
网站IP：	185.31.18.133 已反馈，预计几分钟内完成更新
下载时长：	0.769秒
抓取异常信息：	拒绝访问  查看帮助 
返回HTTP头：
HTTP/1.1 403 Forbidden
Cache-Control: no-cache
Content-Type: text/html
Transfer-Encoding: chunked
Accept-Ranges: bytes
Date: Tue, 13 Oct 2015 06:19:15 GMT
Via: 1.1 varnish
Connection: close
X-Served-By: cache-lcy1122-LCY
X-Cache: MISS
X-Cache-Hits: 0
X-Timer: S1444717155.292409,VS0,VE98
Vary: Accept-Encoding
```

## 罗嗦两句  

做了一个网站, 如果空间提供商直接把搜索引擎的蜘蛛屏蔽了, 那将是一件很可怕的事情.  
但是我们使用gitpage作为我们的静态网站, 免费使用, github 要拒掉百度的蜘蛛我们也没啥说的.  
毕竟之前有人劫持百度流量攻击github这件事摆在眼前, 还是自身的安全第一.  

说了这么多, 问题已经存在: github 把百度的蜘蛛屏蔽了.  

从表面上看, 我们只好弃用 github 的静态网站了, 这样找个没有屏蔽百度蜘蛛的地方就行了.  

但是, 这对于一个码农来说, 是不现实的一件事.  

当初我的经历也蛮复杂的.  

* 第一阶段 使用免费域名和免费空间 (网站底部会被空间提供商嵌入广告)
* 第二阶段 自己买域名和空间自己实现博客(学习各种WEB技术)
* 第三阶段 使用 wordpress搭建博客 (累觉不爱, 想把重点放在写博客上)
* 第四阶段 自己实现简洁的博客 (重点放在写博客后, 追求简洁)
* 第五阶段 使用github 搭建博客 (只需要写篇文章, 提交一下就行了)


## 解决方案

既然不能放弃github, 那就想能不能让百度抓取自己的网站时, 抓的不是github, 而是自己网站的一个镜像.  

恩, 经过搜索, 发现已经有这样的提供商了.  

这里我使用 [gitcafe](https://gitcafe.com) 来镜像我的网站的.  


操作步骤大概如下:  


* 注册 gitcafe 帐号
* 创建一个跟用户名一样的项目
* 把 github 的项目推到 gitcafe 上面去

```
tiankonguse:tiankonguse.github.io $ git remote add gitcafe https://gitcafe.com/tiankonguse/tiankonguse.git
tiankonguse:tiankonguse.github.io $ git checkout -b gitcafe-pages
切换到一个新分支 'gitcafe-pages'
tiankonguse:tiankonguse.github.io $ git push gitcafe master:gitcafe-pages
Username for 'https://gitcafe.com': tiankonguse
Password for 'https://tiankonguse@gitcafe.com': 
Counting objects: 17, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (10/10), done.
Writing objects: 100% (10/10), 1.06 KiB | 0 bytes/s, done.
Total 10 (delta 8), reused 0 (delta 0)
To https://gitcafe.com/tiankonguse/tiankonguse.git
   f0d0296..51611d7  master -> gitcafe-pages
```

* 绑定自定义域名
   1. 点击项目的右上角的 项目配置
   2. 在项目的 基础设置 中配置项目主页
   3. 在 page服务 中添加自己的域名.


* DNS的配置中增加一项 CNAME.  
   我使用 dnspod 这个提供商来管理我的 DNS.  
   CNAME 一般可以按 解析路线 或者 网络类型来单独配置  
   我经过测试, dnspod 网络类型中的百度蜘蛛不起作用  
   后来一个一个尝试, 发现百度是联通网络, 于是把联通的网络映射到 gitcafe.io
   

好了, 到现在为止, 百度蜘蛛应该可以访问我们的网站了.  

如有疑问,可以评论或者给我发邮件.  

finish  


## 参考资料


* [gitcafe Pages 相关帮助](https://gitcafe.com/GitCafe/Help/wiki/Pages-%E7%9B%B8%E5%85%B3%E5%B8%AE%E5%8A%A9#wiki)
* [Githubpage居然把百度蜘蛛给屏蔽了](http://www.zhaoxiaodan.com/%E5%85%B6%E4%BB%96/GithubPage%E5%B1%85%E7%84%B6%E6%8A%8A%E7%99%BE%E5%BA%A6%E8%9C%98%E8%9B%9B%E7%BB%99%E5%B1%8F%E8%94%BD%E4%BA%86.html)



