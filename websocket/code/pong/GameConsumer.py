import json

from channels.consumer import SyncConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from pong.Game import Game

game_rooms = {}

class GameConsumer(SyncConsumer):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        self.room_name = f"pong_{self.scope["url_route"]["kwargs"]["room_name"]}"

    # message: {"room_id: string"}
    def game_start(self, event) -> None:
        game_rooms[event["message"]["room_id"]].start()
    
    # message: {
    #     "room_id": str,
    #     "payerN": int
    # }
    def player_direction(self, event) -> None:
        message = event["message"]
        player_id = message.keys()[0]

        game_rooms[message["room_id"]].setPlayerDir(player_id, message[player_id]) # TODO: seguro que esto funciona?
    
    # message: {
    #     "room_id": str,
    #     "payerN": int
    # }
    def set_player(self, event) -> None:
        message = event["message"]
        player_id = message.keys()[0]

        for obj in game_rooms[message["room_id"]].game_objects:
            if obj.type == player_id:
                obj.id = message["player_id"]
    
    # message: {
    #     "room_id": str,
    #     "data": json converted to string with the config
    # }
    def game_config(self, event) -> None:
        message = event["message"]

        game_rooms[message["room_id"]] = Game(message["data"])
