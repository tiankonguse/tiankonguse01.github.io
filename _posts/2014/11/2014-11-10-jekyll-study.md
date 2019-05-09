---
layout: post
title: Jekyll 语法简单笔记
description: 之前写过 github 搭建静态网站,但是功能特别少,现在看看 Jekyll 的官方文档,记录下一个博客需要的基础知识
keywords: Jekyll, github, 语法, 静态网站, 免费网站, 快速
tags: [jekyll,github,语法]
categories: [前端技术]
---

## 前言



如果你只想快速搭建一个 github 的静态网站, 而暂时没有时间来研究 jekyll 语法的话,建议直接 fork 我的[这个][github-tiankonguse]  

当然,阅读一下之前我记录的一些笔记也可以增长一些知识.  注意,必须在子节点的顶部  

* [Jekyll 模板 简单语法 笔记][jekyll-base-record] 只介绍了最最基本的语法  
* [在github上制作一个静态网站][make-github-website] 只介绍了最简单的 github 操作.  

不过,现在我要记录一个比较完整的语法来建立一个功能比较健全记录型博客.  

具体官方文档地址请参考 [官方文档][jekyllrb-docs].  
这里只介绍关于 jekyll 的语法,不介绍其他内容.  


## 开始

**Jekyll 是什么?** 

jekyll 是一个静态网站生成器.  
jekyll 通过 标记语言 [markdown][] 或 [textile][] 和 模板引擎 [liquid][] 转换生成网页.  
[github][page-github] 为我们提供了这个一个地方, 可以使用 jekyll 做一个我们自己的网站.  

这里不介绍怎么在本地安装使用 jekyll, 如果你想在本地使用,请参考官方文档的 [安装教程][installation] 和 [使用教程][usage].  
不过这里可以透漏一下, jekyll 依赖于 [ruby][] .  


## 配置

> 注意,配置不用使用 tab . 否则可能会忽略那条命令.  

### 文件介绍

**_config.yml**

jekyll 的全局配置在 _config.yml 文件中配置.  
比如网站的名字, 网站的域名, 网站的链接格式等等.  

**_includes**

对于网站的头部, 底部, 侧栏等公共部分, 为了维护方便, 我们可能想提取出来单独编写, 然后使用的时候包含进去即可.  
这时我们可以把那些公共部分放在这个目录下.  
使用时只需要引入即可.  

```
{ % include filename % }
```

**_layouts**

对于网站的布局,我们一般会写成模板的形式,这样对于写实质性的内容时,比如文章,只需要专心写文章的内容, 然后加个标签指定用哪个模板即可.  
对于内容,指定模板了模板后,我们可以称内容是模板的儿子.  
为什么这样说呢?  因为这个模板时可以多层嵌套的, 内容实际上模板,只不过是叶子节点而已.  

在模板中, 引入儿子的内容.  

```
{ { content } }
```

在儿子中,指定父节点模板  

> 注意,必须在子节点的顶部.  


```
---
layout: post
---
```

**_posts**

写的内容,比如博客,常放在这里面, 而且一般作为叶子节点.  


**_data**

也用于配置一些全局变量,不过数据比较多,所以放在这里。  

比如这个网站如果是多人开发, 我们通常会在这里面定义一个 members.yml 文件.  

文件内容为   

```yml
- name: 袁小康
  github: tiankonguse
  oldnick : shen1000
  nick : skyyuan
```

然后在模板中我们就可以通过下面语法使用这些数据了.  

```
site.data.members
```

**_site**

jekyll 生成网站输出的地方, 一般需要在 .gitignore  中屏蔽掉这个目录.  

**index.html**

主页文件, 后缀有时也用 index.md 等.  
这个需要根据自己的需要来写, 因为不同的格式之间在某些情况下还是有一些细微的差别的.  


**静态资源**

对于其他静态资源, 可以直接放在根目录或任何其他目录, 然后路径和平常的网站一样, 按路径来找链接中的文件.  


## 配置全局变量 ##

虽然全局变量都有自己的默认配置, 但是我们往往会手动配置为自己心中最好的效果.  


### 源代码的位置

这个一般不配置, 默认即可.  

```
source: DIR
```

当然编译的时候也可以指定,但是使用 github 我们是不能指定参数的.  

```
-s, --source DIR
```

### 输出网站位置

这个一般也默认.  

```
# 编译参数 -d, --destination DIR
destination: DIR #配置语法
```

### Safe开关

官方文档上就一句话.  

```
Disable custom plugins, and ignore symbolic links.
```

大概意思是禁用常用的插件,忽略符号链接.  

```
# 编译参数  --safe
safe: BOOL
```

### 忽略文件

这个很有用, 有时候你写了一个文件, 里面的一个东西可能会被 jekyll 处理, 但是你不想让 jekyll 处理的话, 就使用这个语法忽略那些文件吧.  

```
exclude: [DIR, FILE, ...]
```

### 强制处理文件

有时候我们的一些文件的名字由于不在 jekyll 处理的文件名字范围内,这时候就需要强制处理这些文件了.  
比如 .htaccess 文件.  

```
include: [DIR, FILE, ...]
```

### 时区

我们模板中经常会对时间进行转换,这个时候如果至指定时区的话,可能得到的时间会和我们想要的时间错几个小时.  

```
# timezone: Asia/Shanghai
timezone: TIMEZONE
```

