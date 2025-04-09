import { Game } from "./Game.js";
import { Tournament } from "./Tournament.js";

export function game_create_room(data, colors) {
	const game = new Game(colors);
	game.createRoom(data);
}

export function game_join_room(data, colors) {
	const game = new Game(colors);
	game.joinRoom(data);
}

export function game_offline_room(data, colors) {
	const game = new Game(colors);
	game.offlineRoom(data);
}

export function tournament_create_room(data, colors) {
	const tournament = new Tournament(colors);
	tournament.createTournament(data);
}

export function tournament_join_room(data, colors) {
	const tournament = new Tournament(colors);
	tournament.joinTournament(data);
}

export default { game_create_room, game_join_room, game_offline_room, tournament_create_room, tournament_join_room };
