import json

from channels.consumer import SyncConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from pong.Game import Game
from pong.Tournament import Tournament, TournamentParticipant


tournaments = {}
game_rooms = {}

class GameConsumer(SyncConsumer):
    # message: {"room_name: string"}
    def game_start(self, event) -> None:
        channel_layer = get_channel_layer()
        message = event["message"]

        async_to_sync(channel_layer.group_send)(
            message["room_name"], {
                "type": "game.started",
                "message": {
                    "room_name": message["room_name"],
                    "data": game_rooms[message["room_name"]].serialize()
                }
            }
        )

        if not game_rooms[event["message"]["room_name"]].is_running:
            game_rooms[event["message"]["room_name"]].start()
    
    def game_started(self, event) -> None:
        pass
    
    def game_state(self, event) -> None:
        pass
    
    def game_end(self, event) -> None:
        message = event["message"]
        data = message["data"]

        if not game_rooms[message["room_name"]].is_running:
            del game_rooms[message["room_name"]]
    
    # message: {
    #     "room_name": str,
    #     "player_id": int
    #     "dir": int
    #     "is_moving": bool
    # }
    def player_direction(self, event) -> None:
        message = event["message"]

        game_rooms[message["room_name"]].setPlayerDir(message["player_id"], message["dir"], message["is_moving"])
    
    # message: {
    #     "room_name": str,
    #     "player": str
    #     "id": int
    # }
    def set_player(self, event) -> None:
        message = event["message"]

        if game_rooms[message["room_name"]].number_players == 2:
            return

        for obj in game_rooms[message["room_name"]].game_objects:
            if obj.id == message["player"] and obj.pk < 0:
                obj.pk = message["id"]
                game_rooms[message["room_name"]].number_players += 1

        
    # message: {
    #     "room_name": str,
    #     "data": json converted to string with the config
    # }
    def game_config(self, event) -> None:
        # TODO: revisar que no existe la sala ya
        message = event["message"]

        self.room_name = message["room_name"]
        game_rooms[message["room_name"]] = Game(room_name=self.room_name, data=message["data"])

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_name, self.channel_name
        )
    
    def tournament_config(self, event) -> None:
        message = event["message"]
        game_config = message["game_config"]
        tournament_name = message["tournament_name"]
        number_players = int(message["number_players"])

        if number_players < 4 or number_players % 2 != 0:
            # TODO: esto deberia estar bien del front, pero por si acaso hay algun gracioso enviar error
            return

        print(f'tournament_config: creating tournament `{message["tournament_name"]}`', flush=True)
        tournaments[message["tournament_name"]] = Tournament(number_players, game_config, tournament_name)

    def tournament_register(self, event) -> None:
        message = event["message"]

        tournament_name = str(message["tournament_name"])
        user_id = int(message["user_id"])
        user_name = str(message["user_name"])

        player = TournamentParticipant(user_id, user_name)

        if not tournaments[tournament_name].registerPlayer(player):
            # TODO: quizas enviar que el torneo esta lleno?
            pass

        if not tournaments[tournament_name].is_running and tournaments[tournament_name].isTournamentFull():
            print(f'GameConsumer::tournament_register -> tournament_name = {tournament_name}', flush=True)
            tournaments[tournament_name].generateSchedule()
            tournaments[tournament_name].start()
        
        def tournament_started(self, event) -> None:
            pass
