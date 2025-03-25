import { CanvasObject } from "./CanvasObject.js";
import { Counter } from "./Counter.js";
import { Ball } from "./Ball.js";
import { Player } from "./Player.js";
import { Floating } from "./Floating.js";
"use strict";

class Game {
/**
 * @param {JSON string} config string with the JSON config
 */
constructor() {	
	// TODO: sacar de la base de datos los colores preferidos por el jugador
	// objs = JSON.parse(config);
	this.canvas = document.createElement("canvas");

	// TODO: que al crear la partida se genere el canvas
	this.canvas.setAttribute("id", "pong");
	this.canvas.setAttribute("width", "800");
	this.canvas.setAttribute("height", "400");
	this.canvas.setAttribute("style", "border: 2px solid black"); // TODO: estos valores tendran que salir de la configuracion de colores del jugador

	this.context = this.canvas.getContext("2d");

	// TODO: todo esto lo puede terner el user en su configuracion, por lo que la configuracion propia de los colores iria aqui
	this.background_color = "black";
	this.object_color = "white";
}

/**
 * @brief clears all the canvas to get only the background
 */
drawBackground() {
	// Clear the canvas
	this.context.fillStyle = this.background_color;
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

	// Draw the center line
	this.context.beginPath();
	this.context.strokeStyle = this.counter.color;
	this.context.lineWidth = "2";
	this.context.moveTo(this.canvas.width / 2, this.canvas.height / 8);
	this.context.lineTo(this.canvas.width / 2, this.canvas.height);
	this.context.moveTo(0, this.canvas.height / 8);
	this.context.lineTo(this.canvas.width, this.canvas.height / 8);
	this.context.closePath();
	this.context.stroke();
}

/**
 * @returns true if game has reached any end condition, false otherwise
 */
isEnd() {
	if (this.counter.time_passed >= this.timeout)
		return true;

	if (this.counter.highest_score >= this.max_score)
		return true;

	return false;
}

/**
 * @brief game loop
 */
gameLoop() {
	let animation;

	this.websocket.send(JSON.stringify({
		"type": "direction",
		"message": {
			"room_name": this.room_name,
			"player": this.playerN,
			"dir": this.dir
		}
	}));

	this.render(this.game_state);

	if (!this.isEnd())// TODO: que sea el server quien mande que la partida ha terminado
		animation = window.requestAnimationFrame(this.gameLoop.bind(this));
	else {
		this.websocket.close();
		console.log(JSON.stringify(this)); // TODO: exportar info de la partida
		window.cancelAnimationFrame(animation);
	}
}

render(game_state) {
	const objs = JSON.parse(game_state);

	this.drawBackground();
	for (let i in objs) {
		// TODO: poner en el metodo render de los objetos el color
		switch (objs[i].type) {
		case "player":
			(new Player(objs[i], this.canvas, this.context)).render();
			break;

		case "ball":
			(new Ball(objs[i], this.canvas, this.context)).render();
			break;

		case "counter":
			(new Counter(objs[i], this.canvas, this.context)).render();
			break;

		default:
			(new CanvasObject(objs[i], this.canvas, this.context)).render();
		}
	}
}

createRoom(game_config) {
	this.room_name = generateRandomString(8);
	this.playerN = "player1";
	// this.game_config = game_config; // TODO: quizas no  haga falta

	this.websocket = new WebSocket(
		'wss://'
		+ window.location.hostname
		+ ':7000/ws/pong/'
		+ this.room_name
		+ '/'
	)

	this.websocket.onopen = () => {
		console.log(`WebSocket opened`);

		getUsers(localStorage.getItem("token")).then((user) => {
			this.user_id = user.id;

			// identificarse
			this.websocket.send(JSON.stringify({
				"type": "identify",
				"message": {
					"user_id": this.user_id
				}
			}));

			// crear la sala
			this.websocket.send(JSON.stringify({
				"type": "create.room",
				"message": {
					"room_name": this.room_name,
					"data": game_config
				}
			}));
		});
	}

	this.websocket.onclose = websocket_close;
	this.websocket.onmessage = server_msg;

	return this.room_name;
}

joinRoom(room_name) {
	this.room_name = room_name;
	this.playerN = "player2";


	this.websocket = new WebSocket(
		'wss://'
		+ window.location.hostname
		+ ':7000/ws/pong/'
		+ this.room_name // TODO: aqui seria pong_CLAVE o CLAVE?
		+ '/'
	)

	this.websocket.onopen = () => {
		console.log(`WebSocket opened`);

		getUsers(localStorage.getItem("token")).then((user) => {
			this.user_id = user.id;

			// identificarse
			this.websocket.send(JSON.stringify({
				"type": "identify",
				"message": {
					"user_id": this.user_id
				}
			}));

			// unirse a la sala
			this.websocket.send(JSON.stringify({
				"type": "join.room",
				"message": {
					"room_name": this.room_name
				}
			}));
		});
	}

	this.websocket.onclose = websocket_close;
	this.websocket.onmessage = server_msg;
}

setStartTime(time) {
// TODO: deprecated?
	this.game_objects.find((obj) => obj.id === "counter").setStartTime(time);
}

toJSON() {
	// TODO: definir bien el JSON que posteriormente se serializara
	// TODO: id del torneo
	// TODO: bool de si esta dentro de un torneo
	return {
		player1_pk: this.game_objects.find((obj) => obj.id === "player1").pk,
		player1_score: this.counter.player1_score,

		player2_pk: this.game_objects.find((obj) => obj.id === "player2").pk,
		player2_score: this.counter.player2_score,

		game_time: this.counter.time_passed
	}
}

}

//------------------------------------------------------------------------------
function server_msg(event) {
	const data = JSON.parse(event["data"]);

	switch(data["type"]) {
	case "game.state":
		this.game_state = data["message"]["game_state"];
		break;

	case "room.created":
		this.room_name = data["message"]["room_name"]
		// TODO: debug temporal
		const tmp = document.createElement("div");
		tmp.innerHTML = `${this.room_name}`
		document.getElementById("root").replaceChildren(tmp);
		break;

	case "game.started":
		this.room_name = data["message"]["room_name"]
		// TODO: que tendria que hacer?
		document.getElementById("root").replaceChildren(this.canvas);
		break;
	}
}

function websocket_close() {
	console.log(`WebSocket closed`);
}

function generateRandomString(length) {
	let result = '';
	// const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	const charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters[Math.floor(Math.random() * charactersLength)];
	}

	return result;
}

export {Game}
