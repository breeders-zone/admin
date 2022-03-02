  
FROM node:14-alpine3.11 as build-stage

WORKDIR /var/www

COPY . /var/www

RUN npm i --no-optional
RUN npm run build

FROM nginx:latest

COPY --from=build-stage /var/www/build/ /usr/share/nginx/html

COPY --from=build-stage /var/www/docker/default.conf /etc/nginx/conf.d/example.com.conf