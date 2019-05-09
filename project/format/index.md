---
layout: post
title: 在线代码格式化
categories: [project]
---

<div class="toolUsing clearfix"> 
    <div class="topBar"> 
         <div class="title">
          待格式化代码：
         </div> 
         <textarea id="code-befor" style="width: 90%;  height: 200px;"></textarea>
    </div> 
    <div class="operateTB form-inline">
        操作： 
        <select id="code-op">
            <option value="格式化" selected="selected">格式化</option>
            <option value="普通压缩">普通压缩</option>
            <option value="加密压缩">加密压缩</option>
        </select> 
        代码语言:
        <select id="code-lang">
            <option value="css" selected="selected">css</option>
            <option value="javascript">javascript</option>
            <option value="html">html</option>
        </select> 
        缩进方式： 
        <select id="code-tab">
            <option value="1">Tab符缩进</option>
            <option value="4" selected="selected">4个空格缩进</option>
        </select> 
        <input class="btn btn-small btn-primary" type="button" onclick="doSomething()" value="操作">
    </div> 
    <div class="bottomBar"> 
        <div class="title">
            格式化代码：
        </div> 
        <div class="resizable-textarea">
            <textarea id="code-after" style="width: 90%;  height: 200px;"></textarea>
        </div> 
    </div> 
</div> 
<script type="text/javascript" src="./jsbeautify.js"></script> 
<script type="text/javascript" src="./cssbeautify.js"></script> 
<script type="text/javascript" src="./htmlformat.js"></script>
<script type="text/javascript" src="./base.js"></script>
