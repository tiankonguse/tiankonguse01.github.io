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
    </div>
    <div id="canvas"></div>
</div>
<div class="right-ad" style="position: fixed;right: 10px;top: 200px;">
<!-- 300 x 600 -->
<ins class="adsbygoogle"
     style="display:inline-block;width:300px;height:600px"
     data-ad-client="ca-pub-2326969899478823"
     data-ad-slot="1758482399"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
</div>
<div class="left-ad"  style="position: fixed;left: 10px;top: 200px;">
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
        <a href="" class="btn btn-success"  id="game-fenxiang" target="_blank" data-dismiss="modal">分享</a>
		<button type="button" class="btn btn-danger " data-dismiss="modal">不分享了</button>
		</div>
    </div>
    </div>
</div>

<script>
function showMessage(score) {
    var $message = $("#myModal");
    $message.find(".modal-body>p").text("恭喜你，获得了" + score + "高分，微博分享给好友？");
    var shareUrl = "http://github.tiankonguse.com/project/tetris/";
    var title = "俄罗斯方块我轻松达到"+score+"分，你能打败我吗？快来挑战我吧？";
    var url = "http://v.t.sina.com.cn/share/share.php?url="+encodeURI(shareUrl)+"&title="+encodeURI(title)+"&appkey=2924220432 &searchPic=false";
    $("#game-fenxiang").attr("href", url);
    $message.modal("show");
}
</script>