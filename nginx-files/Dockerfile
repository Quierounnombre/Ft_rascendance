FROM nginx

RUN mkdir /etc/nginx/ssl/
RUN openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
     -out /etc/nginx/ssl/rascendance.crt -keyout /etc/nginx/ssl/rascendance.key -subj "/CN=rascendance"

COPY conf/rascendance.conf /etc/nginx/conf.d/