---
layout: default
categories: [project]
title : 手机移动端水平滑动相册2
---

<link rel="stylesheet" href="lrtk.css" />
<script src="/javascripts/tk.islider.js"></script>


<div class="wrapper">
  <div class="sub-wrapper">
    <div class="scroller">
        <div id="iSlider-effect-wrapper">
            <div id="animation-effect" class="iSlider-effect"></div>
        </div>
    </div>
  </div>
</div>


<!-- 图片高度自适应 -->
<script type="text/javascript">
function preventDefault(ev) {
  ev.preventDefault()
}

document.addEventListener('touchmove', preventDefault, false);


function isScroller(el) {

  // 判断元素是否为 scroller
  return el.classList.contains('scroller')
}

document.body.addEventListener('touchmove', function (ev) {
  var target = ev.target

  // 在 scroller 上滑动，阻止事件冒泡，启用浏览器默认行为。
  if (isScroller(target)) {
    ev.stopPropagation()
  }
}, false)


var link = "/project/photowall/";
var imgList = [];
var content = [];


$.get("/data/islide_horizontally.json",function(d){
    for(var i in d){
        imgList.push(d[i].url);
    }
    $.each(imgList,function(index,value){
        content.push({
            "content" : value
        });  
    });
    var islider1 = new TK.iSlider({
        data: content,
        dom: document.getElementById("animation-effect"),
        duration: 3000,
        animateType: 'default',
        isAutoplay: true,
        isLooping: true,
        isVertical: false
    });
    islider1.bindMouse();
},"json");



tk.comment.isHaveComment = false;
if(tk.isMobile.any()){
    jQuery(window).load(function(){
	    var win_height = jQuery(window).height();
	    var img_height = win_height * 0.80;
	    jQuery('#animation-effect').css('height',img_height  + 'px');
    });
    tk.ad.isLoadGoogleJs = false;
    tk.ad.isShowPageFoot = false;
    
    jQuery(".ad-page-footer").on('touchmove', preventDefault);
    jQuery(document).ready(function(){
        tk.ad.loadGoogleJs(true);
        jQuery(".ad-page-footer").show();
	    tk.ad.showPageFoot("ad-page-footer","auto" ,true);
    });
}



</script>


