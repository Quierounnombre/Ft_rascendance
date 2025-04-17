import {game_create_room} from "./pong/pong.js"
import {game_join_room} from "./pong/pong.js"
import { getMapForm, defaultMap, doubleBallMap, floatingMap} from "./gameMaps.js"

async function getColors() {
	const token = localStorage.getItem("token")
	const response =  await fetch("https://" + window.location.hostname +":" + window.location.port + "/profile/colors/", {
		method: "GET",
		headers: {
			"Authorization": "Token " + token,
		}
	});
	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		return -1;
	}
}

export default async function loadOnline() {
	const map_selector = getMapForm();
	const gameCreator = document.createElement("div");
	gameCreator.setAttribute("id", "canvas_container");
	gameCreator.setAttribute("class", "container");
	gameCreator.innerHTML = `
	<div>

	<div class="d-flex">
	<h2 class="me-3" data-i18n-key="make-online">Create Online room</h2><i class="bi bi-globe2" style="font-size:2rem;"></i>
	</div>
	<form id="dataForm" class="container mb-4">
			<div class="form-floating">
				<input required type="number" name="timeout" id="timeout" class="form-control" aria-describedby="timeout of the game" min="30" max="180" value="60">
				<label for="timeout" data-i18n-key="max-time" class="form-label">Maximum time of the game in seconds</label>
			</div>

			<div class="form-floating">
				<input required type="number" name="max_score" id="max_score" class="form-control" aria-describedby="maximum score of the game" min="1" max="42" value="3">
				<label for="max_score" data-i18n-key="max-score" class="form-label">Maximum score for a player</label>
			</div>

			${map_selector}

			<button type="submit" data-i18n-key="crea-submit" name="submit" id="submit" class="btn btn-primary">Submit</button>
		</form>
	</div>
	<div>
	<h2 data-i18n-key="join-room" class="me-3">Join room</h2>
	<form id="dataForm2" class="container">
		<div class="form-floating">
			<input required name="room_name2" id="room_name2" type="text" class="form-control" size="100">
			<label class="form-label" for="room_name2" data-i18n-key="join-form">Join pong room</label>
		</div>
		<button type="submit" name="submit" data-i18n-key="join-submit" id="submit" class="btn btn-primary">Submit</button>
	</form>
	<a href="#game"><i class="bi bi-arrow-left-circle-fill" style="font-size:2.5rem; color:blue"></i></a>
	</div>
	`;

	const root = document.getElementById("root");
	root.replaceChildren(gameCreator);
	const form = document.getElementById("dataForm");
	const form2 = document.getElementById("dataForm2");
	const colors = await getColors();

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

		game_create_room(jsonData, colors)
	});

	form2.addEventListener("submit", (event) => {
		event.preventDefault();
		const room_name = document.getElementById("room_name2").value;

		game_join_room(room_name, colors)
	});
}
