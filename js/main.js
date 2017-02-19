var board = new Array();
var score = 0;

var documentWidth = window.screen.availWidth;
var gridContainerWidth = 0.92*documentWidth;
var cellSpace = 0.04*documentWidth;
var cellSideLength = 0.18*documentWidth;

var startx, starty, endx, endy, deltaX, deltaY;

$(function(){
	prepareForNewGame();
	newgame();
})

function prepareForNewGame(){
	if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    
	$('#grid-container').css('width',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('padding',cellSpace);
	$('#grid-container').css('border-radius',0.02*gridContainerWidth);

	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.02*cellSideLength);
}

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
			gridCell.css("top",cellSpace+i*(cellSpace+cellSideLength));
			gridCell.css("left",cellSpace+j*(cellSpace+cellSideLength));
		} 
	}

	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		for (var j = 0; j < 4;j++) {
			board[i][j] = 0;
		}
	}

	updateBoardView();	

	score = 0;
}

function updateBoardView(){
	$('.number-cell').remove();

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>'); 
			var numberCell = $('#number-cell-'+i+'-'+j);
			
			if (board[i][j] == 0) {
				numberCell.css("width",'0px');
				numberCell.css("height",'0px');
				numberCell.css("top",cellSpace+i*(cellSpace+cellSideLength)+50);
				numberCell.css("left",cellSpace+j*(cellSpace+cellSideLength)+50);
			}else{
				numberCell.css("line-height",cellSideLength+'px');	
				numberCell.css('font-size',0.6*cellSideLength+'px');		
				numberCell.css("width",cellSideLength);
				numberCell.css("height",cellSideLength);
				numberCell.css("top",cellSpace+i*(cellSpace+cellSideLength));
				numberCell.css("left",cellSpace+j*(cellSpace+cellSideLength));
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
	board[randX][randY] = randNumber;
	showNumberWithAnimation(randX,randY,randNumber);
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37: //left
			if(moveLeft()){
				generateOneNumber();
				setTimeout(isGameOver(),300);
			}
			break;
		case 38:
			if(moveUp()){
				generateOneNumber();
				setTimeout(isGameOver(),300);
			}
			break;
		case 39:
			if(moveRight()){
				generateOneNumber();
				setTimeout(isGameOver(),300);
			}
			break;
		case 40:
			if(moveDown()){
				generateOneNumber();
				setTimeout(isGameOver(),300);
			}
			break;
		default:
			break;
	}
})

document.addEventListener('touchstart',function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
})

document.addEventListener('touchend',function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	deltaX = endx - startx;
	deltaY = endy - starty;

	if(Math.abs(deltaX) <0.2*documentWidth && Math.abs(deltaY) <0.2*documentWidth)
		return;
	if (Math.abs(deltaX) >= Math.abs(deltaY)){
		if (deltaX >0){
			//move right
			if(moveRight())
				generateOneNumber();
				setTimeout(isGameOver(),300);
		}else{
			//move left
			if(moveLeft())
				generateOneNumber();
				setTimeout(isGameOver(),300);
		}
	}else{
		if (deltaY >0){
			//move down
			if(moveDown())
				generateOneNumber();
				setTimeout(isGameOver(),300);
		}else{
			//move up
			if(moveUp()){
				generateOneNumber();
				setTimeout(isGameOver(),300);
			}
		}
	}
})
function moveLeft(){

	if(!canMoveLeft(board))
		return false;

	//moveLeft
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j <4; j++) {
			if (board[i][j] !=0)
				for (var k = 0; k <j; k++){
					if (board[i][k] ==0 && noBlockHorizontal(i,k,i,j)){
						moveCellWithAnimation(i,k,i,j);						
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[i][k] == board[i][j] && noBlockHorizontal(i,k,i,j)){
						moveCellWithAnimation(i,k,i,j);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);
						continue;
					}
				}
		}
	};

	setTimeout(updateBoardView(),200);
	return true;
}

function moveRight(){

	if(!canMoveRight(board))
		return false;

	//moveRight
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] !=0)
				for (var k = 3; k > j; k--){
					if (board[i][k] ==0 && noBlockHorizontal(i,j,i,k)){
						moveCellWithAnimation(i,k,i,j);						
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[i][k] == board[i][j] && noBlockHorizontal(i,j,i,k)){
						moveCellWithAnimation(i,k,i,j);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);
						continue;
					}
				}
		}
	};

	setTimeout(updateBoardView(),200);
	return true;
}

