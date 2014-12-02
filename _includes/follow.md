<div class="home-menu">
    <div class="home-icon-con">
        <a class="home-menu-icon" href="{{ site.url }}">tiankonguse</a>
        <a class="home-follow" href="{{ site.url }}#" title="Contact Me">+</a>
    </div>
    <div class="home-contact">
        {% for follow in site.data.follow %}
            <a href="{{ follow.url }}" target="_blank"><img src="{{ follow.img }}" alt="{{ follow.name }}"></a>
        {% endfor %}
    </div>
</div>