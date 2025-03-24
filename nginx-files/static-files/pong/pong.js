import { Game } from "./Game.js";

export default async function pong(config) {
	// TODO: diferenciar entre el que esta creando y el que esta jugando
	const game = new Game(config);
	// await game.setWebSocket();
	// game.setStartTime(Date.now())
	// game.gameLoop();
}
