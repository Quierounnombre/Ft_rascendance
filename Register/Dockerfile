FROM python:3.13-slim AS builder

RUN pip install --upgrade pip

RUN mkdir /Register

WORKDIR /Register

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

COPY reqs.txt .
RUN pip install --no-cache-dir -r reqs.txt

FROM python:3.13-slim

RUN useradd -m -r appuser
RUN mkdir /Register
RUN chown -R appuser /Register

COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder  /usr/local/bin/ /usr/local/bin/

COPY --chown=appuser:appuser . /Register/

RUN mkdir /Register/code/static
RUN mkdir /Register/code/staticfiles

RUN python3 -m django migrate --settings=Register.code.configs.settings
RUN python3 -m django collectstatic --settings=Register.code.configs.settings --noinput

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

USER appuser

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "Register.code.configs.wsgi:application"]


