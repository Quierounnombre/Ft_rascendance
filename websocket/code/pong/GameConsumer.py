import json

from channels.consumer import SyncConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from Game import Game

class GameConsumer(SyncConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.room_name = f"pong_game_{self.scope["url_route"]["kwargs"]["room_name"]}"
        self.game = Game() # TODO: que llegue la info del juego aqui

    def start(self):
        # Runs the engine in a new thread
        self.game.start()
    
    # TODO: seguro que cuando reciba algo con type:player.direction ira aqui?
    def player_direction(self, event):
        # message: {"payerN: int"}
        message = event["message"]
        player_id = message.keys()[0]

        self.game.setPlayerDir(player_id, message[player_id])
    
    def set_player(self, event):
        # "type": "set.player",
        # "message": {
        #     "playerN": str with the id
        # }
        # TODO:
