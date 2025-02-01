import canvasObject from "./canvasObject";
"use strict";

export default class Player extends canvasObject {
	constructor(context, x = 0, y = 0, width = 0, height = 0, color = "black") {
		canvasObject(context, x, y, width, height, color);
		this.pointsScored = 0;
	}

	toJSON() {
		return {
			score: this.pointsScored,
		};
	}
}
