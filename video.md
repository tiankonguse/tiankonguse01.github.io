---
layout: page
title: tiankonguse的视频与漫画
description: tiankonguse 的博客历史与个人经历
keywords:  About, Author, Site, tiankonguse, Jekyll, GitHub, Chrome, Firefox, Safari, IE, MS, Contact, Change, Log, SEO
isContact: true
updateData:  15:25 2015/4/10
---


{% for videoState in site.data.video %}
<div class="accordion-group aboutme-group">
    <div class="accordion-heading">
        <h3 class="accordion-toggle list-of-categories" data-toggle="collapse"  href="#{{ videoState.name }}-ref">{{ videoState.name }}</h3>
    </div>   
    <div id="{{ videoState.name }}-ref" class="accordion-body collapse">
        <ul class="article-year clearfix list-articles-category">
            {% for video in videoState.list %}
            <li>
                {% if video.link %}  
                <a href="{{video.link}}">{{ video.name }}</a>
                {% else %} 
                {{ video.name }}  
                {% endif %}
                
                {{ video.time }}  
                
                {% if video.record %} 
                <a href="{{ video.record }}">记录</a>
                {% endif %}
            </li>
            {% endfor %}
        </ul>
    </div>
</div>
{% endfor %}
