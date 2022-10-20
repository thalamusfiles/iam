FROM node:14.17.3-alpine

RUN mkdir -p /var/www/docs
WORKDIR /var/www/docs/

#Copias as pastas do projeto
COPY .cache .cache/
COPY static static/
COPY package.json .
COPY yarn.lock .
COPY gatsby-config.js .
#COPY public public/ lincado durante a execucao

RUN ls

#instala os pacotes para rodar o servidor
RUN yarn install --production

EXPOSE 9000

ENTRYPOINT [ "yarn", "serve" ]