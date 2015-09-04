/*
 * @file    thingsforinternet.js which is base js for thingsforinternet project
 * @author  HQM <-- kimi.huang@brightcells.com -->
 * @date    2014/04/22
 * @github  https://github.com/HQMIS | https://github.com/Brightcells
 * @version 1.0.0
 */


/*
 * @description ajax to post site's visited
 *
 * @param
 *
 * @return
 */
function visit(_iObj, _url, _id){
    $.ajax({
        type: "post",
        url: _url,
        data: {siteid: _id},
        dataType: "json",
        success: function(data){
        }
    });
}

/*
 * @description ajax to post site's like & favorite
 *
 * @param
 *
 * @return
 */
function myLikeFavAjax(_iObj, _spanObj, _url, _data){
    var iObj = _iObj,
        spanObj = _spanObj;

    iObj.classList.add("clicked");
    $.ajax({
        type: "post",
        url: _url,
        data: _data,
        dataType: "json",
        success: function(data){
            num = data['code'];
            if (num in {'300': '', '400': ''}) {
                iObj.classList.remove("icon-white", "done");
                spanObj.text(parseInt(spanObj.text())+1);
            } else if (num in {'302': '', '402': ''}) {
                iObj.classList.add("icon-white", "done");
                spanObj.text(parseInt(spanObj.text())-1);
            }
        }
    });
    event.preventDefault();
    iObj.classList.remove("clicked");
}

/*
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

/*
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 *
 * Control backtop button's display & exec back top
 *
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 */
window.onscroll = function () {
    var scrHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (scrHeight >= 250) {
        document.getElementById("backtop").style.display = "block";
    } else {
        document.getElementById("backtop").style.display = "none";
    }
};

function backtop() {
    scroll(0, 0);
};

/*
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 *
 * Control sidr's open and close by specify button
 *
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 */
$(document).ready(function() {
    $('#simple-menu').sidr();

    var limit=300, //灵敏度，两次Ctrl之间的间隔，单位：ms
          k=0,
          ti=0;

    document.addEventListener('keyup', function(e) {
        if(k>=1 && ((new Date()).valueOf()-ti<=limit)) {
            k=0;
            open_close_sidr();
        }
        if(e.keyCode!=17) {
            k=0;
        } else {
            k+=1;
            ti=(new Date()).valueOf();
        }
    }, false);
});

var m = new Menu(document.getElementsByTagName('menuNav')[0], {
    radius : 130
});

var jsidr = false;
/*
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 *
 * Control sidr's open and close
 * by using gesture support by hammer.js
 * and double click Ctrl realize by self
 *
 * ########## ########## ########## ########## ########## ########## ##########
 * ########## ########## ########## ########## ########## ########## ##########
 */
function open_close_sidr() {
    if (jsidr) {
        jQuery.sidr('close');
        jsidr = false;
    } else {
        jQuery.sidr('open');
        jsidr = true;
    }
}

function open_sidr() {
    if (!jsidr) {
        jQuery.sidr('open');
        jsidr = true;
    }
}

function close_sidr() {
    if (jsidr) {
        jQuery.sidr('close');
        jsidr = false;
    }
}
