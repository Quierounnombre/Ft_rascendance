import { Game } from "./Game.js";

export default async function pong(config) {
	const game = new Game(JSON.parse(config));
	await game.setWebSocket();
	game.setStartTime(Date.now())
	game.gameLoop();
}
