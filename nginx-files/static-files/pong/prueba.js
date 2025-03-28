import pong from "./pong.js"

const form = document.getElementById("dataForm");

form.addEventListener("submit", (event) => {
	event.preventDefault();
	const config = {};
	let data_to_send = [];

	(new FormData(form)).forEach((value, key) => config[key] = value);
	config.timeout = parseInt(config.timeout) * 1000;
	config.max_score = parseInt(config.max_score);
	config.type = "config";

	switch(config.map) {
	case "doubleBall":
		data_to_send = doubleBallMap(config);
		break;
	case "floating":
		data_to_send = floatingMap(config);
		break;
	default:
		data_to_send = defaultMap(config);
	}

	const jsonData = JSON.stringify(data_to_send);

	const game_container = document.getElementById("canvas_container");
	game_container.innerHTML = `<canvas id="pong" width="800" height="400" style="border: 2px solid ${config.counter_color}"></canvas>`;

	pong(jsonData);
});

function defaultMap(config) {
	const data_to_send = [];

	const player1 = {
		pk: -1,
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
		pk: -1,
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

	data_to_send.push(config);
	data_to_send.push(player1);
	data_to_send.push(player2);
	data_to_send.push(ball);
	data_to_send.push(counter);
	
	return data_to_send;
}

function doubleBallMap(config) {
	const data_to_send = [];

	const player1 = {
		pk: -1,
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
		pk: -1,
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

	const ball1 = {
		id: "ball1",
		type: "ball",
		color: config.ball_color,
		x: 390,
		y: 200,
		dirX: -1,
		dirY: -1,
		radius: 10
	};

	const ball2 = {
		id: "ball2",
		type: "ball",
		color: config.ball_color,
		x: 410,
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

	data_to_send.push(config);
	data_to_send.push(player1);
	data_to_send.push(player2);
	data_to_send.push(ball1);
	data_to_send.push(ball2);
	data_to_send.push(counter);
	
	return data_to_send;
}

function floatingMap(config) {
	const data_to_send = [];

	const player1 = {
		pk: -1,
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
		pk: -1,
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

	const floating1 = {
		id: "floating1",
		type: "floating",
		color: config.counter_color,
		x: 225,
		y: 200,
		width: 42,
		height: 42,
		dirY: 1
	};

	const floating2 = {
		id: "floating2",
		type: "floating",
		color: config.counter_color,
		x: 575,
		y: 200,
		width: 42,
		height: 42,
		dirY: -1
	};

	const counter = {
		id: "counter",
		type: "counter",
		color: config.counter_color,
		x: 400,
		y: 10,
		font: "42px Arial"
	};

	data_to_send.push(config);
	data_to_send.push(player1);
	data_to_send.push(player2);
	data_to_send.push(ball);
	data_to_send.push(floating1);
	data_to_send.push(floating2);
	data_to_send.push(counter);
	
	return data_to_send;
}
