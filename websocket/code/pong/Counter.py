import time 

from datetime import datetime
from CanvasObject import CanvasObject

class Counter(CanvasObject):
    def __init__(self, obj):
        super().__init__(obj)
        self.timeout = 60

        self.player1_score = 0
        self.player2_score = 0
        self.highest_score = 0

        self.x = -1
        self.y = -1
        self.width = 0
        self.height = 0
        self.recalculateHitbox()

        self.time_passed = 0
        self.start_time = time.time() # TODO: seguro? esto es en segundos
    
    def serialize(self):
        return {
            'id': self.id,
            'type': self.type,

            'x': self.x,
            'y': self.y,
            
            'width': self.width,
            'heigth': self.height,

            'color': self.color,

            'timeout': self.timeout,
            'time_passed': self.time_passed,
            'start_time': self.start_time,
            'player1_score': self.player1_score,
            'player2_score': self.player2_score,
        }

    def setStartTime(self, time):
        self.start_time = time

    def update(self, canvas_object):
        self.time_passed = time.time() - self.start_time
        self.highest_score = self.player1_score if self.player1_score > self.player1_score else self.player2_score
