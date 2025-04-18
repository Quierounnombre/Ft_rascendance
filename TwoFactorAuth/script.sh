#!/bin/sh

python3 /TwoFactorAuth/code/manage.py makemigrations TwoFactorAuth
python3 /TwoFactorAuth/code/manage.py migrate --verbosity=3


#gunicorn --bind 0.0.0.0:8000 --workers 3 Register.code.configs.wsgi:application
exec python3 /TwoFactorAuth/code/manage.py runserver 0.0.0.0:${BACKEND_PORT}