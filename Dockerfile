  
FROM node:lts as build-stage

WORKDIR /var/www

COPY . /var/www

RUN npm i
RUN npm run build

FROM nginx:latest

COPY --from=build-stage /var/www/build/ /usr/share/nginx/html