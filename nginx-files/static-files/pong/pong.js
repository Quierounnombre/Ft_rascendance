import { Game } from "./Game.js";

export default async function pong(type, data) {
	// TODO: quizas deberian ser dos funciones o algo asi
	const game = new Game();
	if (type === "create_room") {
		game.createRoom(data)
	} else {
		game.joinRoom(data)
	}
}
