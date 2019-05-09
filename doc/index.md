---
layout: default
title: 文档列表
---

<link rel="stylesheet" href="./doc.css" type="text/css" /> 
<div class="container">
    {% for doc in site.data.docs %}
        <a target="_blank" href="{{ doc.url }}">
            <p>
                <strong> {{ doc.title }} </strong>
                <span>{{ doc.description }}</span>
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
