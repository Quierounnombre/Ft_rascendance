import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Floating extends CanvasObject {
/**
 * @brief calculate if the object is outside the canvas, and moves it to
 * the border
 */
keepInsideCanvas() {
	if (this.point_x1 < 0) {
		this.moveTo((this.point_x2 - this.point_x1) / 2, this.y)
		this.dirX = -this.dirX;
	} else if (this.point_x2 > this.canvas.width) {
		this.moveTo(this.canvas.width - (this.point_x2 - this.point_x1) / 2, this.y)
		this.dirX = -this.dirX;
	}

	if (this.point_y1 < this.canvas.height / 8) {
		this.moveTo(this.x, (this.canvas.height / 8) + ((this.point_y3 - this.point_y1) / 2));
		this.dirY = -this.dirY;
	} else if (this.point_y3 > this.canvas.height) {
		this.moveTo(this.x, this.canvas.height - ((this.point_y3 - this.point_y1) / 2));
		this.dirY = -this.dirY;
	}

}
}

export {Floating};
