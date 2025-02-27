import { Game } from "./Game.js";

export default function pong(config) {
	const game = new Game(JSON.parse(config));
	game.gameLoop();
	// TODO: exportar info de la partida
}
