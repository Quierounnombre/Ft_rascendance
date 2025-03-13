import math
from CanvasObject import CanvasObject

class Ball(CanvasObject):
    def __init__(self, obj):
        super().__init__(obj)
        self.radius = obj['radius']
        self.width = self.radius * 2
        self.heigth = self.radius * 2
        self.recalculateHitbox()

    def keepInsideCanvas(self):
        if self.point_x1 < 0:
            self.moveTo(self.canvas_width / 2, self.canvas_height / 2)
            self.counter.player2_score += 1
            self.dirY = -1
            self.dirX = -1
            self.speed = 4
        elif self.point_x2 > self.canvas_width:
            self.moveTo(self.canvas_width / 2, self.canvas_height / 2)
            self.dirY = 1
            self.dirX = 1
            self.speed = 4
            self.counter.player1_score += 1 # TODO: revisar esto

        if self.point_y1 < self.canvas_height / 8:
            self.moveTo(self.x, (self.canvas_height / 8) + ((self.point_y3 - self.point_y1) / 2))
            self.dirY = -self.dirY
        elif self.point_y3 > self.canvas_height:
            self.moveTo(self.x, self.canvas_height - (self.point_y3 - self.point_y1) / 2)
            self.dirY = -self.dirY
            
    def resolveHit(self, canvas_object):
        self.repelFromObject(canvas_object)

        self.dirX = -self.dirX

        if canvas_object.type == "player":
            if canvas_object.dirY == 0:
                self.dirY = 0
            else:
                self.dirY = -(canvas_object.dirY / math.fabs(canvas_object.dirY))
            self.speed = self.speed + 0.5 if self.speed < 20 else 20
        else: 
            self.dirY = -self.dirY
    
    def update(self, canvas_objects):
        if self.dirY == 0:
            self.dirY = 0.01;
        super().update(canvas_objects)
    
    def repelFromObject(self, canvas_object):
        old_speed = self.speed;
        old_dirX = self.dirX;
        old_dirY = self.dirY;

        self.speed = 2;
        while self.objectHits(canvas_object):
            self.slide(-old_dirX, -old_dirY);

        self.speed = old_speed;
        self.dirX = old_dirX;
        self.dirY = old_dirY;
