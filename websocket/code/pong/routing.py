# chat/routing.py
from django.urls import re_path

from . import PongConsumer

websocket_urlpatterns_pong = [
    re_path(r"ws/pong/(?P<room_name>\w+)/$", PongConsumer.PongConsumer.as_asgi()),
]