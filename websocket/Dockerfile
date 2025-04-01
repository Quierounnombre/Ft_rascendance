FROM python:3.13-slim AS builder

RUN pip install --upgrade pip
RUN mkdir /websocket

WORKDIR /websocket

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

COPY reqs.txt .
RUN pip install --no-cache-dir -r reqs.txt

FROM python:3.13-slim

RUN mkdir /websocket

COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder  /usr/local/bin/ /usr/local/bin/

COPY . /websocket/

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

RUN chmod +x /websocket/script.sh

CMD ["/websocket/script.sh"]
