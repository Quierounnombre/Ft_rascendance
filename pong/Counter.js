import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Counter extends CanvasObject {
/**
 * @param obj individual object of parsed with JSON.parse()
 */
constructor(obj) {
	super(obj);
	this.player1_score = 0;
	this.player2_score = 0;
}

render() {
	this.context.font = this.font;// TODO: quizas hacer esto en bucle es innecesario
	this.context.fillStyle = this.color;

	this.context.textAlign = "end";
	this.context.fillText(`${this.player1_score}`, this.canvas.width / 4, this.canvas.height / 8);

	this.context.textAlign = "start";
	this.context.fillText(`${this.player2_score}`, (this.canvas.width / 4) * 3, this.canvas.height / 8);
}

pointHits() {
	return false;
}
}

export {Counter}
