# chat/routing.py
from django.urls import re_path

from . import consumers

websocket_urlpatterns_pong = [
    re_path(r"ws/pong/(?P<room_name>\w+)/$", consumers.PongConsumer.as_asgi()),
]