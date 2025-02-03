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

		/*
		** xy1---------xy2
		** |            |
		** |     xy     |
		** |            |
		** xy3---------xy4
		*/
		this.point_x1 = x - width / 2;
		this.point_y1 = y - height / 2;

		this.point_x2 = x + width / 2;
		this.point_y2 = y - height / 2;

		this.point_x3 = x - width / 2;
		this.point_y3 = y + height / 2;

		this.point_x4 = x + width / 2;
		this.point_y4 = y + height / 2;

		this.color = color;

		this.id = id;
	}

	render() {
		this.context.fillStyle = this.color;
		this.context.fillRect(this.point_x1, this.point_y1, this.width, this.height);
	}

	renderHitBox() {
		this.context.strokeStyle = "magenta";
		this.context.beginPath();
		this.context.lineWidth = "1";
		this.context.rect(this.point_x1, this.point_y1, this.width, this.height);
		this.context.closePath();
		this.context.stroke();
	}

	checkHit(x, y) {
		/*
		TODO: el punto x,y es el centro,
		las esquinas deberian rodear el punto, 
		no empezar desde la esquina superior izquierda
		*/
		// TODO: cambiar al nuevo hitbox
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
		// TODO: cambiar al nuevo hitbox
		this.x += this.dx;
		if (this.x < 0)
			this.x = 0;
		else if (this.x + this.hitboxWidth > canvas.width)
			this.x = canvas.width - this.hitboxWidth;

		this.y += this.dy;
		if (this.y < 0)
			this.y = 0;
		else if (this.y + this.hitboxHeight > canvas.height)
			this.y = canvas.height - this.hitboxHeight;

	}
}

export { CanvasObject };
