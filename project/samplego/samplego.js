

tk.AddMethod(TK,{
    Canvas : function (base){
        this.base = 1;
        if(base){
            this.base = base;
        }
    }
});

tk.Composition(TK.Canvas, {
    "getCanvas": function(dom){
        return dom[0].getContext('2d');
    },
    "fillRect" : function (dom, style, start, end){
        dom.fillStyle = style;
	    dom.fillRect(start.x * this.base, start.y * this.base, end.x * this.base, end.y * this.base);
    },
    "line": function(dom, start, end){
	    dom.beginPath();
	    dom.moveTo(start.x * this.base,   start.y * this.base);
	    dom.lineTo(  end.x * this.base,     end.y * this.base);
	    dom.stroke();
    },
    "arc": function(dom, style, point, R){
        dom.beginPath();
		dom.arc(point.x * this.base, point.y * this.base ,R, 0, 2*Math.PI, false);
		dom.fillStyle=style;
		dom.fill();
    },
    "piece": function(dom, point, backgroud, color){
        var rg = dom.createRadialGradient(point.x*this.base-3, point.y*this.base-3, 1, point.x*this.base-4, point.y*this.base-4, 11);
	    rg.addColorStop(1, backgroud);
	    rg.addColorStop(0, color);
	    return rg;
    },
    "drawImage":  function(){
        
    }
});


tk.Composition(TK, {
    "makePoint" : function(x, y){
        return {
            x: x,
            y: y
        };
    }
});

tk.AddMethod(TK,{
    SampleGo : function SampleGo(){
        this.board = [];
        this.boardOneSize = 20;
        this.boardhalfSize = this.boardOneSize/2;
        this.boardLev = 19;
        this.boardFrame = this.boardLev + 2;
        this.boardDot = [4, 10, 16];
        this.boardMap = [];
        this.boardColor = ["", "gray", "white"];
        this.boardColor2 = ["", "#202020", "#e0e0e0"];
        this.boardNext = [0, 2, 1];
        this.black = 1;
        this.white = 2;
        this.playColor = this.black;
        this.moveStep = 0;
    }
});

