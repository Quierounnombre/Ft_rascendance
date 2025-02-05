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

	this.context.textAlign = "end";
	this.context.fillText(`${this.player1_score}  `, this.canvas.width / 2, this.canvas.height / 8);

	this.context.textAlign = "start";
	this.context.fillText(`  ${this.player2_score}`, this.canvas.width / 2, this.canvas.height / 8);
}

pointHits() {
	return false;
}
}

export {Counter}
