!function(win){
    var TK = win.TK || function(){};
    if(!TK.prototype){
        TK.prototype = TK;
        win.tk = TK;
    }else{
        win.tk = new TK();
    }
    TK.prototype.version = "v20130112";
    TK.prototype.author = "tiankonguse";
    TK.prototype.homepage = "http://tiankonguse.com";
    TK.prototype.QQ = "804345178";
    win.TK = TK;
    
}(window);



//like extend
TK.prototype.Composition = function Composition(target, source){
    for(var key in source){
        target.prototype[key] = source[key];
    }
};



TK.prototype.AddMethod = function AddMethod(target, source){
    for(var key in source){
        target[key] = source[key];
    }
};


/* base function */
tk.Composition(TK, {
    "hasProp" : function (obj, prop){
        return Object.prototype.hasOwnProperty.call(obj, prop);;
    },
    "isFunction" : function (it){
        return Object.prototype.toString.call(it) === '[object Function]';
    },
    "isArray" : function (it){
        return Object.prototype.toString.call(it) === '[object Array]';
    },
    "isString" : function (it){
        return typeof it !== 'string';
    },
    "each": function (ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    },
    "eachProp": function (obj, func) {
        var prop;
        for (prop in obj) {
            if (tk.hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }
});


/* RequireJS */
tk.AddMethod(TK,{
    "RequireJS" : function () {
        this.nextTickTime = 4;
        this.enabledRegistry = {};
    }
});

tk.Composition(TK.RequireJS,{
    "nextTick" : function(fn){
        setTimeout(fn, this.nextTickTime);
    },
    "require" :function (names, deps, callback){
        var that = this;
        that.nextTick(function(){
            var handler;
            var id = names;
            if(tk.hasProp(that.enabledRegistry, id)){
                return;
            } 
            handler = tk.requireJS.makeModule(id);
            handler.init(deps, callback);
        });
        return that.require;
    },
    "load": function(moduleName, url){
        var that = this;
        var attr = {};
        attr["data-requiremodule"] = moduleName;
        tk.loadJSFile(url, function(evt){
            that.onScriptLoad(evt);
        }, true, false, attr)
    },
    "onScriptLoad" : function(evt){
        var that = this;
        var node = evt.currentTarget || evt.srcElement;   
        var name = node.getAttribute('data-requiremodule');
        var handle;
        if(tk.hasProp(that.enabledRegistry, name)){
            handle = that.enabledRegistry[name];
            handle.loaded = true;
            handle.callback();
        }
    },
    "makeModule" : function(name){
        var that = this;
        var handle;
        if(tk.hasProp(that.enabledRegistry, name)){
            handle = that.enabledRegistry[name];
        }else{
            handle = that.enabledRegistry[name] = new TK.RequireJS.Module(name);
        }
        return handle;
    }
});
tk.Composition(TK,{
    "requireJS" : new TK.RequireJS()
});
/* require function */
tk.Composition(TK, {
    "require" : function (names, deps, callback){
        if (!tk.isString(deps) ||!tk.isArray(deps) || !tk.isFunction(callback)) {
            return;
        }
        return tk.requireJS.require(names, deps, callback);
    }
});

tk.AddMethod(TK.RequireJS,{
    "Module" : function (id) {
        this.require = tk.require;
        this.id = id;
        this.afterCallback = []; 
        this.depMaps = [];
        this.enabledRegistry = tk.requireJS.enabledRegistry;
        this.enabledRegistry[this.id] = this;
    }
});
tk.Composition(TK.RequireJS.Module,{
    "init" : function(depMaps, factory){
         if (this.inited) {
            return;
        }
        this.inited = true;
        this.factory = factory;
        this.depMaps = depMaps && depMaps.slice(0);
        this.enable();
    },
    "callback": function(){
        if(this.callbacked){
            return;
        }
        this.callbacked = true;
        this.factory && this.factory();
        tk.each(this.afterCallback, function(fn){
            fn && fn();
        });
    },
    "check": function(){
        var that = this;
        if(that.checking){
            return ;
        } 
        
        that.checked = true;
        that.checking = true;
        tk.each(that.depMaps, function (id, i) {
            var handler;
            if(tk.hasProp(that.enabledRegistry, id)){
                handler = that.enabledRegistry[id];
                if(!handler.loaded){
                    that.checked = false;
                }
            } 
        });
        
        that.checking = false;
        if(that.checked){
            that.callback();
        }
        
    },
    "enable" : function(){
        var that = this;
        if (that.enabled){
            return ;
        }
        that.enabled = true;
        
        tk.each(that.depMaps, function (id, i) {
            var handler;
            if(tk.hasProp(that.enabledRegistry, id)){
                handler = that.enabledRegistry[id];
                handler.afterCallback.push(function(){
                    that.check();
                });
            }else{
                handler = tk.requireJS.makeModule(id);
                handler.afterCallback.push(function(){
                    that.check();
                });
                tk.requireJS.load(id, id);
            }
        });
        that.check();
    }
});








/* min max */
tk.Composition(TK, {
    "min" : function min(){
        var a = arguments;
        var r = a[0];
        var l = a.length;
        for(var i in a){
            r = r < a[i] ? r : a[i];
        }
        return r;
    },
    "max" : function max(){
        var a = arguments;
        var r = a[0];
        var l = a.length;
        for(var i in a){
            r = r > a[i] ? r : a[i];
        }
        return r;
    }
});





/* Cookie */
tk.AddMethod(TK,{
    Cookie : function Cookie(){}
});
tk.Composition(TK.Cookie,{
    set: function set(name, value, domain, path) {
        document.cookie = name + "=" + value + "; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=.cm.com;"));
        return true;
    },
    get: function get(name) {
        var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"),
        m = document.cookie.match(r);
        return (!m ? "": m[1]);
    },
    del: function del(name, domain, path) {
        document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=.tiankonguse.com;"));
    }
});
tk.Composition(TK,{
    cookie : new TK.Cookie()
});


