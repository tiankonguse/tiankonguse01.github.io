---
layout: default
categories: [project]
title : 手机移动端水平滑动相册
---

<link rel="stylesheet" type="text/css" href="/res/zepto/css/reset.css" />
<link rel="stylesheet" type="text/css" href="/res/zepto/css/slider.css" />
<link rel="stylesheet" type="text/css" href="/res/zepto/css/slider.default.css" /> 
<script type="text/javascript" src="/res/zepto/js/zepto.js"></script>
<script type="text/javascript" src="/res/zepto/js/zepto.extend.js"></script>
<script type="text/javascript" src="/res/zepto/js/zepto.ui.js"></script>
<script type="text/javascript" src="/res/zepto/js/mobileevent2pc.js"></script> 
<script type="text/javascript" src="/res/zepto/js/touch.js"></script> 
<script type="text/javascript" src="/res/zepto/js/slider.js"></script>

<div id="slider"></div>
<script>

//创建slider组件
</script>
<!-- 图片高度自适应 -->
<script type="text/javascript">
var link = "/project/photowall/";
var imgList = [];
imgList.push("http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/295002876.jpg");
imgList.push("http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/301178483.jpg");
imgList.push("http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/303276483.jpg");
imgList.push("http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/305125988.jpg");
imgList.push("http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/307156613.jpg");
imgList.push("http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/308843132.jpg");
imgList.push("http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/310617989.jpg");
imgList.push("http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/312398589.jpg");
imgList.push("http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/314567897.jpg");
imgList.push("http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/316447966.jpg");

var content = [];


$.each(imgList,function(index,value){
    content.push({
        href: link,
        pic: value,
        title: ""
    });  
});

var showNum = 3;

if(tk.isMobile.any()){
    showNum = 2;
}

Zepto.ui.slider('#slider', {
    autoPlay:true,
    showArr:false,
    imgZoom:false,
    loop:true,
    viewNum:showNum,
    content:content
});

tk.comment.isHaveComment = false;
jQuery(window).load(function(){
	var win_height = Zepto(window).height();
	var img_height = win_height * 0.67;
	var top_height = win_height * 0.14;
	jQuery('#slider').css('height',img_height  + 'px').css('margin-top',top_height  + 'px');
});
if(tk.isMobile.any()){
    tk.ad.isLoadGoogleJs = false;
    tk.ad.isShowPageFoot = false;
    jQuery(document).ready(function(){
        tk.ad.loadGoogleJs(true);
        jQuery(".ad-page-footer").show();
	    tk.ad.showPageFoot("ad-page-footer","auto" ,true);
    });
}
</script>


