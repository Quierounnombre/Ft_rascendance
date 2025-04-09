#!/bin/sh

python3 /UserMng/code/manage.py	makemigrations UserMng
python3 /UserMng/code/manage.py	migrate --verbosity=3

python /UserMng/code/manage.py createsuperuser --noinput --username ${DJANGO_SUPERUSER}

#gunicorn --bind 0.0.0.0:8000 --workers 3 Register.code.configs.wsgi:application
exec python3 /UserMng/code/manage.py runserver 0.0.0.0:${BACKEND_PORT}