import CanvasObject from "./CanvasObject";
"use strict";

export default class Player extends CanvasObject {
	constructor(context, x = 0, y = 0, width = 0, height = 0, color = "black", id = "player") {
		CanvasObject(context, x, y, width, height, color, id);
		this.pointsScored = 0;
	}

	toJSON() {
		return {
			score: this.pointsScored,
		};
	}
}
