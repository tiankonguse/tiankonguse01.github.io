---
layout: page
title: Archives
description: tiankonguse 的文章归档。
keywords: tiankonguse, GitHub, Archives, linux, css, html, javascript, python, Jekyll, plugins, php, 大数据, 分布式, 机器学习, acm, 算法
isArchive: true
updateData:  21:25 2015/4/2
---


<article class="main-article">
{% capture post_year1 %}{{ 'now' | date: '%Y-%m' }}{% endcapture %}

<h2>{{ post_year1 }}</h2>
<ul class="article-year clearfix">

{% for post in site.posts %}

{% capture post_year2 %}{{ post.date | date: '%Y-%m' }}{% endcapture %}

{% if post_year1 != post_year2 %}

{% assign post_year1 = post_year2 %}

</ul>
<h2>{{ post_year1 }}</h2>
<ul class="article-year clearfix">
{% endif %}

<li>
<span>{{ post.date | date_to_utc | date: '%Y-%m-%d' }}</span>
<a href="{{site.url}}{{ post.url }}">{{ post.title }}</a>
</li>
{% endfor %}
</ul>
</article>
