import json
import time
import threading

from channels.consumer import SyncConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from pong.Game import Game
from pong.Tournament import Tournament, TournamentParticipant


tournaments = {}
game_rooms = {}

class GameConsumer(SyncConsumer):
    strict_ordering = True

    # message: {"room_name: string"}
    def game_start(self, event) -> None:
        channel_layer = get_channel_layer()
        message = event["message"]

        async_to_sync(channel_layer.group_send)(
            message["room_name"], {
                "type": "game.started",
                "message": {
                    "player1_username": game_rooms[message["room_name"]].player1_username,
                    "player2_username": game_rooms[message["room_name"]].player2_username,
                    "room_name": message["room_name"],
                    "tournament_name": message["tournament_name"],
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
            tmp = len(game_rooms) # TODO: esto para que?
            result = game_rooms[message["room_name"]].getResult()
            del game_rooms[message["room_name"]]

            if message["tournament_name"] != "":
                tournaments[message["tournament_name"]].endGame(message["room_name"], result)
                
    
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
        channel_layer = get_channel_layer()

        print(f'\033[1;32mGameConsumer::set_player -> checking if room exists', flush=True)
        if not message["room_name"] in game_rooms:
            async_to_sync(channel_layer.group_send)(
                message["room_name"], {
                    "type": "error",
                    "message": {
                        "user_id": message["id"],
                        "code": "NOTEXIST"
                    }
                }
            )
            return
        
        # TODO: comprobar si ya estaba metido, si lo esta pasarle la misma  info que cuando empieza el juego
        print(f'\033[1;32mGameConsumer::set_player -> checking if player is already in the room', flush=True)
        if message["id"] == game_rooms[message["room_name"]].player1_id or message["id"] == game_rooms[message["room_name"]].player2_id:
            async_to_sync(channel_layer.group_send)(
                message["room_name"], {
                    "type": "game.reconnect",
                    "message": {
                        "user_id": message["id"],
                        "player1_username": game_rooms[message["room_name"]].player1_username,
                        "player2_username": game_rooms[message["room_name"]].player2_username,
                        "room_name": message["room_name"],
                        "tournament_name": message["tournament_name"],
                        "data": game_rooms[message["room_name"]].serialize()
                    }
                }
            )
            return

        print(f'\033[1;32mGameConsumer::set_player -> checking if the room is already full', flush=True)
        if game_rooms[message["room_name"]].number_players == 2:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                    message["room_name"], {
                        "type": "error",
                        "message": {
                            "user_id": message["id"],
                            "code": "ROOMFULL"
                        }
                    }
            )
            return

        print(f'\033[1;32mGameConsumer::set_player -> setting player', flush=True)
        for obj in game_rooms[message["room_name"]].game_objects:
            if obj.id == message["player"] and obj.pk < 0:
                obj.pk = message["id"]
                obj.user_name = message["user_name"]

                if game_rooms[message["room_name"]].number_players == 0:
                    obj.playerN = "player1"
                    game_rooms[message["room_name"]].player1_username = message["user_name"]
                    game_rooms[message["room_name"]].player1_id = message["id"]
                else:
                    obj.playerN = "player2"
                    game_rooms[message["room_name"]].player2_username = message["user_name"]
                    game_rooms[message["room_name"]].player2_id = message["id"]

                game_rooms[message["room_name"]].number_players += 1
        
        print(f'\033[1;32mGameConsumer::set_player -> checking if the room needs to start', flush=True)
        if game_rooms[message["room_name"]].number_players == 2:
            async_to_sync(self.channel_layer.send)(
                "game_engine", {
                    "type": "game.start",
                    "message": {
                        "room_name": message["room_name"],
                        "tournament_name": message["tournament_name"]
                    }
                }
            )
        
    # message: {
    #     "room_name": str,
    #     "data": json converted to string with the config
    # }
    def game_config(self, event) -> None:
        # TODO: revisar que no existe la sala ya
        message = event["message"]

        self.room_name = message["room_name"]
        self.tournament_name = message["tournament_name"]
        game_rooms[message["room_name"]] = Game(room_name=self.room_name, tournament_name=message["tournament_name"], data=message["data"])

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

        tournaments[message["tournament_name"]] = Tournament(number_players, game_config, tournament_name)

    def tournament_register(self, event) -> None:
        message = event["message"]

        tournament_name = str(message["tournament_name"])
        user_id = int(message["user_id"])
        user_name = str(message["user_name"])

        if not tournament_name in tournaments:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                    message["tournament_name"], {
                        "type": "error",
                        "message": {
                            "user_id": user_id,
                            "code": "NOTEXIST"
                        }
                    }
            )
            return

        player = TournamentParticipant(user_id, user_name)

        if not tournaments[tournament_name].registerPlayer(player):
            # TODO: quizas enviar que el torneo esta lleno?
            return

        if not tournaments[tournament_name].is_running and tournaments[tournament_name].isTournamentFull():
            tournaments[tournament_name].generateSchedule()
            tournaments[tournament_name].start()
        
    def tournament_started(self, event) -> None:
        pass

    def next_round(self, event) -> None:
        pass

    def create_tournament_game(self, event) -> None:
        pass

    def join_tournament_game(self, event) -> None:
        pass

    def error(self, event) -> None:
        pass

    def game_reconnect(self, event) -> None:
        pass
