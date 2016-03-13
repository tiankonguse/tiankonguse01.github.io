tk.AddMethod(TK,{
    Scroll : function () {
        this._topName = ".js-scroll-top";
        this._topTag = "#_top";
        
        this._downName = ".js-scroll-down";
        this._downTag = "#_down";
        
        this._commentName = ".js-scroll-comment";
        this._commentTag = "#disqus_container";
        this._defaultPage = "/about.html#disqus_container";
    }
});
tk.Composition(TK.Scroll,{
    setDefaultPage : function(url){
        var that = this;
        that._defaultPage = url;
    },
    show : function(name){
        var that = this;
        if(name == "top"){
            $(that._topName).show();
        }
        if(name == "down"){
            $(that._downName).show();
        }
        if(name == "comment"){
            $(that._commentName).show();
        }
    },
    hide : function(name){
        var that = this;
        if(name == "top"){
            $(that._topName).hide();
        }
        if(name == "down"){
            $(that._downName).hide();
        }
        if(name == "comment"){
            $(that._commentName).hide();
        }
    },
    bind : function(){
        var that = this;
        $(that._topName).click(function(){
            tk.animateGoto($(that._topTag).position().top);
        });
        $(that._commentName).click(function(){
            if($(that._commentTag).length){
                tk.animateGoto($(that._commentTag).position().top);
            }else{
                window.open(that._defaultPage);
            }
        });
        $(that._downName).click(function(){
            tk.animateGoto($(that._downTag).position().top);
        });
    }
});
tk.Composition(TK.Scroll,{
    "fixScroll": function(){
        function preventDefault(ev) {
          ev.preventDefault();
        }

        document.addEventListener('touchmove', preventDefault, false)

        function isScroller(el) {
          // 判断元素是否为 scroller
          return el.classList.contains('scroller')
        }

        document.body.addEventListener('touchmove', function (ev) {
          var target = ev.target
          if (isScroller(target)) {
            ev.stopPropagation()
          }
        }, false)
    }
});
tk.Composition(TK,{
    scroll : new TK.Scroll()
});
