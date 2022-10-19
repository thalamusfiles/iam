#!/bin/bash

# Entra na pasta bin
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

# Troca para a pasta docs
cd ../docs/

# Inicia a aplicação
docker build -t iam_docs_builded .