import json
import time
import threading
import requests
import os

from pong.Ball import Ball
from pong.Player import Player
from pong.Counter import Counter
from pong.CanvasObject import CanvasObject
from pong.Game import Game

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# ------------------------------------------------------------------------------
class Player:
    def __init__(self, user_id : int = -1, user_name : str = "", *args, **kwargs) -> None:
        self.user_id = user_id
        self.user_name = user_name
    
    def setId(self, user_id : str) -> None:
        self.user_id = user_id

    def getId(self) -> str:
        return self.user_id

    def setUserName(self, user_name : str) -> None:
        self.user_name = user_name

    def getUserName(self) -> str:
        return self.user_name

# ------------------------------------------------------------------------------
class Tournament(threading.Thread):
    def __init__(self, num_players : int, game_config : str, *args, **kwargs) -> None:
        self.player_list : list = []
        self.target_players : int = num_players
        self.game_config : str = game_config

        self.game_rounds_to_play = 0
        self.game_rounds_played = 0

        if num_players % 2 != 0:
            raise ValueError("odd players") # TODO: se deberia comprobar antes
        
        if num_players < 4:
            raise ValueError("low players") # TODO: se deberia comprobar antes

    def registerPlayer(self, player : Player) -> bool:
        if len(self.player_list) >= self.target_players:
            return False

        self.player_list.append(player)
        return True

    def isTournamentFull(self) -> bool:
        return len(self.player_list) == self.target_players

    def isTournamentEnd(self) -> bool:
        return self.game_rounds_to_play == self.game_rounds_played

    def generateSchedule(self) -> None:
        number_players = len(self.player_list)

        if number_players < 4:
            raise ValueError("odd players") # TODO: se deberia comprobar antes

        if number_players % 2  != 0:
            raise ValueError("low players") # TODO: se deberia comprobar antes

        temporal_list = self.player_list.copy()

        schedule = '['
        for i in self.player_list:
            tmp1 = temporal_list[:len(temporal_list) // 2]
            tmp2 = temporal_list[len(temporal_list) // 2:]

            tmp2.reverse()
            
            schedule += '['
            for j,k in zip(tmp1, tmp2):
                schedule += f'{{"player1":{{"user_name":"{j.user_name}","user_id":{j.user_id}}},'
                schedule += f'"player2":{{"user_name":"{k.user_name}","user_id":{k.user_id}}}}},'
            schedule = schedule[:-1] + '],'

            tmp3 = temporal_list.pop()
            temporal_list.insert(1, tmp3)
        schedule = schedule[:-1] + ']'

        self.scheduleJSON = schedule
        self.scheduleDICT = json.loads(schedule)

    def createRound(self) -> None:
        pass

    def serialize(self) -> str:
        pass

    def run(self) -> None:
        pass
