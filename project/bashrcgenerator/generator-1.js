var generator={
	idCount:0,
	idPreset:0,
	paletteDisplayed:false,
	overElement:false,
	colorCodes:[
		[37, '#FFF'],
		[31, '#F00'],
		[32, '#0F0'],
		[33, '#FF0'],
		[34, '#00F'],
		[35, '#F0F'],
		[36, '#0FF'],
		[30, '#000']
	],
	defaultColorCode:37,
	codes:[
		['hostnameShort', 'hostname (short)', 'tiankonguse', '\\h'],
		['hostnameFull', 'hostname (full)', 'github.tiankonguse.com', '\\H'],
		['username', 'username', 'tiankonguse', '\\u'],
		['shellName', 'shell name', 'bash', '\\v'],
		['terminal', 'terminal', 'ttys02', '\\l'],
		['currentDirectory', 'directory', '/home/tiankonguse', '\\w'],
		['currentDirectoryBase', 'directory (basename)', 'src', '\\W'],
		['timeShort', 'time-short (HH:MM)', '14:23', '\\A'],
		['timeLong', 'time with seconds (HH:MM:SS)', '14:23:52', '\\t'],
		['timeAMPM', 'time (HH:MM)', '07:23 AM', '\\@'],
		['timeAMPMs', 'time with seconds 12 hours (HH:MM:SS)', '02:23:52', '\\T'],
		['timeDate', 'date (Day Month Date)', 'Mon Feb 22', '\\d'],
		['exitStatus', 'exit status', '0', '\\$?'],
		['charGreaterThan', '>', '>', '>'],
		['charAt', '@', '@', '@'],
		['charColon', ':', ':', ':'],
		['charComma', ',', ',', ','],
		['charPeriod', '.', '.', '.'],
		['charQuestion', '?', '?', '?'],
		['charExclamation', '!', '!', '!'],
		['charBackslash', '\\', '\\', '\\\\'],
		['charLeftBrace', '{', '{', '{'],
		['charRightBrace', '}', '}', '}'],
		['charLeftBracket', '[', '[', '['],
		['charRightBracket', ']', ']', ']'],
		['charCaret', '^', '^', '^'],
		['charStar', '*', '*', '*'],
		['charDash', '-', '-', '-'],
		['charUnderscore', '_', '_', '_'],
		['charSpace', 'space', ' ', ' '],
		['charNewLine', 'new line', '\n', '\\n'],
		['charDollar', '#/$', '$', '\\\\$']
	],

	dragRender:function(event, ui) {
		generator.renderSelection();
	},

	dragOut:function(event, ui) {
		// console.log('out');
		// console.log(ui.item);
	},

	dragFill:function() {
		for(i in generator.codes) {
			$('#source').append(generator.createDragElement('source-' + generator.codes[i][0], generator.codes[i][0], generator.codes[i][1], generator.codes[i][2]));
		}
	},

	fillPalette:function() {
		var elColors=$('#palette .colors');
		var explainEl=$('<div></div>').addClass('_cf').html('Choose a color:');
		elColors.append(explainEl);
		for(var i in generator.colorCodes) {
			var colorEl=$('<div></div>')
				.attr('data-color', generator.colorCodes[i][0])
				.addClass('color')
				.css('backgroundColor', generator.colorCodes[i][1])
				.on('click', function(event) {
					$(generator.overElement).css('color', generator.convertColorToHtml($(event.target).attr('data-color')));
					$(generator.overElement).attr('data-color', $(event.target).attr('data-color'));
					generator.renderSelection();
			});
			elColors.append(colorEl);
		}
		var breakEl=$('<div></div>').addClass('_cf');
		elColors.append(breakEl);
		
		var elBoldness=$('#palette .boldness');
		var boldEl1=$('<input type="checkbox">')
			.attr('id', 'paletteBold')
			.attr('value', 1)
			.bind('click', function(event) {
				generator.toggleBoldElement();
				generator.renderSelection();
			});
		var boldEl2=$('<label></label>')
			.html('bold')
			.attr('for', 'paletteBold')
			.bind('click', function(event) {
				generator.toggleBoldElement();
				generator.renderSelection();
			});
		elBoldness.append(boldEl1, boldEl2);
	},

	toggleBoldElement:function() {
		if($('#paletteBold').attr('checked')=='checked' || $('#paletteBold')[0].checked) {
			$(generator.overElement).css('font-weight', 'bold');
			$(generator.overElement).attr('data-bold', '1');
		}
		else {
			$(generator.overElement).css('font-weight', 'normal');
			$(generator.overElement).attr('data-bold', '0');
		}
	},

	createDragElement:function(id, name, definition, exampleText, color) {
		var el=$('<li></li>')
			.attr('id', 'src-' + id)
			.attr('name', name)
			.attr('title', exampleText)
			.attr('data-color', (color==undefined?generator.defaultColorCode:color))
			.css('color', generator.convertColorToHtml(color==undefined?generator.defaultColorCode:color))
			.attr('data-bold', '0')
			.html(definition)
			.addClass('item');
		return el;
	},

	convertColorToHtml:function(colorCode) {
		for(var i in generator.colorCodes) {
			if(generator.colorCodes[i][0]==colorCode) {
				return generator.colorCodes[i][1];
			}
		}
	},

	initEvents:function() {
		$("#wishlist").sortable({
			cursor: "move",
			placeholder: 'placeholder',
			forcePlaceholderSize: true,
			revert: true,
			beforeStop: function(e, ui) {
				generator.dragRender(e, ui);
				if (sortableIn == 0) {
		            ui.item.remove();
		        }
			},
			receive: function(event, ui) {
		        sortableIn = 1;
		    },
		    over: function(e, ui) { sortableIn = 1; },
		    out: function(e, ui) { sortableIn = 0; }
		}).disableSelection();

		$("#source .item").draggable({
			connectToSortable: "#wishlist",
			forcePlaceholderSize: true,
			helper: "clone",
	        revert: "invalid",
	        opacity: 0.7,
	        out: generator.dragRender
		}).disableSelection();


		//$('#source li.item').tipsy({fade: true, gravity: 'nw'});

		$("#wishlist").on('mouseenter', 'li.item', function(event){
		    clearTimeout(generator.paletteIsDisplayed);
		    pos=$(this).offset();
		    if(parseInt($(this).attr('data-bold'))==0) {
		    	$('#paletteBold').attr('checked', false);
		    }
		    else {
		    	$('#paletteBold').attr('checked', 'checked');
		    }
			$('#palette')
				.css('left', pos.left - $('#palette').width()/2 + $(this).width()/2)
				.css('top', pos.top+40)
				.show();
		    generator.overElement=this;
		}).on('mouseleave', 'li.item', function(){
		    generator.paletteIsDisplayed = setTimeout(function(){
		        $('#palette').fadeOut("fast");
		        generator.overElement=false;
		    }, 500);
		    $('#palette')
		    	.on('mouseenter', function(event) {
		    		clearTimeout(generator.paletteIsDisplayed);
		    	})
		    	.on('mouseleave', function(event) {
			    	$('#palette').fadeOut("fast");
			    	generator.overElement=false;
			    });
		});

		$('#removeEverythingBtn').on('click', function(event) {
			if(confirm('seriously ?')) {
				generator.emptyWishlist();
				generator.renderSelection();
			}
		});


	},

	init:function() {

		generator.dragFill();

		generator.addPreset(['username', 'charAt', 'hostnameShort', 'charColon', 'currentDirectory', 'charDollar', 'charSpace'], 'user at computer : path $');
		generator.addPreset(['username,33', 'charAt', 'hostnameShort', 'charColon', 'charLeftBracket,36', 'currentDirectory,36', 'charRightBracket,36', 'charColon,36', 'charSpace'], 'user at computer [ path ] , more readable');

		generator.fillPalette();
		generator.initEvents();

	},

	getCodePartsFromName:function(name) {
		for(var i in generator.codes) {
			if(generator.codes[i][0]==name) {
				return([generator.codes[i][0], generator.codes[i][1], generator.codes[i][2], generator.codes[i][3]]);
			}
		}
		return false;
	},

	emptyWishlist:function() {
		$('#wishlist').html('');
	},

	setSelectionFromPreset:function(codesString, presetId) {
		generator.emptyWishlist();
		codes=codesString.split('§');
		var parts;
		for(var i in codes) {
			if(codes[i].indexOf(',')>0) {
				var arrCodes=codes[i].split(',');
				code=arrCodes[0];
				color=arrCodes[1];
			}
			else {
				code=codes[i];
				color=generator.defaultColor;
			}
			if(parts=generator.getCodePartsFromName(code)) {
				$('#wishlist').append(generator.createDragElement('preset-' + presetId + '-' + parts[0], parts[0], parts[1], parts[2], color));
			}
		}
		generator.renderSelection();
	},

	renderSelection:function() {
		var htmlPreview='';
		var htmlOutput='';
		var whichColor=generator.defaultColorCode;
		var whichBold=null;
		var parts;
		$('#wishlist li').each(function(idx) {
		    
			if(parts=generator.getCodePartsFromName($(this).attr('name'))) {
				htmlPreview+='<span style="color:' + generator.convertColorToHtml($(this).attr('data-color')) + '; ';
				if(parseInt($(this).attr('data-bold'))==1) {
					htmlPreview+=' font-weight:bold;';
				}
				htmlPreview+='">' + parts[2] + '</span>';

				if($(this).attr('data-color')!=whichColor || parseInt($(this).attr('data-bold'))!=whichBold) {
					if(whichBold!=null) {
						htmlOutput+='\\[\\e[0m\\]';
					}
					htmlOutput+='\\[\\e[0' + parseInt($(this).attr('data-bold')) + ';' + $(this).attr('data-color') + 'm\\]' + parts[3]; // + ';' +
				}
				else {
					htmlOutput+=parts[3];
				}
				whichColor=$(this).attr('data-color');
				whichBold=parseInt($(this).attr('data-bold'));
			}
		});
		if(whichColor) {
			// close the color mode
			htmlOutput+='\\[\\e[0m\\]';
		}
		$('#preview').html(htmlPreview);
		$('#output').html('export PS1="' + htmlOutput + '"');
	},

	createPresetElement:function(id, codes, legend) {
		generator.idPreset++;
		var el=$('<li></li>').attr('id', id).attr('data-code', codes.join('§')).on('click', function(evt) { generator.setSelectionFromPreset($(evt.target).parent().parent().attr('data-code'), $(evt.target).parent().attr('id')); });
		var html='<strong>';
		for(var i in codes) {
			if(codes[i].indexOf(',')>0) {
				var arrCodes=codes[i].split(',');
				code=arrCodes[0];
				color=arrCodes[1];
			}
			else {
				code=codes[i];
				color=generator.defaultColor;
			}
			if(parts=generator.getCodePartsFromName(code)) {
				html+='<span style="color:' + generator.convertColorToHtml(color) + '">' + parts[2] + '</span>';
			}
		}
		html+='</strong> ' + legend;
		el.html(html);
		return el;
	},

	addPreset:function(codes, legend) {
		generator.idPreset++;
		$('#presets').append(generator.createPresetElement(generator.idPreset, codes, legend));
	}
}

$(document).ready(function() {
	generator.init();
});
