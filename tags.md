---
layout: page
title: 标签
keywords: tiankonguse, 标签Tags, github, Jekyll
description: Jekyll 中使用标签得到文章。
---

<div>
  {% for tag in site.tags %}
    <div id="{{ tag[0] }}"><h2>{{ tag[0] }}</h2></div>
    {% for post in tag[1] %}  
    <div><span>{{ post.date | date:"%Y-%m-%d" }}</span>&raquo;<a href="{{ post.url }}">{{ post.title }}</a></div>
    {% endfor %} 
  {% endfor %}
</div>