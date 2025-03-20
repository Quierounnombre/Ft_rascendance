FROM python

COPY reqs.txt /code/
WORKDIR /code/
RUN pip install -r /code/reqs.txt
RUN /code/manage.py runworker game_engine
