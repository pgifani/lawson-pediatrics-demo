FROM nginx:1.27-alpine
COPY index.html i18n.js i18n.es.js *.jpg *.png /usr/share/nginx/html/
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  add_header X-Robots-Tag "noindex, nofollow" always;\n  location / { try_files $uri $uri/ /index.html; }\n  location ~* \.(jpg|png|js)$ { expires 7d; add_header Cache-Control "public"; add_header X-Robots-Tag "noindex, nofollow" always; }\n  gzip on; gzip_types text/html application/javascript text/css;\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
