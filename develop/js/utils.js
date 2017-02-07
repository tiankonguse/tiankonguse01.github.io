
/**
 * ui组件工具
 * @author: steveswwang
 */

(function(window){
	var $ = window.$,
		_ = window._,
		document = window.document,
		docElem = document.documentElement;

	if (! window.console) {
		window.console = {
			log: function(){},
			error: function(){}
		};
	}

	var utils = {};

	window.utils = utils;

	// Can I use transition ?
	var transitionSupported = (function(){
		var style = document.createElement('div').style;
		return 'transition' in style ||
			'WebkitTransition' in style ||
			'MozTransition' in style ||
			'msTransition' in style ||
			'OTransition' in style;
	})();

	// utils.alert(message, type, complete)
	// utils.confirm(message, confirmed, unconfirmed)
	(function(){
		var elemRoot = $("#modal-alert"),
			elemDialog = elemRoot.find(".modal-dialog"),
			elemTitle = elemRoot.find(".modal-title"),
			elemBody = elemRoot.find(".modal-body"),
			btnClose = elemRoot.find(".modal-footer > [data-dismiss=modal]"),
			btnConfirm = elemRoot.find("[data-confirm=modal]"),
			alertText = "确定",
			cancelText = "取消",
			primaryText = "确定",
			deleteText = "删除",
			defaults = {
				title: "提示",
				message: "",
				html: false,
				type: "default"/*,
				width: 500,
				fade: true*/
			},
			typeList = ["info", "success", "warning", "delete", "error", "denied"],
			classMap = {},
			classAll = [],
			isShown = false;
		_.each(typeList, function(type){
			classAll.push(classMap[type] = "modal-" + type);
		});
		classAll = classAll.join(" ");

		btnConfirm.on("click", function(){
			elemRoot.off("escaped.bs.modal");
			elemRoot.modal("hide");
			elemRoot.trigger("confirmed.bs.modal");
		});

		elemRoot.on("hidden.bs.modal", function(){
			isShown = false;
			elemRoot.trigger("escaped.bs.modal");
			utils.dialog.zUpper();
			// 如果还有底层模态框，注意重设滚动条
			utils.dialog.reshow();
		});

		utils.alert = function(message, type, complete){
			if (isShown) {
				return elemRoot.one("hidden.bs.modal", function(){
					utils.alert(message, type, complete);
				});
			}
			var title = defaults.title,
				html = defaults.html,
				// width = defaults.width,
				// fade = defaults.fade,
				btnCloseText = alertText;
			if (_.isObject(message)) {
				var options = _.defaults(message, defaults);
				type = options.type;
				title = options.title;
				message = options.message;
				html = options.html;
				// width = options.width;
				// fade = options.fade;
				complete = options.complete;
				if ("btnCloseText" in options) {
					btnCloseText = options.btnCloseText;
				}
			} else {
				if (_.isFunction(type)) {
					complete = type;
					type = null;
				}
				type = type || defaults.type;
			}
			message = message + "";

			isShown = true;

			elemRoot.off("escaped.bs.modal");

			if (_.isFunction(complete)) {
				elemRoot.one("escaped.bs.modal", complete);
			}

			elemTitle[html ? "html" : "text"](title);
			elemBody[html ? "html" : "text"](message);
			btnConfirm.hide();
			btnClose.html(btnCloseText);
			elemRoot.removeClass(classAll).addClass(classMap[type]);

			utils.dialog.zLower();

			// elemDialog.css("width", width);
			// elemRoot.toggleClass("fade", fade);

			elemRoot.modal({show: true, backdrop: "static"});
			btnClose.focus();
		};
		utils.confirm = function(message, type, confirmed, unconfirmed){
			if (isShown) {
				return elemRoot.one("hidden.bs.modal", function(){
					utils.confirm(message, type, confirmed, unconfirmed);
				});
			}
			var title = defaults.title,
				html = defaults.html,
				// width = defaults.width,
				// fade = defaults.fade,
				btnConfirmText = primaryText,
				btnCloseText = cancelText;
			if (_.isObject(message)) {
				var options = _.defaults(message, defaults);
				type = options.type;
				title = options.title;
				message = options.message;
				html = options.html;
				// width = options.width;
				// fade = options.fade;
				confirmed = options.confirmed;
				unconfirmed = options.unconfirmed;
				if ("btnConfirmText" in options) {
					btnConfirmText = options.btnConfirmText;
				} else if (type === "delete") {
					btnConfirmText = deleteText;
				}
				if ("btnCloseText" in options) {
					btnCloseText = options.btnCloseText;
				}
			} else {
				if (_.isFunction(type)) {
					unconfirmed = confirmed;
					confirmed = type;
					type = null;
				}
				type = type || defaults.type;
				if (type === "delete") {
					btnConfirmText = deleteText;
				}
			}
			message = message + "";

			isShown = true;

			elemRoot.off("escaped.bs.modal confirmed.bs.modal");

			if (_.isFunction(confirmed)) {
				elemRoot.one("confirmed.bs.modal", confirmed);
			}
			if (_.isFunction(unconfirmed)) {
				elemRoot.one("escaped.bs.modal", unconfirmed);
			}

			elemTitle[html ? "html" : "text"](title);
			elemBody[html ? "html" : "text"](message);
			btnConfirm.html(btnConfirmText);
			btnClose.html(btnCloseText);
			if (type === "delete") {
				btnConfirm.removeClass("btn-primary").addClass("btn-danger");
			} else {
				btnConfirm.removeClass("btn-danger").addClass("btn-primary");
			}
			btnConfirm.show();
			elemRoot.removeClass(classAll).addClass(classMap[type]);

			utils.dialog.zLower();

			// elemDialog.css("width", width);
			// elemRoot.toggleClass("fade", fade);

			elemRoot.modal({show: true, backdrop: "static"});
			btnConfirm.focus();
		};
	})();

	// utils.dialog(url, data, title, width, height)
	// utils.dialog(selector, data, title, width, height)
	(function(){
		var elemRoot = $("#modal-dialog"),
			lastElement,
			loaderDialog = elemRoot.find(".modal-dialog"),
			loaderTitle = loaderDialog.find(".modal-title"),
			loaderContent = loaderDialog.find(".modal-content"),
			defaults = {
				title: "&nbsp;",
				width: 500,
				height: "auto"
			},
			isShown = false,
			isLoading = false,
			xhr;
		function escape() {
			isShown = false;
			abort();
			recycle();
			elemRoot.empty().append(loaderDialog);
		}
		function center() {
			var box = elemRoot.find(".modal-dialog"),
				// scroll bar width : 17px
				left = (elemRoot.width() - box.outerWidth() - 17) / 2,
				top = (docElem.clientHeight - box.outerHeight()) / 2;
			box.css({
				position: "absolute",
				left: Math.max(left, 0),
				top: Math.max(top, 0)
			});
		}
		function abort() {
			if (xhr) {
				xhr.abort();
				xhr = null;
				isLoading = false;
			}
		}
		function recycle() {
			if (lastElement) {
				$(document.body).append(lastElement.hide());
				lastElement = null;
			}
		}
		utils.dialog = function(url, data, title, width, height){
			var element;
			if ((url instanceof $) || (url && url.nodeType === 1)) {
				element = $(url);
			} else if (_.isObject(url)) {
				var options = _.defaults(url, defaults);
				url = options.url;
				data = options.data;
				title = options.title;
				width = options.width;
				height = options.height;
				if ("selector" in options) {
					element = $(options.selector);
				}
			} else {
				title = title || defaults.title;
				width = width || defaults.width;
				height = height || defaults.height;
			}

			if (! (url || element)) {
				throw "utils.dialog() need a url";
			}

			loaderTitle.html(title);
			loaderDialog.css("width", width);
			loaderContent.css("height", height);

			elemRoot.one("shown.bs.modal", function(){
				center();
			});
			elemRoot.one("hidden.bs.modal", escape);

			elemRoot.modal({show: true, backdrop: "static"});
			isShown = true;
			isLoading = true;

			if (element) {
				isLoading = false;
				recycle();
				elemRoot.empty().append(element.show());
				elemRoot.find(".modal-dialog").draggable({
					handle: ".modal-header"
				});
				center();
				xhr = null;
				lastElement = element;
			} else {
				xhr = $.ajax({
					url: url,
					type: _.isObject(data) ? "POST" : "GET",
					data: data,
					success: function(content){
						isLoading = false;
						recycle();
						elemRoot.html(content);
						elemRoot.find(".modal-dialog").draggable({
							handle: ".modal-header"
						});
						center();
						xhr = null;
					}
				});
			}
		};
		utils.dialog.center = center;
		utils.dialog.close = function(){
			elemRoot.modal("hide");
		};
		utils.dialog.zLower = function(){
			elemRoot.css("z-index", 1025);
		};
		utils.dialog.zUpper = function(){
			elemRoot.css("z-index", 1040);
		};
		utils.dialog.shake = function(){
			elemRoot.addClass("modal-shaking");
			setTimeout(function(){
				elemRoot.removeClass("modal-shaking");
			}, 150);
		};
		utils.dialog.isShown = function(element){
			return isShown ? (element ? element.is(lastElement) : true) : false;
		};
		utils.dialog.onceClose = function(fn){
			elemRoot.one("hidden.bs.modal", fn);
		};
		// 如果还有底层模态框，注意重设滚动条
		utils.dialog.reshow = function(){
			if (isShown) {
				var modal = elemRoot.data("bs.modal");
				if (modal && modal.isShown) {
					modal.checkScrollbar();
					modal.$body.addClass("modal-open");
					modal.setScrollbar();
				}
			}
		};
	})();

	// utils.tips(mesage [, type] [, duration])
	// utils.tips(options)
	(function(){
		var tpl = '<div class="alert alert-dismissable alert-tips alert-tips-out"><button type="button" class="close">&times;</button><div class="alert-tips-content"></div></div>',
			defaults = {
				type: "info",
				html: false,
				duration: 3000
			},
			closeDuration = transitionSupported ? 150 : 1,
			typeList = ["info", "success", "warning", "danger"];

		utils.tips = function(message, type, duration){
			var options = {};
			if (_.isObject(message)) {
				options = message;
			} else {
				options.message = message;
				if (_.isString(type)) {
					options.type = type;
				} else {
					duration = type;
				}
				if (_.isNumber(duration)) {
					options.duration = duration;
				}
			}
			if (options.type === "error") {
				options.type = "danger";
			}
			_.defaults(options, defaults);

			var elem = $(tpl),
				content = elem.find(".alert-tips-content"),
				btn = elem.find(".close");
			elem.addClass("alert-" + options.type);
			content[options.html ? "html" : "text"](options.message);

			function close() {
				elem.addClass("alert-tips-out");
				setTimeout($.proxy(elem.remove, elem), closeDuration);
			}

			btn.click(close);

			if (options.duration > 0) {
				setTimeout(close, options.duration);
			}

			$(document.body).append(elem);

			elem.css({
				left: (docElem.clientWidth - elem.outerWidth()) / 2,
				top: (docElem.clientHeight - elem.outerHeight()) / 3
			});

			setTimeout(function(){
				elem.removeClass("alert-tips-out");
			}, 1);

			return close;
		};
	})();

	// 表单验证
	utils.validate = function(selector){
		var inputTagNames = {
			INPUT: true,
			SELECT: true,
			TEXTAREA: true
		};
		$(selector).each(function(){
			var elem = $(this),
				isContainer = ! inputTagNames[this.tagName],
				input = isContainer ? elem.find("input,select,textarea") : elem,
				// input = inputSelector ? elem.find(inputSelector) : elem,
				events = "input change focus blur",
				autoshow = !! elem.attr("data-autoshow"),
				container = elem.closest(".form-group");
			if (isContainer) {
				elem.data("focused", true);
			}
			elem.tooltip({
				title: elem.data("title"),
				trigger: "manual",
				placenment: elem.data("placenment") || "top",
				animation: false
			});
			input.on(events, function(){
				if (! elem.data("focused")) {
					return;
				}
				var empty = input.val() === "";
				if (empty && autoshow) {
					elem.tooltip("show");
				} else {
					elem.tooltip("hide");
				}
			});
			input.on("focus", function(){
				elem.data("focused", true);
			});
			elem.on("show.bs.tooltip", function(e){
				container.addClass("has-error");
			});
			elem.on("hide.bs.tooltip", function(e){
				container.removeClass("has-error");
			});
		});
	};

	// 表格全选复选框
	utils.tableChecker = function(selector, srcSelector, dstSelector){
		var events = "click.checker",
			src = $(srcSelector || "thead :checkbox", selector),
			dst = $(dstSelector || "tbody :checkbox", selector);
		src.off(events).on(events, function(){
			var checked = this.checked,
				method = checked ? "not" : "filter";
			dst[method](":checked").prop("checked", checked)/*.triggerHandler("click")*/;
		});
	};

	// 表格表头fixed定位
	utils.tableFixer = (function(){
		var $win = $(window);
		return function(selector, offsetTop){
			var fixedTable = $(selector),
				fixedThead = fixedTable.find("> .box-fixed-thead"),
				fixedTbody = fixedTable.find("> .box-fixed-tbody"),
				shifting = false,
				fixing = false;
			offsetTop = offsetTop || 0;
			$win.scroll(function(){
				var offset = fixedTable.offset(),
					tableHeight = fixedTbody.height(),
					top = offset.top - offsetTop,
					left = offset.left,
					scrollTop = $win.scrollTop(),
					scrollLeft = $win.scrollLeft();
				if (top < scrollTop && (top + tableHeight) > scrollTop) {
					if (! fixing) {
						fixing = true;
						var height = fixedThead.height(),
							width = fixedTbody.width();
						fixedTable.css({
							paddingTop: height
						});
						fixedThead.css({
							position: "fixed",
							top: offsetTop,
							left: "auto",
							width: width
						});
					}
				} else {
					if (fixing) {
						fixing = false;
						fixedThead.css({
							position: "static",
							top: "auto",
							left: "auto",
							width: "auto"
						});
						fixedTable.css({
							paddingTop: 0
						});
					}
				}
				if (fixing) {
					if (scrollLeft > 0) {
						shifting = true;
						fixedThead.css({
							left: left - scrollLeft
						});
					} else if (shifting) {
						shifting = false;
						fixedThead.css({
							left: "auto"
						});
					}
				}
				// console.log("scrolling");
			});
			$win.resize(function(){
				if (fixing) {
					fixedThead.css({
						width: fixedTbody.width()
					});
				}
				// console.log("resizeing");
			});
		};
	})();

	// 静态表格排序
	// utils.tableSorter(table)
	// utils.tableSorter(thead, tbody)
	utils.tableSorter = function(thead, tbody){
		if (arguments.length > 1) {
			thead = $(thead);
			tbody = $(tbody);
		} else {
			tbody = $(thead);
			thead = tbody.find("> thead");
			tbody = tbody.find("> tbody");
		}
		var ths = thead.find("> tr > th"),
			trs = tbody.find("> tr");
		ths.each(function(i){
			var th = ths.eq(i),
				sort = th.data("sort"),
				asc = sort === "asc",
				by = th.data("by") || "number",
				key = th.data("key");
			if (! sort) {
				return;
			}
			var caret = $('<span class="caret"></span>');
			if (! th.html()) {
				caret.css("margin-left", 0);
			}
			th.addClass("sort-container");
			th.append(caret);
			if (asc) {
				caret.addClass("caret-up");
			}
			var list = [];
			trs.each(function(j){
				var tr = trs.eq(j),
					td = tr.find("td").eq(i),
					value = key ? ("" + td.data(key)) : td.text();
				if (by === "number") {
					value = + value.replace(/[,%]/g, "");
				}
				list.push({
					elem: tr,
					value: value
				});
			});
			th.on("click.utils.sorter", function(){
				var on = th.hasClass("sort-container-on"),
					up = caret.hasClass("caret-up");
				asc = !! (on ^ up);
				caret.toggleClass("caret-up", asc);
				if (! on) {
					ths.removeClass("sort-container-on");
					th.addClass("sort-container-on");
				}
				var sign = asc ? 1 : -1;
				list.sort(function(a, b){
					a = a.value;
					b = b.value;
					return sign * (a > b ? 1 : (a < b ? -1 : 0));
				});
				_.each(list, function(item){
					tbody.append(item.elem);
				});
			});
		});
		return {
			destroy: function(){
				ths.each(function(i){
					var th = ths.eq(i);
					th.find("> span.caret").remove();
					th.off("click.utils.sorter");
					th.removeClass("sort-container sort-container-on");
				});
			}
		};
	};

	utils.isIp = function(ip) {
		return (/^\d{1,3}(\.\d{1,3}){3}$/).test(ip);
	};
	utils.matchIps = function(str) {
		return str.match(/\b\d{1,3}(\.\d{1,3}){3}\b/g);
	};
	utils.matchIpParts = function(str) {
		return str.match(/\b\d{1,3}(\.\d{1,3}){0,3}\b/g);
	};
	/*utils.matchIps = function(str) {
		var reg = /\d{1,3}(?:\.\d{1,3}){3}/g,
			match = null,
			ips = [];
		while (match = reg.exec(str)) {
			var prev = str.charAt(match.index - 1),
				next = str.charAt(reg.lastIndex);
			if (! ((prev && /[\d\.]/.test(prev)) || (next && /[\d\.]/.test(next)))) {
				ips.push(match[0]);
			}
		}
		return ips.length > 0 ? ips : null;
	};*/
	utils.strtotime = function(str){
		return + new Date(_.isString(str) ? str.replace(/-/g, "/") : str);
	};

	// 分页
	utils.pagination = (function(){
		var defaults = {
			current: 1,
			pages: 1,
			displays: 9,
			edges: 1,
			large: false,
			url: "#page={page}",
			action: null,
			input: false
		};
		function range(current, pages, displays, edges) {
			var m = Math.floor((displays - 1) / 2),
				n = displays - m - 1,
				left = current - m,
				right = current + n,
				list, i;
			if (left <= 1) {
				right += 1 - left;
			}
			if (right >= pages) {
				left -= right - pages;
			}
			list = _.range(Math.max(1, left), Math.min(pages, right) + 1);
			if (left > 1) {
				for (i = 0; i < edges; ++ i) {
					list[i] = i + 1;
				}
				list[i] = null;
			}
			if (right < pages) {
				for (i = 0; i < edges; ++ i) {
					list[list.length - 1 - i] = pages - i;
				}
				list[list.length - 1 - i] = null;
			}
			return list;
		}
		return function(options) {
			options = _.defaults(options, defaults);
			var current = + options.current,
				pages = + options.pages,
				url = options.url,
				list = range(current, pages, + options.displays, + options.edges),
				html = [];
			html.push('<ul class="pagination' + (options.large ? '' : ' pagination-sm') + '">');
			if (current <= 1) {
				html.push('<li class="disabled"><a class="prev" title="上一页">&laquo;</a></li>');
			} else {
				html.push('<li><a href="' + url.replace(/\{page\}/g, current - 1) + '" data-page="' + (current - 1) + '" class="prev" title="上一页">&laquo;</a></li>');
			}
			_.each(list, function(item){
				if (item === null) {
					html.push('<li><span class="ellipsis">&hellip;</span></li>');
				} else if (item === current) {
					html.push('<li class="active"><a>'+item+'</a></li>');
				} else {
					html.push('<li><a href="'+url.replace(/\{page\}/g, item)+'" data-page="' + item + '">'+item+'</a></li>');
				}
			});
			if (current >= pages) {
				html.push('<li class="disabled"><a class="next" title="下一页">&raquo;</a></li>');
			} else {
				html.push('<li><a href="' + url.replace(/\{page\}/g, current + 1) + '" data-page="' + (current + 1) + '" class="next" title="下一页">&raquo;</a></li>');
			}
			html.push('</ul>');
			var elem = $(options.selector).html(html.join("")),
				inputElem;
			if (options.input) {
				elem.find("ul").addClass("pull-left");
				elem.append('<div class="input-group pull-left" style="margin-left:10px;width:98px;"><input type="text" class="form-control" /><span class="input-group-btn"><button class="btn btn-default" type="button">Go</button></span>');
				inputElem = elem.find("input").keypress(function(e){
					if (e.keyCode === 13) {
						inputGoTo();
					}
				}).val(current);
				elem.find("button").click(inputGoTo);
			}
			if (options.action) {
				elem.find("[data-page]").click(function(e){
					e.preventDefault();
					goTo(+ $(this).data("page"));
				});
			}
			function inputGoTo() {
				goTo(Math.min(+ inputElem.val() || 1, options.pages));
			}
			function goTo(page) {
				if (options.action) {
					options.current = page;
					// utils.pagination(options);
					options.action(options.current);
				} else {
					window.location.href = options.url.replace(/\{page\}/g, page);
				}
			}
		};
	})();

	// utils.localStorage
	// utils.sessionStorage
	_.each(["localStorage", "sessionStorage"], function(item){
		var storage = window[item];
		utils[item] = {
			setItem: function(key, value) {
				return storage.setItem(key, JSON.stringify(value));
			},
			getItem: function(key) {
				var string = storage.getItem(key);
				if (typeof string !== "string" || string === "") {
					return null;
				}
				return JSON.parse(string);
			},
			removeItem: function(key) {
				return storage.removeItem(key);
			},
			clear: function() {
				return storage.clear();
			}
		};
	});


	// 针对 ie 6/7 提示
	(function(){
		var ie = navigator.userAgent.match(/msie ([\d\.]+)/i),
			version = ie && + ie[1],
			mode = document.documentMode;
		utils.IE = !! ie;
		utils.IE67  = ie && (version < 8 || (mode && mode < 8));
		utils.IE678 = ie && (version < 9 || (mode && mode < 9));
		utils.browserAlertTpl = $.trim($("#tpl-alert-browser").html());
		if (utils.IE67) {
			$("div.head").prepend($(utils.browserAlertTpl).css({
				margin: "0",
				padding: "15px"
			}));
		}
	})();

	// 引入js
	utils.require = function(url, complete, error){
		var head = document.getElementsByTagName("head")[0],
			script = document.createElement("script"),
			timeout = 3e4,
			tHandle;
		script.type = "text/javascript";
		script.charset = "utf-8";
		script.src = url;
		if ("onload" in script) {
			script.onload = function() {
				try {
					clearTimeout(tHandle);
					script.onload = null;
					head.removeChild(script);
				} catch(e) {}
				if (complete) {
					complete();
				}
			};
		} else if ("onreadystatechange" in script) {
			script.onreadystatechange = function() {
				if (/loaded|complete/i.test(script.readyState)) {
					try {
						clearTimeout(tHandle);
						script.onreadystatechange = null;
						head.removeChild(script);
					} catch(e) {}
					if (complete) {
						complete();
					}
				}
			};
		} else {
			throw "listen events on script failed";
		}
		if (timeout) {
			// load js timeout
			tHandle = setTimeout(function(){
				try {
					head.removeChild(script);
				} catch (e) {}
				error("timeout");
			}, timeout);
		}
		head.appendChild(script);
	};

	/* global ZeroClipboard */
	// 剪贴板
	utils.clipboard = (function(){
		var Clipboard;
		if (window.clipboardData) {
			// IE 使用原生剪贴板
			Clipboard = function(elem) {
				this.elem = elem;
			};
			Clipboard.prototype.copy = function(text) {
				if (window.clipboardData.setData("text", text)) {
					this.elem.trigger("complete.clipboard", [text]);
				} else {
					this.elem.trigger("error.clipboard", [text]);
				}
			};
		} else {
			// 否则使用 ZeroClipboard.js
			var inited, required, listened, list = [];
			Clipboard = function(elem) {
				this.elem = elem;
				list.push(this);
				if (! inited) {
					if (! required) {
						required = true;
						utils.require("./js/ZeroClipboard.js", function(){
							inited = true;
							_.each(list, init);
						});
					}
				} else {
					init(this);
				}
			};
			Clipboard.prototype.copy = function(text) {
				this.clip.setText(text);
			};
			var init = function(item){
				item.clip = new ZeroClipboard(item.elem);
				if (! listened) {
					listened = true;
					var map = {
						dataRequested: "click",
						mouseover: "mouseenter",
						mouseout: "mouseleave",
						complete: "complete.clipboard"
					};
					_.each(map, function(dst, src){
						item.clip.on(src, function(client, args){
							var that = this;
							_.some(list, function(item){
								var isThat = item.elem[0] === that;
								if (isThat) {
									item.elem.triggerHandler(dst, [args.text]);
								}
								return isThat;
							});
						});
					});
				}
			};
		}
		return function(elem){
			return new Clipboard(elem);
		};
	})();

	// 剪贴板 2.x
	utils.clipboard2 = (function(){
		var Clipboard;
		if (window.clipboardData) {
			// IE 使用原生剪贴板
			Clipboard = function(elem) {
				this.elem = elem;
				var self = this;
				elem.on("click", function(){
					var btn = $(this),
						text = btn.attr("data-clipboard-text"),
						target = btn.attr("data-clipboard-target");
					if (! text && target) {
						target = $("#" + target);
						var tagName = target.prop("tagName");
						text = target[tagName === "INPUT" || tagName === "TEXTAREA" ? "val" : "text"]();
					}
					text = text || "";
					if (window.clipboardData.setData("text", text)) {
						return btn.trigger("aftercopy.clipboard", [text]);
					} else {
						return btn.trigger("error.clipboard", [text]);
					}
				});
			};
		} else {
			// 否则使用 ZeroClipboard.js 2.x
			var inited, required, listened, list = [];
			Clipboard = function(elem) {
				this.elem = elem;
				list.push(this);
				if (! inited) {
					if (! required) {
						required = true;
						utils.require("./js/ZeroClipboard.min.js", function(){
							inited = true;
							ZeroClipboard.config({swfPath: "./js/ZeroClipboard.swf"});
							_.each(list, init);
						});
					}
				} else {
					init(this);
				}
			};
			var init = function(item) {
				var clip = new ZeroClipboard(item.elem);
				clip.on("ready", function(){
					clip.on("aftercopy", function(event){
						$(event.target).trigger("aftercopy.clipboard", [event.data["text/plain"]]);
					});
				});
				clip.on("error", function(event){
					console.log( 'ZeroClipboard error of type "' + event.name + '": ' + event.message );
					ZeroClipboard.destroy();
				});
			};
		}
		return function(elem){
			return new Clipboard(elem);
		};
	})();

	// loading层
	utils.loader = (function(){
		function LoaderList(target) {
			var list = [];
			$(target).each(function(){
				list.push(new Loader($(this)));
			});
			this.list = list;
		}
		LoaderList.prototype.close = function(){
			_.each(this.list, function(loader){
				loader.close();
			});
		};
		function Loader(target) {
			var elem = $('<div class="utils-loader"><div class="utils-loader-mask"></div><div class="utils-loader-body"><img src="./images/ajax-loader.gif" width="32" height="32"></div></div>');
			if (! /^(absolute|fixed|relative)$/i.test(target.css("position"))) {
				target.css("position", "relative");
			}
			target.append(elem);
			this.elem = elem;
			this.target = target;
			target.one("close.loader", $.proxy(this.close, this));
		}
		Loader.prototype.close = function(){
			this.elem.remove();
			this.target.off("close.loader");
			this.elem = null;
			this.target = null;
		};
		return function(target) {
			return new LoaderList($(target));
		};
	})();

	// 页面search跳转
	// utils.location.search(args [, clears])
	// utils.location.search(key, value [, clears])
	// 替换指定地址的search字段
	// utils.location.replaceSearch(href, args [, clears])
	// utils.location.replaceSearch(href, key, value [, clears])
	utils.location = (function(){
		var location = window.location,
			parseRegExp = /^([^\?#]*)((?:\?[^#]*)?)((?:#.*)?)$/;
		function replaceSearch(search, key, value, clears) {
			var args;
			search = search.substr(1);
			if (typeof key === "string") {
				args = {};
				args[key] = value;
			} else {
				args = key;
				clears = value;
			}
			clears = [].concat(clears || []).concat(_.keys(args));
			_.each(clears, function(key){
				// search = search.replace(new RegExp("(^|&)" + key + "=[^&]*", "g"), "");
				search = search.replace(new RegExp("^" + key + "=[^&]*&?|&" + key + "=[^&]*", "g"), "");
			});
			var query = _.map(args, function(v, k){
				return k + "=" + encodeURIComponent(v);
			});
			if (search) {
				query.unshift(search);
			}
			return "?" + query.join("&");
		}
		return {
			search: function(key, value, clears){
				location.href = replaceSearch(location.search, key, value, clears);
			},
			replaceSearch: function(href, key, value, clears){
				var parsed = href.match(parseRegExp);
				parsed.shift();
				parsed[1] = replaceSearch(parsed[1], key, value, clears);
				return parsed.join("");
			},
			parseSearch: function(href){
				var parsed = href.match(parseRegExp),
					query = {};
				_.each(parsed[2].substr(1).split("&"), function(item){
					if (item.length > 0) {
						var temp = item.split("=");
						query[temp[0]] = decodeURIComponent(temp[1] || "");
					}
				});
				return query;
			}
		};
	})();

	// 输入框提示层
	utils.formPopover = function(inputElem, eventIn, eventOut){
		var popoverElem = inputElem.siblings(".form-popover"),
			positioned = false;
		eventIn = eventIn || "focus";
		eventOut = eventOut || "blur";
		inputElem.on(eventIn, function(){
			popoverElem.addClass("active");
			if (! positioned) {
				popoverElem.css("top",  (inputElem.outerHeight() - popoverElem.outerHeight()) / 2);
				positioned = true;
			}
		}).on(eventOut, function(){
			popoverElem.removeClass("active");
		});
	};

	// 左右晃动一个元素
	utils.shake = function(elem){
		elem.addClass("self-shaking");
		setTimeout(function(){
			elem.removeClass("self-shaking");
		}, 300);
	};

	// btn dropdown 模拟 <select>
	utils.btnSelect = function(selector){
		var elem = $(selector),
			text = elem.find(".text"),
			options = elem.find("a"),
			lis = options.parent(),
			value;
		options.click(function(e, noTrigger){
			var option = $(this),
				li = option.parent();
			value = "" + option.data("value");
			if (! li.hasClass("active")) {
				lis.removeClass("active");
				li.addClass("active");
				text.text(option.text());
				if (! noTrigger) {
					elem.triggerHandler("groupchange");
				}
			}
		});
		var temp = elem.find("li.active > a");
		if (temp.length === 0) {
			temp = options.eq(0);
			temp.parent().addClass("active");
		}
		value = "" + temp.data("value");
		return {
			change: function(fn){
				if (fn === undefined) {
					elem.triggerHandler("groupchange");
				} else {
					elem.on("groupchange", fn);
				}
			},
			val: function(val, noTrigger){
				if (val === undefined) {
					return value;
				}
				val = "" + val;
				options.each(function(){
					var option = $(this);
					if (val === "" + option.data("value")) {
						option.triggerHandler("click", [noTrigger]);
					}
				});
				return this;
			}
		};
	};

	// btn group 模拟 <input type="radio">
	utils.btnRadioGroup = function(selector){
		var group = $(selector),
			btns = group.find(".btn"),
			radios = group.find("input");
		radios.change(function(){
			if (! this.checked) {
				return;
			}
			btns.removeClass("btn-primary").addClass("btn-default");
			$(this).closest(".btn").removeClass("btn-default").addClass("btn-primary");
			group.triggerHandler("groupchange");
		});
		return {
			change: function(fn){
				if (fn === undefined) {
					group.triggerHandler("groupchange");
				} else {
					group.on("groupchange", fn);
				}
			},
			val: function(value){
				if (value === undefined) {
					radios.each(function(){
						if (this.checked) {
							value = this.value;
						}
					});
					return value;
				}
				value = "" + value;
				radios.each(function(){
					if (this.value === value && ! this.checked) {
						this.checked = true;
						$(this).closest(".btn").button("toggle");
					}
				});
				return this;
			}
		};
	};

	// 将数字转换为逗号分隔的千分位格式
	utils.numberFormat = function(x){
		return (+x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	// 浏览器是否支持某个特性
	utils.has = function(name){
		switch (name) {
			case "notify":
				return "Notification" in window;
		}
		return null;
	};

	// 页面可见性
	var _hidden;
	function onvisible() {
		_hidden = false;
	}
	function onhidden() {
		_hidden = true;
	}
	if (utils.has("notify")) {
		// http://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
		// IE 9 and lower:
		if ("onfocusin" in document) {
			document.onfocusin = onvisible;
			document.onfocusout = onhidden;
		} else {
			window.onpageshow = window.onfocus = onvisible;
			window.onpagehide = window.onblur = onhidden;
		}
	}
	utils.hidden = (function(){
		var hidden = _.find(["hidden", "webkitHidden", "mozHidden", "msHidden"], function(name){
			return name in document;
		});
		return function(onlyTab){
			return (! onlyTab && _hidden) || (hidden ? document[hidden] : null);
		};
	})();

	// 发送桌面通知
	utils.notify = ! utils.has("notify") ? function(){}
	: function(title, options, always){
		/* global Notification */
		if (Notification.permission === "granted" && (always || utils.hidden())) {
			return new Notification(title, options);
		}
	};

	// @see https://github.com/weareoutman/php_date
	// 相当于php的 date()
	// utls.date(string format, [Date date|integer timestamp|string date]);
	utils.date = function(){function a(a){return(10>a?"0":"")+a}function b(h,i){i instanceof Date||(i=void 0===i?new Date:new Date(typeof i==="string"?i.replace(/-/g,"/"):i));var j,k,l=i.getFullYear(),m=i.getMonth(),n=i.getDay(),o=i.getDate(),p=i.getHours(),q=i.getMinutes(),r=i.getSeconds(),s=(i.getMilliseconds(),-i.getTimezoneOffset()),t=0>s?"-":"+",u=Math.floor(Math.abs(s)/60),v=Math.abs(s)%60,w=p%12,x=!1,y=[];for(0==w&&(w=12),k=0;k<h.length;++k)if(j=h.charAt(k),x)y.pop(),y.push(j),x=!1;else switch(j){case"d":y.push(a(o));break;case"D":y.push(c[n]);break;case"j":y.push(o);break;case"l":y.push(d[n]);break;case"N":y.push(0==n?7:n);break;case"S":y.push(g[o%10>3?3:o%10-1]);break;case"w":y.push(n);break;case"F":y.push(e[m]);break;case"m":y.push(a(m+1));break;case"M":y.push(f[m]);break;case"n":y.push(m+1);break;case"Y":y.push(l);break;case"y":y.push(a(l%100));break;case"a":y.push(12>p?"am":"pm");break;case"A":y.push(12>p?"AM":"PM");break;case"g":y.push(w);break;case"G":y.push(p);break;case"h":y.push(a(w));break;case"H":y.push(a(p));break;case"i":y.push(a(q));break;case"s":y.push(a(r));break;case"O":y.push(t+a(u)+a(v));break;case"P":y.push(t+a(u)+":"+a(v));break;case"Z":y.push(60*s);break;case"c":y.push(b("Y-m-d\\TH:i:sP",i));break;case"r":y.push(b("D, d M Y H:i:s O",i));break;case"U":y.push(Math.floor(i.getTime()/1e3));break;case"\\":x=!0,y.push(j);break;default:y.push(j)}return y.join("")}var c=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],d=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],e=["January","February","March","April","May","June","July","August","September","October","November","December"],f=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],g=["st","nd","rd","th"];return b}();

	// 公告
	var NoticeRead = "NoticeRead";
	if (! utils.sessionStorage.getItem(NoticeRead)) {
		$(function(){
			$.ajax({
				url: "/index.php/notice/get",
				dataType: "json"
			}).done(function(d){
				if (d && + d.enabled === 1 && d.currentTime >= d.startTime && d.currentTime <= d.endTime &&
					(! d.regexp || new RegExp(d.regexp).test(location.pathname))
				) {
					var div = $('<div class="alert alert-' + (d.type || 'danger') + '" style="font-size:14px;font-family:\'Microsoft Yahei\';margin:20px;"><button type="button" class="close" data-dismiss="alert" title="不再显示">&times;</button><p></p></div>')
							.insertBefore('.MainContainer');
					div.find("p").text(d.content);
					div.on("close.bs.alert", function(){
						utils.sessionStorage.setItem(NoticeRead, 1);
					});
				}
			});
		});
	}
})(window);
