#!/bin/bash
set -e

REPO_URL=$1
OUTPUT_PATH=${2:-/output}

git clone "$REPO_URL" .
npm install
npm run build

# Find the index.html that is actually part of a build (usually in a 'dist' or 'browser' folder)
REAL_INDEX=$(find . -path "*/dist/*/index.html" -o -path "*/browser/index.html" | head -n 1)

if [ -n "$REAL_INDEX" ]; then
    BUILD_DIR=$(dirname "$REAL_INDEX")
    echo "Found real build at $BUILD_DIR. Copying..."
    cp -r "$BUILD_DIR"/. "$OUTPUT_PATH/"
else
    echo "Fallback: Copying entire dist folder"
    cp -r dist/*/. "$OUTPUT_PATH/" 2>/dev/null || cp -r ./* "$OUTPUT_PATH/"
fi

chmod -R 755 "$OUTPUT_PATH"
