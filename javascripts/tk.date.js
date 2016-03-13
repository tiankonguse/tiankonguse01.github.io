/* 
 * date function
 */
 
/* format date */
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

/* time */
tk.Composition(TK, {
    time : function time(){
        return new Date().getTime();
    }
});
