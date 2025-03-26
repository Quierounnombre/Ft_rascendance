FROM python:3.13-slim AS builder

RUN pip install --upgrade pip

RUN mkdir /history

WORKDIR /history

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

COPY reqs.txt .
RUN pip install --no-cache-dir -r reqs.txt

FROM python:3.13-slim

RUN mkdir /history

COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder  /usr/local/bin/ /usr/local/bin/

COPY . /history/

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

RUN chmod +x history/script.sh

CMD ["history/script.sh"]



