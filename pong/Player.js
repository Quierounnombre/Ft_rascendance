import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Player extends CanvasObject {
/**
 * @param obj individual object of parsed with JSON.parse()
 */
constructor(obj) {
	super(obj);
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

export {Player};
