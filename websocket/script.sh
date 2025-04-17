#!/bin/sh

python3 /websocket/code/manage.py makemigrations
python3 /websocket/code/manage.py migrate

exec python3 /websocket/code/manage.py runworker game_engine &>/var/log/server.log &
exec python3 /websocket/code/manage.py runserver 0.0.0.0:${BACKEND_PORT}
