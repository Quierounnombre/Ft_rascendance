import json
import time
import threading
import requests
import os

from pong.generateRandomString import generateRandomString

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# ------------------------------------------------------------------------------
class TournamentParticipant:
    def __init__(self, user_id : int = -1, user_name : str = "", *args, **kwargs) -> None:
        self.user_id = user_id
        self.user_name = user_name
        self.scores = []
    
    def __str__(self):
        return f'[{self.user_id}, {self.user_name}]'
    
    def setId(self, user_id : str) -> None:
        self.user_id = user_id

    def getId(self) -> str:
        return self.user_id

    def setUserName(self, user_name : str) -> None:
        self.user_name = user_name

    def getUserName(self) -> str:
        return self.user_name
    
    def getScores(self) -> dict:
        return self.scores
    
    def getTotalPoints(self) -> int:
        total_points = 0;

        for score in self.scores:
            total_points += score
        
        print(f'{self.user_name}: {total_points}: {self.scores}', flush=True)
        return total_points

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
        self.round_games_finished = 0
        self.round_active = False
        self.tournament_end = False

        if num_players % 2 != 0:
            raise ValueError("odd players")
        
        if num_players < 4:
            raise ValueError("low players")

    def registerPlayer(self, player : TournamentParticipant) -> bool:
        if len(list(filter(lambda p: p.user_id == player.user_id, self.player_list))) != 0:
            return True

        if len(self.player_list) >= self.target_players:
            return False

        self.player_list.append(player)

        return True

    def isTournamentFull(self) -> bool:
        return len(self.player_list) == self.target_players

    def generateSchedule(self) -> None:
        channel_layer = get_channel_layer()
        number_players = len(self.player_list)
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
            self.tournament_name, {
                'type': 'create.tournament.game',
                'message': {
                    "room_name": room_name,
                    "tournament_name": self.tournament_name,
                    "game_config": self.game_config,
                    "user_id": player1["user_id"],
                }
            }
        )
        time.sleep(1)
        async_to_sync(channel_layer.group_send)(
            self.tournament_name, {
                'type': 'join.tournament.game',
                'message': {
                    "room_name": room_name,
                    "tournament_name": self.tournament_name,
                    "user_id": player2["user_id"],
                }
            }
        )

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
        self.round_active = True

        return True
    
    def endGame(self, room_name, score) -> None:
        for player in self.player_list:
            if player.user_id in score:
                player.scores.append(score[player.user_id])

        if room_name in self.games_finished:
            return

        self.games_finished.append(room_name)
        self.round_games_finished += 1

        if self.round_games_finished == (self.target_players // 2):
            self.round_active = False
            self.round_games_finished = 0
            self.games_finished = []

    def serialize(self) -> str:
        pass

    def currentRoundHasEnd(self) -> bool:
        return self.round_games_finished == (self.target_players / 2)
    
    def run(self) -> None:
        self.is_running = True

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.tournament_name, {
                "type": "tournament.started",
                "message": ""
            }
        )

        while True:
            if self.round_active:
                time.sleep(2)
                continue

            if not self.createRound():
                break
            
        self.is_running = False
        async_to_sync(channel_layer.group_send)(
            self.tournament_name, {
                "type": "tournament.ended",
                "message": json.dumps(self.getPlayersRanking())
            }
        )
    
    def getPlayersRanking(self) -> list:
        tmp = map(lambda p: (p.getUserName(), p.getTotalPoints()), self.player_list)
        tmp2 = sorted(tmp, key=lambda p: -p[1])
        return tmp2

