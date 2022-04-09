FROM nginx
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY example.crt /etc/nginx/certs/example.crt
COPY example.key /etc/nginx/certs/example.key
