---
layout:     post
title:      自己对 javascript 的一些封装(持续更新中)
description: 在使用 javascript 时，很多需要的功能都没有，或者实现复杂，所以自己封装了一下自己的 javascript 代码。
keywords: javascript, 函数封装, json, xml, 时间格式化
tags: javascript 函数封装 json xml 时间格式化
categories: [前端技术]
---


## 目前代码运行环境

代码文件地址为 我的网站的js代码地址[http://github.tiankonguse.com/javascripts/main.js][main-js]

文件里封装的功能可能会比文章中多，文章一般周末更新。


## 定义自己的名字空间

```
!function(win){
    var TK = win.TK || function(){};
    TK.prototype .version = "v20130112";
    TK.prototype.author = "tiankonguse";
    TK.prototype.homepage = "http://tiankonguse.com";
    TK.prototype.QQ = "804345178";
    win.TK = TK;
    win.tk = new TK();
}(window);

```

## 对象动态添加属性方法

### 封装代码

```
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
```
### 使用样例

```
function Acmer(name, school){
    this.name = name;
    this.school = school;
    this.OJList = [];
};
tk.Composition(Acmer, {
    "getName" : function getName(){
        return this.name;
    },
    "setName" : function setName(name){
        this.name = name;
    }
});
```

## 最小最大函数


```
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
```

## 字符串替换

```
tk.Composition(TK,{
    replace : function replace(str, key, val) {
        return str.split(key).join(val);
    }
});
```


## 时间自定义格式化

``` 
/**
 * @functionName {Format} 得到自定义格式的时间字符串
 * @authon {tiankonguse}
 * @param {String:fmt}      
 * @return {String}
 * y:年, M:月份, d:日, m:分, s:秒 S:毫秒
 */
tk.Composition(TK,{
    Format : function Format(data, fmt) {
        var o = {
            "M+": data.getMonth() + 1,
            "d+": data.getDate(),
            "h+": data.getHours(),
            "m+": data.getMinutes(),
            "s+": data.getSeconds()
        };
        if (/(y+)/.test(fmt)){
            var match = RegExp.$1;
            var length = 4 - tk.min(match.length, 4);
            var replace = (data.getFullYear() + "");
            replace = replace.substr(length);
            fmt = tk.replace(fmt, match, replace);
        }
        if (/(S+)/.test(fmt)){
            var match = RegExp.$1;
            var replace = data.getMilliseconds() + "";
            var length = tk.max(tk.min(match.length, 3), replace.length)
            replace = "00" + replace;
            length = replace.length - length;
            replace = replace.substr(length);
            fmt = tk.replace(fmt, match, replace);
        }
        for (var k in o){
            if (new RegExp("(" + k + ")").test(fmt)){
                var match = RegExp.$1;
                var replace = o[k] + "";
                var length = tk.max(tk.min(match.length, 2), replace.length);
                replace = "0" + replace;
                length = replace.length - length;
                replace = replace.substr(length);
                fmt = tk.replace(fmt, match, replace);
            }
        }
        return fmt;
    }
});
```

## UTF8 length

```
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
```

## cookie 操作

```
tk.AddMethod(TK,{
    Cookie : function Cookie(){ console.log("new"); }
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
        document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=.cm.com;"));
    }
});


tk.Composition(TK,{
    cookie : new TK.Cookie()
});
```

## Bootstrap 下拉列表 

```
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
```  

## JSON 与 str 转化


```
tk.AddMethod(TK,{
    JSON : function JSON(ele){
        ele = ele || "{}";
        this.parse = window.JSON.parse;
        this.stringify = window.JSON.stringify;
        if(typeof ele == "string"){
            this.str = ele;
            this.object = this.parse(ele);
        }else{
            this.object = ele;
            this.str = this.stringify(ele, null, 0);
        }
    }
});

tk.Composition(TK.JSON,{
    toObject : function toObject(src){
        return this.parse(src);
    },
    toString : function toString(format){
        var str;
        if(format){
            str = this.stringify(this.object);
        }else{
            str = this.str;
        }
        return str;
    }
});


tk.Composition(TK, {
    json : new TK.JSON()
});

```


## XML To JSON

```
tk.AddMethod(TK,{
    XML : function XML(ele){
        ele = ele || "";
        this.ok = false;
        this.json = {};
        
        if(typeof ele == "string"){
            if (ele.trim().length == 0) {
                this.ok = true;
            }else{
                var xmlDom = jQuery.parseXML(ele);
                if (xmlDom.nodeType == 9) {
                    this.xmlDom = xmlDom.childNodes[0];
                }else{
                    this.ok = true;
                }
            }
        }else{
            this.xmlDom = ele;
        }
    }
});

tk.Composition(TK.XML,{
    toXMLDom : function toXMLDom(ele){
        ele = ele || "";
        this.ok = false;
        this.json = {};
        
        if(typeof ele == "string"){
            if (ele.trim().length == 0) {
                this.ok = true;
            }else{
                var xmlDom = jQuery.parseXML(ele);
                if (xmlDom.nodeType == 9) {
                    this.xmlDom = xmlDom.childNodes[0];
                }else{
                    this.ok = true;
                }
            }
        }else{
            this.xmlDom = ele;
        }
        return this.xmlDom;
    },
    toJSON : function toJSON(ele){
        if(ele){
            this.toXMLDom(ele);
        }
        
        if(this.ok){
            return this.json;
        }
        var xml = this.xmlDom;
        
        var obj = {};
        if (xml.nodeType == 1) {
            // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = this.xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    }
});

tk.Composition(TK, {
    xml : new TK.XML()
});
```

## 字符串 hash

```
/**
 * 获取字符串的哈希值
 * 
 * @param {String}
 *            str
 * @param {Boolean}
 *            caseSensitive
 * @return {Number} hashCode
 */
tk.Composition(TK,{
    hashString : function hashString(src, caseSensitive){
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
```


## 破解图片反盗链

```
tk.Composition(TK,{
    loadImg : function loadImg(imgList, callback){
        window.TK = window.TK || {};
        var hashMap = window.TK.hashMap;
        var img = window.TK.img;
        var callback = window.TK.callback;
        window.TK.hashMap = {};
        window.TK.img = '';
        window.TK.callback = function(){
            window.TK.hashMap = hashMap;
            window.TK.img = img;
            window.TK.callback = callback;
            if(callback){
                callback();
            }
        };
        for(var i in imgList){
            var url = imgList[i];
            var key = getHashCode(url);
            if(hashMap[key])continue;
            hashMap[key] = 1;
            window.TK.img += '<img src=\''+url+'\' /><script>window.onload = function() { parent.TK.callback(); }</script>';
            
        }
        if(window.img){
            $("body").append('<iframe src="javascript:parent.TK.img;" height="0px" width="0px"></iframe>');
        }
    }
});
```

例如下面的图片就是破解盗链的展示

<p class="javascript-note-lib-img1" style="width: 100px;height: 100px;"></p>


<script>
jQuery(document).ready(function(){
    var $dom = $(".javascript-note-lib-img1");
    
    function nextLoadImg(){
        setTimeout(loadImg,1000);
    }
    
    function loadImg(){
        if(typeof tk == "undefined"){
            return nextLoadImg();
        }
        if(tk.time === undefined){
            return nextLoadImg();
        }
        var imgUrl = "http://qlogo3.store.qq.com/qzone/804345178/804345178/100?"+tk.time();
        tk.loadImg([imgUrl], function(){
            //图片加载完之后做的事
            $dom.html("<img src=\""+imgUrl+"\">");
        });
    }
    
    nextLoadImg();
});
</script>

  
   

## javascript 获得图片的真实高度

```
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
```

## 得到当前时间的时间戳

```
tk.Composition(TK, {
    time : function time(){
        return new Date().getTime();
    }
});

```

[main-js]: http://github.tiankonguse.com/javascripts/main.js