/* customDropDown */
tk.AddMethod(TK,{
    customDropDown : function customDropDown(ele){
        this.dropdown = ele;
        this.placeholder = this.dropdown.find(".placeholder");
        this.options = this.dropdown.find("ul.dropdown-menu > li:not(.hide)");
        this.val = '';
        this.index = -1;//默认为-1;
        this.initEvents();
    }
});
tk.Composition(TK.customDropDown,{
    initEvents : function initEvents() {
        var obj = this;
        //这个方法可以不写，因为点击事件被Bootstrap本身就捕获了，显示下面下拉列表
        obj.dropdown.on("click", function(event) {
            $(this).toggleClass("active");
        });
        //点击下拉列表的选项
        obj.options.on("click", function() {
            var opt = $(this);
            obj.text = opt.find("a").text();
            obj.val = opt.attr("value");
            obj.index = opt.index();
            obj.placeholder.text(obj.text);
        });
    },
    getText : function getText() {
        return this.text;
    },
    getValue : function getValue() {
        return this.val;
    },
    getIndex : function getIndex() {
        return this.index;
    },
    selectFirst : function selectFirst() {
        this.options[0].click();
    },
    hide : function hide() {
        this.dropdown.hide()
    },
    show : function show() {
        this.dropdown.show()
    }
});





/* loadImg */
tk.Composition(TK,{
    loadImg : function loadImg(imgList, callback){
        if(typeof imgList == "string"){
            imgList = [imgList];
        }
        window.TK = window.TK || {};
        var hashMap = {};
        var img = window.TK.img;
        window.TK.img = '';
        
        window.TK.callback = function(){
            window.TK.img = img;
            if(callback){
                setTimeout(callback,100);
            }
        };
        for(var i in imgList){
            var url = imgList[i];
            var key = "" + tk.hashString(url);
            if(hashMap[key])continue;
            hashMap[key] = 1;
            window.TK.img += '<img src=\''+url+'\' /><script>window.onload = function() { parent.TK.callback(); }</script>';
        }
        if(window.TK.img){
            $("body").append('<iframe src="javascript:parent.TK.img;" height="0px" width="0px"></iframe>');
        }
    }
});

/* imgRealSize */
tk.Composition(TK,{
    imgRealSize : function imgRealSize(url, callback){
    var img = new Image();
    img.src = url;
    if(img.complete){
        callBack(img.width, img.height);
        img = null;
    }else{
        img.onload=function(){
            callBack(img.width, img.height);
            img = null;
        };
    }
    }
});