/*

    init: {
        boardWidth : 500,
        boardHeight : 500,
        boardDom : $("#weiqi-board")
    }
*/
tk.Composition(TK.SampleGo, {
    "init" : function init(option){
        tk.AddMethod(this, option);
        this.canvas = new TK.Canvas(this.boardOneSize);
        this.initAttr();
        this.initBoard();
        this.initPiece();
    },
    "initAttr": function(){
        this.boardMap = [];
        this.boardFrame = this.boardLev + 2;
        
        this.boardMap.push([]);
        for(var j = 0; j < this.boardFrame; j++){
            this.boardMap[0].push(3);
        }
        for(var i = 1; i <= this.boardLev; i++){
            this.boardMap.push([]);
            this.boardMap[i].push(3);
            for(var j = 1; j <= this.boardLev; j++){
                this.boardMap[i].push(0);
            }
            this.boardMap[i].push(3);
        }        
        this.boardMap.push([]);
        for(var j = 0; j < this.boardFrame; j++){
            this.boardMap[this.boardLev+1].push(3);
        }
    
        this.boardWidth = this.boardHeight = this.boardOneSize * (this.boardLev + 1);
        
        this.minLev = 1;
        this.maxLev = this.boardLev;
        
        this.boardDom.attr({
            "width" : this.boardWidth,
            "height": this.boardHeight
        });
        this.pieceDom.attr({
            "width" : this.boardWidth,
            "height": this.boardHeight
        });
    },
    "drawEmptyBoard": function(){
	    this.canvas.fillRect(this.boardCxt, "sandybrown", tk.makePoint(0, 0), tk.makePoint(this.boardLev + 1, this.boardLev + 1));
	    
        //横线
	    for (var i = 1; i <= this.boardLev; i++) { 
            this.canvas.line(this.boardCxt, tk.makePoint(this.minLev, i), tk.makePoint(this.maxLev, i));
	    }
	    
	    //竖线
	    for (var i = 1; i <= this.boardLev; i++) {
            this.canvas.line(this.boardCxt, tk.makePoint(i, this.minLev), tk.makePoint(i, this.maxLev));
	    }
	    
	    //九个点
	    for(var i = 0; i < this.boardDot.length; i++){
	        for(var j = 0; j < this.boardDot.length; j++){
	            this.canvas.arc(
	                this.boardCxt, 
	                "black", 
	                tk.makePoint(this.boardDot[i], this.boardDot[j]),
	                3
	            );
	        }
	    }
        
    },
    "drawPiece": function(){
        for(var i = 1; i <= this.boardLev; i++){
            for(var j = 1; j <= this.boardLev; j++){
                if(this.boardMap[i][j] == this.black){
                    this.drawOnePiece(this.boardCxt, tk.makePoint(i, j), this.black);
                }else if(this.boardMap[i][j] == this.white){
                    this.drawOnePiece(this.boardCxt, tk.makePoint(i, j), this.black);
                }else{
                }
            }
        }
    },
    "initBoard" : function(){
        this.boardCxt = this.canvas.getCanvas(this.boardDom);
	    this.drawEmptyBoard();
	    this.drawPiece();
    },
    "getPos": function(x, y){
        var that = this;
        if (x < that.boardOneSize - that.boardhalfSize || x > that.boardWidth - that.boardOneSize + that.boardhalfSize){
            return;
        }
	        
        if (y < that.boardOneSize - that.boardhalfSize || y > that.boardWidth - that.boardOneSize + that.boardhalfSize){
            return;
        }
	        

        var xok = false;
        var yok = false;
        for (var i = 1; i <= that.boardLev; i++) {
	        if (x > i * that.boardOneSize - that.boardhalfSize && x < i * that.boardOneSize + that.boardhalfSize) {
		        x = i;
		        xok = true;
	        }
	        if (y > i * that.boardOneSize - that.boardhalfSize && y < i * that.boardOneSize + that.boardhalfSize) {
		        y = i;
		        yok = true;
	        }
        }
        if (!xok || !yok){
            return;
        }
        return tk.makePoint(x, y);
    },
    "drawOnePiece": function(cxt, point, playColor){
	    var style = this.canvas.piece(cxt, point, this.boardColor2[playColor], this.boardColor[playColor]);
	    this.canvas.arc(cxt, style, point, this.boardhalfSize);
    },
    "play": function(point){
        var that = this;
        if(point.x < 1 || point.x > that.boardLev){
            return;
        }
        if(point.y < 1 || point.y > that.boardLev){
            return;
        }
        
        if(this.boardMap[point.x][point.y]){
            return;
        }
        
        this.boardMap[point.x][point.y] = this.playColor;
        this.drawOnePiece(this.boardCxt, point, this.playColor);
        this.playColor = this.boardNext[this.playColor];
    },
    "initPiece" : function(){
        var that = this;
        this.pieceCxt = this.canvas.getCanvas(this.pieceDom);
        this.pieceDom.bind("mousedown", function(e){
	        var point = that.getPos(e.offsetX, e.offsetY);
	        if (!point){
	            return;
	        }
	        if(that.play(point)){
        	    this.drawEmptyBoard();
	            this.drawPiece();
	        }
        });
        this.pieceDom.bind("mousemove", function(e){
	        var point = that.getPos(e.offsetX, e.offsetY);
	        if (!point){
	            return;
	        }

	        that.pieceCxt.clearRect(0,0,that.boardWidth,that.boardWidth);
	        that.drawOnePiece(that.pieceCxt, point, that.playColor);
        });
        this.pieceDom.bind("mouseout", function(e){
            that.pieceCxt.clearRect(0,0,that.boardWidth,that.boardWidth);
        });
    }
});

/* some global values */
var pan = new Array(
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
);
var shadow = new Array(
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
);
var jie = new Array();
var move_record = new Array();

