FROM node:14.17.3-alpine

RUN mkdir -p /var/www/docs
WORKDIR /var/www/docs

#Copias as pastas do projeto
COPY public .
COPY package.json .
COPY yarn.lock .

#instala os pacotes para rodar o servidor
RUN yarn install --production

EXPOSE 8000

ENTRYPOINT [ "yarn", "serve" ]