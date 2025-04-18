import json
import random
import string

from channels.layers import get_channel_layer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class PongConsumer(WebsocketConsumer):
    http_user = True
    strict_ordering = True

    def connect(self) -> None:
        self.room_name = f"{self.scope["url_route"]["kwargs"]["room_name"]}"
        self.tournament_name = ""

        async_to_sync(self.channel_layer.group_add)(
            self.room_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code) -> None:
        async_to_sync(self.channel_layer.send)(
            "game_engine", {
                "type": "game.disconnect",
                "message": {
                    "tournament_name": self.tournament_name,
                    "room_name": self.room_name,
                }
            }
        )

        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )

        async_to_sync(self.channel_layer.group_discard)(
            str(self.user_id), self.channel_name
        )

    def receive(self, text_data) -> None:
        content = json.loads(text_data)
        message_type = content["type"]
        message = content["message"]

        if message_type == "identify":
            self.identify(message)
        elif message_type == "create.room":
            self.createRoom(message)
        elif message_type == "join.room":
            self.joinRoom(message)
        elif message_type == "direction":
            self.direction(message)

    #     "message": {
    #         "user_id": int
    #     }
    def identify(self, message) -> None:
        self.user_id = message["user_id"]
        self.user_name = message["user_name"]

        async_to_sync(self.channel_layer.group_add)(
            str(self.user_id), self.channel_name
        )

    #     "message": {
    #         "room_name": str
    #         "data": la info del formulario para generar la sala
    #     }
    def createRoom(self, message) -> None:
        self.tournament_name = message["tournament_name"]
        self.room_name = message["room_name"]

        # send to the GameConsumer the game room name and its config
        async_to_sync(self.channel_layer.send)(
            "game_engine", {
                "type": "game.config",
                "message": {
                    "room_name": self.room_name,
                    "tournament_name": self.tournament_name,
                    "data": message["data"]
                }
            }
        )

        # send to the GameConsumer the pk of the player1
        async_to_sync(self.channel_layer.send)(
            "game_engine", {
                "type": "set.player",
                "message": {
                    "user_name": self.user_name,
                    "room_name": self.room_name,
                    "tournament_name": self.tournament_name,
                    "player": "player1",
                    "id": self.user_id
                }
            }
        )

        # send the client the room code of the new game room
        self.send(json.dumps({
            "type": "room.created",
            "message": {
                "room_name": self.room_name,
                "tournament_name": self.tournament_name
            }
        }))

    #     "type": "join_room",
    #     "message": {"room_name": str}
    def joinRoom(self, message) -> None:
        self.room_name = message["room_name"]
        self.tournament_name = message["tournament_name"]

        async_to_sync(self.channel_layer.group_add)(
            self.room_name, self.channel_name
        )

        # send to the GameConsumer the pk of the player2
        async_to_sync(self.channel_layer.send)(
            "game_engine", {
                "type": "set.player",
                "message": {
                    "user_name": self.user_name,
                    "room_name": self.room_name,
                    "tournament_name": self.tournament_name,
                    "player": "player2",
                    "id": self.user_id
                }
            }
        )

    #     "room_name": str,
    #     "player_id": int
    #     "dir": int
    #     "is_moving": bool
    def direction(self, message) -> None:
        async_to_sync(self.channel_layer.send)(
            "game_engine", {
                "type": "player.direction",
                # "message": message
                "message": {
                    "user_name": self.user_name,
                    "room_name": message["room_name"],
                    "player_id": message["player_id"],
                    "dir": message["dir"],
                    "is_moving": message["is_moving"],
                }
            }
        )

    def game_started(self, event) -> None:
        self.send(json.dumps({
            "type": "game.started",
            "message": event["message"]
        }))
    
    def game_state(self, event) -> None:
        self.send(json.dumps({
            "type": "game.state",
            "message": {
                "room_name": self.room_name,
                "tournament_name": self.tournament_name,
                "player1_username": event["message"]["player1_username"],
                "player2_username": event["message"]["player2_username"],
                "game_state": event["message"]["data"]
            }
        }))

    def game_end(self, event) -> None:
        # if self.tournament_name != "":

        self.send(json.dumps({
            "type": "game.end",
            "message": {
                "room_name": self.room_name,
                "tournament_name": self.tournament_name,
                "player1_username": event["message"]["player1_username"],
                "player2_username": event["message"]["player2_username"],
                "game_state": event["message"]["data"]
            }
        }))
    
    def error(self, event) -> None:
        if event["message"]["user_id"] != self.user_id:
            return

        self.send(json.dumps({
            "type": "error",
            "message": event["message"]
        }))

    def game_reconnect(self, event) -> None:
        if event["message"]["user_id"] != self.user_id:
            return

        self.send(json.dumps({
            "type": "game.reconnect",
            "message": event["message"]
        }))

    def create_tournament_game(self, event) -> None:
        pass

    def join_tournament_game(self, event) -> None:
        pass

    def tournament_started(self, event) -> None:
        pass

    def next_round(self, event) -> None:
        pass

    def tournament_ended(self, event) -> None:
        pass
