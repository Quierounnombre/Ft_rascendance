FROM python:3.13-slim AS builder

RUN pip install --upgrade pip

RUN mkdir /UserMng

WORKDIR /UserMng

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

COPY reqs.txt .
RUN pip install --no-cache-dir -r reqs.txt

FROM python:3.13-slim

RUN mkdir /UserMng

COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder  /usr/local/bin/ /usr/local/bin/

COPY . /UserMng/

RUN mkdir /UserMng/code/static
RUN mkdir /UserMng/code/staticfiles

#RUN python3 -m django migrate --settings=UserMng.code.configs.settings
#RUN python3 -m django collectstatic --settings=UserMng.code.configs.settings --noinput

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

RUN chmod +x UserMng/script.sh

CMD ["UserMng/script.sh"]

#CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "UserMng.code.configs.wsgi:application"]


