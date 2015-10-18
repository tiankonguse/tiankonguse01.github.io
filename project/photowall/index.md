---
layout: default
categories: [project]
title : 简单优雅的照片墙
---
<link href="main.css" rel="stylesheet" type="text/css">


<div class="photowall-container">
</div>
<div class="clearfix"></div>
<script type="text/javascript" src="jquery-ui-1.10.2.custom.js"></script>
<script type="text/javascript">
    /* 定义随机left，top和旋转值 */
    $(document).ready(function(){
        $(".js-scroll-comment").click(function(){
            window.open("/about.html#disqus_container");
        });
        
    
        setTimeout(function(){
            $(".ad-page-footer").hide();
        },10);
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
                    $(this).css({"transform":"rotate(0deg)","cursor": "crosshair", "transition":"0ms"}); /* 开始拖动图片旋转为0，鼠标样式改变 */
                },
                stop: function(){
                    var _obj = defineRandom();
                    zindex = zindex + 1;
                    $(this).css({"transform":"rotate("+_obj.rotate+"deg)","cursor": "pointer", "z-index":zindex, "transition":"500ms"}); /* 停止拖动，旋转为随机的 */
                }
            });
            
        }
        
        function changeSize(){
            $(".photowall-container img").each(function(i,v){
                var img = $(v);
                if(tk.isMobile.any()){
                    img.css("width","45%");
                }else{
                    img.css("width","15%");
                }
                
            })
        }
        
        function getImageClassIndex(seed){
            return Math.ceil(Math.random()*seed);
        }
        
        function defineSevenDiv($own){
            var _obj = defineRandom();
            $own.css({"transform":"rotate("+_obj.rotate+"deg)"}); /* 设置随机旋转值 */
            $own.animate({left: _obj.left+"px",top: _obj.top+"px"}); /* 随机排布 */
        }
        
        
        function addTag(img){
            var className = "img-" + (getImageClassIndex(6) + 1);
            $(".photowall-container").append("<img class=\"photowall-img "+className+"\" src=\""+img.url+"\">");
            defineSevenDiv($(".photowall-container").find("img:last"));
        }
        
        $.get("photowall_data.json",function(d){
            var c = {}, key;
            for(var i in d){
                key = getImageClassIndex(d.length*3);
                c["_" + key] = key;
            }
            
            for(var i in c){
                var key = c[i];
                if(key < d.length){
                     addTag(d[key]);
                }
               
            }
            
            
            /* 拖动祝福卡片 */
            draggableNote();
            changeSize();
        },"json");
        
    });
</script>
