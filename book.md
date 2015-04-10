---
layout: page
title: tiankonguse的书籍
description: tiankonguse 的博客历史与个人经历
keywords:  About, Author, Site, tiankonguse, Jekyll, GitHub, Chrome, Firefox, Safari, IE, MS, Contact, Change, Log, SEO
isContact: true
updateData:  13:34 2015/4/10
---


{% for bookState in site.data.book %}
<div class="accordion-group aboutme-group">
    <div class="accordion-heading">
        <h2 class="accordion-toggle list-of-categories" data-toggle="collapse"  href="#{{ bookState.name }}-ref">{{ bookState.name }}</h2>
    </div>   
    <div id="{{ bookState.name }}-ref" class="accordion-body collapse">
        <ul class="article-year clearfix list-articles-category">
            {% for book in bookState.list %}
            <li>
                {% if book.bookLink %}  
                <a href="{{book.bookLink}}">{{ book.bookName }}</a>
                {% else %} 
                {{ book.bookName }}  
                {% endif %}
                
                {{ book.readTime }}  
                
                {% if book.readLink %} 
                <a href="{{ book.readLink }}">读书笔记</a>
                {% endif %}
            </li>
            {% endfor %}
        </ul>
    </div>
</div>
{% endfor %}
