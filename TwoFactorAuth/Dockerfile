FROM python:3.13-slim AS builder

RUN pip install --upgrade pip

RUN mkdir /TwoFactorAuth

WORKDIR /TwoFactorAuth

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

COPY reqs.txt .
RUN pip install --no-cache-dir -r reqs.txt

FROM python:3.13-slim

RUN mkdir /TwoFactorAuth

COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder  /usr/local/bin/ /usr/local/bin/

COPY . /TwoFactorAuth/
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

RUN chmod +x TwoFactorAuth/script.sh

CMD ["TwoFactorAuth/script.sh"]
