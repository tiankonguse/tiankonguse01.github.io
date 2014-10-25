---
layout: default
title : 俄罗斯方块游戏
---

<link rel="stylesheet" href="./tetris.css" type="text/css" />
<div id="tetris">
    <div id="info">
        <div id="next_shape"></div>
        <p id="level">
            Level: <span></span>
        </p>
        <p id="lines">
            Lines: <span></span>
        </p>
        <p id="score">
            Score: <span></span>
        </p>
        <p id="time">
            Time: <span></span>
        </p>
        <p id="help">
            左滑: <span>左</span>
        </p>
        <p id="help">
            右滑: <span>右</span>
        </p>
        <p id="help">
            下滑: <span>下</span>
        </p>
        <p id="help">
            上滑: <span>暂停/继续</span>
        </p>
        <p id="help">
            点击: <span>旋转</span>
        </p>
    </div>
    <div id="canvas"></div>
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
<script src="./tetris.js"></script>

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
        <a href="" class="btn btn-success"  id="game-fenxiang" target="_blank" >分享</a>
		<button type="button" class="btn btn-danger " data-dismiss="modal">重玩</button>
		</div>
    </div>
    </div>
</div>

<script>
var isWeiXin = false;
var shareUrl;
var title;
function showMessage(score, cb) {
    var $message = $("#myModal");
    var bodyText, url;
    
    shareUrl = "http://github.tiankonguse.com/project/tetris/";
    title = "俄罗斯方块我轻松达到"+score+"分，你能打败我吗？快来挑战我吧？";
    
    if(typeof WeixinJSBridge == 'undefined'){
        
        bodyText = "恭喜你，获得了" + score + "高分，微博分享给好友？";
        var url = "http://v.t.sina.com.cn/share/share.php?url="+encodeURI(shareUrl)+"&title="+encodeURI(title)+"&appkey=2924220432 &searchPic=false";
        $("#game-fenxiang").attr("href", url);
    }else{
        isWeiXin = true;
        bodyText = "恭喜你，获得了" + score + "高分，朋友圈分享给好友？";
        
    }
    $message.find(".modal-body>p").text(bodyText);
    $message.modal("show");
    if (cb) {
		$message.on("hidden.bs.modal", cb);
    }
}
$("#game-fenxiang").click(function(){
    if(isWeiXin){
         WeixinJSBridge.invoke('shareTimeline', {
            'img_url': '', 
            'link': shareUrl,
            'desc': title,
            'title': "经典小游戏 俄罗斯方块"
        });
    }
    return true;
});
</script>