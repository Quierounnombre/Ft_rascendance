import json
import time

from Ball import Ball
from Player import Player
from Counter import Counter
from CanvasObject import CanvasObject

class Game:
    def __init__(self, data):
        self.game_objects = [];

        self.background_color = "back"
        self.object_color = "white"

        self.timeout = 60 # TODO: esta en segundos, mirar como deberia ser
        self.max_score = 5
        
        tmp = json.loads(data)

        for obj in tmp:
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
    
    def isEnd(self):
        if self.counter.time_passed >= self.timeout:
            return True

        if self.counter.highest_score >= self.max_score:
            return True

        return False
    
    def gameLoop(self):
        while True:
            if self.isEnd():
                print("End game") # TODO: borrar
                break;

            # TODO: leer la actualizacion

            for obj in self.game_objects:
                # print(json.dumps(obj.serialize()))
                print(obj.serialize())
                obj.update(self.game_objects)
            
            # TODO: comunicar al resto
            time.sleep(0.01)

# TODO: prueba que habra que borrar
game = Game('[{"id":"counter","type":"counter","x":400,"y":10,"font":"42px Arial"},{"id":"player1","type":"player","x":10,"y":200,"width":20,"height":100},{"id":"player2","type":"player","x":790,"y":200,"width":20,"height":100},{"id":"ball","type":"ball","x":400,"y":200,"dirX":-1,"dirY":0,"is_moving":true,"radius":10}]')
game.gameLoop()
