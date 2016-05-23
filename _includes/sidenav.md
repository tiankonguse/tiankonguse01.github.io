<div class="sidenav">
	<h2>关注公众号,接收最新消息</h2>
	<ol class="artical-list">
	<li><img src="/images/weixin-12cm.jpg" border="0" width="100%" alt="" class="img_weixin"></li>
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
<!--div class="sidenav">
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
</div-->

{% if site.load_resources == 1 %}
<div class="sidenav">
	<h2><a href="{{ site.url }}/resources"><span>Resources</span></a></h2>
	<ul class="artical-list">
		{% for post in site.data.resources %}
			<li><a href="{{ post.url }}">{{ post.title }}</a></li>
		{% endfor %}
	</ul>
</div> 
{% endif %}




<div id="menuIndex" class="sidenav">
	<h2><span>目录</span></h2>
</div>
<div id="menuIndex-next" class="sidenav">
<!--
    <ins class="adsbygoogle"
		 style="display:inline-block;width:250px;height:250px"
		 data-ad-client="ca-pub-2326969899478823"
		 data-ad-slot="8884906795"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
	-->
</div>
