import pong from "./pong/pong.js"

const gameCreator = document.createElement("div");
gameCreator.setAttribute("id", "canvas_container");
gameCreator.setAttribute("class", "container");
gameCreator.innerHTML = `
<h2>Create room</h2>
<form id="dataForm" class="container">
		<div class="form-floating">
			<input required type="number" name="timeout" id="timeout" class="form-control" aria-describedby="timeout of the game" min="30" max="180" value="60">
			<label for="timeout" class="form-label">Maximum time of the game in seconds</label>
		</div>

		<div class="form-floating">
			<input required type="number" name="max_score" id="max_score" class="form-control" aria-describedby="maximum score of the game" min="1" max="42" value="3">
			<label for="max_score" class="form-label">Maximum score for a player</label>
		</div>
		
		<div class="form-floating">
			<select class="form-select" name="map" id="map" aria-label="map">
				<option selected ="default" value="default">Default map</option>
				<option value="doubleBall">Two balls map</option>
				<option value="floating">Floating things map</option>
			</select>
			<label for="map" class="form-label">Maximum score for a player</label>
		</div>

		<div class="form-floating">
			<input type="color" class="form-control form-control-color" name="background_color" id="background_color" value="#000000">
			<label for="background_color" class="form-label">Color picker for backgound color</label>
		</div>

		<div class="form-floating">
			<input type="color" class="form-control form-control-color" name="player1_color" id="player1_color" value="#FFFFFF">
			<label for="player1_color" class="form-label">Color picker for player1 color</label>
		</div>

		<div class="form-floating">
			<input type="color" class="form-control form-control-color" name="player2_color" id="player2_color" value="#FFFFFF">
			<label for="player2_color" class="form-label">Color picker for player2 color</label>
		</div>

		<div class="form-floating">
			<input type="color" class="form-control form-control-color" name="ball_color" id="ball_color" value="#FFFFFF">
			<label for="ball_color" class="form-label">Color picker for ball color</label>
		</div>

		<div class="form-floating">
			<input type="color" class="form-control form-control-color" name="counter_color" id="counter_color" value="#FFFFFF">
			<label for="counter_color" class="form-label">Color picker for counter color</label>
		</div>

		<!-- <div class="form-check form-switch">
			<label class="form-check-label" for="flexSwitchCheckDefault">Power Ups</label>
			<input name="power-up" class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
		</div> -->
		<button type="submit" name="submit" id="submit" class="btn btn-primary">Submit</button>
	</form>

<h2>Join room</h2>
<form id="dataForm2" class="container">
	<div class="form-floating">
		<input required name="room_name2" id="room_name2" type="text" class="form-control" size="100">
		<label class="form-label" for="room_name2">Join pong room</label>
	</div>
	<button type="submit" name="submit" id="submit" class="btn btn-primary">Submit</button>
</form>
`;

// TODO: esta sera la funcion para crear salas, para unirse deberia ir por otro lado
export default function loadGame() {
	const root = document.getElementById("root");
	root.replaceChildren(gameCreator);
	const form = document.getElementById("dataForm");
	const form2 = document.getElementById("dataForm2");


	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const config = {};
		let data_to_send = [];

		(new FormData(form)).forEach((value, key) => config[key] = value);
		config.timeout = parseInt(config.timeout);
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

		pong("create_room", jsonData);
	});

	form2.addEventListener("submit", (event) => {
		event.preventDefault();
		const room_name = document.getElementById("room_name2").value;

		pong("join_room", room_name);
	});
}


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
