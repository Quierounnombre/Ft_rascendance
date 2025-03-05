import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Counter extends CanvasObject {
/**
 * @param obj individual object of parsed with JSON.parse()
 * @param canvas instance of the canvas
 * @param context instance of the context
 */
constructor(obj, canvas, context) {
	super(obj, canvas, context);
	this.timeout = 60000;

	this.player1_score = 0;
	this.player2_score = 0;
	this.highest_score = 0;

	this.x = -1;
	this.y = -1;
	this.width = 0;
	this.height = 0;
	this.recalculateHitbox();

	this.time_passed = 0;
	this.start_time = Date.now();
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
	const minutes = Math.trunc((time / 60000) % 60);
	const seconds = Math.trunc((time / 1000) % 60);

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
