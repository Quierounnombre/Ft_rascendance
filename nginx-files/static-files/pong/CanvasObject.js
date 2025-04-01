"use strict";
import * as THREE from 'three';

class CanvasObject {
/**
 * @param obj individual object of parsed with JSON.parse()
 * @param canvas instance of the canvas
 * @param context instance of the context
 */
constructor(obj, canvas, scene) {
	this.canvas = canvas;

	this.color = "white";
	this.id = "generic";
	this.type = "generic";
	this.x = 0;
	this.y = 0;
	this.dirX = 0;
	this.dirY = 0;
	this.speed = 4;
	this.is_moving = false;
	this.width = 0;
	this.height = 0;

	for (let i in obj)
		this[i] = obj[i];

	/*
	** xy1---------xy2
	** |            |
	** |     xy     |
	** |            |
	** xy3---------xy4
	*/
	this.point_x1 = this.x - this.width / 2;
	this.point_y1 = this.y - this.height / 2;

	this.point_x2 = this.x + this.width / 2;
	this.point_y2 = this.y - this.height / 2;

	this.point_x3 = this.x - this.width / 2;
	this.point_y3 = this.y + this.height / 2;

	this.point_x4 = this.x + this.width / 2;
	this.point_y4 = this.y + this.height / 2;

	this.geometry = new THREE.BoxGeometry(this.width, this.height, 20);
	this.material = new THREE.MeshPhongMaterial()
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position.x = this.x;
	this.mesh.position.y = - this.y;
	scene.add(this.mesh);
}

animate(obj) {
	this.mesh.position.x = obj.x;
	this.mesh.position.y = - obj.y;
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
 * @brief checks if a given canvasObject is in contact
 * @param {CanvasObject} object to check
 * @returns true if is in contact, false otherwise
 */
objectHits(object) {
	let horizontal_check = true;
	let vertical_check = true;

	const horizontal_proyection_center = Math.abs(this.x - object.x);
	const horizontal_proyection_obj1 = Math.abs(this.x - this.point_x2);
	const horizontal_proyection_obj2 = Math.abs(object.x - object.point_x2);
	
	if ((horizontal_proyection_obj1 + horizontal_proyection_obj2) < horizontal_proyection_center)
		horizontal_check = false;

	const vertical_proyection_center = Math.abs(this.y - object.y);
	const vertical_proyection_obj1 = Math.abs(this.y - this.point_y2);
	const vertical_proyection_obj2 = Math.abs(object.y - object.point_y2);

	if ((vertical_proyection_obj1 + vertical_proyection_obj2) < vertical_proyection_center)
		vertical_check = false;

	return horizontal_check && vertical_check;
}

/**
 * @brief moves the object in (x, y), it DOESN'T move to global (x,y),
 * it moves from current position in (x, y)
 * @param {int} dirX direction in x axis
 * @param {int} dirY direction in y axis
*/
slide(dirX, dirY) {
	let length = Math.hypot(dirX, dirY);
	if (length > 0) {
	    dirX /= length;
	    dirY /= length;
	}

	this.x += this.speed * dirX;
	this.y += this.speed * dirY;
	
	this.dirX = dirX;
	this.dirY = dirY;
	
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
	this.slide(this.dirX, this.dirY);
	for (let i = 0; i < canvas_objects.length; i++) {
		if (canvas_objects[i] != this && this.objectHits(canvas_objects[i]))
			this.resolveHit(canvas_objects[i]);
	}
}

/**
 * @brief uptades the object state when is hitted
 * @param {CanvasObject} canvas_object object in contact
 */
resolveHit(canvas_object) {
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

	if (this.point_y1 < this.canvas.height / 8)
		this.moveTo(this.x, (this.canvas.height / 8) + ((this.point_y3 - this.point_y1) / 2));
	else if (this.point_y3 > this.canvas.height)
		this.moveTo(this.x, this.canvas.height - ((this.point_y3 - this.point_y1) / 2));
}

/**
 * @param {float} x x value
 * @param {float} y y value
 * @returns the direction (in form of an angle in degrees) of the given vector
 */
vector_dir(x, y)  {
	const a = Math.atan(Math.abs(y) / Math.abs(x)) * (180 / Math.PI);

	if (x >= 0 && y >= 0)
		return a;
	if (x <= 0 && y > 0)
		return 180 - a;
	if (x <= 0 && y <= 0)
		return 180 + a;
	if (x > 0 && y < 0)
		return 360 - a;
}

/**
 * @param {int} angle angle value in degrees
 * @returns a string with the corresponding North, East, South or West from a given angle
 */
position_view(angle) {
	if (angle >= 45 && angle < 135)
		return "North"
	if (angle >= 135 && angle < 225)
		return "East"
	if (angle >= 225 && angle < 315)
		return "South";
	return "West";
}
}

export { CanvasObject };