/* Mobile */
tk.AddMethod(TK,{
    Mobile : function Mobile(){
        this.agent = navigator.userAgent;
    }
});   
tk.Composition(TK.Mobile,{
   Android: function Android() {
        return this.agent.match(/Android/i);
    },
    BlackBerry: function BlackBerry() {
        return this.agent.match(/BlackBerry/i);
    },
    iOS: function iOS() {
        return this.agent.match(/iPhone|iPad|iPod/i);
    }
    ,Opera: function Opera() {
        return this.agent.match(/Opera Mini/i);
    },
    Windows: function Windows() {
        return this.agent.match(/IEMobile/i);
    },
    QQ : function QQ(){
        return this.agent.match(/QQ\//i);
    },
    any: function() {
        return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
    }
});
tk.Composition(TK, {
    isMobile  : new TK.Mobile()
});




/* loadJSFile */
tk.Composition(TK, {
    loadJSFile  : function loadJSFile(url, cb, async, innerText, attr){
        try {
            var head = document.body || document.getElementsByTagName("body")[0] || document.documentElement;
            var script = document.createElement('script');
            var done = false;
            script.type = 'text/javascript';
            script.charset = 'utf-8';
            script.async = !!async;
            
            if(attr){
                tk.eachProp(attr, function(value, key){
                    script.setAttribute(key, value);
                });
            }
            
            if (!!innerText) {
                /* IE8 and below throws an exception when calling appendChild on a script tag */
                try {
                    script.appendChild(document.createTextNode(innerText));
                } catch(e) {
                    script.text = innerText;
                }
            }
            
            script.onload = script.onreadystatechange = function(event) {
                if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                    done = true;
                    script.onload = script.onreadystatechange = null;
                    cb && cb(event);
                }
            };
            script.src = url;
            /* head.insertBefore(script, head.firstChild); */
           head.appendChild(script); 
        } catch (e) { 
            console.log("loadJSFile "+ url +" error. msg: " + err.message); 
        }
    }
});


/* loadPage */
tk.Composition(TK, {
    loadPage : function loadPage(nowPage, allPage, $pageDom, url){
        var first = true;
        if(nowPage == 1){
            first = false;
        }
        if (allPage > 1) {
            $pageDom.html("");
            var op = {
                bootstrapMajorVersion : 3,
                currentPage : nowPage,
                totalPages : allPage,
                onPageChanged : function(e, oldPage, newPage) {
                    if(first == true){
                        first = false;
                        return;
                    }
                    if(newPage > 1){
                        window.location.href=url+"page"+newPage;
                    }else{
                        window.location.href=url;
                    }
                },
                useBootstrapTooltip : true,
                tooltipTitles : function(type, page, current) {
                    switch (type) {
                        case "first" :
                            return "第一页";
                        case "prev" :
                            return "上一页";
                        case "next" :
                            return "下一页";
                        case "last" :
                            return "最后一页";
                        case "page" :
                            return "第" + page + "页";
                    }
                },
                pageUrl : function(type, page, current){
                    if(page == 1){
                        return url;
                    }else{
                        return url+"page"+page;
                    }
                    
                }
            };
            $pageDom.bootstrapPaginator(op);
        } 
    }
});




/* 
功能 : AD 
使用方式： tk.ad.showAd(key, val); 
参数说明： 
    key : dom class name, 比如 "ad-page-footer" 
    val : 广告大小，比如 "300-250"
附加功能：
    loadGoogleJs 函数 加载广告的js文件
    isLoadGoogleJs 变量 是否加载广告js文件
    alreadyLoad 变量 是否已经加载了广告js文件
    adList 变量，广告列表
    showPageFoot 函数 与 tiankonguse 的业务罗辑相关
    endText 需要显示广告的地方附加的广告文本
不足:
    key 值不是选择器dom, 这样自由度不高。
    showPageFoot 是业务罗辑了，需要提取出去
*/
tk.AddMethod(TK,{
    AD : function AD(){
        this.isShowPageFoot = true;
        this.isLoadGoogleJs = false;
        this.alreadyLoad = false;
        this.adList = [];
        this.endText = '<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>';
    }
});
tk.Composition(TK.AD,{
    showPageFoot: function showPageFoot(className, key, force) {
        if(!this.isShowPageFoot && !force){
            return;
        }
        this.showAd(className, key);
    },
    showAd : function showAd(className, key){
        $("." + className).html(this.getAd(key));
    },
    loadGoogleJs : function loadGoogleJs(force){
        if(!this.isLoadGoogleJs && !force && !this.alreadyLoad){
            return;
        }
        this.alreadyLoad = true;
        try{
            //tk.loadJSFile("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",null,true);
        }catch(err){
            //tk.loadJSFile("http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",null,true);
        }
    },
    addAd : function addAd(key, val){
        if(!this.adList[key]){
            this.adList[key] = val;
        }
    },
    getAd : function getAd(key){
        return (this.adList[key] || "") + this.endText;
    }
});
tk.Composition(TK, {
        ad : (function(){
            var ad = new TK.AD();
            ad.addAd("300-250", "<!-- phone-footer --><ins class=\"adsbygoogle\" style=\"display:inline-block;width:300px;height:250px\" data-ad-client=\"ca-pub-2326969899478823\" data-ad-slot=\"8417451596\"></ins>");
            ad.addAd("728-90","<!-- footer --><ins class=\"adsbygoogle\" style=\"display:inline-block;width:728px;height:90px\" data-ad-client=\"ca-pub-2326969899478823\" data-ad-slot=\"5074793995\"></ins>");
            ad.addAd("320-50",'<ins class="adsbygoogle" style="display:inline-block;width:320px;height:50px" data-ad-client="ca-pub-2326969899478823" data-ad-slot="2712008393"></ins>');
            ad.addAd("300-250","<!-- phone-content --><ins class=\"adsbygoogle\" style=\"display:inline-block;width:300px;height:250px\" data-ad-client=\"ca-pub-2326969899478823\" data-ad-slot=\"5463985192\"></ins>");
            ad.addAd("728-90","<!-- content-footer --><ins class=\"adsbygoogle\" style=\"display:inline-block;width:728px;height:90px\" data-ad-client=\"ca-pub-2326969899478823\" data-ad-slot=\"7219919998\"></ins>");
            ad.addAd("auto","<ins class=\"adsbygoogle\" style=\"display:block\" data-ad-client=\"ca-pub-2326969899478823\" data-ad-slot=\"8239263590\" data-ad-format=\"auto\"></ins>");
            
            return ad;
        })()
    }
);


