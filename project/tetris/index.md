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
		<button type="button" class="btn btn-success" id="game-fenxiang" data-dismiss="modal">分享</button>
		<button type="button" class="btn btn-danger " data-dismiss="modal">不分享了</button>
		</div>
    </div>
    </div>
</div>

<script>
var nowScore;
function showMessage(score) {
    nowScore = score;
    $message = $("#myModal");
    $message.find(".modal-body>p").text("恭喜你，获得了" + score "高分，微博分享给好友？");
    $message.modal("show");
}

jQuery(document).ready(function(){
    $("#game-fenxiang").click(function(){
        var url = "http://service.weibo.com/share/share.php?url=http://github.tiankonguse.com/project/tetris/&title=%E4%BF%84%E7%BD%97%E6%96%AF%E6%96%B9%E5%9D%97%E6%88%91%E8%BD%BB%E6%9D%BE%E8%BE%BE%E5%88%B"+nowScore+"%E5%88%86%EF%BC%8C%E4%BD%A0%E8%83%BD%E6%89%93%E8%B4%A5%E6%88%91%E5%90%97%EF%BC%9F%E5%BF%AB%E6%9D%A5%E6%8C%91%E6%88%98%E6%88%91%E5%90%A7%EF%BC%9F&appkey=4191660266&searchPic=false";
        window.open(url, 'newwindow', 'height=100, width=400, top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no')
    });
});
    
    
</script>