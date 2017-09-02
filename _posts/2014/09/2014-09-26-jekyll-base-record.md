---
layout: post
title: Jekyll 模板 简单语法 笔记
description: 使用 github 做静态网站后，发现想实现内容丰富的网站，需要先了解 Jekyll 的基本语法，于是找了一些资料看了看，并记录下来。
keywords: [Jekyll, 模板, 笔记, github]
tags: [Jekyll,模板,笔记,github,网站]
categories: [前端技术]
---

## 目录结构

一般建议在每个目下建一个 index 文件。

Jekyll 的标准目录结构如下。

````
├── _config.yml
├── _includes/
├── _layouts/
├── _posts/
├── _site/
├── about/
|   └── index.html  # => http://tiankonguse.github.io/about/
├── contact/
|   └── index.html  # => http://tiankonguse.github.io/contact/
└── index.html      # => http://tiankonguse.github.io/
````


* _config.yml   Jekyll的配置文件

    _includes文件夹中所放的文件是最终要放到模版中的一些代码片段。

* _includes     include 文件所在的文件夹

    _layouts中放的一些模版，模版是用包含page或post内容的。Jekyll的模版使用HTML语法来写，并包含YAML Front Matter。

    所有的模版都可用Liquid来与网站进行交互。
    
    所的的模版都可以使用全局变量site和page
    
    site变量包含该网站所有可以接触得到的内容和元数据(meta-data)
    
    page变量包含的是当前渲染的page或post的所有可以接触得到的数据。
    
* _layouts      模版文件夹
* _posts        自己要发布的内容
    
    _post文件夹中放的是自己要发布的post文章。
    
    post文件的命名规则为YEAR-MONTH-DATE-title.MARKUP，使用rake post会自动将post文件命名合适。
    
    而对于page，所有放在根目录下或不以下划线开头的文件夹中有格式的文件都会被Jekyll处理成page。
    
    这里说的有格式是指文件含有YAML Front Matter。
    
    所有的post和page都要用markdown或者texile或者HTML语法来写，并可以包含Liquid模版的语法。
    
    还要有 YAML Front Matter (Jekyll只处理具有YAML Front Matter的文件)。
    
    YAML Front Matter必须放在文件的开头，一对---之间，用户可在这一对---间设置预先定义的变量或用户自己的数据
    
    
* _sites        预览时产生的文件都放在该文件夹中




## 全局变量


关于 jekyllrb 的变量文档，可以参考[官方文档][jekyllrb-variables]。


|  变量名     | 描述           
|-------------|-------------
|site	      | site 的信息 以及 _config.yml 文件中的配置信息
|page         | page 特定的信息, YAML 中的配置信息, 另外加上两个额外的变量值:url和content
|content      | 在布局模板文件中，这里变量包含了页面的子视图。这个变量将会把渲染后的内容插入到模板文件中。这个变量不能在文章和页面文件中使用。
|paginator    | 一旦paginate配置选项被设置了，这个变量才能被使用。


 
 
### Site 变量



   site 下的变量             | 描述           
 -------------------------- |-------------
 site.time                  | 当前的时间(当你运行Jekyll时的时间)
 site.pages                 | 所有页面的列表
 site.posts                 | 一个按时间逆序的文章列表。
 site.related_posts         | 如果当前被处理的页面是一个文章文件，那这个变量是一个包含了最多10篇相关文章的列表。
 site.static_files          | 所有静态页面的列表，每个文件有三个属性：路径，修改时间，扩展名。
 site.html_pages            | 所有的html页面的列表
 site.collections           | A list of all the collections.
 site.data                  | A list containing the data loaded from the YAML files located in the _data directory.
 site.documents             | A list of all the documents in every collection.
 site.categories.CATEGORY   | 所有在CATEGORY分类中的文章列表
 site.tags.TAG              | 所有拥有TAG标签的文章的列表
 site.[CONFIGURATION_DATA]  | 截止0.5.2版本，所有在_config.yml中的数据都能够通过site变量调用。


### Page 变量


   Page 下的变量            | 描述           
 -------------------------- |-------------
page.content                | 页面中未渲染的内容
page.title                  | 文章的标题
page.excerpt                | The un-rendered excerpt of the Page.
page.url                    | 除去域名以外的URL
page.date                   | 指定每一篇文章的时间，这个选项能够覆盖一篇文章中前置数据设置的时间，它的格式是这样的:YYYY-MM-DD HH:MM:SS
page.id                     | 每一篇文章的唯一标示符(在RSS中非常有用) 
page.categories             | 这篇文章隶属的分类的一个列表，分类是通过在_post目录中的目录结构推导而来的。
page.tags                   | 这篇文章的标签的列表。这些数据能够在YAML前置数据中指定
page.path                   | 页面的源码地址
page.next                   | 按时间序的下一篇文章
page.previous               | 按时间序的上一篇文章



### Paginator 变量


分页只在 html 页面中[^1]有效，所以对于 index 页面尽量使用 html 后缀。


   Page 下的变量            | 描述           
 -------------------------- |-------------
paginator.per_page          | 每一个页面上文章的数量
paginator.posts             | 当前页面上可用的文章
paginator.total_posts       | 所有文章的数量
paginator.total_pages       | 所有页面的数量
paginator.page              | 当前页面的数量
paginator.previous_page     | 前面的页面的数量
paginator.next_page         | 接下来的的页面的数量


## Collections


官方有这么一句话：


```
Collections support is unstable and may change
This is an experimental feature and that the API may likely change until the feature stabilizes.
```

## Data Files


Jekyll 支持 从 _data 目录中加载 YAML, JSON, 和 CSV 格式的文件数据。

例如创建 _data/members.yml 文件。


```
- name: 袁小康
  github: tiankonguse
  oldnick : shen1000
  nick : skyyuan
```

使用


{% raw %} 
    <ul>
    {% for member in site.data.members %}
      <li>
        <a href="https://github.com/{{ member.github }}">
        {% assign nick = member.nick %}
        {% assign name = member.name %}
          {{ nick}} ( {{name}} )
        </a>
      </li>
    {% endfor %}
    </ul>
{% endraw %}


[jekyllrb-variables]: http://jekyllrb.com/docs/variables/
[1]: http://segmentfault.com/blog/skyinlayer/1190000000406015
