
function preventDefault(ev) {
  ev.preventDefault()
}

document.addEventListener('touchmove', preventDefault, false)

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
    showNum = 1.5;
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