function moveUp(){

	if(!canMoveUp(board))
		return false;

	//moveUp
	for (var j = 0; j < 4; j++) {
		for (var i = 1; i <4; i++) {
			if (board[i][j] !=0)
				for (var k = 0; k <i; k++){
					if (board[k][j] ==0 && noBlockVertical(k,j,i,j)){
						moveCellWithAnimation(k,j,i,j);						
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[k][j] == board[i][j] && noBlockVertical(k,j,i,j)){
						moveCellWithAnimation(k,j,i,j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);
						continue;
					}
				}
		}
	};

	setTimeout(updateBoardView(),200);
	return true;
}

function moveDown(){

	if(!canMoveDown(board))
		return false;

	//moveDown
	for (var j = 0; j < 4; j++) {
		for (var i = 2; i >= 0; i--) {
			if (board[i][j] !=0)
				for (var k = 3; k > i; k--){
					if (board[k][j] ==0 && noBlockVertical(i,j,k,j)){
						moveCellWithAnimation(k,j,i,j);						
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[k][j] == board[i][j] && noBlockVertical(i,j,k,j)){
						moveCellWithAnimation(k,j,i,j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);
						continue;
					}
				}
		}
	};

	setTimeout(updateBoardView(),200);
	return true;
}

function isGameOver(){
	if (isFull(board) && cantMove(board))
		gameOver();
	return false;
}

function gameOver(){
	alert('game over');
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

function canMoveLeft(board){
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++){
			if(board[i][j] != 0)
				console.log("can moveLeft")
				if((board[i][j-1] == 0) || (board[i][j-1] == board[i][j]))
					return true;
		}
	};
	return false;
}

function canMoveRight(board){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 3; j++){
			if(board[i][j] != 0)
				console.log("can moveRight")
				if((board[i][j+1] == 0) || (board[i][j+1] == board[i][j]))
					return true;
		}
	};
	return false;
}

function canMoveUp(board){
	for (var j = 0; j < 4; j++) {
		for (var i = 1; i < 4; i++){
			if(board[i][j] != 0)
				console.log("can moveUp")
				if((board[i-1][j] == 0) || (board[i-1][j] == board[i][j]))
					return true;
		}
	};
	return false;
}

function canMoveDown(board){
	for (var j = 0; j < 4; j++) {
		for (var i = 0; i < 3; i++){
			if(board[i][j] != 0)
				console.log("can moveDown")
				if((board[i+1][j] == 0) || (board[i+1][j] == board[i][j]))
					return true;
		}
	};
	return false;
}
	
function cantMove(board){
	if(canMoveLeft(board) || canMoveUp(board) || canMoveRight(board) || canMoveDown(board))
		return false;
	return true;
}

function noBlockHorizontal(i,k,i,j){
	for (var count = k+1; count < j; count++){
		if (board[i][count] != 0)
			return false;
	}
	return true;
}

function noBlockVertical(k,j,i,j){
	for (var count = k+1; count < i;count++){
		if(board[count][j] != 0)
			return false;
	}
	return true;
}
//animation js
function showNumberWithAnimation(i,j,number){
	var numberCell = $('#number-cell-'+i+'-'+j);

	numberCell.css('line-height',cellSideLength+'px');
	numberCell.css('font-size',0.6*cellSideLength+'px');
	numberCell.css('background-color',getBackgroundColor(number));
	numberCell.css('color',getNumberColor(number));
	numberCell.text(number);

	numberCell.animate({
		width:cellSideLength,
		height:cellSideLength,
		top:cellSpace+(cellSpace+cellSideLength)*i,
		left:cellSpace+(cellSpace+cellSideLength)*j
	},50);
}

function moveCellWithAnimation(toX,toY,fromX,fromY){
	var fromCell = $('number-cell-'+fromX+'-'+fromY);

	fromCell.animate({
		top:cellSpace+(cellSpace+cellSideLength)*toX,
		left:cellSpace+(cellSpace+cellSideLength)*toY
	},50);
}

function updateScore(score){
	$('#score').text(score);
}