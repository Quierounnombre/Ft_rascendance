import { Game } from "./Game.js";

export default async function pong(config) {
	const game = new Game(JSON.parse(config));
	await game.setWebSocket();
	// TODO: al conectarse enviar mensaje a la sala con el pk
	// TODO: cuando recibe un pk diferente, comienza la partida
	// TODO: esperar a que haya dos en la sala
	game.setStartTime(Date.now())
	game.gameLoop();
}
