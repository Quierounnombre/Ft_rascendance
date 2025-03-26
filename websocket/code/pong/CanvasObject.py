import math
import json

class CanvasObject:
    def __init__(self, obj):
        # TODO: crear un diccionario que nazca de parsear la string JSON obj
        self.color = "white"
        self.id = "generic"
        self.type = "generic"
        self.x = 0
        self.y = 0
        self.dirX = 0
        self.dirY = 0
        self.speed = 4
        self.is_moving = False
        self.width = 0
        self.height = 0
        self.canvas_width = 800
        self.canvas_height = 400

        if 'color' in obj:
            self.color = obj['color']
        if 'id' in obj:
            self.id = obj['id']
        if 'type' in obj:
            self.type = obj['type']
        if 'x' in obj:
            self.x = obj['x']
        if 'y' in obj:
            self.y = obj['y']
        if 'dirX' in obj:
            self.dirX = obj['dirX']
        if 'dirY' in obj:
            self.dirY = obj['dirY']
        if 'speed' in obj:
            self.speed = obj['speed']
        if 'is_moving' in obj:
            self.is_moving = obj['is_moving']
        if 'width' in obj:
            self.width = obj['width']
        if 'height' in obj:
            self.height = obj['height']
        if 'canvas_width' in obj:
            self.height = obj['canvas_width']
        if 'canvas_height' in obj:
            self.height = obj['canvas_height']

        # xy1---------xy2
        # |            |
        # |     xy     |
        # |            |
        # xy3---------xy4

        self.point_x1 = self.x - self.width / 2
        self.point_y1 = self.y - self.height / 2

        self.point_x2 = self.x + self.width / 2
        self.point_y2 = self.y - self.height / 2

        self.point_x3 = self.x - self.width / 2
        self.point_y3 = self.y + self.height / 2

        self.point_x4 = self.x + self.width / 2
        self.point_y4 = self.y + self.height / 2
    
    def serialize(self):
        return json.dumps({
            'id': self.id,
            'type': self.type,

            'x': self.x,
            'y': self.y,
            
            'width': self.width,
            'height': self.height,

            'color': self.color,
        }) 

    def objectHits(self, object):
        horizontal_check = True
        vertical_check = True

        horizontal_proyection_center = math.fabs(self.x - object.x)
        horizontal_proyection_obj1 = math.fabs(self.x - self.point_x2)
        horizontal_proyection_obj2 = math.fabs(object.x - object.point_x2)

        if (horizontal_proyection_obj1 + horizontal_proyection_obj2) < horizontal_proyection_center:
            horizontal_check = False

        vertical_proyection_center = math.fabs(self.y - object.y)
        vertical_proyection_obj1 = math.fabs(self.y - self.point_y2)
        vertical_proyection_obj2 = math.fabs(object.y - object.point_y2)

        if (vertical_proyection_obj1 + vertical_proyection_obj2) < vertical_proyection_center:
            vertical_check = False

        return horizontal_check and vertical_check

    def slide(self, dirX, dirY):
        length = math.hypot(dirX, dirY)
        if (length > 0):
            dirX /= length
            dirY /= length

        self.x += self.speed * dirX
        self.y += self.speed * dirY
        
        self.dirX = dirX
        self.dirY = dirY
        
        self.recalculateHitbox()
        self.keepInsideCanvas()

    def moveTo(self, x, y):
        self.x = x
        self.y = y

        self.recalculateHitbox()
        self.keepInsideCanvas()

    def update(self, canvas_objects):
        self.slide(self.dirX, self.dirY)
        for obj in canvas_objects:
            if obj != self and self.objectHits(obj):
                self.resolveHit(obj);
    
    def recalculateHitbox(self):
        self.point_x1 = self.x - self.width / 2;
        self.point_y1 = self.y - self.height / 2;

        self.point_x2 = self.x + self.width / 2;
        self.point_y2 = self.y - self.height / 2;

        self.point_x3 = self.x - self.width / 2;
        self.point_y3 = self.y + self.height / 2;

        self.point_x4 = self.x + self.width / 2;
        self.point_y4 = self.y + self.height / 2;

    def keepInsideCanvas(self):
        # TODO: el canvas como te lo van a pasar, solo necesitas el tamano, pero tendra que pasarse en el json del constructor
        if self.point_x1 < 0:
            self.moveTo((self.point_x2 - self.point_x1) / 2, self.y)
        elif self.point_x2 > self.canvas_width:
            self.moveTo(self.canvas_width - (self.point_x2 - self.point_x1) / 2, self.y)

        if self.point_y1 < self.canvas_height / 8:
            self.moveTo(self.x, (self.canvas_height / 8) + ((self.point_y3 - self.point_y1) / 2));
        elif self.point_y3 > self.canvas_height:
            self.moveTo(self.x, self.canvas_height - ((self.point_y3 - self.point_y1) / 2));
