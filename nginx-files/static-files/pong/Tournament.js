import { Game } from "./Game.js"
import getUser from "../getUser.js"
import generateRandomString from "../generateRandomString.js";
import { onGoing } from "./pong.js";
import { getCookie } from "../cookiesManagement.js";
import translatePage from "../translate.js";
"use strict";

class Tournament {
constructor(colors) {
	this.colors = colors
	this.game_round = []
}

createTournament(game_config, number_players) {
	this.tournament_name = generateRandomString(8);

	this.websocket = new WebSocket(
		'wss://'
		+ window.location.hostname
		+ ":" + window.location.port
		+ '/ws/tournament/'
		+ this.tournament_name
		+ '/'
	)

	this.websocket.onopen = () => {
		console.log(`Tournament WebSocket opened`);

		this.websocket.send(JSON.stringify({
			"type": "create.tournament",
			"message": {
				"tournament_name": this.tournament_name,
				"number_players": number_players,
				"game_config": game_config
			}
		}));
	}

	this.websocket.onclose = websocket_close.bind(this);
	this.websocket.onmessage = server_msg.bind(this);

	return this.room_name;
}

joinTournament(tournament_name) {
	this.tournament_name = tournament_name;

	this.websocket = new WebSocket(
		'wss://'
		+ window.location.hostname
		+ ":" + window.location.port
		+ '/ws/tournament/'
		+ this.tournament_name
		+ '/'
	)

	this.websocket.onopen = () => {
		console.log(`Tournament WebSocket opened`);

		getUser(getCookie("token")).then((user) => {
			this.user_id = user.id;
			this.user_name = user.username;

			this.websocket.send(JSON.stringify({
				"type": "identify",
				"message": {
					"user_id": this.user_id,
					"user_name": this.user_name,
				}
			}))

			this.websocket.send(JSON.stringify({
				"type": "join.tournament",
				"message": {
					"tournament_name": this.tournament_name
				}
			}))
		});
	}


	this.websocket.onclose = websocket_close.bind(this);
	this.websocket.onmessage = server_msg.bind(this);
}

}

//------------------------------------------------------------------------------
function server_msg(event) {
	const data = JSON.parse(event["data"]);

	switch(data["type"]) {
	case "tournament.created":
		this.tournament_name = data["message"]["tournament_name"];

		const container = document.createElement("div");
		container.setAttribute("class", "container");

		const title = document.createElement("h2");
		title.setAttribute("class", "h2 display-1");
		title.setAttribute("style", "text-align: center")
		title.setAttribute("data-i18n-key", "tournament-code");

		const code = document.createElement("h3");
		code.setAttribute("class", "h3 display-1");
		code.setAttribute("style", "text-align: center")
		code.innerHTML = `${this.tournament_name}`;

		// TODO: todas estas cosas tendrian que tener ids y demas cosas para la accesibilidad

		container.appendChild(title);
		container.appendChild(code);
		document.getElementById("root").replaceChildren(container);
		translatePage();

		this.joinTournament(this.tournament_name);
		break;

	case "tournament.started":
		this.tournament_name = data["message"]["tournament_name"];
		break;

	case "tournament.ended":
		const parsed_ranking = JSON.parse(data["message"]);
		const table = create_table(parsed_ranking);

		document.getElementById("root").replaceChildren(table);
		this.websocket.close();
		break;
    
	case "next.round":
		// TODO: una alerta? notificacion? redireccion?
		break;

	case "create.tournament.game":
		this.game_round = new Game(this.colors);
		onGoing.game = this.game_round;

		this.game_round.game_config = data["message"]["game_config"];
		this.game_round.room_name = data["message"]["room_name"];

		this.tournament_name = data["message"]["tournament_name"];
		this.room_name = data["message"]["room_name"];
		this.game_round.tournament_name = data["message"]["tournament_name"]

		this.game_round.createRoom(data["message"]["game_config"], this.room_name);
		break;

	case "join.tournament.game":
		this.game_round = new Game(this.colors);
		onGoing.game = this.game_round;

		this.game_round.room_name = data["message"]["room_name"];

		this.tournament_name = data["message"]["tournament_name"];
		this.room_name = data["message"]["room_name"];

		this.game_round.tournament_name = data["message"]["tournament_name"]

		// TODO: el que se une no le llega estados del juego
		this.game_round.joinRoom(this.room_name);
		break;
	
	case "game.end":
		this.game_round = []
		break;

	case "error":
		const tmp3 = document.createElement("h3");
		tmp3.setAttribute("class", "h3 display-1");
		tmp3.setAttribute("style", "text-align: center");

		switch(data["message"]["code"]) {
		case "NOTEXIST":
			tmp3.setAttribute("data-i18n-key", "tournament-NOTEXIST");
			break;

		case "ROOMFULL":
			tmp3.setAttribute("data-i18n-key", "tournament-ROOMFULL");
			break;

		case "LOWPLAYERS":
		case "HIGHPLAYERS":
		case "ODDPLAYERS":
			tmp3.setAttribute("data-i18n-key", "easter-egg");
			break;

		default:
			break;
		}

		document.getElementById("root").replaceChildren(tmp3);
		translatePage();

		this.websocket.close();
		delete onGoing.game;
		document.addEventListener("keydown", (event) => {});
		document.addEventListener("keyup", (event) => {});
		break;
	}
}

function create_table(data) {
	const h1 = document.createElement("th");
	h1.innerHTML = "Participants";
	h1.setAttribute("data-i18n-key", "hist-par");

	const h2 = document.createElement("th");
	h2.innerHTML = "Result";
	h2.setAttribute("data-i18n-key", "hist-res");

	const h0 = document.createElement("tr");
	h0.appendChild(h1);
	h0.appendChild(h2);

	const header = document.createElement("thead");
	header.appendChild(h0);

	const body = document.createElement("tbody");
	for (let i in data) {
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${data[i][0]}</td>
			<td>${data[i][1]}</td>
		`;
		body.appendChild(row);
	}

	const table= document.createElement("table");
	table.setAttribute("class", "table");

	table.appendChild(header);
	table.appendChild(body);

	return table
}

function websocket_close() {
	console.log(`Tournament WebSocket closed`);
}

export {Tournament}
