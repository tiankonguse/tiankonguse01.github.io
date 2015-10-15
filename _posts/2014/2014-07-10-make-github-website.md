---
layout : post 
description : 记录下自己制作github的过程，中间由于没有背景知识，踩了很多坑，最后终于弄好了。  
title : 在github上制作一个轻量级免费的静态网站 
keywords: github, 静态网站, Jekyll, 域名
tags: [github,静态网站,Jekyll,域名,网站]
categories: [前端技术]
---


## 妄想症

这个记录当时写了一个标题之后，就一直没有再继续往下写。

今天终于再次遇到 github 做静态网站的一些问题，才有时间继续来写这个记录。


## 基本介绍

[github pages][github-page] 是 [github][] 提供的免费的存放网页的服务, 简单的说也就是一个免费的虚拟主机。

由于是免费的，功能就有限制。这个限制就是只能用来建静态网站。

说完虚拟主机了，就需要说说域名的事了。

github 来给我们提供了github的三级域名，如果你想使用自己的域名，也是可以做到的。


## 基本操作

假设你的 github 的账号是 [tiankonguse][github-home], 那你需要建一个名字是 [tiankonguse.github.io][tiankonguse-page] 的仓库。

有个建仓库后，提示页面有个 import code 按钮，点击，然后输入 [github-tiankonguse-page-prj][] 地址，就会把一些做静态网站的基本信息clone过去了。

然后 在这个仓库的 setting 页面([setting][]),可以看到有一个 GitHub Pages  的栏目，选择为 网站。

然后你需要做的就是等若干分钟，一般三五分钟吧，你输入你的 [项目名称][tiankonguse-page] 就可以看到一个网站了。

## 配置域名

现在你已经有一个 github 给你分的域名了。

接下来就是配置成自己的域名了。

首先你需要找到 github 给你分的域名的ip是什么，一般使用 dig tiankonguse.github.io

然后可以看到 tiankonguse.github.io 转到 github.map.fastly.net了， 然后 github.map.fastly.net 站到  103.245.222.133 了。

最后一步需要做的是让 github 知道你这个域名需要指向你这个项目。

所以需要建一个 CNAME 文件，里面只需要写入你的域名即可。

```
skyyuan@skyyuan-PC3:~ $ dig tiankonguse.github.io

; <<>> DiG 9.9.5 <<>> tiankonguse.github.io
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 11234
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4000
;; QUESTION SECTION:
;tiankonguse.github.io.         IN      A

;; ANSWER SECTION:
tiankonguse.github.io.  3595    IN      CNAME   github.map.fastly.net.
github.map.fastly.net.  13      IN      A       103.245.222.133

;; Query time: 4566 msec
;; SERVER: 10.6.18.42#53(10.6.18.42)
;; WHEN: 周日 九月 28 21:18:05 CST 2014
;; MSG SIZE  rcvd: 101
```

所以我们需要做的就是用我们的自定义域名指定那个ip github.tiankonguse.com 指向 103.245.222.133.。



## 配置网站

现在你已经有自己的网站了，但是里面的信息不是你的，文章也不是你的。

其中根位置 有个 _config.yml 目录。

里面的 author, title, url, production_url 修改成自己的信息即可。

然后在 _post 里面写日志吧。

关于 Jekyll 的 模板 可以参考 [Jekyll 模板 简单语法 笔记][jekyll-base-record]






[jekyll-base-record]: http://github.tiankonguse.com/blog/2014/09/26/jekyll-base-record/
[github-tiankonguse-page-prj]: https://github.com/tiankonguse/tiankonguse.github.io
[setting]: https://github.com/tiankonguse/tiankonguse.github.io/settings
[github-home]: https://github.com/tiankonguse
[tiankonguse-page]: http://tiankonguse.github.io
[tiankonguse]: http://tiankonguse.com
[github-tiankonguse]: http://github.tiankonguse.com/
[github-page]: http://pages.github.com/
[github]: https://github.com/
