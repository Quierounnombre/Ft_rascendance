import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Player extends CanvasObject {
constructor(canvas, context, x = 0, y = 0, width = 0, height = 0, color = "black", id = "player") {
	super(canvas, context, x, y, width, height, color, id);
	this.pointsScored = 0;
	this.type = "player";
}

/**
 * @brief moves the object in (x, y), it DOESN'T move to global (x,y),
 * it moves from current position in (x, y)
 * @param {int} dx speed in x axis
 * @param {int} dy speed in y axis
 */
slide(dx, dy) {
	this.y += dy;
	if (!this.is_moving) {
		if (this.dy > 0)
			this.dy -= 1;
		else if (this.dy < 0)
			this.dy += 1;
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
