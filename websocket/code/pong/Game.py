import json
import time
import threading
import requests
import os

from pong.Ball import Ball
from pong.Player import Player
from pong.Counter import Counter
from pong.CanvasObject import CanvasObject

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Game(threading.Thread):
    def __init__(self, room_name, tournament_name ,data, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs, daemon=True)

        self.game_objects = []

        self.background_color = "back"
        self.object_color = "white"

        self.timeout = 60 # TODO: esta en segundos, mirar como deberia ser
        self.max_score = 5
    
        self.room_name = room_name
        self.tournament_name = tournament_name
        self.number_players = 0

        self.is_running = False

        self.player1_username =  ''
        self.player1_id = -42
        self.player2_username =  ''
        self.player2_id = -42

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
                "tournament_name": self.tournament_name,
                "player1_username": self.player1_username,
                "player2_username": self.player2_username,
                "data": data
            }
        }
    
    # TODO: metodo para mandar a todos que ya ha terminado la partida
    
    def broadcastState(self, msg_type) -> None:
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            self.room_name, self.getGameState(msg_type)
        )

    def setPlayerDir(self, player_id, dirY, is_moving) -> None:
        for obj in self.game_objects:
            if obj.pk == player_id:
                if (is_moving):
                    obj.dirY = dirY
                    obj.is_moving = is_moving
                else:
                    obj.is_moving = False
    
    def run(self) -> None:
        for obj in self.game_objects:
            if obj.id == "counter":
                obj.start_time[0] = time.time()

        self.is_running = True
        while not self.isEnd(): # TODO: no esta terminando
            for obj in self.game_objects:
                obj.update(self.game_objects)
            self.broadcastState("game.state")
            time.sleep(0.01)

        self.is_running = False
        self.exportToDatabase() # TODO: hacer que funcione
        self.broadcastState("game.end")# TODO: el metodo requiere el game room
        # TODO: pasar a la base de datos el resultado
    
    def getResult(self) -> dict:
        for obj in self.game_objects:
            if obj.id == "counter":
                player1_score = obj.player1_score
                player2_score = obj.player2_score
        
        if player1_score > player2_score:
            return {
                self.player1_id: 2,
                self.player2_id: 0
            }
        elif player1_score > player2_score: 
            return {
                self.player1_id: 0,
                self.player2_id: 2
            }
        else:
            return {
                self.player1_id: 1,
                self.player2_id: 1
            }
 
    def exportToDatabase(self) -> None:
        for obj in self.game_objects:
            if obj.id == "player1":
                player1_id = obj.pk
                if (obj.pk == -1):
                    return

            elif obj.id == "player2":
                player2_id = obj.pk
                if (obj.pk == -1):
                    return
            
            elif obj.type == "counter":
                player1_score = obj.player1_score
                player2_score = obj.player2_score
                duration = obj.time_passed

            # TODO: cosas de torneo

        requests.post(f'http://history:{os.environ["HISTORY_PORT"]}/add/', json={
            "player1_id": player1_id,
            "player1_score": player1_score,
            "player2_id": player2_id,
            "player2_score": player2_score,
            "duration": duration,
        })
        # "tournament": "",
