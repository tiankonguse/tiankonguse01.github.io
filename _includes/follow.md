<div class="home-menu">
    <div class="home-icon-con">
        <a class="home-menu-icon home-link" href="{{ site.url }}">tiankonguse</a>
        <a class="home-follow home-link" href="{{ site.url }}#" title="Contact Me">+</a>
        <a class="home-menu-ex home-link" href="#" title="Extend Menu">≡</a>
    </div>
    <div class="home-contact">
        {% for follow in site.data.follow %}
            <a href="{{ follow.url }}" target="_blank">
            {% if follow.showImg == 1 %}
                <img src="{{ follow.img }}" alt="{{ follow.name }}">
                
            {% else %}
                <span class="fa-stack fa-lg">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa {{ follow.class }} fa-stack-1x fa-inverse"></i>
                </span>
            {% endif %}
            </a>
        {% endfor %}
    </div>
</div>
<div class="home-next">
    <div class="home-icon-con">
        <a class="home-menu-next home-link" href="/project/">穿越</a>
    </div>
</div>
