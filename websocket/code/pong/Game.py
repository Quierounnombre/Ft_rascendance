import json
import time
import threading

from Ball import Ball
from Player import Player
from Counter import Counter
from CanvasObject import CanvasObject

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Game(threading.Thread):
    def __init__(self, data, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.game_objects = []

        self.background_color = "back"
        self.object_color = "white"

        self.timeout = 60 # TODO: esta en segundos, mirar como deberia ser
        self.max_score = 5
    
        self.room_name = f"pong_game_{self.scope["url_route"]["kwargs"]["room_name"]}"
        data = json.loads(data)

        for obj in data:
            if obj["type"] == "config":
                if 'background_color' in obj:
                    self.background_color = obj['background_color']
                if 'timeout' in obj:
                    self.timeout= obj['timeout']
                if 'max_score' in obj:
                    self.max_score = obj['max_score']
            elif obj["type"] == "player":
                tmp = Player(obj)
                self.game_objects.append(tmp)
            elif obj["type"] == "ball":
                tmp = Ball(obj)
                self.game_objects.append(tmp)
            elif obj["type"] == "counter":
                tmp = Counter(obj)
                self.game_objects.append(tmp)
            else:
                tmp = CanvasObject(obj)
                self.game_objects.append(tmp)
        
        for obj in self.game_objects:
            if obj.type == "counter":
                obj.timeout = self.timeout
                self.counter = obj 
                
                for obj2 in self.game_objects:
                    if obj2.type == "ball":
                        obj2.counter = obj 
                
                break
    
    def isEnd(self) -> bool:
        if self.counter.time_passed >= self.timeout:
            return True

        if self.counter.highest_score >= self.max_score:
            return True

        return False

    def serialize(self) -> str:
        tmp = '['
        for obj in self.game_objects:
            tmp += obj.serialize() + ','
        tmp = tmp[:-1] + ']'

        return tmp
    
    def getGameState(self) -> dict:
        message = self.serialize()
        
        return {
            "type": "game.state",
            "message": message
        }
    
    def broadcastState(self) -> None:
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            self.room_name, self.getGameState()
        )

    def setPlayerDir(self, playerN, dirY):
        for obj in self.game_objects:
            if obj.id == playerN:
                obj.dirY = dirY
    
    def run(self) -> None:
        while not self.isEnd():
            for obj in self.game_objects:
                obj.update(self.game_objects)
            self.broadcastState()
            time.sleep(0.01)

        print("End game") # TODO: borrar

# TODO: prueba que habra que borrar
# game = Game('[{"id":"counter","type":"counter","x":400,"y":10,"font":"42px Arial"},{"id":"player1","type":"player","x":10,"y":200,"width":20,"height":100},{"id":"player2","type":"player","x":790,"y":200,"width":20,"height":100},{"id":"ball","type":"ball","x":400,"y":200,"dirX":-1,"dirY":0,"is_moving":true,"radius":10}]')
# daemon = threading.Thread(target=game.gameLoop, daemon=True)
# daemon.start()

# while not game.isEnd():
#     i = 0
