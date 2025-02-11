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
	this.player1_score = 0;
	this.player2_score = 0;
}

render() {
	this.context.font = this.font;// TODO: quizas hacer esto en bucle es innecesario
	this.context.fillStyle = this.color;
	this.context.strokeStyle = "black"; // TODO: harcoded
	this.context.lineWidth = "1";

	this.context.textAlign = "end";
	this.context.strokeText(`${this.player1_score}`, this.canvas.width / 4, this.canvas.height / 8);
	this.context.fillText(`${this.player1_score}`, this.canvas.width / 4, this.canvas.height / 8);

	this.context.textAlign = "start";
	this.context.strokeText(`${this.player2_score}`, (this.canvas.width / 4) * 3, this.canvas.height / 8);
	this.context.fillText(`${this.player2_score}`, (this.canvas.width / 4) * 3, this.canvas.height / 8);
}

pointHits() {
	return false;
}
}

export {Counter}
