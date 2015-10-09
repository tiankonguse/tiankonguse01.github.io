---
layout: default
title: 项目列表
---

<link rel="stylesheet" href="./project.css" type="text/css" /> 
<div class="container">
    {% for project in site.data.projects %}
        <a target="_blank" href="{{ project.url }}">
            <p>
                <strong> {{ project.title }} </strong>
                <span>{{ project.description }}</span>
            </p>
        </a>
    {% endfor %}
</div>

<script>
 
tk.comment.isHaveComment = false;
jQuery(document).ready(function(){
   $(".ad-page-footer").css("position","relative").css("bottom","0px").css("width","100%");
   $(".ad-page-footer").css("z-index","11");
   $(".ad-page-footer").css("background-color","rgb(80, 80, 80)");
});
</script>
