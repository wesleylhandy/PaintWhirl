var degree = 359; //initialize degrees)
var color = "rgba(0,0,255,0.90)"; // initial color

$(document).ready(function(){

	//set date
	var d = new Date();
	var year = d.getFullYear();
	$("#year").text(year);

	//TO DO

	/* 

	1. create function to slow spin as it returns to initial position on stop 
	2. create speed slider to speed up or slow down rotation
	3. store paint drops into an array and push to local storage
		with unique keys for each saved object, display mini version
		of the saved image in a right-hand side-bar
	4. style the background and controls

	*/

	function drawCenterPoint() {

		//draw a circle at the middle

			var radius = 7;
			ctx.beginPath();
			ctx.arc(0,0,radius,0,Math.PI*2);
			ctx.fillStyle = "black";
			ctx.fill();

		//Create a radial gradient (95% and 105% of original clock radius):
			grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);

		//Create 3 color stops, corresponding with the inner, middle, and outer edge of the arc:
			grad.addColorStop(0, '#333');
			grad.addColorStop(0.5, '#ddd');
			grad.addColorStop(1, '#333');

		//Define the gradient as the stroke style of the drawing object:
			ctx.strokeStyle = grad;
		
		//Define the line width of the drawing object (20% of radius):
			ctx.lineWidth = radius*0.2;

		//draw the circle
			ctx.stroke();
		}

	//Canvas spin function
		//will spin canvas css to show user the spin

	function spinCanvas() {
		
		$("#canvas").css("transform", "rotate(" + degree + "deg)");
		
		//will rotate canvas to spin in sequence with css rotate
		ctx.rotate(radians(degree)); 
		
		//counter-clockwise rotation
		degree--;

		if (degree < 0) {
			degree = 359;
		}

	}

	var spinOut, spinTime = 1;
	
	//create function that spins the canvas at slower intervals until it is back to normal

	function spinToZero () {
		
		if (degree === 0) {
			//stop recursion, canvas will be in regular position
			return false;
		} else {

			//every 20 degrees reduce the spin by increasing the timeout
			if (degree % 20 === 0) {
				spinTime++;
			}

			$("#canvas").css("transform", "rotate(" + degree + "deg)");
			
			//rotate canvas to spin in sequence with css rotate
			ctx.rotate(radians(degree)); 
			degree--;

			//recursion on with an increasing delay
			spinOut = setTimeout(spinToZero, spinTime);
		}
	}

	//event listener for mousepressed over canvas
	$("#canvas").mousemove(function(event){

		//get mouse position in relation to the browser window and 
		//set them to a position relative to canvas
		var points = {
			x: event.clientX - window.innerWidth / 2 ,
			y: event.clientY - window.innerHeight / 2
		}

		//convert points relative to the degree of spin on the canvas
		points = convertPoint(points.x, points.y); 

		// console.log("Mousepos at X: " + points.x + " & Y: " + points.y);

		if (spinning) {
			//painting on canvas only if canvas is in spin mode
			$("#canvas-wrapper").css("background-image", 'radial-gradient(#000 0%, #555 55%, ' + color + ' 70%)');
			dripPaint(points.x, points.y);	
		}
	});

	function convertPoint(x,y){

	    x2 = x * Math.cos(radians(degree)) - y * Math.sin(radians(degree));
	    y2 = x * Math.sin(radians(degree)) + y * Math.cos(radians(degree));

	    return {x: x2, y: y2};
	}

	function radians(degrees){
	    return degrees * (Math.PI / 180);
	}

	//function to drip paint on the canvas
	//the end goal is for there to be a teardrop of paint moving
	//pointing in direction of the current angle

	function dripPaint(x, y) {

		//formulas for calculating a point a set distance along a line
		//given x, y, distance, and slope
			//x1 = x +- sqrt(distance^2/(1 + slope^2))
			//y1 = slope * (x1 - x) + y;

		//slopes
		var m = y/x; //slope = change in rise / change in run
		var m1 = -(x/y); //negative inverse, slope of line perpendicular to m
		// console.log("slopes = " + m + ", " + m1);

		//distances
		var d = 75; //distance along line
		var d1 = 12; // control point for curve
		var d2 = 7.5; //distance along perpendicular

		// console.log("distances = " + d + ', ' + d1 + ', ' + d2);

		//calculate coordinates of a point along a line on a slope

		//check x position to determine which direction to move along line
		if (x > 0) {
			var x0 = x - Math.sqrt((d1*d1)/(1 + (m*m))); //control point 
			var x1 = x + Math.sqrt((d*d)/(1 + (m*m))); //tip
			var y0 = m * (x0 - x) + y; //control point
			var y1 = m * (x1 - x) + y;	//tip
		} else {
			var x0 = x + Math.sqrt((d1*d1)/(1 + (m*m))); //control point 
			var x1 = x - Math.sqrt((d*d)/(1 + (m*m))); //tip
			var y0 = m * (x0 - x) + y; //control point
			var y1 = m * (x1 - x) + y; //tip
		}
		// console.log("point1= " + x1 + ', ' + y1);

		//calculate coordinate of a point along a line perpendicular to x1, y1
		var x2 = x - Math.sqrt((d2 * d2)/(1 + (m1*m1)));
		var y2 = m1 * (x2 - x) + y;

		// console.log("point2= " + x2 + ', ' + y2);

		//calculate coordinate of a point in other direction from x2, y2
		var x3 = x + Math.sqrt((d2 * d2)/(1 + (m1*m1)));
		var y3 = y + m1 * (x3 - x);
		// console.log("point3= " + x3 + ', ' + y3); 

		ctx.beginPath();

		//draw small circle at tip of tear
		ctx.moveTo(x1, y1);
		ctx.arc(x1, y1, d/80, 0, Math.PI *2);
		ctx.moveTo(x1, y1);
		
		//draw triangle towards original point
		ctx.lineTo(x2,y2);//side 1 of triangle

		ctx.quadraticCurveTo(x0, y0, x3, y3); //curved side of triangle

		ctx.lineTo(x1, y1);//side 3 of triangle
		
		ctx.fillStyle = color; //future function to change color
		ctx.strokeStyle = color;
		ctx.lineWidth = 6;
		ctx.fill();
		ctx.stroke();
	}

	//get canvas and context
	var canvas = document.querySelector("#canvas");
	var ctx = canvas.getContext("2d");
	var width = parseInt($("#canvas").attr("width"));
	var height = parseInt($("#canvas").attr("height"));
	var spinning = false;

	//move ctx to center
	ctx.translate(width/2, height/2);

	//start screen
	drawCenterPoint();

	//testing, add a dot on the canvas to test spin

		// var radius = 2;
		// ctx.beginPath();
		// ctx.arc(10,20,radius,0,Math.PI*2);
		// ctx.fillStyle = "black";
		// ctx.fill();
		// ctx.stroke();

	var spin; //initialize interval variable

	$("#spin-btn").on("click", function(){
		if (!spinning) { // prevent multiple intervals
			spinning = true;
			spin = setInterval(spinCanvas, 1); //continuously spin
			// spinCanvas(); // spin one degree
		}
	});

	$("#stop-btn").on("click", function(){
		spinning = false; //prevent more painting
		clearInterval(spin); //stop spin
		console.log(degree);
		//call slow return to zero function
		spinToZero();
	});

	$("#clear-btn").on("click", function(){
		canvas.width = canvas.width;
		ctx = canvas.getContext("2d");
		ctx.translate(width/2, height/2);
		drawCenterPoint();
	});

	$("#blue").on("click", function(){
		color = "rgba(0, 0, 255, 0.90)";
		console.log("color: " + color);
	});

	$("#red").on("click", function(){
		color="rgba(255,0,0,0.90)";
		console.log("color: " + color);
	});

	$("#green").on("click", function(){
		color="rgba(0,128,0,0.90)";
		console.log("color: " + color);
	});

	$("#orange").on("click", function(){
		color="rgba(255, 165, 0, 0.90)";
		console.log("color: " + color);
	});

	$("#yellow").on("click", function(){
		color="rgba(255, 255, 0, 0.90)";
		console.log("color: " + color);
	});

	$("#indigo").on("click", function(){
		color="rgba(75, 0, 130, 0.90)";
		console.log("color: " + color);
	});

	$("#violet").on("click", function(){
		color="rgba(238,130,238,0.90)";
		console.log("color: " + color);
	});

});