---
layout: default
categories: [project]
title : 经典游戏之俄罗斯方块
---


<p style="padding: 0px;margin: 0px;">
<link rel="stylesheet" href="./tetris.css" type="text/css" />
</p>


<div class="wrapper">
  <div class="sub-wrapper">
    <div class="scroller">
        <div id="tetris">
        </div>
    </div>
  </div>
</div>

<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h4 class="modal-title">
    <strong>恭喜你</strong>
    </h4>
    </div>
    <div class="modal-body">
    <p></p>
    </div>
    <div class="modal-footer">
        <a href="" class="btn game-fenxiang game-fenxiang-weibo"  target="_blank" >
            <img src="http://www.sinaimg.cn/blog/developer/wiki/LOGO_16x16.png" alt="分享到新浪微博" >
        </a>
        <a href="" class="btn game-fenxiang game-fenxiang-qzone"  target="_blank" >
            <img src="http://qzonestyle.gtimg.cn/ac/qzone_v5/app/app_share/qz_logo.png" alt="分享到QQ空间" />
        </a>
		<button type="button" class="btn btn-danger " data-dismiss="modal">重玩</button>
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

function loadTetris() {
    var tetris = new TK.Tetris();
    var cw,ch, oneSize, pad = 1, canvasWidth, canvasHeight,w,h, one;
    
    w =  tk.min($(window).width(), screen.width, screen.availWidth);
    h =  tk.min($(window).height(), screen.height, screen.availHeight);
    var tetrisPad = 0;
    var menuHeight = 38;
    var menuPad = 15;
    var adHeight = 50;
    var boadWidth = 2;
    h -= boadWidth;
    
    //fix QQ bug
    if(tk.isMobile.QQ()){
        h -= 2;
        $("#tetris").css("border", "0px");
    }
    
    var widthNum = 10;
    
    if(tk.isMobile.any()){
        h -= menuHeight;
        tetrisPad += menuHeight;
        h -= adHeight;
        
        if(w > 754){
            h -= menuPad;
            tetrisPad += menuPad;
            
            $(".right-ad,.left-ad").hide();
            w -= 500;
            h -= 150;
            widthNum = 15;
        }
        oneSize = parseInt(w * 0.7 / widthNum);
        cw = oneSize * widthNum;
        ch = oneSize * parseInt(h/oneSize);
        //tetrisPad += (h - ch);
        $("#tetris").css("width", w+"px");
        
        //$("#tetris").css("padding-top", tetrisPad+"px");
        $("#tetris").css("padding-top", "2.7em");
    }else{
        if(w < 1400){
            w -= 700;
            h -= 150;
            oneSize = parseInt(w * 0.5 / widthNum);
            cw = oneSize * widthNum;
            ch = oneSize * parseInt(h/oneSize);
            
            $("#tetris").css("height", h+"px");
            $("#tetris").css("width", w+"px");
        }else{
            pad = 2;
            ch = 800;
            cw = 400;
            oneSize = 40;
            w = 700;
        }
    }
    
    tetris.init({
        canvasHeight : ch,
        canvasWidth : cw,
        pSize : oneSize,
        next_shap_pad : pad,
        dom : $("#tetris"),
        style : {
            "canvas" :{
                "width" : cw + "px",
                "height" : ch + "px"
            },
            "info" :{
                "width" : (w-cw) + "px",
                "height" : ch + "px"
            },
            "next_shape" : {
                "padding-bottom" : (oneSize * 3 + 10) + "px"
            }
        },
        callback : function(score){
            showMessage(score, function(){
                location.href = location.href;
            });
        }
    });


}

tk.require("/project/tetris/index.md", ["/project/tetris/tetris.js"], function(){
    loadTetris();
});



function setWeiBo(shareUrl, title, $dom){
    var url = "http://v.t.sina.com.cn/share/share.php?url="+encodeURI(shareUrl)+"&title="+encodeURI(title)+"&appkey=2924220432 &searchPic=false";
    $dom.attr("href", url);
}

function setQzone(shareUrl, title, $dom){
    var url = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+shareUrl+"#0-qzone-1-68767-d020d2d2a4e8d1a374a433f596ad1440&title=经典游戏之俄罗斯方块&desc="+title+"&summary="+title+"&site=http://github.tiankonguse.com";
    $dom.attr("href", url);
}

function showMessage(score, cb) {
    var $message = $("#myModal");
    var shareUrl = "http://github.tiankonguse.com/project/tetris/";

    
    var title = "俄罗斯方块我轻松达到"+score+"分，你能打败我吗？快来挑战我吧？";
    var bodyText = "恭喜你，获得了" + score + "高分，分享给好友？";
    
    if(typeof WeixinJSBridge == 'undefined'){
        setWeiBo(shareUrl, title, $(".game-fenxiang-weibo"));
        setQzone(shareUrl, title, $(".game-fenxiang-qzone"));
    }else{
        $("#game-fenxiang").hide();
        document.title = "俄罗斯方块我轻松达到"+score+"分，你能打败我吗？快来挑战我吧？";
    }
    $message.find(".modal-body>p").text(bodyText);
    $message.modal("show");
    if (cb) {
		$message.on("hidden.bs.modal", cb);
    }
}

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
  if (isScroller(target)) {
    ev.stopPropagation()
  }
}, false)

</script>