### 编码

大家都是程序员,就不用多说了.  

```
# encoding : utf-8
encoding: ENCODING
```

## 模板语法

模板语法实际上分两部分, 一部分是头部定义,另一部分是语法.  


### 头部定义

头部定义主要用于指定模板(layout)和定义一些变量, 比如 标题(title), 描述(description), 分类(category/categories), tags, 是否发布(published), 自定义变量.  

```
---
layout:     post
title:      title
category: blog
description: description
published: true # default true
---
```


### 模板语法


**使用变量**

所有的变量是都一个树节点, 比如模板中定义的头部变量,需要使用下面的语法获得  

```
page.title
```

page 是当前页面的根节点.  

其中全局根结点有  

* site _config.yml 中配置的信息  
* page 页面的配置信息  
* content 模板中,用于引入子节点的内容  
* paginator 分页信息  

### site 下的变量

* site.time 运行 jekyll 的时间  
* site.pages 所有页面  
* site.posts 所有文章  
* site.related_posts 类似的10篇文章,默认最新的10篇文章,指定lsi为相似的文章  
* site.static_files 没有被 jekyll 处理的文章,有属性 path, modified_time 和 extname.  
* site.html_pages 所有的 html 页面  
* site.collections 新功能,没使用过  
* site.data _data 目录下的数据  
* site.documents 所有 collections 里面的文档  
* site.categories 所有的 categorie  
* site.tags 所有的 tag  
* site.[CONFIGURATION_DATA] 自定义变量  


### page 下的变量 

* page.content 页面的内容  
* page.title 标题  
* page.excerpt 摘要  
* page.url 链接  
* page.date 时间  
* page.id 唯一标示  
* page.categories 分类  
* page.tags 标签  
* page.path 源代码位置  
* page.next 下一篇文章  
* page.previous 上一篇文章  

### paginator 下的变量 

* paginator.per_page 每一页的数量  
* paginator.posts 这一页的数量  
* paginator.total_posts 所有文章的数量  
* paginator.total_pages 总的页数  
* paginator.page 当前页数  
* paginator.previous_page 上一页的页数  
* paginator.previous_page_path 上一页的路径  
* paginator.next_page 下一页的页数  
* paginator.next_page_path 下一页的路径  

### 字符转义

有时候想输出 \{ 了,怎么办,使用 \\ 转义即可.  

```
\{ => {
```

### 输出变量

输出变量直接使用两个大括号括起来即可.  

```
{ { page.title } }
```

### 循环

和平常的解释性语言很想.  

```
{ % for post in site.posts % }
    <a href="{ { post.url } }">{ { post.title } }</a>
  { % endfor % }
```

### 自动生成摘要

```
  { % for post in site.posts % }
     { { post.url } } { { post.title } }
      { { post.excerpt | remove: 'test' } }
  { % endfor % }
```

### 删除指定文本

remove 可以删除变量中的指定内容  

```
{ { post.url | remove: 'http' } }
```

### 删除 html 标签

这个在摘要中很有用.  

```
{ { post.excerpt | strip_html } }
```

### 代码高亮

```
{ % highlight ruby linenos % }
\# some ruby code
{ % endhighlight % }
```

### 数组的大小

```
{ { array | size } }
```

### 赋值

```
{ % assign index = 1 % }
```

### 格式化时间

```
{ { site.time | date_to_xmlschema } } 2008-11-07T13:07:54-08:00
{ { site.time | date_to_rfc822 } } Mon, 07 Nov 2008 13:07:54 -0800
{ { site.time | date_to_string } } 07 Nov 2008
{ { site.time | date_to_long_string } } 07 November 2008
```

### 搜索指定key

```
# Select all the objects in an array where the key has the given value.
{ { site.members | where:"graduation_year","2014" } } 
```

### 排序

```
{ { site.pages | sort: 'title', 'last' } }
```

### to json

```
{ { site.data.projects | jsonify } }
```

### 序列化

把一个对象变成一个字符串

```
{ { page.tags | array_to_sentence_string } }
```

### 单词的个数

```
{ { page.content | number_of_words } }
```

### 指定个数

得到数组指定范围的结果集  

```
{ % for post in site.posts limit:20 % }
```


## 内容名字规范

对于博客,名字必须是 YEAR-MONTH-DAY-title.MARKUP 的格式.  

比如

```
2014-11-06-memcached-code.md
2014-11-06-memcached-lib.md
2014-11-06-sphinx-config-and-use.md
2014-11-07-memcached-hash-table.md
2014-11-07-memcached-string-hash.md
```




[github-tiankonguse]: https://github.com/tiankonguse/tiankonguse.github.io
[usage]: http://jekyllrb.com/docs/usage/
[ruby]: http://www.ruby-lang.org/en/downloads/
[installation]: http://jekyllrb.com/docs/installation/
[page-github]: http://pages.github.com/
[liquid]: https://github.com/Shopify/liquid/wiki
[textile]: http://redcloth.org/textile
[markdown]: http://daringfireball.net/projects/markdown/
[jekyllrb-docs]: http://jekyllrb.com/docs/home/
[make-github-website]: http://github.tiankonguse.com/blog/2014/07/10/make-github-website/
[jekyll-base-record]: http://github.tiankonguse.com/blog/2014/09/26/jekyll-base-record/
