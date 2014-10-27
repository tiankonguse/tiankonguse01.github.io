---
layout: default
title : 经典游戏之俄罗斯方块
---

<p style="padding: 0px;margin: 0px;">
<link rel="stylesheet" href="./tetris.css" type="text/css" />
</p>
<div id="tetris">
</div>
<div class="right-ad">
<!-- 300 x 600 -->
<ins class="adsbygoogle"
     style="display:inline-block;width:300px;height:600px"
     data-ad-client="ca-pub-2326969899478823"
     data-ad-slot="1758482399"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
</div>
<div class="left-ad">
<!-- 300 x 600 -->
<ins class="adsbygoogle"
     style="display:inline-block;width:300px;height:600px"
     data-ad-client="ca-pub-2326969899478823"
     data-ad-slot="1758482399"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
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
tk.loadJSFile($("body"), "./tetris.js?t=" + tk.time());

if(tk.isMobile.any()){
    tk.ad.isLoadGoogleJs = false;
    tk.ad.isShowPageFoot = false;
    jQuery(document).ready(function(){
        
        tk.ad.showPageFoot("ad-page-footer", "320-50", true);
        $(".ad-page-footer").show();
        tk.ad.loadGoogleJs(true);
    });
}


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

</script>

