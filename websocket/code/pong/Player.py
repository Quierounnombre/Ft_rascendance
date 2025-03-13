from CanvasObject import CanvasObject

class Player(CanvasObject):
    def __init__(self, obj):
        super().__init__(obj)
    
    def slide(self, dirX, dirY):
        self.y += self.speed * dirY
        if not self.is_moving:
            if self.dirY > 0:
                self.dirY -= 1
            elif self.dirY < 0:
                self.dirY += 1
        self.recalculateHitbox()
        self.keepInsideCanvas()
