import { Game } from "./Game.js"
import getUser from "../getUser.js"
import generateRandomString from "../generateRandomString.js";
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

		getUser(localStorage.getItem("token")).then((user) => {
			this.user_id = user.id;
			this.user_name = user.username;

			console.log(`${this.user_name}: ${this.user_id}`)

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

	console.log(`Tournament has recived a msg type: ${data["type"]}`)

	switch(data["type"]) {
	case "tournament.created":
		this.tournament_name = data["message"]["tournament_name"];

		// TODO: debug temporal
		const tmp = document.createElement("div");
		tmp.innerHTML = `${this.tournament_name}`;
		document.getElementById("root").replaceChildren(tmp);

		this.joinTournament(this.tournament_name);
		break;

	case "tournament.started":
		this.tournament_name = data["message"]["tournament_name"];
		break;

	case "tournament.ended":
		alert(data["message"]);
		break;
    
	case "next.round":
		// TODO: una alerta? notificacion? redireccion?
		break;

	case "create.tournament.game":
		this.game_round = new Game(this.colors);

		this.game_round.game_config = data["message"]["game_config"];
		this.game_round.room_name = data["message"]["room_name"];

		this.tournament_name = data["message"]["tournament_name"];
		this.room_name = data["message"]["room_name"];
		this.game_round.tournament_name = data["message"]["tournament_name"]

		this.game_round.createRoom(data["message"]["game_config"], this.room_name);
		break;

	case "join.tournament.game":
		this.game_round = new Game(this.colors);

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
		alert(`DEBUG: ${data["message"]["code"]}`);
		break;
	}
}

function websocket_close() {
	console.log(`Tournament WebSocket closed`);
}

export {Tournament}
