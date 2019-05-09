---
layout: page
title: tiankonguse的视频与漫画
description: 大学毕业后,看的视频与漫画
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
                {% if video.videoLink %}  
                <a href="{{video.videoLink}}">{{ video.videNname }}</a>
                {% else %} 
                {{ video.videNname }}  
                {% endif %}
                
                {{ video.videoTime }}  
                
                {% if video.videoRecord %} 
                <a href="{{ video.videoRecord }}">记录</a>
                {% endif %}
            </li>
            {% endfor %}
        </ul>
    </div>
</div>
{% endfor %}



