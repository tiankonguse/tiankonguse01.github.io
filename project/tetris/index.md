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
		<button type="button" class="btn btn-success" id="game-fenxiang">分享</button>
		<button type="button" class="btn btn-danger " data-dismiss="modal">不分享了</button>
		</div>
    </div>
    </div>
</div>

<script>
var nowScore;
var $message
function showMessage(score) {
    nowScore = score;
   
    $message.find(".modal-body>p").text("恭喜你，获得了" + score + "高分，微博分享给好友？");
    $message.modal("show");
}

jQuery(document).ready(function(){
     $message = $("#myModal");
    $("#game-fenxiang").click(function(){
        //#0-tsina-1-87453-397232819ff9a47a7b7e80a40613cfe1
        var shareUrl = "http://github.tiankonguse.com/project/tetris/";
        var title = "俄罗斯方块我轻松达到"+nowScore+"分，你能打败我吗？快来挑战我吧？";
       document.title = title;
       //appkey 4191660266
       //http://v.t.sina.com.cn/share/share.php
        var url = "http://v.t.sina.com.cn/share/share.php?url="+encodeURI(shareUrl)+"&title="+encodeURI(title)+"&appkey=2924220432 &searchPic=false";
        window.open(url, 'newwindow', 'height=100, width=400, top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
    });
});
    
    
</script>