import json

from channels.consumer import SyncConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from pong.Game import Game

game_rooms = {}

class GameConsumer(SyncConsumer):
    # message: {"room_id: string"}
    def game_start(self, event) -> None:
        async_to_sync(channel_layer.group_send)(
            self.room_name, {
                "type": "game.start",
            }
        )

        game_rooms[event["message"]["room_id"]].start()
    
    # message: {
    #     "room_id": str,
    #     "player": str
    #     "dir": int
    # }
    def player_direction(self, event) -> None:
        message = event["message"]

        game_rooms[message["room_id"]].setPlayerDir(message["player"], message["dir"])
    
    # message: {
    #     "room_id": str,
    #     "player": str
    #     "id": int
    # }
    def set_player(self, event) -> None:
        message = event["message"]

        for obj in game_rooms[message["room_id"]].game_objects:
            if obj.id == message["player"]:
                obj.pk = message["player_id"]
    
    # message: {
    #     "room_id": str,
    #     "data": json converted to string with the config
    # }
    def game_config(self, event) -> None:
        message = event["message"]

        game_rooms[message["room_id"]] = Game(message["data"])

        self.room_name = f"pong_${message["room_id"]}"

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_name, self.channel_name
        )


