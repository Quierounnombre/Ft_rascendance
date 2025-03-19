import json
import random
import string

from channels.layers import get_channel_layer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

# TODO: la clase Game(SyncConsumer) tiene que crearse al iniciar sala, 
# es decir, en cada partida habra mas de dos consumers, dos asociados
# a un websocket con el usuario, y otro a parte que es el que llevara el bucle
# del juego (y otro que ando leyendo ahora), los websockets le pararan la 
# informacion de movimiento al loop, este hara los calculos y se lo parara a los 
# otros dos consumers, que le pasaran la informacion a los clientes,
# que solo tendran que renderizar

# TODO: esto hara que la estructura del js tenga que cambiar, haciendo que en lugar
# de tener todos los objetos con sus metodos, tenga que ir generando el array en 
# funcion de lo que le pase el server, renderizar y luego destruir

class PongConsumer(WebsocketConsumer):
    http_user = True
    strict_ordering = True

    def connect(self) -> None:
        # TODO: hacer que el room name sea un codigo aleatorio, y pasarselo al GameConsumer y ver como imprimirlo luego en la ui
        # self.room_name = f"pong_{self.scope["url_route"]["kwargs"]["room_name"]}"
        self.player_id = None

        # TODO: trasladar lo de js aqui, para la seleccion de user
        # TODO: hay dos casos, que alguien este creando una sala o que se este uniendo

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_name, self.channel_name
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
            room_code = self.createRoom(message)
            self.send(json.dumps({
                "type": "room.created",
                "message": {
                    "room_code": room_code
                }
            }))

        elif message_type == "join.room":
            if self.room_name in rooms: # TODO: old
                self.joinRoom(message)
            # else # la sala no existe
        
        elif message_type == "room.ready":
            # TODO: este metodo para que?
            self.send(json.dumps({
                "type": "room.ready",
                "message": ""
            }))

    #     "type": "identify",
    #     "message": {
    #         "user_id": int
    #     }
    def identify(self, message) -> None:
        self.user_id = message["user_id"]

    #     "type": "create_room",
    #     "message": {
    #         la info del formulario para generar la sala
    #     }
    def createRoom(self, message) -> int:
        room_code = ''.join(random.sample(string.ascii_letters, 16))
        self.room_name = f"pong_${room_code}"

        async_to_sync(channel_layer.group_send)(
            self.room_name, {
                "type": "game.config",
                "message": message
            }
        )

        async_to_sync(channel_layer.group_send)(
            self.room_name, {
                "type": "set.player",
                "message": {
                    "player1": self.player_id
                }
            }
        )

        return room_code

    #     "type": "join_room",
    #     "message": str, pero ignorable
    def joinRoom(self, message) -> None:
        # TODO: crear el GameConsumer
        # TODO: mensaje a el Game consumer para que comience
        self.send(json.dumps({
            "type": "room.ready",
            "message": ""
        }))

        rooms[self.room_name].daemon.start()

    def room_ready(self, event) -> None:
        i = 0
        # TODO: comenzar

    def direction(self, dir) -> None:
        # TODO: funcion para enviar al resto el movimiento del judagor leido del socket
        async_to_sync(channel_layer.group_send)(
            self.room_name, self.getGameState()
        )