function showPan() {
	var c = document.getElementById("weiqi-board");
	var cxt = c.getContext("2d");
	cxt.strokeStyle="black";
	
	/* 清空，重新画线等 */
	cxt.clearRect(0,0,600,600);
	cxt.fillStyle = "sandybrown";
	cxt.fillRect(0,0,600,600);
	grid(cxt);
	ninePoints(cxt);

	for (var i = 0; i < 19; i++) {
		for (var j = 0; j < 19; j++) {
			if (pan[i][j] === 1) { //black
				var rg = cxt.createRadialGradient((i+1)*30-3, (j+1)*30-3, 1, (i+1)*30-4, (j+1)*30-4, 11);
				rg.addColorStop(1, "#202020");
				rg.addColorStop(0, "gray");
				
				
				cxt.beginPath();
				cxt.arc((i+1)*30, (j+1)*30,15,0,2*Math.PI,false);
				cxt.fillStyle=rg;
				cxt.fill();
			}
			else if (pan[i][j] === 2) { //white
				var rg = cxt.createRadialGradient((i+1)*30-3, (j+1)*30-3, 1, (i+1)*30-4, (j+1)*30-4, 11);
				rg.addColorStop(1, "#e0e0e0");
				rg.addColorStop(0, "white");
				cxt.beginPath();
				cxt.arc((i+1)*30, (j+1)*30,15,0,2*Math.PI,false);
				cxt.fillStyle=rg;
				cxt.fill();
			}
			else if (pan[i][j] === 7) { // fill color
				cxt.beginPath();
				cxt.arc((i+1)*30, (j+1)*30,15,0,2*Math.PI,false);
				cxt.fillStyle="red";
				cxt.fill();
			}
		}
	}
	// 显示手数
	if (move_show_flag) {
		for (var m = 0; m < move_record.length-1; m++) { // 最新的一手由后面的红色标记
			// 先判断一下棋子还在不在棋盘上
			if (pan[move_record[m][0]][move_record[m][1]] === 0)
				continue;

			// 而且只应该画最新的数字（打劫后，可能导致一个坐标上重复许多步数）
			var repeat_move_flag = false;
			for (var j = m+1; j < move_record.length; j++) {
				if (move_record[m][0] === move_record[j][0] &&
						move_record[m][1] === move_record[j][1]) {
					repeat_move_flag = true;
					break;
				}
			}
			if (repeat_move_flag)
				continue;

			// 这下可以放心绘制手数数字啦
			if (move_record[m][2] % 2 === 1) { //black
				cxt.fillStyle="white";
			} else {
				cxt.fillStyle="black";
			}
			cxt.font="bold 18px sans-serif";
			if (move_record[m][2] > 99) {
				cxt.font="bold 16px sans-serif";
			}
			cxt.font="bold 16px sans-serif";
			cxt.textAlign="center";
			var move_msg = move_record[m][2].toString();
			//cxt.fillText(move_msg, (i+1)*30, (j+1)*30+6);
			cxt.fillText(move_msg, (move_record[m][0]+1)*30, (move_record[m][1]+1)*30+6);
		}
	}
	// 特别显示最新的一手
	if (move_record.length > 0) {
		cxt.fillStyle = "red";
		var newest_move = move_record.length-1;
		cxt.fillRect(
			(move_record[newest_move][0]+1)*30-5, 
			(move_record[newest_move][1]+1)*30-5, 
			10, 10
		);
	}
}

function play(row, col) {
	if (row < 0 || row > 19 || col < 0 || col > 19) {
		alert("index error....");
		return;
	}
	// 处理已有棋子在此
	if (pan[row][col] != 0) {
		alert("此处已有棋子！");
		return;
	}

	var can_down = false; // 是否可落子
	// 得到将落子的棋子的颜色
	var color = 2; // 白
	if (move_count % 2 === 0) { // 未落子前是白
		color = 1; 
	}

	if (!have_air(row, col)) {
		if (have_my_people(row, col)) {
			make_shadow();


			flood_fill(row, col, color);	
			if (fill_block_have_air(row, col, color)) {
				can_down = true;
				var dead_body = new Array();
				can_eat(row, col, color, dead_body);
				clean_dead_body(dead_body);
			} else {
				var dead_body = new Array();
				var cret = can_eat(row, col, color, dead_body);
				clean_dead_body(dead_body);

				if (cret) {
					can_down = true;
				} else {
					alert("无气，不能落子！！");
				}
			}
		} else {
			var dead_body = new Array();
			var cret = can_eat(row, col, color, dead_body);

			// 劫争也应该在此处理，只在此处理？
			if (cret) {
				if (!is_jie(row, col, dead_body)) {
					clean_dead_body(dead_body);
					can_down = true;
				} else {
					alert("劫, 不能落子, 请至少隔一手棋！");
				}	
			}
		}
	} else {
		can_down = true;
		var dead_body = new Array();
		can_eat(row, col, color, dead_body);
		clean_dead_body(dead_body);
	}
	if (can_down) {
		stone_down(row, col);
	}
}

