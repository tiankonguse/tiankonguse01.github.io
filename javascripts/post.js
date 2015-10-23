jQuery(document).ready(function(){
    var $ = jQuery;
    
 

    (function(){
        var ie6 = ($.browser && $.browser.msie && $.browser.version=="6.0") ? true : false;
        var contentMap = {};
        var $menuIndex = $('#menuIndex');
        
        var scrollTop = [];
        var scrollLiTop = [];
        var menuIndexTop = $menuIndex.offset().top;
        var menuIndexLeft = $menuIndex.offset().left;
        var winHeight =  tk.min($(window).height(), screen.height,screen.availHeight);
        var bottomHeight;
            
        var indexHeight = 0;
        var length = 0;
        var shouldPos = winHeight / 5;;
        
        function initHeading(){
            var h2 = [];
            var h3 = [];
            var h2index = 0;

            $.each($('.entry h2, .entry h3'),function(index,item){
                if(item.tagName.toLowerCase() == 'h2'){
                    var h2item = {};
                    h2item.name = $(item).text();
                    h2item.id = 'menuIndex'+index;
                    contentMap["#content-h2-" + h2item.name] = h2item.id;
                    h2.push(h2item);
                    h2index++;
                }else{
                    var h3item = {};
                    h3item.name = $(item).text();
                    h3item.id = 'menuIndex'+index;
                    contentMap["#content-h3-" + h3item.name] = h3item.id;
                    if(!h3[h2index-1]){
                        h3[h2index-1] = [];
                    }
                    h3[h2index-1].push(h3item);
                }
                item.id = 'menuIndex' + index;
            });

            return {h2:h2,h3:h3}
        }

        function genTmpl(){
            var h1txt = $('h1').text();
            var tmpl = '<ul><li class="h1"><a href="#content-h1-' + h1txt + '">' + h1txt + '</a></li>';

            var heading = initHeading();
            var h2 = heading.h2;
            var h3 = heading.h3;

            for(var i=0;i<h2.length;i++){
                tmpl += '<li><a href="#' +h2[i].id + '" data-id="'+h2[i].id+'">'+h2[i].name+'</a></li>';

                if(h3[i]){
                    for(var j=0;j<h3[i].length;j++){
                        tmpl += '<li class="h3"><a href="#' + h3[i][j].id + '" data-id="'+h3[i][j].id+'">'+h3[i][j].name+'</a></li>';
                    }
                }
            }
            tmpl += '</ul>';

            return tmpl;
        }

        
        
        
        function gotoSelectorPos(id){
            var selector = id ? '#' + id : 'h1'
            var scrollNum = $(selector).offset().top;
            $('body, html').animate({ scrollTop: scrollNum-30 }, 400, 'swing');
            waitForFinalEvent(waitDoing, 400);
        }

        function genIndex(){
            var tmpl = genTmpl();
            var $next = $("#menuIndex-next");
            $menuIndex = $('#menuIndex');
            $menuIndex.append($(tmpl));
            
            
            var h = winHeight - 100 - $next.height();
                
            $menuIndex.delegate('a','click',function(e){
                    e.preventDefault();
                    gotoSelectorPos($(this).attr('data-id'));
                });
            if(tk && tk.ad && tk.ad.isLoadGoogleJs){
                $menuIndex.append($next.children());
            }
            $next.remove();
            
            $('#menuIndex ul').css({"max-height": h + "px", "overflow-y": "auto"});
            
        }

        var waitForFinalEvent = (function () {
            var timers = {};
            return function (callback, ms, uniqueId) {
                if (!uniqueId) {
                    uniqueId = "Don't call this twice without a uniqueId";
                }
                if (timers[uniqueId]) {
                    clearTimeout (timers[uniqueId]);
                }
                
                timers[uniqueId] = setTimeout(callback, ms);
            };
        })();

        function getNowTop(index, nowTop){
            bottomHeight = $("#content .entry").height() + $("#content .entry-header").height() + 190;
            var mytop  = nowTop + shouldPos - scrollLiTop[index];

            if(mytop  > nowTop){
                mytop  = nowTop;
            }
            
            if(mytop  + indexHeight <= nowTop + winHeight){
                mytop  = nowTop - (indexHeight - winHeight) - 15;
            }
            
            if(bottomHeight <= mytop + indexHeight){
                mytop = bottomHeight - indexHeight;
            }
            return mytop - nowTop;
        }
        var preTop ; 
        function waitDoing(){
            var nowTop = $(window).scrollTop();

            if(nowTop === preTop){
                return;
            }
            preTop = nowTop;

            var index;
            if(nowTop+60 > scrollTop[length-1]){
                index = length;
            }else{
                for(var i=0;i<length;i++){
                    if(nowTop+60 <= scrollTop[i]){
                        index = i;
                        break;
                    }
                }
            }
            index--;
            $('#menuIndex li').removeClass('on');
            $('#menuIndex li').eq(index).addClass('on');
            
            
            if(nowTop+20 > menuIndexTop){
                menuIndexLeft = $menuIndex.offset().left;
                if(winHeight >= indexHeight){
                    $menuIndex.css({
                        position:'fixed'
                        ,top:'10px'
                        ,left:menuIndexLeft + "px"
                    });
                }else{
                    var mytop  = getNowTop(index, nowTop);
                    $menuIndex.css({
                        position:'fixed',
                        top: mytop  + 'px',
                        left:menuIndexLeft+"px"
                    });
                
                }
            }else{
                $menuIndex.css({
                    position:'static',
                    top:0,
                    right:0
                });
            }
        }
        
        if($('.entry h2').length > 0 &&  !ie6){
            genIndex();
            $.each($('#menuIndex li a'),function(index,item){
                var id = $(item).attr('data-id');
                var selector = id ? '#'+id : 'h1'
                var mytop  = $(selector).offset().top;
                scrollTop.push(mytop );
                var liOffset = $(item).parent().offset();
                scrollLiTop.push(liOffset.top - menuIndexTop);
            });
            bottomHeight = $("#content").height();
            scrollLiTop.push(bottomHeight);
            
            if(!tk.isMobile.any()){
                indexHeight = $menuIndex.height();
                length = scrollTop.length;
                
                $(document).bind('mousewheel DOMMouseScroll', function(event){
                    waitForFinalEvent(waitDoing);
                });
                setInterval(function(){
                    waitForFinalEvent(waitDoing);
                },1000) 
                $(window).resize(function(){
                    $menuIndex.css({
                        position:'static',
                        top:0,
                        left:0
                    });
                    console.log("resize"); 
                    menuIndexTop = $menuIndex.offset().top;
                    menuIndexLeft = $menuIndex.offset().left;
    
                    $(window).trigger('scroll');
                    waitForFinalEvent(waitDoing);
                });
            }

            if(/\#content-h/.test(location.hash)){
                location.hash = decodeURI(location.hash);
                gotoSelectorPos(contentMap[location.hash]);
            }

        }else{
            var $next = $("#menuIndex-next");
            if(tk && tk.ad && tk.ad.isLoadGoogleJs){
                $menuIndex.append($next.children());
            }
            $next.remove();
            $('#menuIndex').remove();
        }
    })();

    $.getScript('/javascripts/prettify/prettify.js',function(){
        prettyPrint();
    });

   if(tk.isMobile.any()){
        //tk.ad.showPageFoot("ad-content-footer","300-250" ,true);
        tk.ad.showPageFoot("ad-content-footer","auto" ,true);
    }else{
         //tk.ad.showPageFoot("ad-content-footer","728-90" ,true);
         tk.ad.showPageFoot("ad-content-footer","auto" ,true);
    }
    
    $('pre').addClass('prettyprint linenums'); //添加Google code Hight需要的class


    $('.entry a').each(function(index,element){
        var that = $(this);
        var href = that.attr('href');
        if(href){
            href = href.toLowerCase();
            if(href.indexOf('#') == 0){
            }else if ( href.indexOf('/') == 0 || href.indexOf('tiankonguse.com')>-1 ||  href.indexOf('tiankonguse.github.io')>-1){
                if(href.indexOf('/page')>-1 || that.attr("data-original-title") != undefined){
                
                }else{
                    that.attr('target','_blank');
                }
            }else if ($(element).has('img').length){
            }else{
                that.attr('target','_blank');
                that.addClass('external');
            }
        }
    });
    
    if(/css3-animation/.test(location.href)){
        $("head").append("<link rel='stylesheet' type='text/css' href='/stylesheets/css3-ani.css'/>");
        $.getScript('/javascripts/css3-ani.js',function(){});
    }
    
    $("table").addClass("table table-bordered table-hover table-striped table-condensed");

    $(".tag-box .categories").click(function(e){
        e.preventDefault()
        var that = $(this);
        tt=that;
        var text = that.data("name");
        $(".home-menu-ex").trigger("click");
        $("#sidebar-tags li[data-filter='" + text + "']").trigger("click");
        console.log("#sidebar-tags li[data-filter='" + text + "']");
    });
});
