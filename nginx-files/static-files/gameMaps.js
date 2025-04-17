
export function getMapForm() {
	return (`
		<div class="form-floating">
			<select class="form-select" name="map" id="map" aria-label="map">
				<option data-i18n-key="map-default" selected ="default" value="default">Default map</option>
				<option data-i18n-key="map-two" value="doubleBall">Two balls map</option>
				<option data-i18n-key="map-float" value="floating">Floating things map</option>
			</select>
			<label for="map" class="form-label" data-i18n-key="map-select" >Map selection</label>
		</div>
	`)
}

export function defaultMap(config) {
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

export function doubleBallMap(config) {
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

export function floatingMap(config) {
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

export default {defaultMap, doubleBallMap, floatingMap};