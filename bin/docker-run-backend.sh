#!/bin/bash

FILE=config.env

# Entra na pasta bin
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

# Carrega configurações
if [ -f "$FILE" ]; then
    export $(grep -v '^#' $FILE | xargs -d '\n')
else
  echo "Arquivo $FILE inexistente."
  exit 1
fi


# Troca para a pasta docs
cd ../backend/docker

# Inicia a aplicação
docker-compose --env-file .env.dev up