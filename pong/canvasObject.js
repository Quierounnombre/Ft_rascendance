"use strict";

export default class canvasObject {
	constructor(context, x = 0, y = 0, width = 0, height = 0, color = "black") {
		this.context = context;

		this.x = x;
		this.y = y;

		this.dx = 0;
		this.dy = 0;

		this.width = width;
		this.height = height;

		this.hitboxWidth = width;
		this.hitboxHeight = height;

		this.color = color;
	}

	render() {
		this.context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	checkHit(x, y) {
		if (this.x + (this.hitboxWidth / 2) == x)
			return true;
		if (this.x - (this.hitboxWidth / 2) == x)
			return true;
		if (this.y + (this.hitboxHeight / 2) == y)
			return true;
		if (this.y - (this.hitboxHeight / 2) == y)
			return true;
		return false
	}
	// TODO: method to move elements
}
