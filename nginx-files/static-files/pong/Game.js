import { CanvasObject } from "./CanvasObject.js";
import { Counter } from "./Counter.js";
import { Ball } from "./Ball.js";
import { Player } from "./Player.js";
import { onGoing } from "./pong.js";
import getUser from "../getUser.js"
import generateRandomString from "../generateRandomString.js";
import translatePage from "../translate.js";
import * as THREE from 'three';
"use strict";

class Game {
/**
 * @param {JSON string} config string with the JSON config
 */
constructor(colors) {	
	this.colors = colors
	this.game_objects = new Map()

	this.background_color = "black";
	this.object_color = "white";

	this.dir = 0;
	this.game_running = false;
	this.is_moving = false;

	this.tournament_name = ""

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
				"tournament_name": this.tournament_name,
				"player_id": this.user_id,
				"username": this.user_name,
				"dir": this.dir,
				"is_moving": this.is_moving
			}
		}));
	});

	document.addEventListener("keyup", (event) => {
		if (event.key === "ArrowUp" || event.key === "ArrowDown" ) {
			this.is_moving = false;
			this.dir = 0
		} else
			return;

		this.websocket.send(JSON.stringify({
			"type": "direction",
			"message": {
				"room_name": this.room_name,
				"tournament_name": this.tournament_name,
				"player_id": this.user_id,
				"username": this.user_name,
				"dir": this.dir,
				"is_moving": this.is_moving
			}
		}));
	
	});

 // 3d graphics
	this.threeCanvas = document.createElement("canvas");
	this.threeCanvas.setAttribute("id", "pong");
	this.threeCanvas.setAttribute("width", "800");
	this.threeCanvas.setAttribute("height", "400");
	this.threeCanvas.setAttribute("style", "border: 2px solid black; display: flex;justify-content: center; align-items: center;");
	this.scene = new THREE.Scene();
	this.scene.background = new THREE.Color(0x101010);

	var FOV = 70;
	var z = this.threeCanvas.height / (2 * Math.tan(((FOV * Math.PI) / 180)/2))
	this.camera = new THREE.PerspectiveCamera(FOV, this.threeCanvas.width / this.threeCanvas.height, z, z + 30)
	this.camera.position.z = z + 11;
	this.camera.position.x = this.threeCanvas.width / 2;
	this.camera.position.y = - this.threeCanvas.height / 2;
	this.scene.add(this.camera);
	this.renderer = new THREE.WebGLRenderer({
		canvas: this.threeCanvas
	})
	this.renderer.setSize(this.threeCanvas.width, this.threeCanvas.height);
	this.renderer.setAnimationLoop(this.animate.bind(this));
}

