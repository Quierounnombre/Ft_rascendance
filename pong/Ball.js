import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Ball extends CanvasObject {
/**
 * @param {HTMLElement} canvas 
 * @param {CanvasRenderingContext2D} context 
 * @param {int} x 
 * @param {int} y 
 * @param {int} radius 
 * @param {Counter} counter 
 * @param {string} color 
 * @param {string} id 
 */
constructor (canvas, context, x, y, radius, counter, color, id) {
	super(canvas, context, x, y, radius * 2, radius * 2, color, id);
	this.radius = radius;
	this.type = "ball"
	this.counter = counter;
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
	if (this.point_x1 < 0) {
		this.moveTo(this.canvas.width / 2, this.canvas.height / 2);
		this.counter.player2_score += 1;
		this.dirY = 0;
		this.dirX = -4; // TODO: archivo con variables de las que importar todos estos, quizas cuanto la partida sea un objeto pueda acceder a ellos
	} else if (this.point_x2 > this.canvas.width) {
		this.moveTo(this.canvas.width / 2, this.canvas.height / 2);
		this.dirY = 0;
		this.dirX = -4;
		this.counter.player1_score += 1;
	}

	if (this.point_y1 < 0) {
		this.moveTo(this.x, (this.point_y3 - this.point_y1) / 2);
		this.dirY = -this.dirY;
	} else if (this.point_y3 > this.canvas.height) {
		this.moveTo(this.x, this.canvas.height - (this.point_y3 - this.point_y1) / 2);
		this.dirY = -this.dirY;
	}
}

/**
 * @brief uptades the object state when is hitted
 * @param {CanvasObject} canvas_object object in contact
 */
resolveHit(canvas_object) {
	this.dirX = -this.dirX;
	if (canvas_object.type === "player") {
		if (this.dirX > 0)
			this.dirX += 0.5;
		else
			this.dirX -+ 0.5;
		this.dirY -= canvas_object.dirY / 4;
	}
}
}

export {Ball};
