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
    
    if("格式化" == codeOp){
        codeAfter = formatSource(codeBefor, codeLang, codeTab);
    }else if("普通压缩" == codeOp){
        codeAfter = normalCompression(codeBefor, codeLang);
    }
    
    $("#code-after").val(codeAfter);
}

function normalCompression(codeBefor, codeLang){
    var codeAfter = "还不能压缩这个语言的代码";
    if(codeLang == "css"){
        codeAfter = normalCompressionCss(codeBefor);
    }else if(codeLang == "javascript"){
        codeAfter = normalCompressionJavascript(codeBefor);
    }else if(codeLang == "html"){
        codeAfter = normalCompressionHtml(codeBefor);
    }
    return codeAfter;
}


function normalCompressionHtml(codeBefor){
    var source = codeBefor;
    source = source.replace(/\n+/g, "");
    source = source.replace(/<!--.*?-->/ig, "");
    source = source.replace(/\/\*.*?\*\//ig, "");
    source = source.replace(/[ ]+</ig, "<");
    return source;
}

function normalCompressionCss(codeBefor){
    var source = codeBefor;
    source = source.replace(/\n+/g, "");
    source = source.replace(/\/\*.*?\*\//ig, "");
    source = source.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
    source = source.replace(/\,[\s\.\#\d]*\{/g, "{");  
    return source;
}

function normalFormatCss(codeBefor){
    var source = codeBefor;
    source = source.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
    source = source.replace(/;\s*;/g, ";");
    source = source.replace(/\,[\s\.\#\d]*{/g, "{");
    source = source.replace(/([^\s])\{([^\s])/g, "$1 {\n\t$2");
    source = source.replace(/([^\s])\}([^\n]*)/g, "$1\n}\n$2");
    source = source.replace(/([^\s]);([^\s\}])/g, "$1;\n\t$2");
    return source;
}

function formatSource(codeBefor, codeLang, codeTab){
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

function formatJavascript(codeBefor, codeTab){
    var tabchar = ' ';
    if (codeTab == 1){
        tabchar = '\t';
    }
    return js_beautify(codeBefor, codeTab, tabchar);
}

function formatCss(codeBefor, codeTab){
    var options = {
        indent: '    '
    };
    if(codeTab == 1){
        options.indent = '\t';
    }
    return cssbeautify(codeBefor, options);
}

function formatHtml(codeBefor, codeTab){
    var tabchar = ' ';
    if (codeTab == 1){
        tabchar = '\t';
    }
    return style_html(codeBefor, codeTab, tabchar, 80);
}