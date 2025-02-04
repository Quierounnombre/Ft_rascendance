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

	/**
	 * Checks if a given (x, y) point is in contant with the object
	 * @param x position in x
	 * @param y position in y 
	 * @returns true if is in contact, false otherwise
	 */
	checkHit(x, y) {
		const triangle_area = (x1, y1, x2, y2, x3, y3) => {
			return abs(
				(x1 * (y2 - y3)  + 
				 x2 * (y3 - y1)  + 
				 x3 * (y1 - y2)) / 
				 2.0
			);
		}

		const hitbox_area = triangle_area(x1, y1, x2, y2, x3, y3) +
		                    triangle_area(x2, y2, x3, y3, x4, y4);
		
		const area1 = triangle_area(x, y, this.x1, this.y1, this.x2, this.y2);
		const area2 = triangle_area(x, y, this.x2, this.y2, this.x3, this.y3);
		const area3 = triangle_area(x, y, this.x3, this.y3, this.x4, this.y4);
		const area4 = triangle_area(x, y, this.x4, this.y4, this.x1, this.y1);

		return !(hitbox_area === (area1 + area2 + area3 + area4));
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
