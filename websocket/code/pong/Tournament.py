import json
import time
import threading
import requests
import os

# from pong.Ball import Ball
# from pong.Player import Player
# from pong.Counter import Counter
# from pong.CanvasObject import CanvasObject
# from pong.Game import Game

from pong.generateRandomString import generateRandomString

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# ------------------------------------------------------------------------------
class TournamentParticipant:
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
    def __init__(self, num_players : int, game_config : str, tournament_name : str, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs, daemon=True)
        self.player_list : list = []
        self.target_players : int = num_players
        self.game_config : str = game_config
        self.tournament_name : str = tournament_name
        self.is_running = False

        self.games_finished = []

        if num_players % 2 != 0:
            raise ValueError("odd players") # TODO: se deberia comprobar antes
        
        if num_players < 4:
            raise ValueError("low players") # TODO: se deberia comprobar antes

    def registerPlayer(self, player : TournamentParticipant) -> bool:
        if len(self.player_list) >= self.target_players:
            return False

        self.player_list.append(player)

        # TODO: haria falta unirse al grupo para enviar, o es solo para recibir?
        # async_to_sync(self.channel_layer.group_add)(
        #     player.getId(), self.channel_name
        # )

        return True

    def isTournamentFull(self) -> bool:
        return len(self.player_list) == self.target_players

    def isTournamentEnd(self) -> bool:
        return len(self.game_queue) == 0

    def generateSchedule(self) -> None:
        number_players = len(self.player_list)

        if number_players < 4:
            raise ValueError("odd players") # TODO: se deberia comprobar antes

        if number_players % 2  != 0:
            raise ValueError("low players") # TODO: se deberia comprobar antes

        temporal_list = self.player_list.copy()

        schedule = '['
        for i in range(len(self.player_list) - 1):
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
        self.game_queue = json.loads(schedule)

    def createGame(self, game) -> None:
        room_name = generateRandomString(8)
        channel_layer = get_channel_layer()

        player1 = game["player1"]
        player2 = game["player2"]

        async_to_sync(channel_layer.group_send)(
            str(player1["player_id"]), {
                'type': 'create.tournament.game',
                'message': {
                    "room_name": room_name,
                    "tournament_name": self.tournament_name,
                    "game_config": self.game_config
                }
            }
        )

        async_to_sync(channel_layer.group_send)(
            str(player2["player_id"]), {
                'type': 'join.tournament.game',
                'message': {
                    "room_name": room_name,
                    "tournament_name": self.tournament_name
                }
            }
        )
        # TODO: identificar player1
        # TODO: player1 crea sala
        # TODO: identificar player2
        # TODO: player2 se une a sala
        pass

    def createRound(self) -> bool:
        if len(self.game_queue) < 1:
            return False

        current_round = next(iter(self.game_queue))
        

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.tournament_name, {
                "type": "next.round",
                "message": ""
            }
        )

        for game in current_round:
            self.createGame(game)

        self.game_queue.pop(0)

        return True
    
    def endGame(self, room_name) -> None:
        if room_name in self.games_finished:
            return

        self.games_finished.append(room_name)            
        self.round_games_finished += 1

    def serialize(self) -> str:
        pass

    def currentRoundHasEnd(self) -> bool:
        return self.round_games_finished == (self.target_players / 2)

    def run(self) -> None:
        # TODO:
        self.is_running = True
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            self.tournament_name, {
                "type": "tournament.started",
                "message": ""
            }
        )

        while not self.isTournamentEnd():
            if not self.currentRoundHasEnd():
                continue

            if not self.createRound():
                self.round_games_finished = 0
                self.games_finished = []
                break

        self.is_running = False
