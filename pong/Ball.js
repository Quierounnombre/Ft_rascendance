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
 * @brief calculate if the object is outside the canvas, and moves it to
 * the border
 */
keepInsideCanvas() {
	// TODO: puntuacion
	if (this.point_x1 < 0)
		this.moveTo((this.point_x2 - this.point_x1) / 2, this.y)
	else if (this.point_x2 > this.canvas.width)
		this.moveTo(this.canvas.width - (this.point_x2 - this.point_x1) / 2, this.y)

	if (this.point_y1 < 0) {
		this.moveTo(this.x, (this.point_y3 - this.point_y1) / 2);
		this.dy = -this.dy;
	}
	else if (this.point_y3 > this.canvas.height) {
		this.moveTo(this.x, this.canvas.height - (this.point_y3 - this.point_y1) / 2);
		this.dy = -this.dy;
	}
}

/**
 * @brief uptades the object state when is hitted
 * @param {CanvasObject} canvas_object object in contact
 */
resolveHit(canvas_object) {
	// TODO: rebotar contra las paredes, NOTE: que sea en keepInsideCanvas
	// TODO: que dependiendo de en que zona de la pala vaya mas diagonal o menos
	this.dx = -this.dx;
	if (canvas_object.type === "player") {
		if (this.dx > 0)
			this.dx += 0.5;
		else
			this.dx -+ 0.5;
		this.dy -= canvas_object.dy / 4;
	}
}
}

export {Ball};
