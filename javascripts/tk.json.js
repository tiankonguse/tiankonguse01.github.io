
/* JSON */
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


/* XML */
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
