#!/usr/bin/env bash

FILE=/Applications/Phoenix.app

if [ ! -d $FILE ]
then
    echo "Install Phoenix.app"
    path=${PWD}
    cd /Applications && curl -L 'https://github.com/kasper/phoenix/releases/download/2.5/phoenix-2.5.tar.gz' | tar -xz
    wait
    echo "Creating config files"
    if [ ! -d ~/.config/phoenix/ ]
    then
      mkdir ~/.config/phoenix/
    fi
    if [ ! -d ~/.config/hyperspace/ ]
    then
      mkdir ~/.config/hyperspace/
    fi
    wait
    cp $path/src/configs/phoenix.js ~/.config/phoenix/phoenix.js
    wait
    open /Applications/Phoenix.app
else
    echo "Open Phoenix.app"
    open /Applications/Phoenix.app
fi

