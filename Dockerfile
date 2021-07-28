  
FROM node:14-alpine3.11 as build-stage

WORKDIR /var/www

COPY . /var/www

RUN rm package-lock.json && npm i
RUN npm run build

FROM nginx:latest

COPY --from=build-stage /var/www/build/ /usr/share/nginx/html