/* 
功能 : Comment 
使用方式： tk.comment.init($select);
参数说明： $select 是要显示位置的对象，比如 $('#disqus_container .comment')
*/
tk.AddMethod(TK,{
    Comment : function Comment(){
        this.isHaveComment = true;
        this.disqus_shortname = 'tiankonguse-record';
        this.duoshuo_shortname = 'tiankonguse';
        this.hash = location.hash;
        this.time = 5000;
    }
});
tk.Composition(TK.Comment, {
    init : function init(dom){
        this.dom = dom;
        if(!this.isHaveComment || this.dom.length == 0){
            return;
        }
        if(this.shouldLoad()){
            this.loadComment();
        }else{
            this.bindClick();
            this.laterLoad(this.time);
        }
        
    },
    laterLoad : function laterLoad(t){
        var that = this;
        setTimeout(function(){
            that.loadComment();
        }, t);
    },
    shouldLoad  : function shouldLoad(){
        return /\#comment/.test(this.hash ) || /\#disqus/.test(this.hash );
    },
    bindClick : function bindClick(){
        var that = this;
        this.dom.on('click',function(){
            that.loadComment();
        });
    },
    loadComment : function loadComment(){
        var that = this.dom;
        that.html('加载中...');
        $.getScript('http://static.duoshuo.com/embed.js',function(){that.remove()});
        //$.getScript('http://' + this.disqus_shortname + '.disqus.com/embed.js',function(){that.remove()});
    }
});
tk.Composition(TK, {
        comment : new TK.Comment()
    }
);


tk.Composition(TK, {
    frame : function(){
        if(window != window.top){
            window.top.location = window.location;
        }
    }
});



