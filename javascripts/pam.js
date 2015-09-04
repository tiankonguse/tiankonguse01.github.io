//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/'---'\___
//                 .' \\|       |// '.
//                / \\|||   :   |||// \
//               / _|||||  -:-  |||||_ \
//              |   |  \\\  -  ///  |   |
//              | \_|   ''\---/''   |_/ |
//              \  .-\__   '-'   __/-.  /
//            ___'. .'   /--.--\   '. .'___
//         ."" '<  `.____\_<|>_/____.`  >' "".
//        | | :   `- \`.;`\ _ /`;.`\ -`   : | |
//        \  \ `_.    \_ __\ /__ _/    ._` /  /
//    =====`-.___ `.____ \_____/ ____.` ___.-'=====
//                       `=---='
//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//          佛祖保佑       HQM        永无BUG
//

/**
 * @fileOverview pam.js which to simply deal with picture\audio\movie
 * @author HQM
 * @date 2013/06/27
 * @e-mail qiminis0801@gmail.com
 * @github https://github.com/HQMIS
 * @version 1.0.1
 */

/**
 * Global Variable
 */
var config = {
    site: '',
    usr: '',

    cache: 'true',
    device: 'C',

    img_index: 0, // the index of the picList

    slide_image_num: 5, // number of side image from server
    slide_image_classify: "",  // classify of side image from server

    global_bg_time: 0, // global backgroud interval time
    global_bg_res: [], // global backgroud res

    pic_jsonp_url: "http://pamjs.com/api/pic/?site=%1&usr=%2&num=%3&callback=pamjs&cache=%4&device=%5&classify=%6",
    daily_pic_jsonp_url: "http://pamjs.com/api/daily_pic/?site=%1&usr=%2&num=%3&callback=pamjs&cache=%4&device=%5&classify=%6",

    ctrl: true,  // 是否显示控制按钮
    con_div: 'Div',  // 控制按钮控制区域
    display: false  // 控制区域内内容是否显示
}

/**
 * @description Override global var config
 *
 * @param conf
 *
 * @return
 */
function init(conf) {
    for(c in conf) {
        if(c in config) {
            config[c] = conf[c];
        }
    }
}

/**
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 *
 * the global function used for all feature
 *
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 */

/**
 * @description check the browser you are using
 *
 * @param
 *
 * @return {Object} Sys
 */
