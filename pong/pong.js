import { Game } from "./Game.js";

function main() {
	const tmp = JSON.parse(`[{"type":"config","timeout":30000,"max_score":3},{"id":"player1","type":"player","x":10,"y":200,"width":20,"height":100,"speed":2,"move_up":"w","move_down":"s"},{"id":"player2","type":"player","x":790,"y":200,"width":20,"height":100,"speed":2,"move_up":"ArrowUp","move_down":"ArrowDown"},{"id":"ball","type":"ball","x":400,"y":200,"dirX":1,"dirY":1,"radius":10},{"id":"counter","type":"counter","x":400,"y":10,"font":"42px Arial"}]`);
	const game = new Game(tmp);
	game.gameLoop();
	// TODO: exportar info de la partida
}

main();
