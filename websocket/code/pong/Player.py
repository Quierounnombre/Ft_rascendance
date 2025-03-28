from pong.CanvasObject import CanvasObject
import json

class Player(CanvasObject):
    def __init__(self, obj):
        super().__init__(obj)
        self.is_moving = False
        self.pk = -1
    
    def slide(self, dirX, dirY):
        self.y += self.speed * dirY

        if not self.is_moving:
            if self.dirY > 0:
                self.dirY -= 1
            elif self.dirY < 0:
                self.dirY += 1

        self.recalculateHitbox()
        self.keepInsideCanvas()

    def serialize(self):
        return json.dumps({
            'id': self.id,
            'pk': self.pk,
            'type': self.type,

            'x': self.x,
            'y': self.y,
            
            'width': self.width,
            'height': self.height,

            'color': self.color,
        })
