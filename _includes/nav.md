<ul class="artical-cate">
    {% for nav in site.data.nav %}
        <li style="{{ nav.style }}"><a href="{{ site.url }}{{ nav.url }}"><span>{{ nav.text }}</span></a></li>
    {% endfor %}
</ul>
