"use strict";
// TODO: hacer quitar un nivel de indentacion a las clases, no solo a esta
class CanvasObject {
constructor(canvas, context, x = 0, y = 0, width = 0, height = 0, color = "black", id = "generic") {
	this.canvas = canvas;
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

/**
 * @brief puts itself in the canvas
 */
render() {
	this.context.fillStyle = this.color;
	this.context.fillRect(this.point_x1, this.point_y1, this.width, this.height);
}

/**
 * @brief puts the hitbox in the canvas
 */
renderHitBox() {
	this.context.strokeStyle = "magenta";
	this.context.beginPath();
	this.context.lineWidth = "1";
	this.context.rect(this.point_x1, this.point_y1, this.width, this.height);
	this.context.closePath();
	this.context.stroke();
}

/**
 * @brief Checks if a given (x, y) point is in contant with the object
 * @param {int} x position in x
 * @param {int} y position in y 
 * @returns true if is in contact, false otherwise
 */
pointHits(x, y) {
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

	return hitbox_area === (area1 + area2 + area3 + area4);
}

/**
 * @brief checks if a given canvasObject is in contact
 * @param {CanvasObject} object to check
 * @returns true if is in contact, false otherwise
 */
objectHits(object) {
	if (this.pointHits(object.point_x1, object.point_y1))
		return true;
	if (this.pointHits(object.point_x2, object.point_y2))
		return true;
	if (this.pointHits(object.point_x3, object.point_y3))
		return true;
	if (this.pointHits(object.point_x4, object.point_y4))
		return true;
	return false;
}

/**
 * @brief moves the object in (x, y), it DOESN'T move to global (x,y),
 * it moves from current position in (x, y)
 * @param {int} dx speed in x axis
 * @param {int} dy speed in y axis
 */
slide(dx, dy) {
	this.x += dx;
	this.y += dy;
	this.recalculateHitbox();
	this.keepInsideCanvas();
}

/**
 * @brief moves the object to global(x, y)
 * @param {int} x position in x
 * @param {int} y position in y 
 */
moveTo(x, y) {
	this.x = x;
	this.y = y;	
	this.recalculateHitbox();
	this.keepInsideCanvas();
}

/**
 * @brief updates the info of the object, it includes movement and collisions
 * @param {CanvasObject[]} canvas_objects objects in the current canvas
 */
update(canvas_objects) {
	this.slide(this.dx, this.dy);
	for (let i = 0; i < canvas_objects.length; i++) {
		if (canvas_objects[i] != this && this.objectHits(canvas_objects[i])) // TODO: esto funciona? el primer check
			resolveHit(canvas_objects[i]);
	}
}


/**
 * @brief recalculates the hitbox points with the current (x, y)
 */
recalculateHitbox() {
	this.point_x1 = this.x - this.width / 2;
	this.point_y1 = this.y - this.height / 2;

	this.point_x2 = this.x + this.width / 2;
	this.point_y2 = this.y - this.height / 2;

	this.point_x3 = this.x - this.width / 2;
	this.point_y3 = this.y + this.height / 2;

	this.point_x4 = this.x + this.width / 2;
	this.point_y4 = this.y + this.height / 2;
}

/**
 * @brief calculate if the object is outside the canvas, and moves it to
 * the border
 */
keepInsideCanvas() {
	if (this.point_x1 < 0)
		this.moveTo((this.point_x2 - this.point_x1) / 2, this.y)
	else if (this.point_x2 > this.canvas.width)
		this.moveTo(this.canvas.width - (this.point_x2 - this.point_x1) / 2, this.y)

	if (this.point_y1 < 0)
		this.moveTo(this.x, (this.point_y3 - this.point_y1) / 2);
	else if (this.point_y3 > this.canvas.height)
		this.moveTo(this.x, this.canvas.height - (this.point_y3 - this.point_y1) / 2);
}
}

export { CanvasObject };
