import { Game } from "./Game.js";
import { Tournament } from "./Tournament.js";

export let onGoing = new Object();

export function game_create_room(data, colors) {
	onGoing.game = new Game(colors);
	onGoing.game.createRoom(data);
}

export function game_join_room(data, colors) {
	onGoing.game = new Game(colors);
	onGoing.game.joinRoom(data);
}

export function game_offline_room(data, colors) {
	onGoing.game = new Game(colors);
	onGoing.game.offlineRoom(data);
}

export function tournament_create_room(data, number_players, colors) {
	onGoing.tournament = new Tournament(colors);
	onGoing.tournament.createTournament(data, number_players);
}

export function tournament_join_room(data, colors) {
	onGoing.tournament = new Tournament(colors);
	onGoing.tournament.joinTournament(data);
}

export default { game_create_room, game_join_room, game_offline_room, tournament_create_room, tournament_join_room};
