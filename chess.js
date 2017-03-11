/**
 * Function to draw chess board
 * @param {*} boxSize: size of each square field in a chess board
 */
const drawChessBoard = (boxSize) => {
	//Create a SVG element with d3
	const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
	const rows = [8, 7, 6, 5, 4, 3, 2, 1];
	const pieces = [{
		name: "rook",
		w: "\u2656",
		b: "\u265C"
	}, {
		name: "knight",
		w: "\u2658",
		b: "\u265E"
	}, {
		name: "bishop",
		w: "\u2657",
		b: "\u265D"
	}, {
		name: "king",
		w: "\u2654",
		b: "\u265A"
	}, {
		name: "queen",
		w: "\u2655",
		b: "\u265B"
	}, {
		name: "bishop",
		w: "\u2657",
		b: "\u265D"
	}, {
		name: "knight",
		w: "\u2658",
		b: "\u265E"
	}, {
		name: "rook",
		w: "\u2656",
		b: "\u265C"
	}, {
		name: "pown",
		w: "\u2659",
		b: "\u265F"
	}];
// Draw
const boardDimension = 8,
boardSize = boardDimension * boxSize,
margin = 100;

// set <body>
const div = d3.select("body")
.append("div").attr("id", "svg-container");

// create <svg>
const svg = div.append("svg")
.attr("width", boardSize + boxSize + "px")
.attr("height", boardSize + boxSize + "px");
// top labels 
svg.selectAll("colLabel")
.data(cols)
.enter().append("text")
.text(function (d) { return d; })
.classed("colLabel", true)
.attr("y", 0)
.attr("x", function (d, i) { return i * boxSize + boxSize / 2;})
.attr("dx", boxSize / 2)
.attr("dy", boxSize / 4)
.style("font-size", boxSize/3 + "px")
.style("text-anchor", "middle")
.style("opacity", 0.8);

// bottoms
svg.selectAll("colLabel")
.data(cols)
.enter().append("text")
.text(function (d) { return d; })
.classed("colLabel", true)
.attr("y", boardSize + boxSize/2)
.attr("x", function (d, i) { return i * boxSize + boxSize / 2; })
.attr("dx", boxSize / 2)
.attr("dy", boxSize / 4)
.style("font-size", boxSize/3 + "px")
.style("text-anchor", "middle");

// left labels 
svg.selectAll("rowLabel")
.data(rows)
.enter().append("text")
.text(function(d) { return d; })
.classed("rowLabel", true)
.attr("y", function(d, i) { return i * boxSize + boxSize / 2;})
.attr("x", 0)
.attr("dx", boxSize / 4)
.attr("dy", boxSize / 2)
.style("font-size", boxSize/3 + "px")
.style("text-anchor", "middle")
.style("opacity", 0.8);

// right labels 
svg.selectAll("rowLabel")
.data(rows)
.enter().append("text")
.text(function(d) { return d; })
.classed("rowLabel", true)
.attr("y", function(d, i) { return i * boxSize + boxSize / 2;})
.attr("x", boardSize + boxSize/2)
.attr("dx", boxSize / 4)
.attr("dy", boxSize / 2)
.style("font-size", boxSize/3 + "px")
.style("text-anchor", "middle")
.style("opacity", 0.8);

// loop through 8 rows and 8 columns to draw the chess board
for (let i = 0; i < 8; i++) {
	for (let j = 0; j < 8; j++) {
        // draw each chess field
        var box = svg.append("rect")
        .attr("x", i * boxSize + boxSize / 2)
        .attr("y", j * boxSize + boxSize / 2)
        .attr("width", boxSize + "px")
        .attr("height", boxSize + "px");
        if ((i + j) % 2 === 0) {
        	box.attr("fill", "beige");
        } else {
        	box.attr("fill", "gray");
        }

        // draw chess pieces 
        var chess = svg.append("text")
        .classed('draggable', true)
        .style("font-size", boxSize*2/3)
        .attr("text-anchor", "middle")
        .attr("x", i * boxSize + boxSize / 2)
        .attr("y", j * boxSize + boxSize / 2 )
        .attr("dx", boxSize / 2)
        .attr("dy", boxSize * 2 / 3);
        chess.attr("X", chess.attr("x"))
        .attr("Y", chess.attr("y"));
        // // Draw pieces
        if (j === 1) {
        	chess.attr("id", "b" + i + "1")
        	.classed('team1', true)
        	.text(pieces.find(ele => ele.name === "pown").b);

        }
        if (j === 6) {
        	chess.attr("id", "b" + i + "6")
        	.classed('team2', true)
        	.text(pieces.find(ele => ele.name === "pown").w);
        }

        if (j === 0) {
        	chess.attr("id", "b" + i + "0")
        	.classed('team1', true)
        	.text(pieces[i].b);
        }
        if (j === 7) {
        	chess.attr("id", "b" + i + "7")
        	.classed('team2', true)
        	.text(pieces[i].w);
        }
    }
}
// DRAG BEHAVIOUR 
const drag = d3.drag()
.subject(function () {
	let t = d3.select(this);
	return {
		x: t.attr("x"),
		y: t.attr("y")
	};
    }) // prevent distance between mouse and the piece when selecting it
.on("start", startDrag)
.on("drag", dragging)
.on("end", endDrag);
//
function startDrag() {
	d3.select(this).raise().classed("active", true);
	//change attr X, Y to capture initial position before dragging    
	d3.select(this)
	.attr("X", d3.event.x)
	.attr("Y", d3.event.y);
}
//
function dragging() {
	d3.select(this)
	.attr("x", d3.event.x)
	.attr("y", d3.event.y);
}
//
function endDrag() {
    //get the coordinates of the closest  box
    let endX = Math.floor(d3.event.x / boxSize) * boxSize + boxSize / 2;
    let endY = Math.floor(d3.event.y / boxSize) * boxSize + boxSize / 2;
    //remove the old piece when dropping a new piece in the box
    let oldPiece = document.querySelector('text:not(.active):not(.rowLabel):not(.colLabel)[x="' + endX + '"][y="' + endY + '"]');
    //drop the element to the closest box
    //check if the selected piece is in the same team as the piece at the box

    if (oldPiece !== null) {
        if (d3.select(this).classed(oldPiece.classList.item(1)) === false) { // different teams -> remove
        	oldPiece.remove();
        	d3.select(this)
        	.attr("x", endX)
        	.attr("y", endY);
        } else { //same teams -> put back the original position
        	d3.select(this)
        	.attr("x", d3.select(this).attr("X"))
        	.attr("y", d3.select(this).attr("Y"));
        }
    } else { //oldPiece === null after moving the piece
    	d3.select(this)
    	.attr("x", endX)
    	.attr("y", endY);
    }
    console.log(endX);
    console.log(endY);
    d3.select(this).classed("active", false);
};

d3.selectAll(".draggable").call(drag);
}

//default
const init = () => {
	drawChessBoard(80);
}
init();

//clear chess board
const clearBoard = () => {
	d3.select("#svg-container").remove();
}

//select input DOM element
const inputNum = document.getElementById("boxSize");
//user select a new box size -> draw chess board again
const clickGet = () => {
	boxSize = parseInt(inputNum.value);
	if (Number.isNaN(boxSize)) {
		document.getElementById("instruction").innerHTML = "Please enter a number";
	} else {
		clearBoard();
		drawChessBoard(boxSize);
	}
}


//MOVING EFFECTS
//EFFECT WHEN MOUSE OVER A RECT
d3.selectAll("rect")
.on("mouseover", function (d, i) {
	d3.select(this).classed("rect-over", true);
})
.on("mouseout", function (d, i) {
	d3.select(this).classed("rect-over", false);
});

