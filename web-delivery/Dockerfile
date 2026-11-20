FROM nginx:1.27-alpine
COPY web-delivery/nginx.conf /etc/nginx/conf.d/default.conf
COPY src/public/myoutlet-app.js /usr/share/nginx/html/myoutlet-app.js
EXPOSE 8080
