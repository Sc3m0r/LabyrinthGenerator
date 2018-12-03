var backgroundColor = "#255C69", borderColor = "#0F2D35", solutionColor = "#FFD167";

window.onload = function() {
	var x = Math.floor(window.innerWidth/50), y = Math.floor(window.innerWidth/100), i, j, fieldObject, MazeRoom, DIRECTIONS, width=innerWidth, height=innerHeight;
	DIRECTIONS = Object.freeze({"WEST":0, "NORTH":1, "EAST":2, "SOUTH":3});
	MazeRoom = getMazeRoomConstructor();
	fieldObject = generateMaze(createMaze(x,y,MazeRoom), DIRECTIONS, 0, 0);
	drawMaze(fieldObject, DIRECTIONS, x, y, width, height);
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
 	this.nextDirection = 0;
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
	var currentRoom, nextDirection, stack = new Array(), pathStack = new Array(), possibileNeighbours, done = false, result = Object.create(Object);
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
			currentRoom = field[currentX][currentY];
		} else {
			if (stack.length > pathStack.length) {
				pathStack = stack.slice();
				pathStack.push(currentRoom);
			}
			currentRoom = stack.pop();
			currentY = currentRoom.y;
			currentX = currentRoom.x;
			nextDirection = null;
		}
		if (currentX == 0 && currentY == 0 && possibileNeighbours.length == 0)
			done = true;
	}
	result.path = pathStack;
	result.field = field;
	return result;
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

function drawMaze(fieldObject, DIRECTIONS, colCount, rowCount, width, height) {
	var canvas, ctx, roomWidth=Math.floor(width/colCount), roomHeight=Math.floor(height/rowCount), nextX, nextY, field = fieldObject.field, currentRoom, beginX, endX, beginY, endY;
	canvas = document.getElementById("canvas");
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext("2d");
	ctx.fillStyle = backgroundColor;
	ctx.strokeStyle = borderColor;
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

	fieldObject.path = setDirections(fieldObject.path, DIRECTIONS);
	fieldObject.path.forEach(function(currentRoom, index, allRooms) {
		ctx.beginPath();
		ctx.fillStyle = solutionColor;
		ctx.strokeStyle = ctx.fillStyle;
		if (index === 0 || index === allRooms.length -1) {
			ctx.fillRect(roomWidth*currentRoom.x+1, roomHeight*currentRoom.y+1, roomWidth-2, roomHeight-2);
		} else {
			beginX = endX = currentRoom.x * roomWidth + Math.floor(roomWidth/2);
			beginY = endY = currentRoom.y * roomHeight + Math.floor(roomHeight/2);
			ctx.moveTo(beginX, beginY);
			if (currentRoom.nextDirection == DIRECTIONS.NORTH || allRooms[index-1].nextDirection == DIRECTIONS.SOUTH) {
				endY -= Math.floor(roomHeight/2);
				ctx.lineTo(endX, endY);
				endY = beginY;
				ctx.moveTo(beginX,beginY);
			}
			if (currentRoom.nextDirection == DIRECTIONS.SOUTH || allRooms[index-1].nextDirection == DIRECTIONS.NORTH) {
				endY += Math.floor(roomHeight/2);
				ctx.lineTo(endX, endY);
				endY = beginY;
				ctx.moveTo(beginX,beginY);
			}
			if (currentRoom.nextDirection == DIRECTIONS.WEST || allRooms[index-1].nextDirection == DIRECTIONS.EAST) {
				endX -= Math.floor(roomWidth/2);
				ctx.lineTo(endX, endY);
				endX = beginX;
				ctx.moveTo(beginX,beginY);
			} 
			if (currentRoom.nextDirection == DIRECTIONS.EAST || allRooms[index-1].nextDirection == DIRECTIONS.WEST) {
				endX += Math.floor(roomWidth/2);
				ctx.lineTo(endX, endY);
				endX = beginX;
				ctx.moveTo(beginX,beginY);
			}
			ctx.stroke();
		}
	});

	function setDirections(path, DIRECTIONS) {
		var nextDirection = 0, currentX, currentY, nextX, nextY;
		path.forEach(function(room, index, allRooms) {
			if (index < allRooms.length-1) {
				currentX = room.x;
				currentY = room.y;
				nextX = allRooms[index + 1].x;
				nextY = allRooms[index + 1].y;
				if (currentX < nextX) {
					nextDirection = DIRECTIONS.EAST; 
				} else if (currentX > nextX) {
					nextDirection = DIRECTIONS.WEST;
				} else if (currentY < nextY) {
					nextDirection = DIRECTIONS.SOUTH;
				} else if (currentY > nextY) {
					nextDirection = DIRECTIONS.NORTH;
				}
				room.nextDirection = nextDirection;
			}
		});
		return path;
	}

}