function browserCheck() {
    var Sys = {},
        ua = navigator.userAgent.toLowerCase(),
        s;

    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : (s = ua
            .match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : (s = ua
            .match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : (s = ua
            .match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : (s = ua
            .match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    return Sys;
}

/**
 * @description convert timestamp to strftime, which can call by timestamp
 *
 * @param {fmt}
 *            strftime time format such as "yyyy-MM-dd"
 * @return {fmt}
 *            strftime time which has already been convert
 */
Date.prototype.pattern=function(fmt) {
    var o = {
            "M+" : this.getMonth()+1, //月份
            "d+" : this.getDate(), //日
            "h+" : this.getHours() == 0 ? 12 : this.getHours(), //小时
            "H+" : this.getHours(), //小时
            "m+" : this.getMinutes(), //分
            "s+" : this.getSeconds(), //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S" : this.getMilliseconds() //毫秒
        },
        week = {
            "0" : "\u65e5",
            "1" : "\u4e00",
            "2" : "\u4e8c",
            "3" : "\u4e09",
            "4" : "\u56db",
            "5" : "\u4e94",
            "6" : "\u516d"
        };

    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);
    }

    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }

    return fmt;
};

/**
 * @description format string
 *
 * @param {str}
 *            string to format
 * @return
 *            string formated
 */
String.format = function(str) {
    var args = arguments,
        re = new RegExp("%([1-" + args.length + "])", "g");

    return String(str).replace(re, function($1, $2) {
        return args[$2];
    });
};

/**
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 *
 * the two function below is for jsonp
 *
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 */
function setOneOrMore(data) {
    config.global_bg_res = data[0];
    if (1 == config.global_bg_res.length) {
        setBackground(config.global_bg_res[0]);
    } else {
        timeId = window.setInterval("slideSetBackground(config.global_bg_res)", config.global_bg_time);
        slideSetBackground(config.global_bg_res);
    }
}

var pamjs = function(data) {
    setOneOrMore(data);

    if (window.localStorage) {
        var ymd = new Date().pattern("yyyy-MM-dd");
        for(var i=0; i<localStorage.length; i++) {
            var key = localStorage.key(0);
            if (key.indexOf(ymd) >= 0) {

            } else {
                localStorage.removeItem(key);
            }
        }
        localStorage.setItem(String.format("%1_%2_%3_%4", config.site, config.usr, config.slide_image_classify, ymd), JSON.stringify(data));
    }
};

function getRemoteInfo(url, site, usr, num, cache, device, classify) {
    // 创建script标签，设置其属性
    var script = document.createElement('script');
    script.setAttribute('src', String.format(url, site, usr, num, cache, device, classify));
    // 把script标签加入head，此时调用开始
    document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 *
 * the three function below is for picture
 *
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 */

/**
 * @description control to set background use picture
 *
 * @param {int _bg_mode}
 *     0 - diy resource
 *     1 - use server's resource
 * @param {Array or Int _bg_res}
 *     Array - path of diy resource
 *     Int - show background _bg_mode, 0 for just one image, 1 for slide image
 * @param {Array or Int _bg_info}
 *     Array - info of diy resource
 *     Int - choose whether to display _bg_info, 0 for display, 1 for not display
 * @param {Array or Int _bg_link}
 *     Array - link of diy resource
 *     Int - choose whether to add _bg_link, 0 for add, 1 for not add
 * @param {int _bg_time}
 *     the interval time of the timer, unit is millisecond(毫秒)
 *
 * @return {null} null
 */
function _bg(_bg_mode, _bg_res, _bg_time) {
    /**
     * when _bg_mode equals 1, we should use server's picture else when _bg_mode
     * equals 0, we should use diy picture
     */
    if (1 == _bg_mode) {
        var storeage_key = String.format("%1_%2_%3_%4", config.site, config.usr, config.slide_image_classify, new Date().pattern("yyyy-MM-dd"));
        if (window.localStorage && (storeage_key in localStorage)) {
            setOneOrMore(JSON.parse(localStorage.getItem(storeage_key)));
        } else {
            if (1 == _bg_res) { // order to set picture on server in the list as background
                config.global_bg_time = _bg_time;
                /* set a timer, to set background every interval time */
                getRemoteInfo(config.pic_jsonp_url, config.site, config.usr, config.slide_image_num, config.cache, config.device, config.slide_image_classify);
            } else if(-1 == _bg_res) {
                getRemoteInfo(config.dailypic_jsonp_url, config.site, config.usr, config.slide_image_num, config.cache, config.device, config.slide_image_classify);
            }else { // set one random picture as background
                config.global_bg_time = _bg_time;
                getRemoteInfo(config.pic_jsonp_url, config.site, config.usr, 1, config.cache, config.device, config.slide_image_classify);
            }
        }
    } else {
        if (1 == _bg_res.length) {
            /*
             * the length of the array is 1, direct set the picture index which
             * index is 0 as background
             */
            setBackground(_bg_res[0]);
        } else {
            config.global_bg_res = _bg_res;
            /* set a timer, to set background every interval time */
            var timeId = window.setInterval("slideSetBackground(config.global_bg_res)", _bg_time);
            slideSetBackground(config.global_bg_res);
        }
    }
}

/**
 * @description slide to set background use picture
 *
 * @param {Array}
 *            _bg_res the picture list to be set as background
 * @return {null} null
 */
function slideSetBackground(_bg_res) {
    /* judge the index of the picture to be set as background */
    if (config.img_index >= _bg_res.length) {
        config.img_index = 0;
    }
    setBackground(_bg_res[config.img_index++]);
}

/**
 * @description set background use picture
 *
 * @param {String}
 *            _bg_res the picture to be set as background
 * @return {null} null
 */
function setBackground(_bg_res) {
    var _bg_image = _bg_res["image"],
        _bg_info = _bg_res["info"],
        _bg_link = _bg_res["link"];

    /* Judge whether the img tag whose id is _bgImg exists or not */
    var _bgImg = document.getElementById("_bgImg");
    if (_bgImg) {
        _bgImg.src = _bg_image;
    } else {
        /* create div && set id\className && append to body */
        var _bgDiv = document.createElement("div");
        _bgDiv.id = "bgDiv";
        _bgDiv.className = "bgDiv";
        var object = document.body.appendChild(_bgDiv);

        /* create img && set src && append to div above */
        var _bgImg = document.createElement("img");
        _bgImg.id = "_bgImg";
        _bgImg.src = _bg_image;
        var object = _bgDiv.appendChild(_bgImg);
    }

    //alert(_bg_info);
    if (undefined == _bg_info || '' == _bg_info) {
        var _infoDiv = document.getElementById("infoDiv");
        if(_infoDiv) {
            _infoDiv.parentNode.removeChild(_infoDiv);
        }
    } else {
        /* Judge whether the info tag whose id is _bgInfo exists or not */
        var _infoDiv = document.getElementById("infoDiv");
        if (_infoDiv) {
            if (undefined != _bg_link) {
                document.getElementById("aInfo").href = _bg_link;
            }
            document.getElementById("aInfo").innerHTML = _bg_info;
        } else {
            /* create div && set id\className && append to body */
            var _infoDiv = document.createElement("div");
            _infoDiv.id = "infoDiv";
            _infoDiv.className = "infoDiv";
            var object = document.body.appendChild(_infoDiv);

            _h3Title = document.createElement("h3");
            _h3Title.className = "h3Title";
            _h3Title.innerHTML = "今日图片故事";
            var object = _infoDiv.appendChild(_h3Title);

            _aInfo = document.createElement("a");
            _aInfo.id = "aInfo";
            _aInfo.className = "aInfo";
            if (undefined != _bg_link) {
                _aInfo.href = _bg_link;
                _aInfo.target = "_blank";
            }
            _aInfo.innerHTML = _bg_info;
            var object = _infoDiv.appendChild(_aInfo);
        }
    }
}

/**
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 *
 * the three function below is for audio
 *
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 */

/**
 * @description control to broadcast audio
 *
 * @param {int}
 *            _audio_mode 0 - diy resource(Array) 1 - use server's
 *            resource(String)
 * @param {Array
 *            or Int} _audio_res Array - path of diy resource Int - broadcast
 *            _audio_mode, 0 for single replay, 1 for more replay
 * @return {null} null
 */
function _audio(_audio_mode, _audio_res) {
    var Sys = browserCheck();

    /**
     * when _audio_mode equals 1, we should use server's audio else when
     * _audio_mode equals 0, we should use diy audio
     */
    if (1 == _audio_mode) {
        /* audio list on server */
        var audioList = [ url + "audio/snq", url + "audio/qg", url + "audio/xy" ];

        if (Sys.ie && parseInt(Sys.ie.split(".")[0]) < 9) {
            _audio_IE(audioList);
        } else {
            if (1 == _audio_res) { // order play the audio on server
                broadcastList(audioList);
            } else { // order play the audio on server
                var slideIndex = parseInt(Math.random() * audioList.length);
                broadcastList(audioList.slice(slideIndex, slideIndex + 1));
            }
        }
    } else {
        /**
         * if statement deal with the browser which not support html5's audio
         * tag else statement deal with the browser that support html5's audio
         * tag
         */
        if (Sys.ie && parseInt(Sys.ie.split(".")[0]) < 9) {
            _audio_IE(_audio_res);
        } else {
            broadcastList(_audio_res);
        }
    }
}

/**
 * @description broadcast audio by list
 *
 * @param {String}
 *            _audio_res the audio list to be broadcast
 * @return {null} null
 */
function broadcastList(_audio_res) {
    /* audioIndex is the index of resource array */
    var audioIndex = 0;
    /* create audio */
    var _audio = document.createElement("audio");

    /**
     * judge the audio and deal with if auido is null or not can play, show the
     * notice else deal with the request
     */
    if (_audio != null && _audio.canPlayType) {
        /* append audio to body */
        var object = document.body.appendChild(_audio);

        /* broadcat _audio_res[i] through audio */
        broadcast(_audio, _audio_res[audioIndex++]);

        /* add the callback function addEventListener to audio's object */
        _audio.addEventListener('ended', function() {
            /* judge the index of the audio to be broadcast */
            if (audioIndex >= _audio_res.length) {
                audioIndex = 0;
            }

            /* broadcat _audio_res[i] through audio */
            broadcast(_audio, _audio_res[audioIndex++]);
        }, false);
    } else {
        var _notice = document.createElement("div");
        _notice.innerText = "您现在使用的浏览器不支持audio标签";
        var object = document.body.appendChild(_notice);
    }
}

/**
 * @description broadcast audio
 *
 * @param {object}
 *            _audio the object create by document.createElement("audio")
 * @param {String}
 *            _audio_res the audio to be broadcast
 * @return {null} null
 */
function broadcast(_audio, _audio_res) {
    /* set id\controls\preload\autoplay\className */
    _audio.id = "_audio";
    _audio.controls = "controls";
    _audio.preload = "auto";
    _audio.autoplay = "autoplay";
    _audio.className = "audio";

    /*
     * judge the browser you are using whether support audio which is ogg format
     * or not && select the suitable format's audio to be broadcast
     */
    if (_audio.canPlayType("audio/ogg")) {
        _audio.src = _audio_res + ".ogg";
    } else if (_audio.canPlayType("audio/mpeg")) {
        _audio.src = _audio_res + ".mp3";
    }
}

/**
 * @description broadcast audio for ie version below 9
 *
 * @param {Array}
 *            _audio_res Array - path of _audio_res to be broadcast
 * @return {null} null
 */
function _audio_IE(_audio_res) {
    /* create div && append to body */
    var _notice = document.createElement("div");
    var object = document.body.appendChild(_notice);

    /*
     * create a && set id\href\onclick\innerText\className && append to div
     * above
     */
    var _switch = document.createElement("a");
    _notice.appendChild(_switch);
    _switch.id = "_switch";
    _switch.href = "javascript:void(0);";
    _switch.onclick = function(stop) {
        var _bgsound = document.getElementById("_bgsound");
        /* judge the text of the _switch and deal with */
        if ("关闭背景音乐" == document.getElementById("_switch").innerHTML) {
            _bgsound.src = "";
            _switch.innerText = "打开背景音乐";
        } else {
            _bgsound.src = _audio_res[0] + ".mp3";
            _switch.innerText = "关闭背景音乐";
        }
    };
    _switch.innerText = "关闭背景音乐";
    _switch.className = "switch";

    /* create bgsound && set id\src\loop && append to body */
    var _bgsound = document.createElement("bgsound");
    _bgsound.id = "_bgsound";
    _bgsound.src = _audio_res[0] + ".mp3";
    _bgsound.loop = -1;
    var object = document.body.appendChild(_bgsound);
}

/**
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 *
 * the three function below is for movie(video)
 *
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 */

/**
 * @description control to set movie(video) as background whichi just is
 *              broadcast movie without controls
 *
 * @param {int}
 *            _movie_mode 0 - diy resource(Array) 1 - use server's
 *            resource(String)
 * @param {Array
 *            or Int} _movie_res Array - path of diy resource Int - broadcast
 *            _movie_mode, 0 for single replay, 1 for more replay
 * @return {null} null
 */
function _movie(_movie_mode, _movie_res) {
    var Sys = browserCheck();

    /**
     * when _movie_mode equals 1, we should use server's audio else when
     * _movie_mode equals 0, we should use diy audio
     */
    if (1 == _movie_mode) {
        /* video list on server */
        var videoList = [ url + "movie/movie", url + "movie/xwqzzhxcp" ];

        if (Sys.ie && parseInt(Sys.ie.split(".")[0]) < 9) {
            _movie_IE(_movie_res);
        } else {
            if (1 == _movie_res) { // order play the movie(video) on server
                broadcastSetList(videoList);
            } else { // order play the audio on server
                var slideIndex = parseInt(Math.random() * videoList.length);
                broadcastSetList(videoList.slice(slideIndex, slideIndex + 1));
            }
        }
    } else {
        /**
         * if statement deal with the browser which not support html5's video
         * tag else statement deal with the browser that support html5's video
         * tag
         */
        if (Sys.ie && parseInt(Sys.ie.split(".")[0]) < 9) {
            _movie_IE(_movie_res);
        } else {
            broadcastSetList(_movie_res);
        }
    }
}

/**
 * @description set movie(video) as background whichi just is broadcast movie
 *              without controls by list
 *
 * @param {String}
 *            _movie_res the video list to be broadcast
 * @return {null} null
 */
function broadcastSetList(_movie_res) {
    /* videoIndex is the index of resource array */
    var videoIndex = 0;
    /* create video */
    var _video = document.createElement("video");

    /**
     * judge the vedio and deal with if vedio is null or not can play, show the
     * notice else deal with the request
     */
    if (_video != null && _video.canPlayType) {
        /* append _movieDiv to body */
        var _movieDiv = document.createElement("div");
        _movieDiv.className = "movieDiv";
        var object = document.body.appendChild(_movieDiv);

        /* append video to body */
        var object = _movieDiv.appendChild(_video);

        /* broadcat _movie_res[i] through video */
        broadcastSet(_video, _movie_res[videoIndex++]);

        /* add the callback function addEventListener to video's object */
        _video.addEventListener('ended', function() {
            /* judge the index of the video to be broadcast */
            if (videoIndex >= _movie_res.length) {
                videoIndex = 0;
            }

            /* broadcat _movie_res[i] through video */
            broadcastSet(_video, _movie_res[videoIndex++]);
        }, false);
    } else {
        var _notice = document.createElement("div");
        _notice.innerText = "您现在使用的浏览器不支持video标签";
        var object = document.body.appendChild(_notice);
    }
}

/**
 * @description set movie(video) as background whichi just is broadcast movie
 *              without controls
 *
 * @param {object}
 *            _movie the object create by document.createElement("movie")
 * @param {String}
 *            _movie_res the movie to be broadcast
 * @return {null} null
 */
function broadcastSet(_movie, _movie_res) {
    /* set id\controls\preload\autoplay\className */
    _movie.id = "_movie";
    // _movie.controls = "controls";
    _movie.preload = "auto";
    _movie.autoplay = "autoplay";
    // _movie.className = "video";

    /*
     * judge the browser you are using whether support audio which is ogg format
     * or not && select the suitable format's audio to be broadcast
     *
     * mp4 is much smaller than ogv, so make mp4 header
     */
    if (_movie.canPlayType("video/mp4")) {
        _movie.src = _movie_res + ".mp4";
    } else if (_movie.canPlayType("video/ogg")) {
        _movie.src = _movie_res + ".ogv";
    } else if (_movie.canPlayType("video/webM")) {
        _movie.src = _movie_res + ".webm";
    }
}

/**
 * @description set movie(video) as background whichi just is broadcast movie
 *              without controls for ie version below 9
 *
 * @param {Array}
 *            _movie_res Array - path of _movie_res to be set
 * @return {null} null
 */
function _movie_IE(_movie_res) {
    /* create div && append to body */
    var _notice = document.createElement("div");
    _notice.className = "ieMovieDiv";
    var object = document.body.appendChild(_notice);

    /* create embed && set id\src\loop && append to div _notice */
    var _embed = document.createElement("embed");
    _embed.id = "_embed";
    _embed.src = _movie_res[0] + ".avi";
    _embed.autostart = true;
    _embed.loop = true;
    _embed.className = "ieEmbed";
    var object = _notice.appendChild(_embed);
}

/**
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 *
 * the function below is for float layer
 *
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 */

/**
 * @description display float layer by transmiting idDiv\imgPath\imgName as
 *              parameter
 *
 * @param {idDiv}
 *            the id of the float layer which to be create
 * @param {imgPath}
 *            the path of the image to be display
 * @param {imgName}
 *            the name of the image to be display
 * @return {null} null
 */
function showid(idDiv, imgPath, imgName) {
    var isIE = (document.all) ? true : false;
    var isIE6 = isIE
            && ([ /MSIE (\d)\.0/i.exec(navigator.userAgent) ][0][1] == 6);
    var newbox = document.getElementById(idDiv);
    newbox.style.zIndex = "9999";
    newbox.style.display = "block";
    newbox.style.position = !isIE6 ? "fixed" : "absolute";
    newbox.style.top = newbox.style.left = "50%";
    newbox.style.marginTop = -newbox.offsetHeight / 2 + "px";
    newbox.style.marginLeft = -newbox.offsetWidth / 2 + "px";

    /*
     * judge whether img tag which id named _img is exists or not, if not
     * exists, create, else do nothing
     */
    if (null == document.getElementById("_img")) {
        var _img = document.createElement("img");
        _img.id = "_img";
        _img.src = imgPath;
        _img.className = "imgStyle";
        newbox.appendChild(_img);

        var _br = document.createElement("br");
        newbox.appendChild(_br);

        var _b = document.createElement("b");
        _b.innerHTML = imgName;
        newbox.appendChild(_b);
    }

    var layer = document.createElement("div");
    layer.id = "layer";
    layer.style.width = layer.style.height = "100%";
    layer.style.position = !isIE6 ? "fixed" : "absolute";
    layer.style.top = layer.style.left = 0;
    layer.style.backgroundColor = "#000";
    layer.style.zIndex = "9998";
    layer.style.opacity = "0.6";
    document.body.appendChild(layer);
    var sel = document.getElementsByTagName("select");
    for ( var i = 0; i < sel.length; i++) {
        sel[i].style.visibility = "hidden";
    }
    function layer_iestyle() {
        layer.style.width = Math.max(document.documentElement.scrollWidth,
                document.documentElement.clientWidth)
                + "px";
        layer.style.height = Math.max(document.documentElement.scrollHeight,
                document.documentElement.clientHeight)
                + "px";
    }
    function newbox_iestyle() {
        newbox.style.marginTop = document.documentElement.scrollTop
                - newbox.offsetHeight / 2 + "px";
        newbox.style.marginLeft = document.documentElement.scrollLeft
                - newbox.offsetWidth / 2 + "px";
    }
    if (isIE) {
        layer.style.filter = "alpha(opacity=60)";
    }
    if (isIE6) {
        layer_iestyle();
        newbox_iestyle();
        window.attachEvent("onscroll", function() {
            newbox_iestyle();
        });
        window.attachEvent("onresize", layer_iestyle);
    }
    layer.onclick = function() {
        newbox.style.display = "none";
        layer.style.display = "none";
        for ( var i = 0; i < sel.length; i++) {
            sel[i].style.visibility = "visible";
        }
    };
}

/**
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 *
 * the function below is for window.onload
 *
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 */
window.onload = function () {
    if(config.ctrl) {
        var _conDiv = document.getElementById(config.con_div);
        if (_conDiv) {
            var _ctrlSpan = document.createElement("span");

            _ctrlSpan.id = "ctrlSpan";
            _ctrlSpan.className = "ctrlSpan";
            if(config.display && _conDiv){
                _conDiv.style.display = "";
                _ctrlSpan.innerHTML = "隐藏";
            } else {
                _conDiv.style.display = "none";
                _ctrlSpan.innerHTML = "显示";
            }
            var object = document.body.appendChild(_ctrlSpan);

            _ctrlSpan.addEventListener("click", function() {
                if("" == _conDiv.style.display) {
                    _conDiv.style.display = "none";
                    _ctrlSpan.innerHTML = "显示";
                } else {
                    _conDiv.style.display = "";
                    _ctrlSpan.innerHTML = "隐藏";
                }
            }, false);
        }
    }
}
