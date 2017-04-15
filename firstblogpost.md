---
layout: default
title: tiankonguse's 第一个博客
description: tiankonguse的第一个博客
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
        var defaultUrl = "http://tiankonguse.com/record/firstblog_data.php?state=post&id=" + id;
        jQuery.get(defaultUrl, function(d){
            if(d.code == 0){
                showPost(d.data);
            }
        },"json");
    }
    
    function showPost(post){
        var recordListURL= "/firstblog.html?nowPage=";
        var recordPostURL= "/firstblogpost.html?id=";
        
        post.siteurl = siteurl;
        post.url = recordPostURL + post.id;
        post.description = "";
        post.date = tk.Format(new Date(post.time * 1000), "yyyy-MM-dd");
        post.fulldate = tk.Format(new Date(post.time * 1000), "yyyy-MM-dd hh:mm:ss");
        
        post.pre = post.pre || {};
        if(post.pre.id){
            post.pre.url = recordPostURL + post.pre.id;
        }
        
        post.next = post.next || {};
        if(post.next.id){
            post.next.url = recordPostURL + post.next.id;
        }
        post.content = post.content.replace(/<div>/g, "<p>");
        post.content = post.content.replace(/<\/div>/g, "</p>");
        post.content = post.content.replace(/<font[^>]*>([^<]*)<\/font>/g, "$1");
        
        //<br>|<br/> => <p></p>
        post.content = post.content.replace(/<br\s*\/?>/g, "<p></p>");
        
        //<p><h2> =>   <p></p><h2>
        post.content = post.content.replace(/<p>\s*(<h.>)/g, "<p></p>$1");
        //</h2></p> =>   <p></p><h2>
        post.content = post.content.replace(/(<\/h.>)\s*<\/p>/g, "$1<p></p>");
        
        //<p><pre> =>   <p></p><pre>
        post.content = post.content.replace(/<p>\s*(<pre>)/g, "<p></p>$1");
        //</pre></p> =>   <p></p><pre>
        post.content = post.content.replace(/(<\/pre>)\s*<\/p>/g, "$1<p></p>");
        
        
        post.content = post.content.replace(/(<pre>|<h.>)/g, "<p></p>$1");
        post.content = post.content.replace(/(<\/pre>|<\/h.>)/g, "$1<p></p>");
        
        //remove blank
        post.content = post.content.replace(/\s*<p>\s*/g, "<p>");
        post.content = post.content.replace(/\s*<\/p>\s*/g, "</p>");
        
        
        //<p> something <p> something </p> => <p> something </p><p> something </p><p>
        post.content = post.content.replace(/<p>([^<]+)<p>([^<]+)<\/p>/g, "<p>$1</p><p><$2/p><p>");
        
        // </p> something <p> =></p>  <p> something </p><p> 
        post.content = post.content.replace(/(<\/p>)([^<]+)(<p>)/g, "$1<p>$2</p>$3");
        
        
        post.content = post.content.replace(/\<p><p><\/p><\/p>/g, "<p></p>");
        post.content = post.content.replace(/<p><\/p><p><\/p>/g, "<p></p>");
        
        // </p> something <other> something </other> <p>  => </p><p>something <other> something </other> <p>
        post.content = post.content.replace(/(<\/p>)([^<]+(?!<p>|<h.>|<pre>)[^>]+>[^<]+(?!<p>|<h.>|<pre>)[^>]+>[^<]+)(<p>|<h.>|<pre>)/g, "$1<p>$2</p>$3");
        
        post.content = post.content.replace(/\<p><p><\/p><\/p>/g, "<p></p>");
        post.content = post.content.replace(/<p><\/p><p><\/p>/g, "<p></p>");
        
        post.content = post.content.replace(/<font\s+color="[^"]*">([^<]*)<\/font>/g, "$1");
        post.content = post.content.replace(/<p><\/p>/g, "");
        post.content = post.content.replace("/common/kindeditor/", "http://tiankonguse.com/common/kindeditor/");
        
        
        var tpl = '\
        <h1 class="entry-title"><a href="<%=siteurl%><%=url%>" title="<%= title %>"><%= title %></a></h1>\
        <p class="entry-attr">作者: <span  class="entry-author">tiankonguse</span> | 更新日期: <time  class="entry-date"><%= fulldate %></time></p>\
        <p></p>\
        <p><%= content %></p>\
        <p></p>\
        <div class="ad-content-footer"></div>\
        <footer class="unit-foot">\
            <% if(tags && tags.length){ %>\
            <section>\
                <ul class="tag-box inline">\
                    <li>标签:</li>\
                    <% for(tagIndex in tags){ %> \
                        <li><%= tags[tagIndex] %></li>\
                    <% } %> \
                </ul>\
            </section>\
            <% } %>\
            <div class="footer-post-info clearfix">\
                <ul>\
                    <li>\
                        作者「<a href="/about.html" rel="author">tiankonguse</a>」于 \
                        <time><%= fulldate %></time> 发布本文</li>\
                    <li>文章声明：自由转载-非商用-非衍生-保持署名  |  <a href="http://creativecommons.org/licenses/by-nc-nd/3.0/deed.zh" target="_blank" rel="nofollow">BY-NC-SA</a></li>\
                    <li>如果你觉得这篇文章对你有帮助，欢迎支持作者：<a class="internal" href="<%=siteurl%>/support.html" title="支持作者">&laquo; 大力支持</a></li>\
                </ul>\
            </div>\
            <div class="unit-inner unit-foot-inner">\
                <nav class="pagination">\
                    <ul>\
                        <% if(pre.id){ %>\
                        <li class="prev"><a class="internal" rel="prev"  href="<%=siteurl%><%=pre.url%>" title="View <%=pre.title%>">&laquo; <%=pre.title%></a></li>\
                        <% } %>\
                        <% if(pre.id && next.id){ %>\
                        <li class="pipe"> | </li>\
                        <% } %>\
                        <% if(next.id){ %>\
                        <li class="prev"><a class="internal" rel="prev"  href="<%=siteurl%><%=next.url%>" title="View <%=next.title%>">&laquo; <%=next.title%></a></li>\
                        <% } %>\
                    </ul>\
                </nav>\
                <p class="gotop">\
                    <a href="#">Back to Top</a>\
                </p>\
            </div>\
        </footer>\
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
        tk.comment.init($('#disqus_container .comment'));
        tk.loadJSFile(siteurl + "/javascripts/post.js");
    }
    
    jQuery(document).ready(function(){
        var urlObj = tk.parseURL(window.location);
        loadPost(urlObj.params.id);
    });
</script>
