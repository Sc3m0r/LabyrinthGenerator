window.onload = function() {
	var x = Math.floor(window.innerWidth/10), y = Math.floor(window.innerWidth/20), i, j, field, MazeRoom, DIRECTIONS, width=innerWidth, height=innerHeight;
	DIRECTIONS = Object.freeze({"WEST":0, "NORTH":1, "EAST":2, "SOUTH":3});
	MazeRoom = getMazeRoomConstructor();
	field = generateMaze(createMaze(x,y,MazeRoom), DIRECTIONS, 0, 0);
	drawMaze(field, x, y, width, height);
}

function getMazeRoomConstructor() {
 return function(x,y) {
 	this.x = x;
 	this.y = y;
 	this.openNorth = false;
 	this.openWest = false;
 	this.openEast = false;
 	this.openSouth = false;
 	this.visited = false;
 }
}

function createMaze(x, y, MazeRoom) {
var field = new Array(x), i, j;
	for (i = 0; i < x; i++) {
		field[i] = new Array(y);
		for (j = 0; j < y; j++) {
			field[i][j] = new MazeRoom(i,j);
		}
	}
	return field;
}

function generateMaze(field, DIRECTIONS, currentX, currentY) {
	var currentRoom, nextDirection, stack = new Array(), possibileNeighbours, done = false;
		currentRoom = field[currentX][currentY];
	while(!done) {
		currentRoom.visited = true;
		possibileNeighbours = new Array();
		if (nextDirection != null) {
			switch(nextDirection) {
				case DIRECTIONS.NORTH: currentRoom.openSouth = true; break;
				case DIRECTIONS.WEST : currentRoom.openEast = true; break;
				case DIRECTIONS.SOUTH : currentRoom.openNorth = true; break;
				case DIRECTIONS.EAST : currentRoom.openWest = true; break;
			}
		}
		if (currentY > 0 && !field[currentX][currentY-1].visited)
				possibileNeighbours.push(Object.keys(DIRECTIONS)[DIRECTIONS.NORTH]);
		if (currentX > 0 && !field[currentX-1][currentY].visited)
				possibileNeighbours.push(Object.keys(DIRECTIONS)[DIRECTIONS.WEST]);
		if (currentX < field.length - 1 && !field[currentX+1][currentY].visited)
				possibileNeighbours.push(Object.keys(DIRECTIONS)[DIRECTIONS.EAST]);
		if (currentY < field[0].length - 1 && !field[currentX][currentY+1].visited)
				possibileNeighbours.push(Object.keys(DIRECTIONS)[DIRECTIONS.SOUTH]);
		
		if (possibileNeighbours.length > 0) {
			nextDirection = getNextDirection(possibileNeighbours, DIRECTIONS);
			switch(nextDirection) {
				case DIRECTIONS.NORTH: currentY--; currentRoom.openNorth = true; break;
				case DIRECTIONS.WEST: currentX--; currentRoom.openWest = true; break;
				case DIRECTIONS.SOUTH: currentY++; currentRoom.openSouth = true; break;
				case DIRECTIONS.EAST: currentX++; currentRoom.openEast = true; break;
			}
			stack.push(currentRoom);
			log(currentX, currentY, possibileNeighbours);
			currentRoom = field[currentX][currentY];
		} else {
			currentRoom = stack.pop();
			currentY = currentRoom.y;
			currentX = currentRoom.x;
			nextDirection = null;
		}
		if (currentX == 0 && currentY == 0 && possibileNeighbours.length == 0)
			done = true;
	}
	return field;
}

function getNextDirection(possibileNeighbours, DIRECTIONS) {
	var result = Math.floor(Math.random() * possibileNeighbours.length), i;
	result = possibileNeighbours[result];
	Object.keys(DIRECTIONS).forEach(function(element, index) {
		if (element === result) {
			result = index;
		}
	});
	return result;
}

function log() {
	var answer = "";
	if (arguments.length == 0)
		console.log("Empty log");
	else {
		Array.prototype.forEach.call(arguments, function(elem) {
			answer += " "+elem.toString();
		});
		console.log(answer);
	}
}

function drawMaze(field, colCount, rowCount, width, height) {
	var canvas, ctx, roomWidth=width/colCount, roomHeight=height/rowCount, nextX, nextY;
	canvas = document.getElementById("canvas");
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "#A2D8C2";
	ctx.strokeStyle = "#000000";
	ctx.fillRect(0,0,width, height);
	ctx.lineWidth = 1;

	field.forEach(function(col, colIndex) {
		col.forEach(function(room, rowIndex) {
			ctx.beginPath();
			nextY = roomHeight*rowIndex;
			nextX = roomWidth*(colIndex+1);
			if (room.openNorth)
				ctx.moveTo(nextX, nextY);
			else
				ctx.lineTo(nextX, nextY);
			nextY = roomHeight*(rowIndex+1);
			if (room.openEast)
				ctx.moveTo(nextX, nextY);
			else
				ctx.lineTo(nextX, nextY);
			nextX = roomWidth*colIndex;
			if (room.openSouth)
				ctx.moveTo(nextX, nextY);
			else
				ctx.lineTo(nextX, nextY);
			nextY = roomHeight*rowIndex;
			if (room.openWest)
				ctx.moveTo(nextX, nextY)
			else
				ctx.lineTo(nextX, nextY);
			ctx.stroke();
		});
	});
}