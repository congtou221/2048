var board = new Array();

$(function(){
	newgame();
})

function newgame(){
	//初始化棋盘格
	init();
	//初始化数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css("top",20+i*120);
			gridCell.css("left",20+j*120);
		} 
	}

	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		for (var j = 0; j < 4;j++) {
			board[i][j] = 0;
		}
	}

	updateBoardView();	
	
}

function updateBoardView(){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>'); 
			var numberCell = $('#number-cell-'+i+'-'+j);
			

			if (board[i][j] == 0) {
				numberCell.css("width",'0px');
				numberCell.css("height",'0px');
				numberCell.css("top",20+i*120+50);
				numberCell.css("left",20+j*120+50);
			}else{
				numberCell.css("width",'100px');
				numberCell.css("height",'100px');
				numberCell.css("top",20+i*120);
				numberCell.css("left",20+j*120);
				numberCell.css("background-color",getBackgroundColor(board[i][j]));
				numberCell.css("color",getNumberColor(board[i][j]));
				numberCell.text(board[i][j]);
			};
		}
	}
}
function generateOneNumber(){
	if(isFull(board)){
		return false;
	}
	//随机位置
	while(true){
		var randX = parseInt(Math.floor(Math.random()*4));
		var randY = parseInt(Math.floor(Math.random()*4));
		if(board[randX][randY] ==0){
			break;
		}
	}
	
	//随机数值
	var randNumber = Math.random()>0.5?2:4;
	//为随机位置赋值
	showNumberWithAnimation(randX,randY,randNumber);
}
//support js
function getBackgroundColor(number){
	switch(number){
		case 2:return "#eee4da";break;
		case 4:return "#ede0c8";break;
		case 8:return "#f2b179";break;
		case 16:return "#f59563";break;
		case 32:return "#f67e5f";break;
		case 64:return "#f65e3b";break;
		case 128:return "#edcf72";break;
		case 256:return "#edcc61";break;
		case 512:return "#9c0";break;
		case 1024:return "#33b5e5";break;
		case 2048:return "#09c";break;
		case 4096:return "#a6c";break;
		case 8192:return "#93c";break;
	}
	return "black";
}

function getNumberColor(number){
	if(number<=4)
		return "#776e65";
	return "white";
}

function isFull(board){
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if(board[i][j] == 0){
				return false;
			}
		};
	};
	return true;
}

function showNumberWithAnimation(i,j,number){
	var numberCell = $('#number-cell-'+i+'-'+j);

	numberCell.css('background-color',getBackgroundColor(number));
	numberCell.css('color',getNumberColor(number));
	numberCell.text(number);

	numberCell.animate({
		width:"100px",
		height:"100px",
		top:20+120*i,
		left:20+120*j
	},50);
/*	numberCell.css('width','100px');
	numberCell.css('height','100px');
	numberCell.css('top',20+120*i);
	numberCell.css('left',20+120*j);
*/
}