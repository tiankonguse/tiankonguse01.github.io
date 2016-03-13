



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
