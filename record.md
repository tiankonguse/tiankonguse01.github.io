---
layout: page
title: tiankonguse's 代码世界
description: tiankonguse 的第二博客
keywords: tiankonguse, GitHub, Archives, linux, css, html, javascript, python, Jekyll, plugins, php, 大数据, 分布式, 机器学习, acm, 算法
isIndex: true
---



<div class="index-content"></div>
<script>
    function loadList(nowPage){
        var defaultUrl = "http://tiankonguse.com/record/record_data.php?state=list&nowPage=" + nowPage;
        jQuery.get(defaultUrl, function(d){
            if(d.code == 0){
                d.data.nowPage = nowPage;
                showList(d.data);
            }
        },"json");
    }
    
    function showList(d){
        var recordListURL= "/record.html?nowPage=";
        var recordPostURL= "/recordpost.html?id=";
        
        for(postIndex in d.list){
            var post = d.list[postIndex];
            post.url = recordPostURL + post.id;
            post.description = "";
            post.date = tk.Format(new Date(post.time * 1000), "yyyy-MM-dd");
        }
        
        var tpl = '\
            <div class="section">\
                <ul class="artical-list">\
                    <% for(postIndex in list){ %>\
                    <% var post = list[postIndex]; %>\
                    <li>\
                        <h2>\
                            <a href="<%=post.url%>"><%= post.title %></a>\
                            <div class="title-date"><%= post.date %></div>\
                        </h2>\
                    </li>\
                    <%= } %>\
                </ul>\
                <div class="pagination-centered" id="pagination_bottom">\
                    <div class="page-stat">统计：共有<%= allPostNum %>篇文章，共有<%= allPageNum %>页</div>\
                    <ul id="pager_bottom">\
                    </ul>\
                </div>\
            </div>';
    
        jQuery("#content .entry .index-content").append(tk.parseTpl(tpl, d));
    
        tk.loadPage(d.nowPage, d.allPageNum, jQuery("#pager_bottom"), "/");
    }
    
    jQuery(document).ready(function(){
        var urlObj = tk.parseURL(window.location);
        loadList(urlObj.nowPage || 1);
    });
</script>


