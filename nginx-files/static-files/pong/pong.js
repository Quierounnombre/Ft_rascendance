import { Game } from "./Game.js";
import { Tournament } from "./Tournament.js";

function game_create_room(data, colors) {
	const game = new Game(colors);
	game.createRoom(data)
}

function game_join_room(data, colors) {
	const game = new Game(colors);
	game.joinRoom(data)
}

function game_offline_room(data, colors) {
	const game = new Game(colors);
	game.offlineRoom(data)
}

export default { game_create_room, game_join_room, game_offline_room};
