---
layout: default
categories: [project]
title : 简单的个人照片墙
---
<link href="main.css" rel="stylesheet" type="text/css">

<div class="photowall-tips">这里只有你可以看到, 可以展示你的任何图片.增加图片, 请在评论中告诉我</div>
<div class="photowall-container">
</div>
<div class="clearfix"></div>



<script type="text/javascript" src="jquery-ui-1.10.2.custom.js"></script>
<script type="text/javascript">
    /* 定义随机left，top和旋转值 */
    $(document).ready(function(){
    
        setTimeout(function(){
            $(".ad-page-footer").hide();
        },10);
        var zindex = 2;
        var w =  $(window).width() - 200;
        var h =  $(window).height() - 200;
        
        if(tk.isMobile.any()){
            w =  w + 150;
            h =  h + 150;
        }
        
        function defineRandom(){
            var randomLeft = Math.floor(w*(Math.random())), /* 图片left值 */
            randomTop =  Math.floor(h*Math.random()) , /* 图片top值 */
            randomRotate = 20 - Math.floor(400*Math.random()); /* 图片旋转角度 */
            return {
                left: randomLeft,
                top: randomTop,
                rotate:randomRotate
            }
        }
        
        
        function draggableNote(){
            $(".photowall-container .photowall-img").draggable({
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
            var _img = "<img class=\"img-url photowall-img " +className+ "\" src=\""+ img.url +"\" alt=\" " + img.desc + " \">";
            var _text = "<div class=\"img-desc\">" + img.desc + "</div>";
            var _inner = "<div class=\"img-inner\">"+ _img + _text  +"</div>";
            var _outer = "<div class=\"photowall-img " +className+ "\">"+ _inner  +"</div>";
            
            $(".photowall-container").append(_img);
            defineSevenDiv($(".photowall-container").find(".photowall-img:last"));
        }
        
        function GetRequest() {
           var url = location.search; //获取url中"?"符后的字串
           var theRequest = new Object();
           if (url.indexOf("?") != -1) {
              var str = url.substr(1);
              strs = str.split("&");
              for(var i = 0; i < strs.length; i ++) {
                 theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
              }
           }
           return theRequest;
        }
        
        var SUC = 0;
        var LOGIN = 2;
        var CREATE = 3;
        var GET = 4;
        var id = GetRequest()["id"];
        
        function show(d){
            // d = [];
            // d.push({"url":"1.png", "desc":"你好"});
            // d.push({"url":"2.png", "desc":"你好"});
            // d.push({"url":"3.png", "desc":"你好"});
            // d.push({"url":"4.png", "desc":"你好"});
            var c = {}, key;
            var img;
            console.log(d);
            for(var i in d){
                key = getImageClassIndex(d.length);
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
        }

        function showMessage(message,cb){
            alert(message);
            return;
	        $message = $("#message");
	        $message.find(".modal-body>p").text(message);
	        $message.modal("show");
	        $message.on("hide",cb);
        }
        
        function login(pw){
            $.get("http://tiankonguse.com/lab/photowall/api.php?callback=?",{
                "id" : id,
                "op" : LOGIN,
                "pw" : pw
            },function(d){
                if(d.code == SUC){
                    showMessage(d.message);
                    get();
                }else{
                    showMessage(d.message);
                }
            },"json");
        }

        function prelogin(){
            var pw = prompt("请输入你的口令,亲", "");
            if(pw.length == 0){
                showMessage("口令不能为空,亲");
                return
            }
            login(pw);
            
        }
        
        function create(pw){
            $.get("http://tiankonguse.com/lab/photowall/api.php?callback=?",{
                "id" : id,
                "op" : CREATE,
                "pw" : pw
            },function(d){
                if(d.code == SUC){
                    showMessage(d.message);
                    prelogin();
                }else{
                    showMessage(d.message);
                }
            },"json");
        }

        function precreate(){
            var pw1 = prompt("请输入你的口令,亲", "");
            
            
            if(pw1.length == 0){
                showMessage("口令不能为空,亲");
                return
            }
            
            var pw2 = prompt("请再次输入你的口令,亲", "");
            
            if(pw1.length == 0){
                showMessage("口令不能为空,亲");
                return
            }
            
            if(pw1 != pw2){
                showMessage("两个口令不一样,亲");
                return
            }
            
            create(pw1);
            
        }

        function get(){
            $.get("http://tiankonguse.com/lab/photowall/api.php?callback=?",{
                "id" : id,
                "op" : GET
            },function(d){
                if(d.code == SUC){
                    show(d["list"]);
                }else if(d.code == LOGIN){
                    showMessage(d.message);
                    prelogin();
                }else if(d.code == CREATE){
                    showMessage(d.message);
                    precreate();
                }else{
                    showMessage(d.message);
                }
            },"json");
        }
        
        get();
        
    });
</script>
