---
layout: default
categories: [project]
title : 简单优雅的照片墙
---
<style type="text/css">

.photowall-container {
    padding: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    position: relative;
}

.photowall-container img {
    padding: 10px 10px 15px;
    background: #fff;
    border: 1px solid #ddd;
    position: absolute;
    transition: 500ms;
}

.photowall-container img:hover {
    tranform: rotate(0);
    -webkit-transform: rotate(0);
    -webkit-transform: scale(1.2);
    -ms-transform: scale(1.2);
    transform: scale(1.2);
    box-shadow: 10px 10px 15px #ccc;
    z-index: 2700;
}


@media screen and (max-width: 750px) {
    .photowall-container img {
        padding: 2px 2px 3px;
    }
    .photowall-container img:hover {
        box-shadow: 2px 2px 3px #ccc;
    }
}


</style>
<div class="photowall-container">
</div>
<div class="clearfix"></div>
<script type="text/javascript" src="jquery-ui-1.10.2.custom.js"></script>
<script type="text/javascript">
    /* 定义随机left，top和旋转值 */

    $(document).ready(function(){
        var zindex = 2;
        var w =  tk.min($(window).width(), screen.width, screen.availWidth) - 200;
        var h =  tk.min($(window).height(), screen.height, screen.availHeight) - 200;
        
        if(tk.isMobile.any()){
            w =  w + 150;
            h =  h + 150;
        }
        
        function defineRandom(){
            var randomLeft = Math.floor(w*(Math.random())), /* 图片left值 */
            randomTop =  Math.floor(h*Math.random()) , /* 图片top值 */
            randomRotate = 20 - Math.floor(40*Math.random()); /* 图片旋转角度 */
            return {
                left: randomLeft,
                top: randomTop,
                rotate:randomRotate
            }
        }
        
        
        function draggableNote(){
            $(".photowall-container img").draggable({
                containment: $(".photowall-container"),
                zIndex: 2700,
                start: function(){
                    $(this).css({"transform":"rotate(0deg)","cursor": "crosshair"}); /* 开始拖动图片旋转为0，鼠标样式改变 */
                },
                stop: function(){
                    var _obj = defineRandom();
                    zindex = zindex + 1;
                    $(this).css({"transform":"rotate("+_obj.rotate+"deg)","cursor": "pointer", "z-index":zindex}); /* 停止拖动，旋转为随机的 */
                }
            });
            
        }
        
        function changeSize(){
            $(".photowall-container img").each(function(i,v){
                var img = $(v);
                if(tk.isMobile.any()){
                    img.css("width","35%");
                }else{
                    img.css("width","15%");
                }
                
            })
        }
        
        function getImageClassIndex(){
            return Math.ceil(Math.random()*6);
        }
        
        function defineSevenDiv($own){
            var _obj = defineRandom();
            $own.css({"transform":"rotate("+_obj.rotate+"deg)"}); /* 设置随机旋转值 */
            $own.animate({left: _obj.left+"px",top: _obj.top+"px"}); /* 随机排布 */
        }
        
        
        function addTag(img){
            var className = "note-" + getImageClassIndex();
            $(".photowall-container").append("<img class=\""+className+"\" src=\""+img.url+"\">");
            defineSevenDiv($(".photowall-container").find("img:last"));
        }
        
        $.get("photowall_data.json",function(d){
            for(var i in d){
                addTag(d[i]);
            } 
            
            /* 拖动祝福卡片 */
            draggableNote();
            changeSize();
        },"json");
        
    });
</script>
