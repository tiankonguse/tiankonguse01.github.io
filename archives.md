---
layout: page
title: Archives
description: tiankonguse 的文章归档。
keywords: tiankonguse, GitHub, Archives, linux, css, html, javascript, python, Jekyll, plugins, php, 大数据, 分布式, 机器学习, acm, 算法
isArchive: true
updateData:  21:25 2015/4/2
---

{% capture postYear0 %}0{% endcapture %}
{% capture postYear1 %}0{% endcapture %}
<article class="main-article">
{% for post in site.posts %}
    {% capture postYear2 %}{{ post.date | date: '%Y-%m' }}{% endcapture %}
    {% if postYear1 != postYear2 %}
        {% if postYear1 != postYear0  %}
                </ul>
            </div>
        {% endif %}
        {% assign postYear1 = postYear2 %}
        <div class="accordion-heading">
            <h2 class="accordion-toggle list-of-categories" data-toggle="collapse" href="#{{ postYear1 }}-ref">{{ postYear1 }}</h2>
        </div>
        <div id="{{ postYear1}}-ref" class="accordion-body collapse">
            <ul class="article-year clearfix list-articles-category">
    {% endif %}
    <li>
    <time pubdate="pubdate" datetime="{{ post.date|date:'%Y-%m-%d' }}">{{ post.date|date:'%Y-%m-%d' }}</time>
    <a href="{{site.url}}{{ post.url }}">{{ post.title }}</a>
</li>
{% endfor %}
    </ul>
</div>
</article>
