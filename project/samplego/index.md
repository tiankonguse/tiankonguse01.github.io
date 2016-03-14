---
layout: default
categories: [project]
title : samplego
---

<p style="padding: 0px;margin: 0px;">
<link rel="stylesheet" href="./samplego.css" type="text/css" />
</p>


<div class="wrapper">
  <div class="sub-wrapper">
    <div class="scroller">
        <div id="weiqi-frame">
            <button id="move_show" type="button">显示手数</button><br />
            <canvas id="weiqi-board"></canvas>
            <canvas id="weiqi-piece"></canvas>
        </div>
    </div>
  </div>
</div>




<script>
tk.comment.isHaveComment = false;
if(tk.isMobile.any()){
    tk.ad.isLoadGoogleJs = false;
    tk.ad.isShowPageFoot = false;
    jQuery(document).ready(function(){
        tk.ad.loadGoogleJs(true);
        $(".ad-page-footer").show();
	    tk.ad.showPageFoot("ad-page-footer","auto" ,true);
    });
}

function loadSampleGo() {
    var samplego = new TK.SampleGo();
    samplego.init({
        boardDom : $("#weiqi-board"),
        pieceDom : $("#weiqi-piece"),
    });
    
}

tk.require("/project/samplego/index.md", ["/project/samplego/samplego.js", "/javascripts/tk.scroll.js"], function(){
    tk.scroll.fixScroll();
    loadSampleGo();
});


</script>

