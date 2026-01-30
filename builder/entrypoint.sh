#!/bin/bash
REPO_URL=$1

git clone "$REPO_URL" .

if [ -f "./build.sh" ]; then
    chmod +x ./build.sh
    ./build.sh
else
    npm install && npm run build
    cp -r out/* /output/
fi
