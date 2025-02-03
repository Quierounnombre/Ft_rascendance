import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Ball extends CanvasObject {
	constructor (context, x = 0, y = 0, radius = 0, color = "black", id = "ball") {
		super(context, x, y, radius * 2, radius * 2, color, id);
		this.radius = radius;
	}

	render() {
		this.context.fillStyle = this.fillColor;
		this.context.beginPath();
		this.context.roundRect(this.point_x1, this.point_y1, this.width, this.height, 100);
		this.context.closePath();
		this.context.fill();
	}
}

export {Ball};
