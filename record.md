---
layout: default
title: tiankonguse's 代码世界
description: tiankonguse 的第二博客
keywords: tiankonguse, GitHub, Archives, linux, css, html, javascript, python, Jekyll, plugins, php, 大数据, 分布式, 机器学习, acm, 算法
isIndex: true
---


<style type="text/css">
    body { background:#e8e8e8; }
    @media screen and (max-width: 750px){
        body { background:#fff; }
    }
    @media screen and (max-width: 1020px){
        body { background:#fff; }
    }
</style>
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
    
    function loadList(nowPage){
        var defaultUrl = "http://tiankonguse.com/record/record_data.php?state=list&nowPage=" + nowPage;
        jQuery.get(defaultUrl, function(d){
            if(d.code == 0){
                d.data.nowPage = nowPage;
                showList(d.data);
            }
        },"json");
    }
    
    function showList(data){
        var recordListURL= "/record.html?nowPage=";
        var recordPostURL= "/recordpost.html?id=";
        
        data.title = "tiankonguse's 记录集";
        data.siteurl = siteurl;
        data.url = recordListURL + data.nowPage;
        data.preData = "";
        data.nextData = "";
        
        if(data.nowPage > 1){
            data.preData = '<link rel="prev" title="上一页" href="/page' + (data.nowPage - 1) + '">';
        }
        if(data.nowPage < data.allPageNum){
            data.nextData = '<link rel="next" title="下一个" href="/page' + (data.nowPage + 1) + '">';
        }
        
        for(postIndex in data.list){
            var post = data.list[postIndex];
            post.url = recordPostURL + post.id;
            post.description = "";
            post.date = tk.Format(new Date(post.time * 1000), "yyyy-MM-dd");
        }
        
        var tpl = '\
        <h1 class="entry-title"><%= title %></h1>\
        <p></p>\
        <%=preData%>\
        <%=nextData%>\
        <div class="index-content">\
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
                    <% } %>\
                </ul>\
                <div class="pagination-centered" id="pagination_bottom">\
                    <div class="page-stat">统计：共有<%= allPostNum %>篇文章，共有<%= allPageNum %>页</div>\
                    <ul id="pager_bottom">\
                    </ul>\
                </div>\
            </div>\
        </div>\
        <p></p>\
        <div id="disqus_container">\
            <a href="#" class="comment" onclick="return false;">点击查看评论</a>\
            <div id="disqus_thread"></div>\
            <div class="ds-thread" data-thread-key="<%=url%>" data-title="<%=title%>" data-url="<%=siteurl%><%=url%>"></div>\
            <div id="cloud-tie-wrapper" class="cloud-tie-wrapper"></div>\
        </div>';
        
    
        jQuery("#content .entry").append(tk.parseTpl(tpl, data));
    
        tk.loadPage(data.nowPage, data.allPageNum, jQuery("#pager_bottom"), "/record.html", "?nowPage=");
        
        window.disqus_shortname = 'tiankonguse-record'; 
        window.duoshuoQuery = {short_name:"tiankonguse"};
        window.cloudTieConfig = {
            url: document.location.href, 
            sourceId: post.url,
            productKey: "1cb0b08870384b08a97d3e08c258391b",
            target: "cloud-tie-wrapper"
        };
        tk.comment.init($('#disqus_container .comment'));
    }
    
    jQuery(document).ready(function(){
        var urlObj = tk.parseURL(window.location);
        loadList(urlObj.params.nowPage || 1);
    });
</script>


