if [ -f "/Applications/Phoenix.app" ]
then
    open /Applications/Phoenix.app
else
    echo "start."
    #cd /Applications && curl -L 'https://github.com/kasper/phoenix/releases/download/2.3/phoenix-2.3.tar.gz' | tar -xz
    #wait
    #open /Applications/Phoenix.app
fi

