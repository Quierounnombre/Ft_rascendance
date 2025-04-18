import {tournament_create_room} from "./pong/pong.js"
import {tournament_join_room} from "./pong/pong.js"
import translatePage from "./translate.js";
import {getMapForm, defaultMap, doubleBallMap, bigBallMap, floatingMap, bigBallLittleBallMap} from "./gameMaps.js"
import {getCookie} from "./cookiesManagement.js"

async function getColors() {
	const token = getCookie("token")
	const response =  await fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/colors/", {
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

export default async function loadTournament() {
	const map_selector = getMapForm();
	const gameCreator = document.createElement("div");
	gameCreator.setAttribute("id", "canvas_container");
	gameCreator.setAttribute("class", "container");
	gameCreator.innerHTML = `
	<div>
	<div id="liveAlertPlaceholder"></div>
	<h2 data-i18n-key="make-tourn">Create tourn</h2>
	<form id="dataForm" class="container">
			<div class="form-floating">
				<input required type="number" name="timeout" id="timeout" class="form-control" aria-describedby="timeout of the game" min="30" max="180" value="60">
				<label for="timeout" data-i18n-key="max-time" class="form-label">Maximum time of the game in seconds</label>
			</div>

			<div class="form-floating">
				<input required type="number" name="max_score" id="max_score" class="form-control" aria-describedby="maximum score of the game" min="1" max="42" value="3">
				<label for="max_score" data-i18n-key="max-score" class="form-label">Maximum score for a player</label>
			</div>

			${map_selector}

			<div class="form-floating">
				<input required type="number" name="tourn_player_num" id="tourn_player_num" class="form-control" aria-describedby="Number of players for the tournament" min="4" max="42" value="4">
				<label for="tourn_player_num" data-i18n-key="tourn_player_num" class="form-label">Number of players</label>
			</div>

			<button type="submit" data-i18n-key="crea-submit" name="submit" id="submit" class="btn btn-primary">Submit</button>
		</form>
	</div>
	<div>
	<h2 data-i18n-key="join-tourn" class="me-3">Join tourn</h2>
	<form id="dataForm2" class="container">
		<div class="form-floating">
			<input required name="tourn_name2" id="tourn_name2" type="text" class="form-control" size="100">
			<label class="form-label" for="tourn_name2" data-i18n-key="join-form">Join pong tourn</label>
		</div>
		<button type="submit" name="submit" data-i18n-key="join-submit" id="submit" class="btn btn-primary">Submit</button>
	</form>
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

		const number_players = config.tourn_player_num;
		delete config.tourn_player_num;

		if (number_players % 2 != 0) {
			put_alert("error-pair-tournament", "Please, put a pair number of participants to the tournament");
			return;
		}

		if (number_players < 4) {
			put_alert("error-number-tournament", "Please, put a valid number of participants to the tournament. Hint: put a number between 4 and 42, both inclusive");
			return;
		}

		switch(config.map) {
		case "doubleBall":
			data_to_send = doubleBallMap(config);
			break;
		case "floatingMap":
			data_to_send = floatingMap(config);
			break;
		case "bigBallMap":
			data_to_send = bigBallMap(config);
			break;
		case "bigBallLittleBallMap":
			data_to_send = bigBallLittleBallMap(config);
			break;
		default:
			data_to_send = defaultMap(config);
		}

		const jsonData = JSON.stringify(data_to_send);

		const game_container = document.getElementById("canvas_container");
		game_container.innerHTML = `<canvas id="pong" width="800" height="400" style="border: 2px solid ${config.counter_color}"></canvas>`;

		tournament_create_room(jsonData, number_players, colors);
	});

	form2.addEventListener("submit", (event) => {
		event.preventDefault();
		const tournament_name = document.getElementById("tourn_name2").value;

		const tmp = document.createElement("h2");
		tmp.setAttribute("class", "h2 display-1");
		tmp.setAttribute("style", "text-align: center");
		tmp.setAttribute("data-i18n-key", "waiting-room");
		document.getElementById("root").replaceChildren(tmp);
		translatePage()

		tournament_join_room(tournament_name, colors);
	});
}

// TODO: esto se puede reutilizar en todos los errores?
function put_alert(id, msg) {
	const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
	const wrapper = document.createElement('div')

	wrapper.innerHTML = `
		<div class="alert alert-danger alert-dismissible" role="alert">
			<div data-i18n-key="${id}">${msg}</div>
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
	`;

	alertPlaceholder.append(wrapper);
	translatePage();
}
