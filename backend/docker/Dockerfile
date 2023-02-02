FROM node:18.12.0-alpine

RUN mkdir -p /var/www/backend
WORKDIR /var/www/backend

# Copias as pastas do projeto
COPY dist dist/
COPY package.json .
COPY yarn.lock .
COPY . .
#COPY public public/ lincado durante a execucao

RUN ls

# Instala os pacotes para rodar o servidor
RUN yarn