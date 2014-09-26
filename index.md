---
layout: home
---

<div class="index-content blog">
    <div class="section">
        <ul class="artical-cate">
            <li class="on"><a href="/"><span>home</span></a></li>
            <li style="text-align:center"><a href="/opinion"><span>Opinion</span></a></li>
            <li style="text-align:right"><a href="/project"><span>Project</span></a></li>
        </ul>
        
        <div class="cate-bar"><span id="cateBar"></span></div>
        
        <ul class="artical-list">
            {% for post in paginator.posts %}
            <li>
            <h2><a href="{{ post.url }}">{{post.title }}</a></h2>
            <div class="title-desc">{{ post.description }}</div>
            </li>
            {% endfor %}
        </ul>
        
        <!-- Pagination links -->
        <div class="pagination">
          {% if paginator.previous_page %}
            <a href="/page{{ paginator.previous_page }}" class="previous">Previous</a>
          {% else %}
            <span class="previous">Previous</span>
          {% endif %}
          
          <span class="page_number ">Page: {{ paginator.page }} of {{ paginator.total_pages }}</span>
          {% if paginator.next_page %}
            <a href="/page{{ paginator.next_page }}" class="next">Next</a>
          {% else %}
            <span class="next ">Next</span>
          {% endif %}
          
        </div>
        
    </div>
    <div class="aside"></div>
</div>

