import CanvasObject from "./CanvasObject";
"use strict";

export default class Ball extends CanvasObject {
	constructor (context, x = 0, y = 0, radius = 0, color = "black", id = "ball") {
		CanvasObject(context, x, y, radius * 2, radius * 2, color, id);
		this.radius = radius;
	}

	render() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		context.closePath();
		context.fillStyle = fillColor;
		context.fill();
	}
}
