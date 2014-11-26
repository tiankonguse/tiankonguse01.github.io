---
layout: page
title: 标签
keywords: tiankonguse, 标签Tags, github, Jekyll
description: Jekyll 中使用标签得到文章。
---

{% for tag in site.tags %}
<h2><a href="{{ size.url }}{{ page.url }}#{{ tag[0] }}">{{ tag[0] }}</h2>
<ul class="artical-list">
{% for post in tag[1] %}
    <li>{{ post.date | date:"%Y-%m-%d" }} &raquo; <a href="{{ size.url }}{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
</ul> 
{% endfor %}