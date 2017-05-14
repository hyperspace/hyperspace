#!/usr/bin/env bash

FILE=/Applications/Phoenix.app
path=${PWD}

if [ ! -d $FILE ]
then
    echo "Install Phoenix.app"
    cd /Applications && curl -L 'https://github.com/kasper/phoenix/releases/download/2.5/phoenix-2.5.tar.gz' | tar -xz
    wait
fi

if [ ! -d ~/.config/phoenix/ ]
then
  echo "Creating config files"
  mkdir ~/.config/phoenix/
fi

if [ ! -d ~/.config/hyperspace/ ]
then
  mkdir ~/.config/hyperspace/
fi

if [ ! -f ~/.config/hyperspace/configs.json ]
then
  cp $path/src/configs/configs.json ~/.config/hyperspace/configs.json
fi

wait

cp $path/src/configs/phoenix.js ~/.config/phoenix/phoenix.js

wait

echo "Open Phoenix.app"
open /Applications/Phoenix.app


