---
layout: default
title: 标签
keywords: tiankonguse, 标签Tags, github, Jekyll
description: "Jekyll 中使用标签得到文章。"
---

<div>
  {% for tag in site.tags %}
  <a href="#{{ tag[0] }}" {% if tag[1].size == 1 %}style="color:#888580"{% endif %}>{{ tag[0] }}({{ tag[1].size }})</a>
  {% endfor %}
</div>

<div>
  {% for tag in site.tags %}
    <div id="{{ tag[0] }}"><h2>{{ tag[0] }}</h2></div>
    {% for post in tag[1] %}  
    <div><span>{{ post.date | date:"%Y-%m-%d" }}</span>&raquo;<a href="{{ post.url }}">{{ post.title }}</a></div>
    {% endfor %} 
  {% endfor %}
</div>