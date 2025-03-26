import json

from channels.consumer import SyncConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from pong.Game import Game

game_rooms = {}

class GameConsumer(SyncConsumer):
    # message: {"room_name: string"}
    def game_start(self, event) -> None:
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            event["message"]["room_name"], {
                "type": "game.started",
                "message": {
                    "room_name": event["message"]["room_name"]
                }
            }
        )

        game_rooms[event["message"]["room_name"]].start()
    
    def game_started(self, event) -> None:
        pass
    
    def game_state(self, event) -> None:
        pass
    
    def game_end(self, event) -> None:
        game_rooms[event["message"]["room_name"]].stop()
    
    # message: {
    #     "room_name": str,
    #     "player": str
    #     "dir": int
    # }
    def player_direction(self, event) -> None:
        message = event["message"]

        print(message, flush=True)
        game_rooms[message["room_name"]].setPlayerDir(message["player"], message["dir"])
    
    # message: {
    #     "room_name": str,
    #     "player": str
    #     "id": int
    # }
    def set_player(self, event) -> None:
        message = event["message"]

        for obj in game_rooms[message["room_name"]].game_objects:
            if obj.id == message["player"]:
                obj.pk = message["id"]
        
    # message: {
    #     "room_name": str,
    #     "data": json converted to string with the config
    # }
    def game_config(self, event) -> None:
        message = event["message"]

        self.room_name = message["room_name"]
        game_rooms[message["room_name"]] = Game(room_name=self.room_name, data=message["data"])


        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_name, self.channel_name
        )


