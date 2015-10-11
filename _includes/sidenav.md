<div class="sidenav">
	<h2>关注公众号,接收最新消息</h2>
	<ol class="artical-list">
	<li><img src="/images/weixin-12cm.jpg" border="0" width="100%" height="100%" alt="" class="img_weixin"></li>
	</ol>
</div>
<div class="sidenav">
	<h2>置顶文章</h2>
	<ul class="artical-list">
	{% for post in site.data.toppost %}
		<li><a href="{{ site.url }}{{ post.url }}">{{ post.title }}</a></li>
	{% endfor %}
	</ul>
</div>
<div class="sidenav" >
	<h2>孩子的奶粉钱</h2>
	<div>
<!-- ins class="adsbygoogle"
			 style="display:inline-block;width:250px;height:250px"
			 data-ad-client="ca-pub-2326969899478823"
			 data-ad-slot="8884906795"></ins -->
<!-- auto -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2326969899478823"
     data-ad-slot="8239263590"
     data-ad-format="auto"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
	</div>
</div>

<div class="sidenav">
	<h2><a href="{{ site.url }}/resources"><span>Resources</span></a></h2>
	<ul class="artical-list">
		{% for post in site.data.resources %}
			<li><a href="{{ post.url }}">{{ post.title }}</a></li>
		{% endfor %}
	</ul>
</div> 

<div class="sidenav">
	<h2><a href="{{ site.url }}/archives.html"><span>猜你喜欢</span></a></h2>
	<ul class="artical-list">
{% assign matchNum = 0 %}

{% for post in site.posts %}
    {% if matchNum < 10 %}
        {% assign match = false %}
        {% for tag in post.tags %}
            {% if page.tags contains tag %}
                {% assign match = true %}
            {% endif %}
        {% endfor %}
        {% if match %}
            {% assign matchList[matchNum] = post %}
            {% assign matchNum = matchNum | plus:1 %}
            <li><a href="{{ site.url }}{{ post.url }}">{{ post.title }}</a></li>
        {% endif %}
    {% endif %}
{% endfor %}

{% if matchNum < 10 %}
    {% assign matchNum = 10 | minus:matchNum %}
    {% for post in site.posts limit:matchNum  %}
        <li><a href="{{ site.url }}{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
{% endif %}
	</ul>
</div>

<div id="menuIndex" class="sidenav"></div>
<div id="menuIndex-next" class="sidenav">
<!-- ins class="adsbygoogle"
		 style="display:inline-block;width:250px;height:250px"
		 data-ad-client="ca-pub-2326969899478823"
		 data-ad-slot="8884906795"></ins -->
<!-- auto -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2326969899478823"
     data-ad-slot="8239263590"
     data-ad-format="auto"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
	
</div>
