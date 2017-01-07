//set date
var d = new Date();
var year = d.getFullYear();
$("#year").text(year);

//TO DO

//get canvas and context

var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");
var width = parseInt($("#canvas").attr("width"));
var height = parseInt($("#canvas").attr("height"));

//move ctx to center
ctx.translate(width/2, height/2);

function drawCenterPoint() {

	//draw a circle at the middle

		var radius = 5;
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

var degree = 0; //initialize degrees)

function spinCanvas() {
	if (degree = 360) {
		degree = 0;
	}
	$("#canvas").css("transform", "rotate(" + degree + "deg)");
	
	//will rotate canvas to spin in sequence with css rotate
	//ctx.rotate(radians(degree)); //converting degrees into radians
	degree++;
}

//event listener for mousepressed over canvas
$("#canvas").mousedown(function(event){
	
	var points = {
		x: event.clientX - window.innerWidth / 2 ,
		y: event.clientY - window.innerHeight / 2
	}
	points = convertPoint(points.x, points.y); 
	console.log("MousePress at X: " + points.x + " & Y: " + points.y);
	dripPaint(points.x, points.y);
});

function convertPoint(x,y){

    
    var offset = 0; //change if your corner is not 0,0

    x2 = x *Math.cos(radians(degree)) + (y - offset) *Math.sin(radians(degree));
    y2 = x *Math.sin(radians(degree)) - (y - offset) *Math.cos(radians(degree));

    return {x: x2, y: y2}
}

function radians(degrees){
    return degrees * (Math.PI / 180);
}

//function to drip paint on the canvas
//the end goal is for there to be a teardrop of paint moving
//pointing in direction of the current angle

var color = "blue"; // initial color

//user presses key to change color
$(document).on("keydown", function(event) {

	//====================
	//	THE W KEY
	//====================
	if (event.keyCode == 87) {
		color = "blue";
	}
	//====================
	//	THE S KEY
	//====================
	if (event.keyCode == 83) {
		color = "orange";
	}
	//====================
	//	THE A KEY
	//====================
	if (event.keyCode == 65) {
		color = "green";
	}
	//====================
	//	THE D KEY
	//====================
	if (event.keyCode == 68) {
		color = "red";
	}

	console.log("color: " + color);
});

function dripPaint(x, y) {

	var m = y/x; //slope = change in rise / change in run

	var m1 = -(x/y); //negative inverse, slope of line perpendicular to m
	console.log("slopes = " + m + ", " + m1);


	//draw teardrop
	var radius = 30;
	var d = radius * Math.sqrt(3); //distance along line
	var d1 = radius * 0.5;
	var d2 = radius*1.5; //distance along perpendicular


	console.log("distances = " + d + ', ' + d2);

	//calculate coordinates of a point along a line on a slope
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
	console.log("point1= " + x1 + ', ' + y1);
	//calculate coordinate of a point along a line perpendicular to x1, y1
	var x2 = x - Math.sqrt((d2 * d2)/(1 + (m1*m1)));
	var y2 = m1 * (x2 - x) + y;

	console.log("point2= " + x2 + ', ' + y2);
	//calculate coordinate of a point in other direction from x2, y2
	var x3 = x + Math.sqrt((d2 * d2)/(1 + (m1*m1)));
	var y3 = y + m1 * (x3 - x);
	console.log("point3= " + x3 + ', ' + y3); 

	ctx.beginPath();
	//draw drop at tip of tear
	ctx.moveTo(x1, y1);
	ctx.arc(x1, y1, radius/7, 0, Math.PI *2);
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2,y2);//corner 1 of triangle
	ctx.bezierCurveTo(x0, y0, x0, y0, x3, y3); //draw curved drop
	ctx.lineTo(x1, y1);//final corner of triangle
	
	ctx.fillStyle = color; //future function to change color
	ctx.strokeStyle = color;
	ctx.lineWidth = 6;
	ctx.fill();
	ctx.stroke();

		
}

$(document).ready(function(){

	drawCenterPoint();

	//testing, add a dot on the canvas to test spin

		// var radius = 2;
		// ctx.beginPath();
		// ctx.arc(10,20,radius,0,Math.PI*2);
		// ctx.fillStyle = "black";
		// ctx.fill();
		// ctx.stroke();

	var spin = setInterval(spinCanvas, 1);
});

