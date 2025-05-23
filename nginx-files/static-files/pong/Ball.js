import { CanvasObject } from "./CanvasObject.js";
"use strict";
import * as THREE from 'three';
class Ball extends CanvasObject {
/**
 * @param obj individual object of parsed with JSON.parse()
 * @param canvas instance of the canvas
 * @param context instance of the context
 */
constructor(obj, canvas, scene, color) {
	super(obj, canvas, scene, color);
	this.width = this.radius * 2;
	this.height = this.radius * 2;
	this.recalculateHitbox();

	this.material.side = THREE.DoubleSide;
	this.material =  new THREE.MeshStandardMaterial({color: this.color, emissive: this.color})
	this.geometry = new THREE.SphereGeometry( this.radius );
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position.z = - this.radius + 5
	this.mesh.position.x = this.x;
	this.mesh.position.y = - this.y;
	this.light = new THREE.PointLight(0xffffff, 300, 0, 1)
	this.light.position.x = this.mesh.position.x;
	this.light.position.y = this.mesh.position.y;
	// this.light.position.z = canvas.height / (2 * Math.tan(((70 * Math.PI) / 180)/2));
	scene.add(this.mesh);
	scene.add(this.light);
}

animate(obj) {
	this.mesh.position.x = obj.x;
	this.mesh.position.y = - obj.y;
	this.light.position.x = this.mesh.position.x;
	this.light.position.y = this.mesh.position.y;
}

/**
 * @brief calculate if the object is outside the canvas, and moves it to
 * the border
 */
keepInsideCanvas() {
	if (this.point_x1 < 0) {
		this.moveTo(this.canvas.width / 2, this.canvas.height / 2);
		this.counter.player2_score += 1;
		this.dirY = -1;
		this.dirX = -1;
		this.speed = 4;
	} else if (this.point_x2 > this.canvas.width) {
		this.moveTo(this.canvas.width / 2, this.canvas.height / 2);
		this.dirY = 1;
		this.dirX = 1;
		this.speed = 4;
		this.counter.player1_score += 1;
	}
	
	if (this.point_y1 < this.canvas.height / 8) {
		this.moveTo(this.x, (this.canvas.height / 8) + ((this.point_y3 - this.point_y1) / 2));
		this.dirY = -this.dirY;
	} else if (this.point_y3 > this.canvas.height) {
		this.moveTo(this.x, this.canvas.height - (this.point_y3 - this.point_y1) / 2);
		this.dirY = -this.dirY;
	}
}

/**
 * @brief uptades the object state when is hitted
 * @param {CanvasObject} canvas_object object in contact
 */
resolveHit(canvas_object) {
	this.repel_from_object(canvas_object);

	this.dirX = -this.dirX;

	if (canvas_object.type === "player") {
		if (canvas_object.dirY === 0)
			this.dirY = 0;
		else
			this.dirY = -(canvas_object.dirY / Math.abs(canvas_object.dirY));

		this.speed = (this.speed < 20) ? (this.speed + 0.5) : 20;
	} else 
		this.dirY = -this.dirY;
}

/**
 * @brief updates the info of the object, it includes movement and collisions
 * @param {CanvasObject[]} canvas_objects objects in the current canvas
 */
update(canvas_objects) {
	if (this.dirY === 0)
		this.dirY = 0.01;
	super.update(canvas_objects);
}

/**
 * @brief undoes the movement till hit
 * @param {CanvasObject} canvas_object object hitted
 */
repel_from_object(canvas_object) {
	const old_speed = this.speed;
	const old_dirX = this.dirX;
	const old_dirY = this.dirY;

	this.speed = 1;
	while (this.objectHits(canvas_object))
		this.slide(-old_dirX, -old_dirY);

	this.speed = old_speed;
	this.dirX = old_dirX;
	this.dirY = old_dirY;
}
}

export {Ball};
