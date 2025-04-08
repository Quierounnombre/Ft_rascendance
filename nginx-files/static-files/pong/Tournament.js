import { Game } from "./Game.js"
import generateRandomString from "./Game.js";
"use strict";

class Tournament {
constructor(colors) {
	self.colors = colors
	this.game_round = []
}

createTournament(game_config) {
	this.tournament_name = generateRandomString(8);

	this.websocket = new WebSocket(
		'wss://'
		+ window.location.hostname
		+ ':7000/ws/tournament/'
		+ this.tournament_name
		+ '/'
	)

	this.websocket.onopen = () => {
		console.log(`WebSocket opened`);

		this.websocket.send(JSON.stringify({
			"type": "create.tournament",
			"message": {
				"tournament_name": this.tournament_name,
				"data": game_config
			}
		}));
	}

	this.websocket.onclose = websocket_close.bind(this);
	this.websocket.onmessage = server_msg.bind(this);

	return this.room_name;
}

}

//------------------------------------------------------------------------------
function server_msg(event) {
	const data = JSON.parse(event["data"]);

	switch(data["type"]) {
	case "tournament.created":
		this.tournament_name = data["message"]["tournament_name"]

		// TODO: debug temporal
		const tmp = document.createElement("div");
		tmp.innerHTML = `${this.tournament_name}`
		document.getElementById("root").replaceChildren(tmp);


		getUser(localStorage.getItem("token")).then((user) => {
			this.user_id = user.id;
			this.user_name = user.username;

			this.websocket.send(JSON.stringify({
				"type": "identity",
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
		break;

	case "tournament.started":
		this.tournament_name = data["message"]["tournament_name"]
		break;
    
	case "next.round":
		this.game_round = new Game(this.colors)
		break;

	case "create.tournament.game":
		this.game_round.game_config = data["message"]["game_config"]
		this.game_round.room_name = data["message"]["room_name"]

		this.tournament_name = data["message"]["tournament_name"]
		this.room_name = data["message"]["room_name"]

		this.game_round.createRoom(data["message"]["game_config"], this.room_name)
		break;

	case "join.tournament.game":
		this.game_round.room_name = data["message"]["room_name"];

		this.tournament_name = data["message"]["tournament_name"]
		this.room_name = data["message"]["room_name"]

		this.game_round.joinRoom(this.room_name);
		break;
	
	case "game.end":
		this.game_round = []
		break;
	}
}

function websocket_close() {
	console.log(`WebSocket closed`);
}

export {Tournament}
