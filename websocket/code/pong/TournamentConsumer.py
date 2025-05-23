import json
import random
import string

from channels.layers import get_channel_layer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from pong.generateTournamentSchedule import generateTournamentSchedule

class TournamentConsumer(WebsocketConsumer):
    http_user = True
    strict_ordering = True

    def connect(self) -> None:
        self.tournament_name = f"tournament_{self.scope["url_route"]["kwargs"]["room_name"]}"

        async_to_sync(self.channel_layer.group_add)(
            self.tournament_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code) -> None:
        async_to_sync(self.channel_layer.send)(
            "game_engine", {
                "type": "tournament.disconnect",
                "message": {
                    "tournament_name": self.tournament_name,
                }
            }
        )
 
        async_to_sync(self.channel_layer.group_discard)(
            self.tournament_name, self.channel_name
        )

    def receive(self, text_data) -> None:
        content = json.loads(text_data)
        message_type = content["type"]
        message = content["message"]

        if message_type == "identify":
            self.identify(message)
        elif message_type == "create.tournament":
            self.createTournament(message)
        elif message_type == "join.tournament":
            self.joinTournament(message)
        elif message_type == "end.tournament.game":
            self.endTournamentGame(message)
    
    def identify(self, message) -> None:
        self.user_id = message["user_id"]
        self.user_name = message["user_name"]

        async_to_sync(self.channel_layer.group_add)(
            str(self.user_id), self.channel_name
        )

    #     "message": {
    #         "tournament_name": str
    #         "data": la info del formulario para generar la sala
    #     }
    def createTournament(self, message) -> None:
        self.tournament_name = message["tournament_name"]

        async_to_sync(self.channel_layer.send)(
            "game_engine", {
                "type": "tournament.config",
                "message": {
                    "tournament_name": self.tournament_name,
                    "number_players": message["number_players"],
                    "game_config": message["game_config"]
                }
            }
        )

        # send the client the room code of the new game room
        self.send(json.dumps({
            "type": "tournament.created",
            "message": {
                "tournament_name": self.tournament_name
            }
        }))

    #     "message": {
    #           "tournament_name": str,
    #           "id": int
    #      }
    def joinTournament(self, message) -> None:
        self.tournament_name = message["tournament_name"]

        async_to_sync(self.channel_layer.group_add)(
            self.tournament_name, self.channel_name
        )

        async_to_sync(self.channel_layer.send)(
            "game_engine", {
                "type": "tournament.register",
                "message": {
                    "tournament_name": self.tournament_name,
                    "user_id": self.user_id,
                    "user_name": self.user_name,
                }
            }
        )
    
    def endTournamentGame(self, message) -> None:
        pass

    def tournament_started(self, event) -> None:
        self.send(json.dumps({
            "type": "tournament.started",
            "message": {
                "tournament_name": self.tournament_name
            }
        }))

    def tournament_ended(self, event) -> None:
        self.send(json.dumps({
            "type": "tournament.ended",
            "message": event["message"]
        }))



    def next_round(self, event) -> None:
        self.send(json.dumps({
                "type": "next.round",
                "message": ""
        }))

    def create_tournament_game(self, event) -> None:
        if event["message"]["user_id"] != self.user_id:
            return

        self.tournament_name = event["message"]["tournament_name"]

        self.send(json.dumps({
            "type": "create.tournament.game",
            "message": {
                "tournament_name": event["message"]["tournament_name"],
                "room_name": event["message"]["room_name"],
                "game_config": event["message"]["game_config"],
            }
        }))

    def join_tournament_game(self, event) -> None:
        if event["message"]["user_id"] != self.user_id:
            return

        self.tournament_name = event["message"]["tournament_name"]

        self.send(json.dumps({
            "type": "join.tournament.game",
            "message": {
                "tournament_name": event["message"]["tournament_name"],
                "room_name": event["message"]["room_name"]
            }
        }))
        pass

    def error(self, event) -> None:
        if event["message"]["user_id"] != self.user_id and event["message"]["user_id"] != -1:
            return

        self.send(json.dumps({
            "type": "error",
            "message": event["message"]
        }))
