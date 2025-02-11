#!/bin/sh

python3 -m django migrate --settings=Register.code.configs.settings

gunicorn --bind 0.0.0.0:8000 --workers 3 Register.code.configs.wsgi:application