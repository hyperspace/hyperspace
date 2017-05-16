#!/usr/bin/env bash

FILE=/Applications/Phoenix.app
ABSPATH=$(cd "$(dirname "$0")"; pwd)

if [ ! -d $FILE ]
then
    echo "Install Phoenix.app"
    cd /Applications && curl -L 'https://github.com/kasper/phoenix/releases/download/2.5/phoenix-2.5.tar.gz' | tar -xz
    wait
fi

if [ ! -d $HOME/.config/phoenix/ ]
then
  echo "Creating config folder"
  mkdir $HOME/.config/phoenix/
fi

if [ ! -d $HOME/.config/hyperspace/ ]
then
  mkdir $HOME/.config/hyperspace/
fi

if [ ! -f $HOME/.config/hyperspace/configs.json ]
then
  echo "Create hyperspace config file"
  cp $ABSPATH/configs.json $HOME/.config/hyperspace/configs.json
fi

wait

echo "Setup phoenix lib"
osascript -e 'quit application "Phoenix"'
wait
if [ -f $HOME/.phoenix.js ]
then
  rm $HOME/.phoenix.js
fi
cp $ABSPATH/phoenix.js $HOME/.config/phoenix/phoenix.js

wait

echo "Open Phoenix.app"
open /Applications/Phoenix.app
sleep 1
wait