// TODO 劫争处理的本质是防止全局同型，基于此，还是要处理连环劫之类的，再说吧
// 我先看看应氏围棋规则，研究研究
function is_jie(row, col, dead_body) { //是否劫
	//只吃了一个？ 希望我对围棋的理解没错，单劫都是只互吃一个。
	if (dead_body.length === 1) {
		for (var i = 0; i < jie.length; i++) {
			//若符合（有坐标，且move_count就是上一手）
			//注意此处比较的是死去的棋子，下面push的是本次落子的棋子
			if (	jie[i][0] === dead_body[0][0] && 
					jie[i][1] === dead_body[0][1] && 
					jie[i][2] === move_count) {
				return true;
			}
		}
		//加入记录表
		jie.push([row, col, move_count+1]);
		return false;
	}
	return false;
}

/* 能提吃吗？ */
function can_eat(row, col, color, dead_body) { // color 是当前要落子的颜色
	var ret = false;
	var anti_color = 2;
	if (color === 2)
		anti_color = 1;

	if (row+1 <= 19-1 && pan[row+1][col] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		flood_fill(row+1, col, anti_color);
		if (!anti_fill_block_have_air(anti_color)) {
			// 记录下这些7的坐标，以及(row+1,col)，表示可以提吃的对方棋子
			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	if (row-1 >= 0 && pan[row-1][col] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		flood_fill(row-1, col, anti_color);
		if (!anti_fill_block_have_air(anti_color)) {
			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	if (col+1 <= 19-1 && pan[row][col+1] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		flood_fill(row, col+1, anti_color);
		if (!anti_fill_block_have_air(anti_color)) {
			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	if (col-1 >= 0 && pan[row][col-1] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		flood_fill(row, col-1, anti_color);
		if (!anti_fill_block_have_air(anti_color)) {
			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	return ret;
}

function record_dead_body(db) {
	var ret = false;
	for (var row = 0; row < shadow.length; row++) {
		for (var col = 0; col < shadow[row].length; col++) {
			if (shadow[row][col] === 7) {
				db.push([row, col]);
				ret = true; // it's true have dead body
			}
		}
	}
	return ret;
}
function clean_dead_body(db) {
	for (var i = 0; i < db.length; i++) {
		pan[db[i][0]][db[i][1]] = 0;
	}	
}

/* 填充的区域周围是否有空 */
function fill_block_have_air(row, col, color) {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			if (i !== row || j !== col) {
				if (shadow[i][j] === 7 && pan[i][j] !== color) {
					return true; // 此块有空，可下
				}
			}
		}
	}
	//alert("fill block 无气！！！");
	return false;
}
/* 提吃判断专用 */
function anti_fill_block_have_air(color) {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			if (shadow[i][j] === 7 && pan[i][j] !== color) {
				return true; // 活
			}
		}
	}
	//alert("anti fill block 无气！！！");
	return false; //死
}
/* 将盘面做个影分身 */
function make_shadow() {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			shadow[i][j] = pan[i][j];
		}
	}
}
function shadow_to_pan() {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			pan[i][j] = shadow[i][j];
		}
	}
}

/* 泛洪填充，只操作影分身 */
function flood_fill(row, col, color) { // color 为当前要填充的颜色
	if (row < 0 || row > 19-1 || col < 0 || col > 19-1)
		return;

	var anti_color = 2;
	if (color === 2)
		anti_color = 1;

	if (shadow[row][col] !== anti_color && shadow[row][col] !== 7) { // 非color颜色，且未被填充
		shadow[row][col] = 7; // 表示已被填充
		flood_fill(row+1, col, color);
		flood_fill(row-1, col, color);
		flood_fill(row, col+1, color);
		flood_fill(row, col-1, color);
	}
}

