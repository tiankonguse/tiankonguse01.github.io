---
layout: page
title: tiankonguse的书籍
description: tiankonguse 的博客历史与个人经历
keywords:  About, Author, Site, tiankonguse, Jekyll, GitHub, Chrome, Firefox, Safari, IE, MS, Contact, Change, Log, SEO
isContact: true
updateData:  13:34 2015/4/10
---


{% for bookState in site.data.book %}
<div class="accordion-group">
    <div class="accordion-heading">
        <h2 class="accordion-toggle list-of-categories" data-toggle="collapse"  href="#{{ bookState.name }}-ref">{{ bookState.name }}</h2>
    </div>   
    <div id="{{ bookState.name }}-ref" class="accordion-body collapse">
        <ul class="article-year clearfix list-articles-category">
            {% for book in bookState.list %}
                <li>
{% if book.bookLink %} [{{ book.bookName }}][{{book.bookLink}}] {% else %} {{ book.bookName }} {% endif %}
{{ book.readTime }} 
{% if book.readLink %} [读书笔记][{{ book.readLink }}] {% endif %}
                </li>
            {% endfor %}
        </ul>
    </div>
</div>
{% endfor %}


[zhifubao_code]: /images/zhifubao_code.jpg
[5a55f12fd7055f54d7060400]: http://user.qzone.qq.com/804345178/mood/5a55f12fd7055f54d7060400.1
[book-list]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/430766252.png
[qzone-china-people]: http://user.qzone.qq.com/804345178/mood/5a55f12f770d55540bcc0300.
[github-tiankonguse]: https://github.com/tiankonguse/tiankonguse.github.io
[Computer-Parables-Enlightenment-in-the-Information-Age]: http://github.tiankonguse.com/blog/2014/11/01/Computer-Parables-Enlightenment-in-the-Information-Age/
[the-ten-of-programming]: http://github.tiankonguse.com/blog/2014/10/31/the-ten-of-programming/
[the-tao-of-programming]: http://github.tiankonguse.com/blog/2014/10/29/the-tao-of-programming/
[csdn]: http://blog.csdn.net/tiankonguse
[github]: http://github.tiankonguse.com/
[iteye]: http://tiankonguse.iteye.com/
[record]: http://tiankonguse.com/record/
[wordpress]: http://tiankonguse.com/blog/
[firstblog]: http://tiankonguse.com/firstblog/
[cnblogs]: http://www.cnblogs.com/tiankonguse/
[qzone]: http://user.qzone.qq.com/804345178/
[On-Top-of-Tides]: http://github.tiankonguse.com/blog/2014/10/22/On-Top-of-Tides/
[lab-kirichik]: http://tiankonguse.com/lab/kirichik/
[douban-Learning-SQL]: http://book.douban.com/subject/4872454/
[douban-High-Performance-MySQL-3rd]: http://book.douban.com/subject/23008813/
[douban-MySQL-High-Availability]: http://book.douban.com/subject/6847455/
[douban-SQL-Antipatterns]: http://book.douban.com/subject/6800774/
[douban-mysql-3729677]: http://book.douban.com/subject/3729677/