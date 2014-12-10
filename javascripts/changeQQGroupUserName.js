function nameOK(name) {
	return /^\d{2}_/.test(name);
}

function getName(name) {
    
    //数院13级李宇锋
	if (/^1X/.test(name)) {
		return name;
	}
    // "20XX" +  (空白 |"-"|"_" | "-")+ "tiankonguse" -> "XX_tiankonguse"
	if (/^20\d{2}[\s-_]*[^\s]+$/.test(name)) {
		name = name.replace(/^20(\d{2})[\s-_]*([^\s]+)$/, "$1_$2");;
	}

    // "XX" +  (空白 |"_" | "―"| "#")+ "tiankonguse" -> "XX_tiankonguse"
	if (/^\d{2}[\s-_―#]*[^\s]+$/.test(name)) {
		name = name.replace(/^(\d{2})[\s-_―#]*([^\s]+)$/, "$1_$2");;
	}
    
    // "1X_" 开头的 -> 空
	if (/^1X_.*$/.test(name)) {
		name = "";
	}
    // XX + 非中文 + 中文 -> XX_中文
	if (/^\d{2}[^\u4E00-\u9FA5\uF900-\uFA2D]*[\u4E00-\u9FA5\uF900-\uFA2D]+$/.test(name)) {
		name = name.replace(/^(\d{2})[^\u4E00-\u9FA5\uF900-\uFA2D]*([\u4E00-\u9FA5\uF900-\uFA2D]+)$/,"$1_$2");;
	}
    
    //数院13级李宇锋
	if (/^.{2}\d{2}级[^\u4E00-\u9FA5\uF900-\uFA2D]*[\u4E00-\u9FA5\uF900-\uFA2D]{2,3}$/.test(name)) {
		name = name.replace(/^(.{2})(\d{2}级)([^\u4E00-\u9FA5\uF900-\uFA2D]*[\u4E00-\u9FA5\uF900-\uFA2D]{2,3})$/,"$2_$1_$3");;
	}

    
	return name;
};
function UTF8Length(s) {
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
function format(name, len){
    while(UTF8Length(name) < len){
        name = name + " "; 
    }
    return name;
}

!jQuery(".td-card").each(function(k, v) {
	var notAlter = ["37927865", "16410220"];//不转名字的QQ号
	var $that = $(v);
    var nick = $that.prev().find("span").text().trim();
	var $obj = $that.find("input.member-card");
	var qq = $obj.attr("data-id");
	var name = $obj.attr("data-old");
	var i = $.inArray(qq, notAlter);
	var oldname = name;
    
    if(!qq){
        oldname = name = $that.text().trim();
        qq = $that.prev().find("i").attr("data-id");
    }
    
    // i != -1 代表当前QQ没有在不转列表
	if (i == -1) {
		if (nameOK(oldname)) {
			return;
		}


        name = getName(oldname);//修改名字的规则函数，一般试用正则表达式实现
        oldname = oldname.trim();
        name = name.trim();
        if(oldname == name){
            if(!oldname){
                oldname = "无群名片";
            }
            nick = format(nick, 20)
            oldname = format(oldname, 20)
            name = format(name, 20)
            qq = format(qq, 20)
            console.log("不规范名字 昵称:"+nick +", 群名片:"+ oldname +", QQ " + qq + ", format: " + name + ";");
        }
		
		return;
		$.post("http://qun.qq.com/cgi-bin/qun_mgr/set_group_card", {
			"gc" : "261289916",
			"u" : qq,
			"name" : name,
			"bkn" : "1153304660"
		}, function(data) {
			if (data && data.ec == 0) {
				console.log(qq + ":" + oldname + "->" + name);
			} else {
				console.log("alter failes", data);
			}
		}, "json");
	} else {
		console.log("特殊任务，不予处理 昵称:"+nick +", 群名片:"+ oldname +", QQ " + qq + ";");
	}
});




