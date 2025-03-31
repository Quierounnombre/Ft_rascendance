import { CanvasObject } from "./CanvasObject.js";
import { Counter } from "./Counter.js";
import { Ball } from "./Ball.js";
import { Player } from "./Player.js";
import getUser from "../getUser.js"
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

	this.game_objects = new Map()

	// TODO: todo esto lo puede terner el user en su configuracion, por lo que la configuracion propia de los colores iria aqui
	this.background_color = "black";
	this.object_color = "white";

	this.dir = 0;
	this.game_running = false;
	this.is_moving = false;

	// TODO: esto habria que comprobar que los clientes no pueden mover a otros 
	document.addEventListener("keydown", (event) => {
		if (event.key === 'ArrowUp') {
			this.dir = -4; // NOTE: este numero para que haya cierto degradado en la velocidad, que tambien es menor de base
			this.is_moving = true;
		} else if (event.key === 'ArrowDown') {
			this.dir = 4; // NOTE: este numero para que haya cierto degradado en la velocidad, que tambien es menor de base
			this.is_moving = true;
		} else
			return;

		this.websocket.send(JSON.stringify({
			"type": "direction",
			"message": {
				"room_name": this.room_name,
				"player_id": this.user_id,
				"dir": this.dir,
				"is_moving": this.is_moving
			}
		}));
	});

	document.addEventListener("keyup", (event) => {
		if (event.key == "ArrowUp" || event.key == "ArrowDown" ) {
			this.is_moving = false;
			this.dir = 0
		} else
			return;

		this.websocket.send(JSON.stringify({
			"type": "direction",
			"message": {
				"room_name": this.room_name,
				"player_id": this.user_id,
				"dir": this.dir,
				"is_moving": this.is_moving
			}
		}));
	
	});
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
	if (!this.game_running)
		return;

	document.getElementById("root").replaceChildren(this.canvas);

	this.render();
	this.animation = window.requestAnimationFrame(this.gameLoop.bind(this));
}

render() {
	if (!this.game_state)
		return;

	const objs = JSON.parse(this.game_state);

	this.drawBackground(); // TODO: retocar esto
	for (let i in objs) {
		// TODO: poner en el metodo render de los objetos el color
		switch (objs[i].type) {
		case "player":
			const player = new Player(objs[i], this.canvas, this.context);
			player.render();
			break;

		case "ball":
			const ball = new Ball(objs[i], this.canvas, this.context);
			ball.render();
			break;

		case "counter":
			const counter = new Counter(objs[i], this.canvas, this.context);
			counter.render();
			break;

		default:
			const canvas_object = new CanvasObject(objs[i], this.canvas, this.context);
			canvas_object.render();
		}
	}
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
	this.context.strokeStyle = "white"; // TODO: personalizacion?
	this.context.lineWidth = "2";
	this.context.moveTo(this.canvas.width / 2, this.canvas.height / 8);
	this.context.lineTo(this.canvas.width / 2, this.canvas.height);
	this.context.moveTo(0, this.canvas.height / 8);
	this.context.lineTo(this.canvas.width, this.canvas.height / 8);
	this.context.closePath();
	this.context.stroke();
}

createRoom(game_config) {
	this.room_name = generateRandomString(8);
	this.playerN = "player1";

	this.websocket = new WebSocket(
		'wss://'
		+ window.location.hostname
		+ ':7000/ws/pong/'
		+ this.room_name
		+ '/'
	)

	this.websocket.onopen = () => {
		console.log(`WebSocket opened`);

		getUser(localStorage.getItem("token")).then((user) => {
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

	this.websocket.onclose = websocket_close.bind(this);
	this.websocket.onmessage = server_msg.bind(this);

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

		getUser(localStorage.getItem("token")).then((user) => {
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

	this.websocket.onclose = websocket_close.bind(this);
	this.websocket.onmessage = server_msg.bind(this);
}

toJSON() {
	// TODO: definir bien el JSON que posteriormente se serializara
	// TODO: id del torneo
	// TODO: bool de si esta dentro de un torneo
	const game_objects = JSON.parse(this.game_state);

	return {
		player1_pk: game_objects.find((obj) => obj.id === "player1").pk,
		player1_score:game_objects.find((obj) => obj.id === "counter").player1_score,

		player2_pk: game_objects.find((obj) => obj.id === "player2").pk,
		player2_score: game_objects.find((obj) => obj.id === "counter").player2_score,

		game_time:game_objects.find((obj) => obj.id === "counter").time_passed
	}
}

}

//------------------------------------------------------------------------------
function server_msg(event) {
	const data = JSON.parse(event["data"]);

	// console.log(`DEBUG: server_msg.type: ${data["type"]}`) // TODO: debug
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

		const tmp2 = JSON.parse(data["message"]["data"])
		for (let i in tmp2) {
			switch (tmp2[i].type) {
			case "player":
				this.game_objects.set(tmp2[i].id, (new Player(tmp2[i], this.canvas, this.context)));
				break;

			case "ball":
				this.game_objects.set(tmp2[i].id, (new Ball(tmp2[i], this.canvas, this.context)));
				break;

			case "counter":
				this.game_objects.set(tmp2[i].id, (new Counter(tmp2[i], this.canvas, this.context)));
				break;

			default:
				this.game_objects.set(tmp2[i].id, (new CanvasObject(tmp2[i], this.canvas, this.context)));
			}
		}

		document.getElementById("root").replaceChildren(this.canvas);
		this.game_running = true;
		this.gameLoop();
		break;
	
	case "game.end":
		this.websocket.close();
		this.game_running = false;
		console.log(JSON.stringify(this)); // TODO: exportar info de la partida
		window.cancelAnimationFrame(this.animation);
		break;
	}
}

function websocket_close() {
	console.log(`WebSocket closed`);
	this.game_running = false;
}

function generateRandomString(length) {
	let result = '';
	// const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

	const charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters[Math.floor(Math.random() * charactersLength)];
	}

	return result;
}

export {Game}
