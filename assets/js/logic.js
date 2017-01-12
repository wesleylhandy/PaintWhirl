
var degree = 359; //initialize degrees)
var color = "rgba(0,0,255,0.90)"; // initial color
var counter = 0; //used to store data in a numbered array
var canvasArray = []; //used to push data to local storage for completed pic
var spinning = false; //control for paint and storing functions

// Initialize Firebase
var config = {
	apiKey: "AIzaSyBmUiZcB2Fz-beoyN6lhNNv1R4o9G3t60g",
	authDomain: "paintwhirl.firebaseapp.com",
	databaseURL: "https://paintwhirl.firebaseio.com",
	storageBucket: "paintwhirl.appspot.com",
	messagingSenderId: "987352983785"
};

firebase.initializeApp(config);

//set database

var database=firebase.database();

$(document).ready(function(){

	//set date
	var d = new Date();
	var year = d.getFullYear();
	$("#year").text(year);

	//TO DO

	/* 

	DONE  1. create function to slow spin as it returns to initial position on stop 
	2. create speed slider to speed up or slow down rotation
	DONE 3. store paint drops into an array and push to local storage
		with unique keys for each saved object, 
	4. display mini version of the saved image in a right-hand side-bar
	5. limit right hand display to the previous 4 obj
	6. allow users to click on mini-whirls and redisplay on main canvas
	7. allow users to delete a whirl
	8. allow users to pring to pdf
	9. allow users to tweet image of whirl
	10. style the background and controls
	11. change mouseover to mousepress/mousedown/mouseup

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



		// console.log("Mousepos at X: " + points.x + " & Y: " + points.y);

		if (spinning) {
			
			// document.onmousedown = function() {
				//convert points relative to the degree of spin on the canvas
				//will return converted points, plus coordinates for teardrop, as object
				points = convertPoint(points.x, points.y); 

				//painting on canvas only if canvas is in spin mode
				$("#canvas-wrapper").css("background-image", 'radial-gradient(#000 0%, #555 55%, ' + color + ' 70%)');
				dripPaint(points);	
			// }
		}
	});

	function convertPoint(x,y){

		//convert static points to translated points on a rotated canvas
			//note: canvas x,y is inverted
			 
	    xPrime = x * Math.cos(radians(degree)) - y * Math.sin(radians(degree));
	    yPrime = x * Math.sin(radians(degree)) + y * Math.cos(radians(degree));
	    // xPrime = x;
	    // yPrime = y;
	    //formulas for calculating a point a set distance along a line
		//given x, y, distance, and slope
			//x1 = x +- sqrt(distance^2/(1 + slope^2))
			//y1 = slope * (x1 - x) + y;

		//slopes
		var m = yPrime/xPrime; //slope = change in rise / change in run
		var m1 = -(xPrime/yPrime); //negative inverse, slope of line perpendicular to m
		// console.log("slopes = " + m + ", " + m1);

		//distances
		var d0 = 75; //distance along line
		var d1 = 12; // control point for curve
		var d2 = 7.5; //distance along perpendicular

		// console.log("distances = " + d + ', ' + d1 + ', ' + d2);

		//calculate coordinates of a point along a line on a slope

		//check x position to determine which direction to move along line
		if (xPrime > 0) {
			var x0 = xPrime - Math.sqrt((d1*d1)/(1 + (m*m))); //control point 
			var x1 = xPrime + Math.sqrt((d0*d0)/(1 + (m*m))); //tip
			var y0 = m * (x0 - xPrime) + yPrime; //control point
			var y1 = m * (x1 - xPrime) + yPrime;	//tip
		} else {
			var x0 = xPrime + Math.sqrt((d1*d1)/(1 + (m*m))); //control point 
			var x1 = xPrime - Math.sqrt((d0*d0)/(1 + (m*m))); //tip
			var y0 = m * (x0 - xPrime) + yPrime; //control point
			var y1 = m * (x1 - xPrime) + yPrime; //tip
		}
		// console.log("point1= " + x1 + ', ' + y1);

		//calculate coordinate of a point along a line perpendicular to x1, y1
		var x2 = xPrime - Math.sqrt((d2 * d2)/(1 + (m1*m1)));
		var y2 = m1 * (x2 - xPrime) + yPrime;

		// console.log("point2= " + x2 + ', ' + y2);

		//calculate coordinate of a point in other direction from x2, y2
		var x3 = xPrime + Math.sqrt((d2 * d2)/(1 + (m1*m1)));
		var y3 = yPrime + m1 * (x3 - xPrime);
		// console.log("point3= " + x3 + ', ' + y3); 

		//store coordinates in local storage
		var drop = {coords: {
								"m": m, "m1": m1, 
								"d0": d0, "d1": d1, "d2": d2, 
								"x": xPrime, "x0": x0, "x1": x1, "x2": x2, "x3": x3, 
								"y": yPrime, "y0": y0, "y1": y1, "y2": y2, "y3": y3, 
								"color": color, "degree": degree
							}
						};
		// console.log(drop);
		canvasArray.push(drop);

	    return drop;
	}

	function radians(degrees){
	    return degrees * (Math.PI / 180);
	}

	//function to drip paint on the canvas
	//the end goal is for there to be a teardrop of paint moving
	//pointing in direction of the current angle

	function dripPaint(obj) {

		console.log(obj);

		ctx.beginPath();

		//draw small circle at tip of tear
		ctx.moveTo(obj.coords.x1, obj.coords.y1);
		ctx.arc(obj.coords.x1, obj.coords.y1, obj.coords.d0/80, 0, Math.PI *2);
		ctx.moveTo(obj.coords.x1, obj.coords.y1);
		
		//draw triangle towards original point
		ctx.lineTo(obj.coords.x2,obj.coords.y2);//side 1 of triangle

		ctx.quadraticCurveTo(obj.coords.x0, obj.coords.y0, obj.coords.x3, obj.coords.y3); //curved side of triangle

		ctx.lineTo(obj.coords.x1, obj.coords.y1);//side 3 of triangle
		
		ctx.fillStyle = obj.coords.color; //future function to change color
		ctx.strokeStyle = obj.coords.color;
		ctx.lineWidth = 6;
		ctx.fill();
		ctx.stroke();
	}

	function drawMiniWhirl (obj) {

		var whirl = JSON.parse(localStorage.getItem("canvas0"));
		console.log(whirl);
		for (let x=0; x < whirl.length; x++) {
			ctx.rotate(radians(whirl[x].coords.degree));
			dripPaint(whirl[x]);
			ctx.rotate(0);
		}
	}

	//get canvas and context
	var canvas = document.querySelector("#canvas");
	var ctx = canvas.getContext("2d");
	var width = parseInt($("#canvas").attr("width"));
	var height = parseInt($("#canvas").attr("height"));


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
			
			//TESTING

			// for (let x=0; x<45; x++){
			// 	spinCanvas(); // spin one degree

			// }
		}
	});

	$("#stop-btn").on("click", function(){
		spinning = false; //prevent more painting
		clearInterval(spin); //stop spin
		console.log(degree);
		//call slow return to zero function
		spinToZero();
	});

	$("#save-btn").on("click", function(){
		localStorage.setItem("canvas" + counter, JSON.stringify(canvasArray));
		console.log(localStorage);
		counter++;
	});

	$("#clear-btn").on("click", function(){
		canvasArray = [];
		canvas.width = canvas.width;
		ctx = canvas.getContext("2d");
		ctx.translate(width/2, height/2);
		drawCenterPoint();
	});

	$("#restore-btn").on("click", function(){
		canvasArray = [];
		canvas.width = canvas.width;
		ctx = canvas.getContext("2d");
		ctx.translate(width/2, height/2);
		drawMiniWhirl();
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
		color="rgba(238,130,238,0.90)"	;
		console.log("color: " + color);
	});

});