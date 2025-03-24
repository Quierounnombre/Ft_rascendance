import json
import random
import string

from channels.layers import get_channel_layer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

# TODO: esto hara que la estructura del js tenga que cambiar, haciendo que en lugar
# de tener todos los objetos con sus metodos, tenga que ir generando el array en 
# funcion de lo que le pase el server, renderizar y luego destruir

class PongConsumer(WebsocketConsumer):
    http_user = True
    strict_ordering = True

    def connect(self) -> None:
        self.room_name = f"pong_{self.scope["url_route"]["kwargs"]["room_name"]}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code) -> None:
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )

    def receive(self, text_data) -> None:
        content = json.loads(text_data)
        message_type = content["type"]
        message = content["message"]

        if message_type == "identify":
            self.identify(message)

        elif message_type == "create.room":
            room_name = self.createRoom(message)


        elif message_type == "join.room":
            # TODO: y si no existe la sala?
            self.joinRoom(message)
        
        elif message_type == "direction"
            self.direction(message)

    #     "message": {
    #         "user_id": int
    #     }
    def identify(self, message) -> None:
        # TODO: quizas siempre tiene que identificarse
        self.user_id = message["user_id"] # TODO: creo que no funcionaria

    #     "message": {
    #         "room_name": str
    #         "data": la info del formulario para generar la sala
    #     }
    def createRoom(self, message) -> int:
        # send to the GameConsumer the game room name and its config
        async_to_sync(channel_layer.group_send)(
            game_engine, {
                "type": "game.config",
                "message": {
                    "room_name": self.room_name,
                    "data": message["data"]
                }
            }
        )

        # send to the GameConsumer the pk of the player1
        async_to_sync(channel_layer.group_send)(
            game_engine, {
                "type": "set.player",
                "message": {
                    "room_name": self.room_name,
                    "player": "player1",
                    "id": self.player_id
                }
            }
        )

        # send the client the room code of the new game room
        self.send(json.dumps({
            "type": "room.created",
            "message": {
                "room_name": room_name
            }
        }))

        return room_name

    #     "type": "join_room",
    #     "message": {"room_name": str}
    def joinRoom(self, event) -> None:
        self.room_name = event["message"]["room_name"]

        # TODO: si la sala ya tiene a dos jugadores?
        # TODO: si no existe la sala?

        # join the game room
        async_to_sync(self.channel_layer.group_add)(
            self.room_name, self.channel_name
        )

        # send to the GameConsumer the pk of the player2
        async_to_sync(channel_layer.group_send)(
            game_engine, {
                "type": "set.player",
                "message": {
                    "room_name": self.room_name,
                    "player": "player2",
                    "id": self.player_id
                }
            }
        )

        # send to the GameConsumer the instruction to start the game
        async_to_sync(channel_layer.group_send)(
            game_engine, {
                "type": "game.start",
                "message": {
                    "room_name": event["room_name"]
                }
            }
        )

    #     "room_name": str,
    #     "player": str
    #     "dir": int
    def direction(self, message) -> None:
        async_to_sync(channel_layer.group_send)(
            game_engine, {
                "type": "player.direction",
                "message": message
            }
        )

    def game_start(self, event) -> None:
        self.send(json.dumps({
            "type": "game.start",
        }))
