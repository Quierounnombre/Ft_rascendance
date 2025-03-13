import json

from channels.generic.websocket import WebsocketConsumer
from channels.layers import get_channel_layer
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

class PongConsumer(JsonWebsocketConsumer):
    http_user = True
    strict_ordering = True

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"pong_{self.room_name}"

        # TODO: trasladar lo de js aqui, para la seleccion de user
        # TODO: hay dos casos, que alguien este creando una sala o que se este uniendo

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def game_update(self, event):
        # TODO: el front tendra que enviar el cambio pertinente (state)
        # send message to websocket
        state = event["state"]
        self.send(json.dumps(state))

    def receive(self, text_data):
        content = json.loads(text_data)
        message_type = content["type"]
        message = content["message"]

        if message_type == "direction":
            return self.direction(message)
        elif message_type == "join":
            return self.join(message)


class GameEngine(threading.Thread):
    def run(self):
        while True:
            self.state = # TODO: calculos del estado de la partida
            self.broadcast_state(self.state)
            time.sleep(0.05)
    
    def broadcast_state(self, state):
        state_json = state.render()
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.room_group_name, {
                "type": "game_update",
                "state": state_json
            }
        )
    async def direction(self, message):
        await self.channel_layer.send(
            "game_engine",
            {
                "type": "player.dirY", # TODO: nope, habria que ver que se anda pasando, probablemente el estado de la partida
                "player": self.username,
                "dirY": message["dirY"]
            },
        )


class GameConsumer(SyncConsumer):
    strict_ordering = True

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"pong_{self.room_name}"
        self.engine = GameEngine(self.room_group_name)

        self.engine.start()
    
    def player_new(self, event):
        self.engine.join_queue(envent["player"])

    def player_direction(self, event):
        dirY = event.get("dirY")
        self.engine.set_player_direction(event[player], dirY)
