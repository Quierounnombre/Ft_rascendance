import json

from channels.consumer import SyncConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from Game import Game

class GameConsumer(SyncConsumer):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        self.room_name = f"pong_{self.scope["url_route"]["kwargs"]["room_name"]}"

    def start(self) -> None:
        self.game.start()
    
    # message: {"payerN: int"}
    def player_direction(self, event) -> None:
        message = event["message"]
        player_id = message.keys()[0]

        self.game.setPlayerDir(player_id, message[player_id])
    
    # "message": {"playerN": int}
    def set_player(self, event) -> None:
        message = event["message"]
        player_id = message.keys()[0]

        for obj in self.game.game_objects:
            if obj.type == player_id:
                obj.id = message["player_id"]
    
    # "message": json converted to string with the config
    def game_config(self, event) -> None:
        self.game = Game(event["message"])
