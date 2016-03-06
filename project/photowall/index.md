---
layout: default
categories: [project]
title : 简单优雅的照片墙
---
<link href="main.css" rel="stylesheet" type="text/css">


<div class="wrapper">
  <div class="sub-wrapper">
    <div class="scroller">
        <div class="photowall-tips">图片可拖拽哦</div>
        <div class="photowall-container">
        </div>
    </div>
  </div>
</div>


<div class="clearfix"></div>
<script type="text/javascript" src="jquery-ui-1.10.2.custom.js"></script>
<script type="text/javascript">
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


    /* 定义随机left，top和旋转值 */
    $(document).ready(function(){

        
    
        setTimeout(function(){
            $(".ad-page-footer").hide();
        },10);
        var zindex = 2;
        var w =  tk.min($(window).width(), screen.width, screen.availWidth) - 300;
        var h =  tk.min($(window).height(), screen.height, screen.availHeight) - 300;
        
        if(tk.isMobile.any()){
            w =  w + 150;
            h =  h + 150;
        }
        
        function defineRandom(){
            var randomLeft = Math.floor(w*(Math.random())), /* 图片left值 */
            randomTop =  Math.floor(h*Math.random()) , /* 图片top值 */
            randomRotate = 90 - Math.floor(180*Math.random()); /* 图片旋转角度 */
            return {
                left: randomLeft,
                top: randomTop,
                rotate:randomRotate
            }
        }
        
        
        function draggableNote(){
            var touch = {};
            var abs = Math.abs;
            var MIN_STEP = 5;
            function _start($obj){
                 /* 开始拖动图片旋转为0，鼠标样式改变 */
                zindex = zindex + 1;
                $obj.css({"position": "absolute","transform":"rotate(0deg)","cursor": "crosshair","z-index":zindex, "transition":"10ms"});
                
            }
            function _stop($obj){
                /* 停止拖动，旋转为随机的 */
                var _pos = defineRandom();
                zindex = zindex + 1;
                $obj.css({"position": "absolute","transform":"rotate("+_pos.rotate+"deg)","cursor": "pointer", "z-index":zindex, "transition":"500ms"}); 
            }
            
            var $img = $(".photowall-container img");
            $img.draggable({
                containment: $(".photowall-container"),
                zIndex: 2700,
                start: function(){
                    _start($(this));
                },
                stop: function(){
                    _stop($(this));
                }
            });
            function _copy(to, _from){
                to.clientX = _from.clientX;
                to.clientY = _from.clientY;
                to.pageX = _from.pageX;
                to.pageY = _from.pageY;
                to.screenX = _from.screenX;
                to.screenY = _from.screenY;
            }
            $img.on("touchstart", function(event){
                _start($(this));
                var _touch = event.originalEvent.changedTouches[0];
                _copy(touch, _touch);
            });
            
            $img.on("touchmove", function(event){
                 var that = $(this);
                var _touch = event.originalEvent.changedTouches[0];
                var oldtop = parseInt(that.css("top"));
                var oldleft = parseInt(that.css("left"));
                var x = _touch.clientX - touch.clientX;
                var y = _touch.clientY - touch.clientY;
                
                if(abs(x) >= MIN_STEP || abs(y) >= MIN_STEP){
                    that.css("top", (oldtop + y)+ "px");
                    that.css("left", (oldleft + x)+ "px");
                    _copy(touch, _touch);
                }
            });
            
            
            $img.on("touchend", function(){
                _stop($(this));
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
            $own.css({"position": "absolute"}); /* 设置相对位置 */
            $own.animate({left: _obj.left+"px",top: _obj.top+"px"}); /* 随机排布 */
            $own._obj = _obj;
        }
        
        
        function addTag(img){
            var className = "img-" + (getImageClassIndex(6) + 1);
            $(".photowall-container").append("<img class=\"photowall-img "+className+"\" src=\""+img.url+"\">");
            defineSevenDiv($(".photowall-container").find("img:last"));
        }
        
        $.get("/data/photowall_data.json",function(d){
            var c = {}, key, name;
            for(var i in d){
                key = getImageClassIndex(d.length*3);
                name = "_" + key;
                while(name in c){
                    key = getImageClassIndex(d.length*3);
                    name = "_" + key;
                }
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