animate() {
	if (!this.game_state)
		return ;
	const objs = JSON.parse(this.game_state);
	for (let i in objs) {
		this.game_objects.get(objs[i].id).animate(objs[i]);
	}
	this.renderer.render(this.scene, this.camera)
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

createRoom(game_config, room_name = generateRandomString(8)) {
	this.room_name = room_name;
	this.playerN = "player1";

	this.websocket = new WebSocket(
		'wss://'
		+ window.location.hostname
		+ ":" + window.location.port
		+ '/ws/pong/'
		+ this.room_name
		+ '/'
	)

	this.websocket.onopen = () => {
		console.log(`WebSocket opened`);

		getUser(localStorage.getItem("token")).then((user) => {
			this.user_id = user.id;
			this.user_name = user.username;
			// identificarse
			this.websocket.send(JSON.stringify({
				"type": "identify",
				"message": {
					"user_id": this.user_id,
					"user_name": this.user_name,
				}
			}));

			// crear la sala
			this.websocket.send(JSON.stringify({
				"type": "create.room",
				"message": {
					"room_name": this.room_name,
					"tournament_name": this.tournament_name,
					"data": game_config
				}
			}));
		});
	}

	this.websocket.onclose = websocket_close.bind(this);
	this.websocket.onmessage = server_msg.bind(this);

	return this.room_name;
}

reconect() {
	document.getElementById("root").replaceChildren(this.banner);
	if (this.game_running) {
		document.getElementById("root").appendChild(this.threeCanvas);
	} else {
		document.getElementById("root").replaceChildren(this.room_html);
	}
}

joinRoom(room_name) {
	this.room_name = room_name;
	this.playerN = "player2";

	this.websocket = new WebSocket(
		'wss://'
		+ window.location.hostname
		+ ":" + window.location.port
		+ '/ws/pong/'
		+ this.room_name
		+ '/'
	)

	this.websocket.onopen = () => {
		console.log(`WebSocket opened`);

		getUser(localStorage.getItem("token")).then((user) => {
			this.user_id = user.id;
			this.user_name = user.username;

			// identificarse
			this.websocket.send(JSON.stringify({
				"type": "identify",
				"message": {
					"user_id": this.user_id,
					"user_name": this.user_name,
				}
			}));

			// unirse a la sala
			this.websocket.send(JSON.stringify({
				"type": "join.room",
				"message": {
					"room_name": this.room_name,
					"tournament_name": this.tournament_name,
				}
			}));
		});
	}

	this.websocket.onclose = websocket_close.bind(this);
	this.websocket.onmessage = server_msg.bind(this);
}

offlineRoom(game_config) {
	this.room_name = generateRandomString(8);

	this.websocket = new WebSocket(
		'wss://'
		+ window.location.hostname
		+ ":" + window.location.port
		+ '/ws/pong/'
		+ this.room_name
		+ '/'
	)

	document.addEventListener("keydown", (event) => {
		if (event.key === 'ArrowUp') {
			this.websocket.send(JSON.stringify({
				"type": "direction",
				"message": {
					"room_name": this.room_name,
					"tournament_name": this.tournament_name,
					"player_id": this.user_id,
					"dir": -4,
					"is_moving": true
				}
			}));
		} else if (event.key === "w") {
			this.websocket.send(JSON.stringify({
				"type": "direction",
				"message": {
					"room_name": this.room_name,
					"tournament_name": this.tournament_name,
					"player_id": -1,
					"dir": -4,
					"is_moving": true
				}
			}));
		} else if (event.key === 'ArrowDown') {
			this.websocket.send(JSON.stringify({
				"type": "direction",
				"message": {
					"room_name": this.room_name,
					"tournament_name": this.tournament_name,
					"player_id": this.user_id,
					"dir": 4,
					"is_moving": true
				}
			}));

		} else if (event.key === 's') {
			this.websocket.send(JSON.stringify({
				"type": "direction",
				"message": {
					"room_name": this.room_name,
					"tournament_name": this.tournament_name,
					"player_id": -1,
					"dir": 4,
					"is_moving": true
				}
			}));
		}
	});

	document.addEventListener("keyup", (event) => {
		if (event.key === "ArrowUp" || event.key === "ArrowDown" ) {
			this.websocket.send(JSON.stringify({
				"type": "direction",
				"message": {
					"room_name": this.room_name,
					"tournament_name": this.tournament_name,
					"player_id": this.user_id,
					"dir": 0,
					"is_moving": false
				}
			}));

		} else if (event.key === "w" || event.key === "s") {
			this.websocket.send(JSON.stringify({
				"type": "direction",
				"message": {
					"room_name": this.room_name,
					"tournament_name": this.tournament_name,
					"player_id": -1,
					"dir": 0,
					"is_moving": false
				}
			}));
		}
	});

	this.websocket.onopen = () => {
		console.log(`WebSocket opened`);

		// TODO: el juego local  no funciona
		getUser(localStorage.getItem("token")).then((user) => {
			this.user_id = user.id;
			this.user_name = user.username;

			// NOTE: esta invertido para que no este espejado
			// identificarse
			this.websocket.send(JSON.stringify({
				"type": "identify",
				"message": {
					"user_id": -1,
					"user_name": this.user_name
				}
			}));

			// unirse a la sala
			this.websocket.send(JSON.stringify({
				"type": "create.room",
				"message": {
					"room_name": this.room_name,
					"tournament_name": this.tournament_name,
					"data": game_config
				}
			}));

			// identificarse
			this.websocket.send(JSON.stringify({
				"type": "identify",
				"message": {
					"user_id": this.user_id,
					"user_name": this.user_name
				}
			}));

			// unirse a la sala
			this.websocket.send(JSON.stringify({
				"type": "join.room",
				"message": {
					"room_name": this.room_name,
					"tournament_name": this.tournament_name,
				}
			}));

		});
	}

	this.websocket.onclose = websocket_close.bind(this);
	this.websocket.onmessage = server_msg.bind(this);
}

toJSON() {
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

export {Game}

//------------------------------------------------------------------------------
function server_msg(event) {
	const data = JSON.parse(event["data"]);

	console.log(`Game has recived a msg type: ${data["type"]}`)

	switch(data["type"]) {
	case "game.state":
		this.game_state = data["message"]["game_state"];
		break;

	case "room.created":
		this.room_name = data["message"]["room_name"]

		// TODO: si creas sala, se vas a otra seccion y vuelves, esta con una partida sin  cargar
		if (data["message"]["tournament_name"] != "")
			return;

		const container = document.createElement("div");
		container.setAttribute("class", "container");

		const title = document.createElement("h2");
		title.setAttribute("class", "h2 display-1");
		title.setAttribute("style", "text-align: center")
		title.setAttribute("data-i18n-key", "game-code");

		const code = document.createElement("h3");
		code.setAttribute("class", "h3 display-1");
		code.setAttribute("style", "text-align: center")
		code.innerHTML = `${this.room_name}`;

		// TODO: todas estas cosas tendrian que tener ids y demas cosas para la accesibilidad

		container.appendChild(title);
		container.appendChild(code);
		this.room_html = container;

		document.getElementById("root").replaceChildren(this.room_html);
		translatePage();
		break;

	case "game.reconnect":
	case "game.started":
		this.room_name = data["message"]["room_name"]

		const tmp2 = JSON.parse(data["message"]["data"])
		for (let i in tmp2) {
			switch (tmp2[i].type) {
			case "player":
				if (tmp2[i].pk === this.user_id)
					this.game_objects.set(tmp2[i].id, (new Player(tmp2[i], this.threeCanvas, this.scene, this.colors.me_color)));
				else
					this.game_objects.set(tmp2[i].id, (new Player(tmp2[i], this.threeCanvas, this.scene, this.colors.other_color)));
				break;

			case "ball":
				this.game_objects.set(tmp2[i].id, (new Ball(tmp2[i], this.threeCanvas, this.scene, this.colors.ball_color)));
				break;

			case "counter":
				this.game_objects.set(tmp2[i].id, (new Counter(tmp2[i], this.threeCanvas, this.scene, this.colors.counter_color)));
				break;

			default:
				this.game_objects.set(tmp2[i].id, (new CanvasObject(tmp2[i], this.threeCanvas, this.scene, this.colors.ball_color)));
			}
		}
		this.banner = document.createElement("h2");
		this.banner.setAttribute("class", "h2 display-1");
		this.banner.setAttribute("style", "text-align: center")
		this.banner.innerHTML = data["message"]["player1_username"] + " vs " + data["message"]["player2_username"]
		this.game_running = true;
		this.reconect();
		break;
	
	case "game.end":
		// TODO: esto deberia estar en el backend
		if (data["message"]["tournament_name"] != "") {
			this.websocket.send(JSON.stringify({
				"type": "end.tournament.game",
				"message": {
					"tournament_name": data["message"]["tournament_name"],
					"room_name": self.room_name
				}
			}))

			const tmp = document.createElement("h2");
			tmp.setAttribute("class", "h2 display-1");
			tmp.setAttribute("style", "text-align: center");
			tmp.setAttribute("data-i18n-key", "waiting-room");
			document.getElementById("root").replaceChildren(tmp);
			translatePage()
		} else {
			const tmp2 = document.createElement("h3");
			tmp2.setAttribute("class", "h3 display-1");
			tmp2.setAttribute("style", "text-align: center");
			tmp2.setAttribute("data-i18n-key", "game-end");
			document.getElementById("root").appendChild(tmp2);
			translatePage()
		}

		this.websocket.close();
		this.game_running = false;
		this.renderer.setAnimationLoop(null);
		delete onGoing.game;
		document.addEventListener("keydown", (event) => {});
		document.addEventListener("keyup", (event) => {});
		break;

	case "error":
		alert(`DEBUG: ${data["message"]["code"]}`);
		this.websocket.close();
		break;
	}
}

function websocket_close() {
	console.log(`WebSocket closed`);
	this.game_running = false;
}
