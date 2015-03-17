<div class="sidenav">
	<h2>网站公告</h2>
	<ol class="artical-list">
	{% for post in site.data.notice %}
		<li>{{ post.title }}</li>
	{% endfor %}
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
<div class="sidenav">
	<h2>孩子的奶粉钱</h2>
	<div>
		<ins class="adsbygoogle"
			 style="display:inline-block;width:250px;height:250px"
			 data-ad-client="ca-pub-2326969899478823"
			 data-ad-slot="8884906795"></ins>
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
	<h2>最近记录</h2>
	<ul class="artical-list">
	{% for post in site.related_posts %}
		<li><a href="{{ site.url }}{{ post.url }}">{{ post.title }}</a></li>
	{% endfor %}
	</ul>
</div> 

<div id="menuIndex" class="sidenav"></div>
<div id="menuIndex-next" class="sidenav">
	<ins class="adsbygoogle"
		 style="display:inline-block;width:250px;height:250px"
		 data-ad-client="ca-pub-2326969899478823"
		 data-ad-slot="8884906795"></ins>
	<script>
	(adsbygoogle = window.adsbygoogle || []).push({});
	</script>
</div>
