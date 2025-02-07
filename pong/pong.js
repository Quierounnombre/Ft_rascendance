import { Player } from "./Player.js"
import { Ball } from "./Ball.js"
import { Counter } from "./Counter.js"

const g_canvas = document.getElementById("pong");
const g_context = g_canvas.getContext("2d");

document.addEventListener("keyup", keyUpHandler);
document.addEventListener("keydown", keyDownHandler);

// TODO: que los valores de configuracion se importen de algun lado
const PLAYER_WIDTH     = 20;
const PLAYER_HEIGHT    = 100;
const BALL_RADIUS      = 10;
const SPEED            = 4;
const OBJECT_COLOR     = "white";
const BACKGROUND_COLOR = "black";

const canvas_objects = [];

const player1 = new Player(
	g_canvas,
	g_context,
	PLAYER_WIDTH / 2,
	(g_canvas.height - PLAYER_HEIGHT + PLAYER_HEIGHT) / 2,
	PLAYER_WIDTH,
	PLAYER_HEIGHT,
	OBJECT_COLOR,
	"player1",
);

const player2 = new Player(
	g_canvas,
	g_context,
	g_canvas.width - (PLAYER_WIDTH / 2),
	(g_canvas.height - PLAYER_HEIGHT + PLAYER_HEIGHT) / 2,
	PLAYER_WIDTH,
	PLAYER_HEIGHT,
	OBJECT_COLOR,
	"player2",
)

const counter = new Counter(
	g_canvas,
	g_context,
	"42px arial",
	OBJECT_COLOR,
	"counter",
)

const ball = new Ball(
	g_canvas,
	g_context,
	g_canvas.width / 2,
	g_canvas.height / 2,
	BALL_RADIUS,
	counter,
	OBJECT_COLOR,
	"ball",
);

function keyUpHandler(event) {
	if (event.key === "ArrowUp" || event.key === "ArrowDown") {
		player2.is_moving = false;
	}
	else if (event.key === "w" || event.key === "s") {
		player1.is_moving = false;
	}
}

function keyDownHandler(e) {
	if (e.key === "ArrowUp") {
		player2.dirY = -2;
		player2.is_moving = true;
	}
	else if (e.key === "ArrowDown") {
		player2.dirY = 2;
		player2.is_moving = true;
	}
	else if (e.key === "w") {
		player1.dirY = -2;
		player1.is_moving = true;
	}
	else if (e.key === "s") {
		player1.dirY = 2;
		player1.is_moving = true;
	}
}

function game_loop() {
	g_context.fillStyle = BACKGROUND_COLOR;
	g_context.fillRect(0, 0, g_canvas.width, g_canvas.height);
	g_context.beginPath();
	g_context.strokeStyle = OBJECT_COLOR;
	g_context.lineWidth = "2";
	g_context.moveTo(g_canvas.width / 2, 0);
	g_context.lineTo(g_canvas.width / 2, g_canvas.height);
	g_context.closePath();
	g_context.stroke();

	for (let i = 0; i < canvas_objects.length; i++) {
		canvas_objects[i].update(canvas_objects); // TODO: antes o despues de render?
		canvas_objects[i].render();
		canvas_objects[i].renderHitBox();
	}

	// TODO: esto es debug, borrar------------------------------------------
	// g_context.beginPath();
	// g_context.strokeStyle = "magenta";
	// g_context.moveTo(0, 0);
	// g_context.lineTo(g_canvas.width, g_canvas.height);
	// g_context.moveTo(g_canvas.width, 0);
	// g_context.lineTo(0, g_canvas.height);
	// g_context.moveTo(0, g_canvas.height / 2);
	// g_context.lineTo(g_canvas.width, g_canvas.height / 2);
	// g_context.moveTo(g_canvas.width / 2, 0);
	// g_context.lineTo(g_canvas.width / 2, g_canvas.height);
	// g_context.closePath();
	// g_context.stroke()
	// ---------------------------------------------------------------------

	window.requestAnimationFrame(game_loop);
}

function main() {
	canvas_objects.push(player1);
	canvas_objects.push(player2);
	canvas_objects.push(ball);
	canvas_objects.push(counter);
	// TODO: counter class

	// TODO: check end of game condition
	window.requestAnimationFrame(game_loop);
}

main();
