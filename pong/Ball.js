import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Ball extends CanvasObject {
constructor (canvas, context, x = 0, y = 0, radius = 0, color = "black", id = "ball") {
	super(canvas, context, x, y, radius * 2, radius * 2, color, id);
	this.radius = radius;
	this.type = "ball"
}

render() {
	this.context.fillStyle = this.color;
	this.context.beginPath();
	this.context.roundRect(this.point_x1, this.point_y1, this.width, this.height, 100);
	this.context.closePath();
	this.context.fill();
}

/**
 * @brief uptades the object state when is hitted
 * @param {CanvasObject} canvas_object object in contact
 */
resolveHit(canvas_object) {
	// TODO: rebotar contra las paredes
	// TODO: que dependiendo de en que zona de la pala vaya mas diagonal o menos
	if (canvas_object.type === "player") {
		this.dx = -this.dx;
	}
	if (this.dx > 0)
		this.dx++;
	else
		this.dx--;
	console.log(`${this.id} is resolving a hit with ${canvas_object.id}`);
}
}

export {Ball};
