import { Game } from "./Game.js";

export default async function pong(config) {
	const game = new Game(JSON.parse(config));
	await game.gameLoop();
	// TODO: exportar info de la partida
	console.log(JSON.stringify(game));
}
