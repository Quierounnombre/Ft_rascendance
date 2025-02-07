import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Player extends CanvasObject {
/**
 * @param {HTMLElement} canvas 
 * @param {CanvasRenderingContext2D} context 
 * @param {int} x 
 * @param {int} y 
 * @param {int} width 
 * @param {int} height 
 * @param {string} color 
 * @param {string} id 
 */
constructor(canvas, context, x, y, width, height, color, id) {
	super(canvas, context, x, y, width, height, color, id);
	this.pointsScored = 0;
	this.type = "player";
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

toJSON() {
	return {
		score: this.pointsScored,
	};
}
}

export {Player};