/* 坐标周围4交叉点有气否？ */
function have_air(row, col) {
	if (row > 0 && row < 19-1 && col > 0 && row < 19-1) { //非边角 1->17(0->18)
		if (	pan[row+1][col] !== 0 &&
				pan[row-1][col] !== 0 &&
				pan[row][col+1] !== 0 &&
				pan[row][col-1] !== 0 ) {
			//alert("have no air");
			return false;
		} else {
			//alert("have air");
			return true;
		}
	} else if (row === 0 && col > 0 && col < 19-1) { // 边
		if (	pan[row+1][col] !== 0 &&
				pan[row][col+1] !== 0 &&
				pan[row][col-1] !== 0 ) {
			//alert("have no air");
			return false;
		} else {
			//alert("have air");
			return true;
		}
	} else if (row === 19-1 && col > 0 && col < 19-1) {
		if (	pan[row-1][col] !== 0 &&
				pan[row][col+1] !== 0 &&
				pan[row][col-1] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (col === 0 && row > 0 && row < 19-1) {
		if (	pan[row][col+1] !== 0 &&
				pan[row+1][col] !== 0 &&
				pan[row-1][col] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (col === 19-1 && row > 0 && row < 19-1) {
		if (	pan[row][col-1] !== 0 &&
				pan[row+1][col] !== 0 &&
				pan[row-1][col] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (row === 0 && col === 0) { // 角
		if (	pan[row][col+1] !== 0 &&
				pan[row+1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 0 && col === 19-1) {
		if (	pan[row][col-1] !== 0 &&
				pan[row+1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 19-1 && col === 0) {
		if (	pan[row][col+1] !== 0 &&
				pan[row-1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 19-1 && col === 19-1) {
		if (	pan[row][col-1] !== 0 &&
				pan[row-1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	}



		
}

/* 坐标周围是否有我方的棋子 */
function have_my_people(row, col) { //FIXME 边角没有处理呢
	if (row > 0 && row < 19-1 && col > 0 && row < 19-1) { //非边角 1->17(0->18)
		if (move_count % 2 === 0) { //未落子前是白
			if (	pan[row+1][col] === 1 ||
					pan[row-1][col] === 1 ||
					pan[row][col+1] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row-1][col] === 2 ||
					pan[row][col+1] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 0 && col > 0 && col < 19-1) { // 边
		if (move_count % 2 === 0) { //未落子前是白
			if (	pan[row+1][col] === 1 ||
					pan[row][col+1] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row][col+1] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 19-1 && col > 0 && col < 19-1) { // 边
		if (move_count % 2 === 0) { //未落子前是白
			if (	pan[row-1][col] === 1 ||
					pan[row][col+1] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row-1][col] === 2 ||
					pan[row][col+1] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (col === 19-1 && row > 0 && row < 19-1) {
		if (move_count % 2 === 0) { //未落子前是白
			if (	pan[row+1][col] === 1 ||
					pan[row-1][col] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row-1][col] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (col === 0 && row > 0 && row < 19-1) {
		if (move_count % 2 === 0) { //未落子前是白
			if (	pan[row+1][col] === 1 ||
					pan[row-1][col] === 1 ||
					pan[row][col+1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row-1][col] === 2 ||
					pan[row][col+1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 0 && col === 0) { // 角
		if (move_count % 2 === 0) { //未落子前是白
			if (	pan[row+1][col] === 1 ||
					pan[row][col+1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row][col+1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 0 && col === 19-1) { // 角
		if (move_count % 2 === 0) { //未落子前是白
			if (	pan[row+1][col] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 19-1 && col === 0) { // 角
		if (move_count % 2 === 0) { //未落子前是白
			if (	pan[row-1][col] === 1 ||
					pan[row][col+1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row-1][col] === 2 ||
					pan[row][col+1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 19-1 && col === 19-1) { // 角
		if (move_count % 2 === 0) { //未落子前是白
			if (	pan[row-1][col] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row-1][col] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	}

	return false;
}

// 真正落子
function stone_down(row, col) {
	if (move_count % 2 === 0) { //未落子前是白
		pan[row][col] = 1; //就放黑
	} else {
		pan[row][col] = 2;
	}
	move_count ++;
	move_record.push([row, col, move_count]);	// 记录手数
}







