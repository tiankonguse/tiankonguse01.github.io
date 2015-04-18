---
layout: post
title: 在线配置PS1样式 
description : Generate your .bashrc PS1 prompt easily with a drag and drop interface
categories: [project]
---

<div style="height:0px;">
<link rel="stylesheet" href="reset.css" type="text/css">
<link rel="stylesheet/less" href="default.less" type="text/css">
</div>

<div class="content">
	<section class="presets">
		<b>Examples and presets of PS1 prompts</b>
		<span>Clicking on an example will replace your selection.</span>
		<ol id="presets">
		</ol>
	</section>
	<section class="main">
		<b>Preview of your prompt</b>
		<div id="preview"></div>
		<b>Your selection
			<span class="buttons _cf">
				<a class="small-button" id="removeEverythingBtn">remove everything</a>
			</span>
		</b>
		<ul class="dd" id="wishlist"></ul>
		<div id="palette" class="arrow-box" style="display:none;">
			<div class="colors"></div>
			<div class="boldness"></div>
		</div>
	</section>
	<section class="sources">
		<b>Drag and drop elements to your selection</b>
		<ul id="source" class="source dd _cf">
		</ul>
	</section>
	<section class="output">
		<b>Your generated .bashrc PS1 and additional functions</b>
		<span>Paste to your command line or copy into your .bashrc file for permanent use (example: vim ~/.bashrc), which I recommend doing of course.</span>
		<div id="output"></div>
	</section>
</div>
<script src="/javascripts/jquery-ui.min.js"></script>
<script src="/javascripts/jquery.tipsy.js"></script>
<script src="/javascripts/less-1.2.2.min.js"></script>
<script src="generator-1.js"></script>
