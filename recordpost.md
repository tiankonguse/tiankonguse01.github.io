---
layout: default
title: tiankonguse's 代码世界
description: tiankonguse 的第二博客
keywords: tiankonguse, GitHub, Archives, linux, css, html, javascript, python, Jekyll, plugins, php, 大数据, 分布式, 机器学习, acm, 算法
isIndex: true
---

<div id="content" class="clearfix">
    <div class="entry-header">
        <div class="index-content">
            {% include nav.md %}
        </div>
    </div>
    <div class="entry">
    </div>
    <div class="sidenav-frame">
        {% include sidenav.md %}
    </div>
</div>



<script>
    var siteurl = "{{ site.url }}";
    
    function loadPost(id){
        var defaultUrl = "http://tiankonguse.com/record/record_data.php?state=post&id=" + id;
        jQuery.get(defaultUrl, function(d){
            if(d.code == 0){
                showPost(d.data);
            }
        },"json");
    }
    
    function showPost(post){
        var recordListURL= "/record.html?nowPage=";
        var recordPostURL= "/recordpost.html?id=";
        
        post.siteurl = siteurl;
        post.url = recordPostURL + post.id;
        post.description = "";
        post.date = tk.Format(new Date(post.time * 1000), "yyyy-MM-dd");
        
        post.content = "<p>" + post.content + "</p>";;
        post.content = tk.replace(post.content, "<br>", "</p><p>");
        post.content = tk.replace(post.content, "<br/>", "</p><p>");
        post.content = tk.replace(post.content, "<br />", "</p><p>");
        post.content = tk.replace(post.content, "<br >", "</p><p>");
        
        var tpl = '\
        <h1 class="entry-title"><%= title %></h1>\
        <p></p>\
        <p><%= content %></p>\
        <p></p>\
        <div id="disqus_container">\
            <a href="#" class="comment" onclick="return false;">点击查看评论</a>\
            <div id="disqus_thread"></div>\
            <div class="ds-thread" data-thread-key="<%=url%>" data-title="<%=title%>" data-url="<%=siteurl%><%=url%>"></div>\
            <div id="cloud-tie-wrapper" class="cloud-tie-wrapper"></div>\
        </div>';
        
    
        jQuery("#content .entry").append(tk.parseTpl(tpl, post));

        window.disqus_shortname = 'tiankonguse-record'; 
        window.duoshuoQuery = {short_name:"tiankonguse"};
        window.cloudTieConfig = {
            url: document.location.href, 
            sourceId: post.url,
            productKey: "1cb0b08870384b08a97d3e08c258391b",
            target: "cloud-tie-wrapper"
        };
        tk.loadJSFile(siteurl + "/javascripts/post.js");
    }
    
    jQuery(document).ready(function(){
        var urlObj = tk.parseURL(window.location);
        loadPost(urlObj.id);
    });
</script>