tk.Composition(TK, {
    fixConsole : function(){
        var console = (window.console = window.console || {});
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var noop = function () {};
        var length = methods.length;
        var method;
        while (length--) {
            method = methods[length];
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }
});



tk.Composition(TK, {
    animateGoto : function(e, f){
        $("body,html").animate({
            scrollTop: e
        }, 800, f || function() {}
        );
    }
});

tk.Composition(TK, {
    fixString : function(){
        if (String.prototype.trim === undefined){
            String.prototype.trim = function(){ 
                return this.replace(/^\s+|\s+$/g, '') 
            };
        }
    }
});


tk.Composition(TK, {
    fixArray : function(){
        if (Array.prototype.reduce === undefined){
            Array.prototype.reduce = function(fun){
                if(this === void 0 || this === null){
                    throw new TypeError();
                }
                var t = Object(this), len = t.length >>> 0, k = 0, accumulator;
                if(typeof fun != 'function'){
                    throw new TypeError()
                }
                if(len == 0 && arguments.length == 1){
                    throw new TypeError()
                }

                if(arguments.length >= 2){
                    accumulator = arguments[1]
                }else{
                    do{
                        if(k in t){
                            accumulator = t[k++]
                            break
                        }
                        if(++k >= len){
                            throw new TypeError()
                        }
                    } while (true);
                }
                

                while (k < len){
                    if(k in t){
                        accumulator = fun.call(undefined, accumulator, t[k], k, t)
                    }
                    k++;
                }
                return accumulator;
            };
        }
    }
});

tk.Composition(TK, {
    __INIT__ : function(){
        tk.frame();
        tk.fixConsole();
        tk.fixString();
        tk.fixArray();
        tk.require("/javascripts/tk.js", ["/javascripts/tk.base.js", "/javascripts/tk.date.js", "/javascripts/tk.json.js"], function(){
            
        });
    }
});




/*
功能: 渲染模板
参数:tk.parseTpl(str, data);
语法: <%= code %> 输出code. <% code %> code为js语法 data为key-value对象, 模板中可以直接使用key.  
例如: tk.parseTpl('<%= title %>',{title:"hello"}).
*/
tk.Composition(TK, {
    parseTpl : function(str, data ){
        var buf = [];
        buf.push('var __p=[];');
        buf.push('with(obj||{}){');
        buf.push('__p.push(\'');
        
        str = str.replace( /\\/g, '\\\\' );
        str = str.replace( /'/g, '\\\'' );
        str = str.replace( /<%=([\s\S]+?)%>/g, function( match, code ) {
            return '\'+' + code.replace( /\\'/, '\'' ) + '+\'';
        } );
        str = str.replace( /<%([\s\S]+?)%>/g, function( match, code ) {
            return '\');' + code.replace( /\\'/, '\'' )
                    .replace( /[\r\n\t]/g, ' ' ) + '__p.push(\'';
        } );
        str = str.replace( /\r/g, '\\r' );
        str = str.replace( /\n/g, '\\n' );
        str = str.replace( /\t/g, '\\t' );
        buf.push(str);
        buf.push('\');');
        buf.push('}');
        buf.push('return __p.join("");');
        
        var func = new Function( 'obj', buf.join("") );
        return func(data);
    }
});

tk.AddMethod(TK,{
    Event : function Event(){
        this.__dom_id = 1;
        this.specialEvents = {
            click : 'MouseEvents',
            mousedown : 'MouseEvents',
            mouseup : 'MouseEvents',
            clmousemoveick : 'MouseEvents'
        };
        this.hover = {
            mouseenter: 'mouseover', 
            mouseleave: 'mouseout'
        };
    }
});

tk.Composition(TK.Event, {
    _id : function(element){
        return element.__dom_id || (element.__dom_id = this.__dom_id++);
    }
});



/* string replace */
tk.Composition(TK,{
    replace : function replace(str, key, val) {
        return str.split(key).join(val);
    }
});



/* hashString */
tk.Composition(TK,{
    hashString : function hashString(str, caseSensitive){
        str = str.toString();
        if (!caseSensitive) {
            str = str.toLowerCase();
        }
        // 1315423911=b'1001110011001111100011010100111'
        var hash = 1315423911, i, ch;
        for (i = str.length - 1; i >= 0; i--) {
            ch = str.charCodeAt(i);
            hash ^= ((hash << 5) + ch + (hash >> 2));
        }
        return (hash & 0x7FFFFFFF);
    }
});


/* UTF8Length */
tk.Composition(TK,{
    UTF8Length : function UTF8Length(s) {
        var l = 0;
        var c;
        for (var i = 0; i < s.length; i++) {
            c = s.charCodeAt(i);
            if (c <= 0x007f) {
                l = l + 1;
            } else if ((0x0080 <= c) && (c <= 0x07ff)) {
                l += 2;
            } else if ((0x0800 <= c) && (c <= 0xffff)) {
                l += 3;
            }
        }
        return l;
    }
});

/*
 * 只能以页面为相对位置, 或者绝对位置
*/
tk.Composition(TK,{
    getAbsolutePath : function(url) {
        var aTag = document.createElement('a');
        aTag.href = url;
        return aTag.href;
    }
});

tk.Composition(TK,{
    clone : function(obj, deep) {
        var newObj = obj;
        if(tk.isArray(obj)){
            newObj = [];
            tk.each(obj, function(value){
                if(deep){
                    newObj.push(tk.clone(value, deep));
                }else{
                    newObj.push(value);
                }
            });
        }else if(tk.isObject(obj)){
            newObj = {};
            tk.eachProp(newObj, function(value, key){
                if(deep){
                    newObj[key] = tk.clone(value, deep);
                }else{
                    newObj[key] = value;
                }
            });
        }
        return newObj;
    }
});

/*
放在最后执行
*/
tk.__INIT__();

