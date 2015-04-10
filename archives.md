---
layout: page
title: Archives
description: 文章归档:按年月分隔，这样每月顶多只有几十篇记录了。  
keywords: tiankonguse, GitHub, Archives, linux, css, html, javascript, python, Jekyll, plugins, php, 大数据, 分布式, 机器学习, acm, 算法
isArchive: true
updateData:  21:25 2015/4/2
---

{% capture postYear0 %}0{% endcapture %}
{% capture postYear1 %}0{% endcapture %}
<div class="row-fluid">
    <div class="accordion main-article" id="accordion2">
        {% for post in site.posts %}
            {% capture postYear2 %}{{ post.date | date: '%Y-%m' }}{% endcapture %}
            {% if postYear1 != postYear2 %}
                {% if postYear1 != postYear0  %}
        </ul>
    </div>
</div>
                {% endif %}
                {% assign postYear1 = postYear2 %}
<div class="accordion-group">
    <div class="accordion-heading">
        <h2 class="accordion-toggle list-of-categories" data-toggle="collapse" data-parent="#accordion2"  href="#{{ postYear1 }}-ref">{{ postYear1 }}</h2>
    </div>
    <div id="{{ postYear1}}-ref" class="accordion-body collapse">
        <ul class="article-year clearfix list-articles-category">
            {% endif %}
            <li><time pubdate="pubdate" datetime="{{ post.date|date:'%Y-%m-%d' }}">{{ post.date|date:'%Y-%m-%d' }}</time><a href="{{site.url}}{{ post.url }}">{{ post.title }}</a></li>
        {% endfor %}
        </ul>
    </div>
</div>
    </div>
</div>


<script>
    (function ($) {
        $(document).ready(function(){
            $(".entry-title").append('<span class="fa-stack fa-lg" style="cursor: pointer;width: 30px;display: inline-block;font-size: 15px;"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-th-large fa-stack-1x fa-inverse"></i></span>');
            $(".entry-title .fa-stack").bind("click", function(){
                $(".entry-title .fa-stack-1x").toggleClass("fa-th-large");
                $(".entry-title .fa-stack-1x").toggleClass("fa-list-ul");
                $("#accordion2").toggleClass("main-article");
            });
        });
    }(jQuery));
</script>

