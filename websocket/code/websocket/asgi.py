"""
ASGI config for websocket project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'websocket.settings')

application = get_asgi_application()

from chat.routing import websocket_urlpatterns
from pong.routing import websocket_urlpatterns_pong
from pong.GameConsumer import GameConsumer

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
        "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns_pong)),
        "channel": ChannelNameRouter({
            "game_engine": GameConsumer.as_asgi(),
        }),
    }
)