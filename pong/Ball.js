import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Ball extends CanvasObject {
/**
 * @param obj individual object of parsed with JSON.parse()
 * @param canvas instance of the canvas
 * @param context instance of the context
 */
constructor(obj, canvas, context) {
	// TODO: que la funcion que llame al constructor le ponga el counter
	// TODO: la funcion que te genere los objetos a partir del array que produce JSON.parse(), que ponga el canvas y el context
	super(obj, canvas, context);
	this.width = this.radius * 2;
	this.height = this.radius * 2;
	this.recalculateHitbox();
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
		this.dirX = -1;
		this.speed = 4;
	} else if (this.point_x2 > this.canvas.width) {
		this.moveTo(this.canvas.width / 2, this.canvas.height / 2);
		this.dirY = 0;
		this.dirX = 1;
		this.speed = 4;
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
	this.repel_from_object(canvas_object);

	this.dirX = -this.dirX;
	this.diry = -this.diry;

	// if (canvas_object.dirY === 0)
	// 	this.dirY = 0;
	// else
	// 	this.dirY = -(canvas_object.dirY / Math.abs(canvas_object.dirY));

	if (canvas_object.type === "player")
		this.speed += 0.5;
}

/**
 * @brief updates the info of the object, it includes movement and collisions
 * @param {CanvasObject[]} canvas_objects objects in the current canvas
 */
update(canvas_objects) {
	if (this.dirY === 0)
		this.dirY = 0.01;
	super.update(canvas_objects);
}

repel_from_object(canvas_object) {
	switch(this.position_view(this.vector_dir(this.dirX, -this.dirY))) {
	case "North":
		console.log(`---`);
		console.log(`${this.id}.repel_from_objetc(${canvas_object.id}: North)`);
		console.log(`(${this.x}, ${this.y})`);
		this.moveTo(this.x, (this.y - (canvas_object.point_y2 - canvas_object.y)) - 0.1);
		console.log(`(${this.x}, ${this.y})`);
		console.log(`---`);
		break;
	case "East":
		console.log(`---`);
		console.log(`${this.id}.repel_from_objetc(${canvas_object.id}: East)`);
		console.log(`(${this.x}, ${this.y})`)
		this.moveTo((this.x + (canvas_object.x - canvas_object.point_x2)) + 0.1, this.y);
		console.log(`(${this.x}, ${this.y})`)
		console.log(`---`);
		break;
	case "South":
		console.log(`---`);
		console.log(`${this.id}.repel_from_objetc(${canvas_object.id}: South)`);
		console.log(`(${this.x}, ${this.y})`)
		this.moveTo(this.x, (this.y + (canvas_object.point_y2 - canvas_object.y)) + 0.1);
		console.log(`(${this.x}, ${this.y})`)
		console.log(`---`);
		break;
	case "West":
		console.log(`---`);
		console.log(`${this.id}.repel_from_objetc(${canvas_object.id}: West)`);
		console.log(`(${this.x}, ${this.y})`)
		console.log(`(${this.x} - ${canvas_object.x} - ${canvas_object.point_x2} = ${this.x - canvas_object.x - canvas_object.point_x2})`)
		this.moveTo((this.x - (canvas_object.x - canvas_object.point_x2)) - 0.1, this.y);
		console.log(`(${this.x}, ${this.y})`)
		console.log(`---`);
		break;
	}
}

}

export {Ball};
