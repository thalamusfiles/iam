#!/bin/bash

FILE=config.env

# Entra na pasta bin
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

# Criandos pastas configurações
mkdir -p ../backend/tmp/postgres_tst

# Troca para a pasta docs
cd ../backend/docker

# Inicia a aplicação
docker-compose --env-file .env.tst up