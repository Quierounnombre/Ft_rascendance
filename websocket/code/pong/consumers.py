import json
import time

from channels.generic.websocket import WebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from Game import Game

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

rooms = {}

class PongConsumer(WebsocketConsumer):
    http_user = True
    strict_ordering = True

    def connect(self):
        self.room_name = f"pong_{self.scope["url_route"]["kwargs"]["room_name"]}"
        self.player_id = None

        # TODO: trasladar lo de js aqui, para la seleccion de user
        # TODO: hay dos casos, que alguien este creando una sala o que se este uniendo

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )

    def receive(self, text_data):
        content = json.loads(text_data)
        message_type = content["type"]
        message = content["message"]

        if message_type == "identify":
            self.identify(message)

        elif message_type == "create.room":
            if self.room_name not in rooms:
                self.createRoom(message)
            # else # esa sala ya existe

        elif message_type == "join.room":
            if self.room_name in rooms:
                self.joinRoom(message)
            # else # la sala no existe
        
        elif message_type == "room.ready":
            self.send(json.dumps({
                "type": "room.ready",
                "message": ""
            }))


    #     "type": "identify",
    #     "message": {
    #         "user_id": int
    #     }
    def identify(self, message):
        self.user_id = message["user_id"]

    #     "type": "create_room",
    #     "message": {
    #         la info del formulario para generar la sala
    #     }
    def createRoom(self, message):
        i = 0
        # TODO: old
        # rooms[self.room_name] = Game(message)
        # rooms[self.room_name].setPlayer1(self.user_id)

    #     "type": "join_room",
    #     "message": str, pero ignorable
    def joinRoom(self, message):
        # rooms[self.room_name].setPlayer2(self.user_id)
        # rooms[self.room_name].daemon = threading.Thread(target=rooms[self.room_name].gameLoop, daemon=True)

        # TODO: crear el GameConsumer
        # TODO: mensaje a el Game consumer para que comience
        self.send(json.dumps({
            "type": "room.ready",
            "message": ""
        }))

        rooms[self.room_name].daemon.start()

    def room_ready(self, event):
        # TODO: comenzar

    def direction(self, dir):
        # TODO: funcion para enviar al resto el movimiento del judagor leido del socket
        async_to_sync(channel_layer.group_send)(
            self.room_name, self.getGameState()
        )
