import { CanvasObject } from "./CanvasObject.js";
"use strict";

class Counter extends CanvasObject {
constructor (canvas, context, font = "42px arial", color = "white", id = "counter") {
	super(canvas, context, 0, 0, 0, 0, color, id);
	this.type = "counter";
	this.font = font;
	this.player1_score = 0;
	this.player2_score = 0;
}

render() {
	this.context.font = this.font;// TODO: quizas hacer esto en bucle es innecesario

	let text = `[${this.player1_score} | ${this.player2_score}]`;
	let text_width = this.context.measureText(text).width;
	// this.context.textAlign = "end";
	this.context.fillText(text, (this.canvas.width - text_width) / 2, this.canvas.height / 8);
}

pointHits() {
	return false;
}
}

export {Counter}
