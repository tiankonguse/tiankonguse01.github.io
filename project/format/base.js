function doSomething(){
    
    $('#code-after').val("");
    
    var codeOp = $('#code-op').val();
    
    
    var codeBefor =$('#code-befor').val().replace(/^\s+/, '');
    if(codeBefor.length==0){
        return;
    }
    
    var codeLang = $("#code-lang").val();
    
    var codeTab = $("#code-tab").val();
    
    var codeAfter = "";
    
    function callback(codeAfter){
        $("#code-after").val(codeAfter);
    }
    
    if("格式化" == codeOp){
        codeAfter = formatSource(codeBefor, codeLang, codeTab, callback);
    }else if("普通压缩" == codeOp){
        codeAfter = normalCompression(codeBefor, codeLang, callback);
    }
    
    callback(codeAfter);
}

function normalCompression(codeBefor, codeLang, callback){
    var codeAfter = "还不能压缩这个语言的代码";
    if(codeLang == "css"){
        codeAfter = normalCompressionCss(codeBefor, callback);
    }else if(codeLang == "javascript"){
        codeAfter = normalCompressionJavascript(codeBefor, callback);
    }else if(codeLang == "html"){
        codeAfter = normalCompressionHtml(codeBefor, callback);
    }
    return codeAfter;
}



function normalCompressionJavascript(codeBefor, callback){
    return "正在实现中";
}


function normalCompressionHtml(codeBefor, callback){
    var source = codeBefor;
    source = source.replace(/\n+/g, "");
    source = source.replace(/<!--.*?-->/ig, "");
    source = source.replace(/\/\*.*?\*\//ig, "");
    source = source.replace(/[ ]+</ig, "<");
    return source;
}

function normalCompressionCss(codeBefor, callback){
    var source = codeBefor;
    source = source.replace(/\n+/g, "");
    source = source.replace(/\/\*.*?\*\//ig, "");
    source = source.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
    source = source.replace(/\,[\s\.\#\d]*\{/g, "{");  
    return source;
}

function normalFormatCss(codeBefor, callback){
    var source = codeBefor;
    source = source.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
    source = source.replace(/;\s*;/g, ";");
    source = source.replace(/\,[\s\.\#\d]*{/g, "{");
    source = source.replace(/([^\s])\{([^\s])/g, "$1 {\n\t$2");
    source = source.replace(/([^\s])\}([^\n]*)/g, "$1\n}\n$2");
    source = source.replace(/([^\s]);([^\s\}])/g, "$1;\n\t$2");
    return source;
}

function formatSource(codeBefor, codeLang, codeTab, callback){
    var codeAfter = "还不能格式化这个语言的代码";
    if(codeLang == "css"){
        codeAfter = formatCss(codeBefor, codeTab);
    }else if(codeLang == "javascript"){
        codeAfter = formatJavascript(codeBefor, codeTab);
    }else if(codeLang == "html"){
        codeAfter = formatHtml(codeBefor, codeTab);
    }
    return codeAfter;
}

function formatJavascript(codeBefor, codeTab, callback){
    var tabchar = ' ';
    if (codeTab == 1){
        tabchar = '\t';
    }
    return js_beautify(codeBefor, codeTab, tabchar);
}

function formatCss(codeBefor, codeTab, callback){
    var options = {
        indent: '    '
    };
    if(codeTab == 1){
        options.indent = '\t';
    }
    return cssbeautify(codeBefor, options);
}

function formatHtml(codeBefor, codeTab, callback){
    var tabchar = ' ';
    if (codeTab == 1){
        tabchar = '\t';
    }
    return style_html(codeBefor, codeTab, tabchar, 80);
}