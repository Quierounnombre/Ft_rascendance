#!/bin/sh

python3 /UserMng/code/manage.py	makemigrations
python3 /UserMng/code/manage.py	migrate
python3 /UserMng/code/manage.py createsuperuser --username ${SUPER_USER} --email ${SUPER_EMAIL} --database default --no-input

#gunicorn --bind 0.0.0.0:8000 --workers 3 Register.code.configs.wsgi:application
exec python3 /UserMng/code/manage.py runserver 0.0.0.0:${BACKEND_PORT}