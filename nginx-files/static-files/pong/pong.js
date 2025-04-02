import { Game } from "./Game.js";

export default function pong(type, data) {
// TODO: una vez se crea el torneo vendra por aqui a hacer un join room a la sala creada por el torneo?
	if (type === "tournament") {
	} else {
		const game = new Game();

		if (type === "create_room")
			game.createRoom(data);
		else if (type === "join_room")
			game.joinRoom(data);
		else if (type === "local_room")
			game.offlineRoom(data);

	}
}
