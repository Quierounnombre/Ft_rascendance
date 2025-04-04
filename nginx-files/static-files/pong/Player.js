import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Player extends CanvasObject {
/**
 * @param obj individual object of parsed with JSON.parse()
 * @param canvas instance of the canvas
 * @param context instance of the context
 */
constructor(obj, canvas, scene, color) {
	super(obj, canvas, scene, color);

	document.addEventListener("keydown", playerKeyDownHandler.bind(this));
	document.addEventListener("keyup", playerKeyUpHandler.bind(this));
}

/**
 * @brief moves the object in (x, y), it DOESN'T move to global (x,y),
 * it moves from current position in (x, y)
 * @param {int} dirX speed in x axis
 * @param {int} dirY speed in y axis
 */
slide(dirX, dirY) {
	this.y += this.speed * dirY;
	if (!this.is_moving) {
		if (this.dirY > 0)
			this.dirY -= 1;
		else if (this.dirY < 0)
			this.dirY += 1;
	}
	this.recalculateHitbox();
	this.keepInsideCanvas();
}
}

function playerKeyDownHandler(event) {
	if (event.key === this.move_up) {
		this.dirY = -4; // NOTE: este numero para que haya cierto degradado en la velocidad, que tambien es menor de base
		this.is_moving = true;
	} else if (event.key === this.move_down) {
		this.dirY = 4; // NOTE: este numero para que haya cierto degradado en la velocidad, que tambien es menor de base
		this.is_moving = true;
	}
}

function playerKeyUpHandler(event) {
	if (event.key == this.move_up || event.key == this.move_down)
		this.is_moving = false;
}


export {Player};
