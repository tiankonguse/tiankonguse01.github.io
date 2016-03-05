---
layout: default
categories: [project]
title : 手机移动端水平滑动相册2
---

<link rel="stylesheet" href="lrtk.css" />
<script src="/javascripts/tk.islider.js"></script>
<div id="iSlider-effect-wrapper">
    <div id="animation-effect" class="iSlider-effect"></div>
</div>


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
        "content" : value
    });  
});



tk.comment.isHaveComment = false;
if(tk.isMobile.any()){
    jQuery(window).load(function(){
	    var win_height = jQuery(window).height();
	    var img_height = win_height * 0.80;
	    jQuery('#animation-effect').css('height',img_height  + 'px');
    });
    tk.ad.isLoadGoogleJs = false;
    tk.ad.isShowPageFoot = false;
    jQuery(document).ready(function(){
        tk.ad.loadGoogleJs(true);
        jQuery(".ad-page-footer").show();
	    tk.ad.showPageFoot("ad-page-footer","auto" ,true);
    });
}
jQuery(document).ready(function(){
    //all animation effect
    var islider1 = new TK.iSlider({
        data: content,
        dom: document.getElementById("animation-effect"),
        duration: 2000,
        animateType: 'default',
        isAutoplay: true,
        isLooping: true,
        isVertical: false
    });
    islider1.bindMouse();
});

</script>


