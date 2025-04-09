import { Game } from "./Game.js";

export default function pong(type, data, colors) {
	const game = new Game(colors);

	if (type === "create_room")
		game.createRoom(data);
	else if (type === "join_room")
		game.joinRoom(data);
	else if (type === "local_room")
		game.offlineRoom(data);

}
