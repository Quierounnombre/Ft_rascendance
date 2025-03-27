import json
import time
import threading

from pong.Ball import Ball
from pong.Player import Player
from pong.Counter import Counter
from pong.CanvasObject import CanvasObject

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Game(threading.Thread):
    def __init__(self, room_name, data, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        self.game_objects = []

        self.background_color = "back"
        self.object_color = "white"

        self.timeout = 60 # TODO: esta en segundos, mirar como deberia ser
        self.max_score = 5
    
        self.room_name = room_name

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
                        obj2.counter.append(obj)
                
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
    
    def getGameState(self, msg_type) -> dict:
        data = self.serialize()
        
        return {
            "type": msg_type,
            "message": {
                "room_name": self.room_name,
                "data": data
            }
        }
    
    # TODO: metodo para mandar a todos que ya ha terminado la partida
    
    def broadcastState(self, msg_type) -> None:
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            self.room_name, self.getGameState(msg_type)
        )

    def setPlayerDir(self, playerN, dirY) -> None:
        for obj in self.game_objects:
            if obj.id == playerN:
                obj.dirY = dirY
    
    def run(self) -> None:
        for obj in self.game_objects:
            if obj.id == "counter":
                obj.start_time.append(time.time())

        while not self.isEnd(): # TODO: no esta terminando
            for obj in self.game_objects:
                obj.update(self.game_objects)
            self.broadcastState("game.state")
            time.sleep(0.01)

        self.broadcastState("game.end")# TODO: el metodo requiere el game room
        print("End game") # TODO: borrar
