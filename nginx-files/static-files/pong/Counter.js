import { CanvasObject } from "./CanvasObject.js";
"use strict";
import * as THREE from 'three';

class Counter extends CanvasObject {
/**
 * @param obj individual object of parsed with JSON.parse()
 * @param canvas instance of the canvas
 * @param context instance of the context
 */
constructor(obj, canvas, context, scene) {
	super(obj, canvas, context, scene);
	this.canvas =  canvas.cloneNode();
	this.canvas.setAttribute("height", canvas.height / 8);
	this.geometry = new THREE.BoxGeometry(this.canvas.width, this.canvas.height, 40);
	this.texture = new THREE.CanvasTexture(this.canvas);
	this.texture.needsUpdate = true;
	this.material = new THREE.MeshPhongMaterial({map: this.texture});
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position.x = this.canvas.width / 2;
	this.mesh.position.y = - this.canvas.height / 2;
	this.mesh.position.z = - 10;
	scene.add(this.mesh);
}

animate(obj) {
	this.mesh.position.x = this.canvas.width / 2;
	this.mesh.position.y = - this.canvas.height / 2;
	const ctx = this.canvas.getContext("2d");
	ctx.fillStyle = "red";
	ctx.fillRect(0, 0, 100, 50);
	this.texture.needsUpdate = true;
}

setStartTime(time) {
	// TODO: deprecated?
	this.start_time = time;
}

/**
 * @brief updates the time passed since creation and the highest score in the current game
 * @param {CanvasObject[]} canvas_objects in the current canvas
 */
update(canvas_objects) {
	this.time_passed = Date.now() - this.start_time;
	this.highest_score = (this.player1_score > this.player2_score) ? this.player1_score : this.player2_score;
}

/**
 * @brief renders the scores and the countdown
 */
render() {
	const time = this.timeout - this.time_passed;
	const minutes = Math.trunc((time / 60) % 60);
	const seconds = Math.trunc(time % 60);

	this.context.font = this.font;
	this.context.fillStyle = this.color;
	this.context.lineWidth = "1";

	this.context.textAlign = "center";
	this.context.fillText(`:`, this.canvas.width / 2, this.canvas.height / 8 * 0.775);

	this.context.textAlign = "end";
	this.context.fillText(`${this.player1_score}`, this.canvas.width / 4, this.canvas.height / 8 * 0.775);
	this.context.fillText(`${minutes}`, (this.canvas.width / 25) * 12, this.canvas.height / 8 * 0.775);

	this.context.textAlign = "start";
	this.context.fillText(`${this.player2_score}`, (this.canvas.width / 4) * 3, this.canvas.height / 8 * 0.775);
	this.context.fillText(`${seconds}`, (this.canvas.width / 25) * 13, this.canvas.height / 8 * 0.775);
}
}

export {Counter}
