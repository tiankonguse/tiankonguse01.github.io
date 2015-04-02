---
layout: page
title: 标签
keywords: tiankonguse, 标签Tags, github, Jekyll
description: Jekyll 中使用标签得到文章。
---


<div class="row-fluid entry-tag">
    <div class="offset1">
        <form class="form-search">
            <input type="text" class="input-medium search-query filterinput" placeholder="Find a tag">
        </form>
        <ul class="list-of-tags">
            {% for tag in site.tags %}
            <li>
            <a href="#{{ tag.first }}-ref">{{ tag.first }}<span>{{ tag | last | size }}</span></a>
            </li>
            {% endfor %}
        </ul>
    </div>
</div>

<div class="row-fluid entry-tag">
    <div class="offset">
        {% for tag in site.tags %}
        <h2 class="tag-title">{{ tag.first }}</h2><span id="{{ tag.first }}-ref"></span>
        <ul class="articles-in-tag list-articles-category" >
            {% for article in tag.last %}
            <li>
                <time pubdate="pubdate" datetime="{{ article.date|date:"%Y-%m-%d %H:%M:%S" }}">{{ article.date|date:"%Y-%m-%d" }}</time>
                <a href="{{ site.url }}{{ article.url }}">{{ article.title }}</a></li>
            {% endfor %}
        </ul>
        {% endfor %}
    </div>
</div>

<script>
    (function ($) {
        // custom css expression for a case-insensitive contains()
        jQuery.expr[':'].Contains = function(a,i,m){
            return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
        };
        function listFilter() {
            $('.filterinput')
            .change( function () {
                var filter = $(this).val();
                if(filter) {
                    // this finds all links in a list that contain the input,
                    // and hide the ones not containing the input while showing the ones that do
                    $('.list-of-tags').find("a:not(:Contains(" + filter + "))").parent().hide();
                    $('.list-of-tags').find("a:Contains(" + filter + ")").parent().show();
                    } else {
                    $('.list-of-tags').find("li").show();
                }
                return false;
            })
            .keyup( function () {
                // fire the above change event after every letter
                $(this).change();
            });
        }
        //ondomready
        $(function () {
            listFilter($());
        });
    }(jQuery));
</script>

