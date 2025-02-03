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
		this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		this.context.closePath();
		this.context.fill();
	}
}

export {Ball};
