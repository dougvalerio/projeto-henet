#!/bin/bash

# Construir a imagem Docker
docker build --pull --rm -f "Dockerfile" -t projeto-eventos:latest "."

# Salvar a imagem Docker como um arquivo tar
docker save -o /home/darkowl/projeto-eventos.tar projeto-eventos

# Copiar o arquivo tar para o servidor remoto
scp /home/darkowl/projeto-eventos.tar velejar@177.38.244.53:/home/velejar/