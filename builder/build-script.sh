#!/bin/bash
set -e

export NODE_OPTIONS="${NODE_OPTIONS:---openssl-legacy-provider}"

REPO_URL=$1
OUTPUT_PATH=${2:-/output}

git clone "$REPO_URL" .
npm install
npm run build

# Find the index.html that is actually part of a build (dist/build/out/browser)
REAL_INDEX=$(find . \
    -path "*/dist/*/index.html" -o \
    -path "*/dist/index.html" -o \
    -path "*/build/index.html" -o \
    -path "*/out/index.html" -o \
    -path "*/browser/index.html" \
    | head -n 1)

if [ -n "$REAL_INDEX" ]; then
    BUILD_DIR=$(dirname "$REAL_INDEX")
    echo "Found real build at $BUILD_DIR. Copying..."
    cp -r "$BUILD_DIR"/. "$OUTPUT_PATH/"
else
    echo "Fallback: Copying common build folders"
    if [ -d "dist" ]; then
        cp -r dist/. "$OUTPUT_PATH/"
    elif [ -d "build" ]; then
        cp -r build/. "$OUTPUT_PATH/"
    elif [ -d "out" ]; then
        cp -r out/. "$OUTPUT_PATH/"
    else
        cp -r ./* "$OUTPUT_PATH/"
    fi
fi

chmod -R 755 "$OUTPUT_PATH"
