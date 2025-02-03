"use strict";

class CanvasObject {
	constructor(context, x = 0, y = 0, width = 0, height = 0, color = "black", id = "generic") {
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

		this.id = id;
	}

	render() {
		this.context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	renderHitBox() {
		this.context.strokeStyle = "red";
		this.context.strokeRect(this.x, this.y, this.hitboxWidth, this.hitboxHeight);
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
	
	move() {
		this.x += this.dx;
		if (this.x < 0)
			this.x = 0;
		else if (this.x + this.hitboxWidth > canvas.width)
			this.x = canvas.width - this.hitboxWidth;

		this.y += this.dy;
		if (this.y < 0)
			this.y = 0;
		else if (this.y + this.hitboxHeight > canvas.height)
			this.y = canvas.height- this.hitboxHeight;

	}
}

export {CanvasObject};
