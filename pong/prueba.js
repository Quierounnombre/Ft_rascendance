import pong from "./pong.js"

const form = document.getElementById("dataForm");

form.addEventListener("submit", (event) => {
	event.preventDefault();
	const config = {};

	(new FormData(form)).forEach((value, key) => config[key] = value);
	config.timeout = parseInt(config.timeout) * 1000;
	config.max_score = parseInt(config.max_score);
	config.type = "config";
	// TODO: cambiar el switch de power ups a true/false

	const player1 = {
		id: "player1",
		type: "player",
		color: config.player1_color,
		x: 10,
		y: 200,
		width: 20,
		height: 100,
		speed: 2,
		move_up: "w",
		move_down: "s"
	};

	const player2 = {
		id: "player2",
		type: "player",
		color: config.player2_color,
		x: 790,
		y: 200,
		width: 20,
		height: 100,
		speed: 2,
		move_up: "ArrowUp",
		move_down: "ArrowDown"
	};

	const ball = {
		id: "ball",
		type: "ball",
		color: config.ball_color,
		x: 400,
		y: 200,
		dirX: 1,
		dirY: 1,
		radius: 10
	};

	const counter = {
		id: "counter",
		type: "counter",
		color: config.counter_color,
		x: 400,
		y: 10,
		font: "42px Arial"
	};

	const tmp = [];

	tmp.push(config);
	tmp.push(player1);
	tmp.push(player2);
	tmp.push(ball);
	tmp.push(counter);

	const jsonData = JSON.stringify(tmp);
	const game_container = document.getElementById("canvas_container");
	game_container.innerHTML = `<canvas id="pong" width="800" height="400"></canvas>`;
	console.log(JSON.parse(jsonData));
	pong(jsonData);
});
