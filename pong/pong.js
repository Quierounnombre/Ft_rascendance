import { Game } from "./Game.js";

export default async function pong(config) {
	const game = new Game(JSON.parse(config));
	game.gameLoop();
}
