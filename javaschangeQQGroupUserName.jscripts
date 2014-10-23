function nameOK(name) {
	return /^\d{2}_/.test(name);
}

function getName(name) {

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
	return name;
};

jQuery(".td-card").each(function(k, v) {
	var notAlter = ["37927865", "16410220"];//不转名字的QQ号
	var $that = $(v);
	var $obj = $that.find("input.member-card");
	var qq = $obj.attr("data-id");
	var name = $obj.attr("data-old");
	var i = $.inArray(qq, notAlter);
	var oldname = name;
    
    // i != -1 代表当前QQ没有在不转列表
	if (i == -1) {

		if (nameOK(name)) {
			return;
		} else {
			if (name) {
				console.log(name);
			}

			name = getName(name);//修改名字的规则函数，一般试用正则表达式实现
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
		console.log(qq);
	}
});




