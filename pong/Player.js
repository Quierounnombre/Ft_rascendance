import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Player extends CanvasObject {
constructor(canvas, context, x = 0, y = 0, width = 0, height = 0, color = "black", id = "player") {
	super(canvas, context, x, y, width, height, color, id);
	this.pointsScored = 0;
	this.type = "player";
}

toJSON() {
	return {
		score: this.pointsScored,
	};
}
}

export {Player};
