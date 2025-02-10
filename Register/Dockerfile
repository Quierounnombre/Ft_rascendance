FROM python:3.13-slim AS builder

RUN pip install --upgrade pip

RUN mkdir /app

WORKDIR /app

COPY reqs.txt .
RUN pip install --no-cache-dir -r reqs.txt

FROM python:3.13-slim

RUN useradd -m -r appuser
RUN mkdir /app
RUN chown -R appuser /app

COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder  /usr/local/bin/ /usr/local/bin/

COPY --chown=appuser:appuser . /app/


USER appuser

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "app.code.configs.wsgi:application"]


