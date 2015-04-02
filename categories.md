---
layout: page
title: categories
description: tiankonguse 的文章归档。
keywords: tiankonguse, GitHub, Archives, linux, css, html, javascript, python, Jekyll, plugins, php, 大数据, 分布式, 机器学习, acm, 算法
isArchive: true
updateData:  21:25 2015/4/2
---

<div class="row-fluid">
    <div class="span8 offset2">
        <div class="accordion" id="accordion2">
            {% for category in site.categories %}
            
            {% capture categoryName %}{{ category.first }}{% endcapture %}
            {% capture articlesList %}{{ category.last }}{% endcapture %}
            

            <div class="accordion-group">
                <div class="accordion-heading">
                    <a class="accordion-toggle list-of-categories" data-toggle="collapse" data-parent="#accordion2" href="#{{ categoryName.slug }}-ref">
                        {{ categoryName }}<span>{{  articlesList | size }}</span>
                    </a>
                </div>
            </div>
            
            {% endfor %}
        </div>
    </div>
</div>

