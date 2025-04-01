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
        message = event["message"]

        async_to_sync(channel_layer.group_send)(
            message["room_name"], {
                "type": "game.started",
                "message": {
                    "room_name": message["room_name"],
                    "data": game_rooms[message["room_name"]].serialize()
                }
            }
        )

        if not game_rooms[event["message"]["room_name"]].is_running:
            game_rooms[event["message"]["room_name"]].start()
    
    def game_started(self, event) -> None:
        pass
    
    def game_state(self, event) -> None:
        pass
    
    def game_end(self, event) -> None:
        if not game_rooms[event["message"]["room_name"]].is_running:
            del game_rooms[event["message"]["room_name"]]
        # TODO: pasar a la base de datos el resultado
    
    # message: {
    #     "room_name": str,
    #     "player_id": int
    #     "dir": int
    #     "is_moving": bool
    # }
    def player_direction(self, event) -> None:
        message = event["message"]

        game_rooms[message["room_name"]].setPlayerDir(message["player_id"], message["dir"], message["is_moving"])
    
    # message: {
    #     "room_name": str,
    #     "player": str
    #     "id": int
    # }
    def set_player(self, event) -> None:
        message = event["message"]

        if game_rooms[message["room_name"]].number_players == 2:
            return

        for obj in game_rooms[message["room_name"]].game_objects:
            if obj.id == message["player"] and obj.pk < 0:
                obj.pk = message["id"]
                game_rooms[message["room_name"]].number_players += 1

        
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


