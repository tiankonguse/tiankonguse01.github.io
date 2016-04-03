jQuery(document).ready(function(){
    //***********************
    //穿越逻辑
    goBlackHole();
    
    // home follow
    var $homeContact = $('.home-contact');
    function addContactData(name, href, img){
        name = name || "";
        return '<a href="'+href+'" target="_blank" ><img src="'+img+'" alt="'+name+'"/></a>';
    }
    var contactTpl = "";
    contactTpl += '<div class="weixin" style="display: none;"><img src="http://7d9r3t.com1.z0.glb.clouddn.com/weixin_code.png" alt="微信"></div>';
    
    $homeContact.append(contactTpl);
    var weixin = $('[href="http://weixin.qq.com/"]');
    weixin.click(function(){
        $('.weixin').toggle(200);
        return false;
    });
    
    $(".home-follow").click(function(e){
        e.preventDefault();
        if($homeContact.is(':visible')){
            $homeContact.slideUp(100);
            $('.weixin').hide();
        }else{
            $homeContact.slideDown(100);
        }
    });
    //***********************
    
    tk.comment.init($('#disqus_container .comment'));

    //ad
    if(tk.isMobile.any()){
        tk.ad.showPageFoot("ad-page-footer", "auto"); 
        //tk.ad.showPageFoot("ad-page-footer", "300-250");        
    }else{
        tk.ad.showPageFoot("ad-page-footer", "auto");
        //tk.ad.showPageFoot("ad-page-footer", "728-90");
    }
    
    tk.ad.loadGoogleJs();
    setTimeout(function(){
        $(".home-follow").click();
    }, 3000);
    
    loadSidebar();

});

function goBlackHole(){
    $.get("/data/black-hole-data.json",function(d){
        var index = Math.ceil(Math.random() * d.length);
        var $next = $(".home-menu-next");
        if(index < d.length){
            $next.attr("href", d[index].link);
        }
    },"json");
}

function loadSidebar(){
    var hand;
    var filter = 'all';
    var $allLink;
    var $filterLink = {};
    var $searchInput = $('#search-input');
    //
    $("#sidebar-close,.close-icon").click(function(){
        $("body").removeClass("sidebar-visible");
        clearTimeout(hand);
        hand = 0;
    });
    var googleUrl = "https://www.google.com/search?q=site%3Atiankonguse.com+";
    $(".search-submit").click(function(){
        var that = $(this);
        var val = $(".search-field").val();
        that.attr("href", googleUrl + val);
        return true;
    });
    $(".js-menu-trigger").hide();
    $(".home-menu-ex").bind("click", function(e){ 
    
        $("body").toggleClass("sidebar-visible");
        $(".js-menu").addClass("is-visible");
        $(".menu-screen").addClass("is-visible");
        $(".js-menu-trigger").show();
        if(hand){
            clearTimeout(hand);
        }
        hand = setTimeout(function(){
            $searchInput.focus();
        },3);
        e.preventDefault();
    });
    
    $(".js-menu-trigger").bind("click", function(e) {
        $(".js-menu").removeClass("is-visible");
        $(".menu-screen").removeClass("is-visible");
        $(".js-menu-trigger").hide();
        clearTimeout(hand);
        hand = 0;
        e.preventDefault();
    });
    
    $searchInput.on('input', function(e){
        var value = this.value;
        $allLink.hide();
        if (filter === 'all') {
            $.each($allLink, function(k, v){
                $(v).filter(":contains('"+value+"')").fadeIn(350);
            });
        }else{
           $.each($filterLink[filter], function(k, v){
                $(v).filter(":contains('"+value+"')").fadeIn(350);
            });
        }
    });
    
    // Tags Filter
    $('#sidebar-tags').on('click', '.sidebar-tag', function() {
        filter = $(this).data('filter');
        if (filter === 'all') {
            $allLink.fadeIn(350);
        } else {
            $allLink.hide();
            $filterLink[filter].fadeIn(350);
        }
        $(this).addClass('active').siblings().removeClass('active');
        if($searchInput.val()){
            $searchInput.trigger('input');
        }
    });

    $.get("/postlist.json", function(data){
        var categories = data.categories;
        var posts = data.posts;
        
        var $sidebarTags = $("#sidebar-tags");
        for (var i in categories){
            $sidebarTags.append('<li class="sidebar-tag" data-filter="'+categories[i]+'">'+categories[i]+'</li>');
        }
        
        var $toc = $("#toc");
        var post;
        for (var i in posts){
            post = posts[i];
            $toc.append('<a class="toc-link sidebar-social-icon" data-tags="'+post.categories.join(" ")+'" href="'+post.url+'">'+post.title+'</a>');
        }
        
        $allLink = $(".toc-link");
        
        for (var i in categories){
            $filterLink[categories[i]] = $('.toc-link[data-tags~=' + categories[i] + ']');
        }
    });
    
    /* scroll top down */
    //tk.scroll.bind();
    tk.require("/javascripts/main.js", ["/javascripts/tk.scroll.js"], function(){
        tk.scroll.bind();
    });
}


