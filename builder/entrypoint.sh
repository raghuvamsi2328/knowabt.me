#!/bin/bash
set -e

REPO_URL=$1

echo "🔄 Cloning repository..."
# Clone into a subdirectory to avoid permission issues
git clone "$REPO_URL" /tmp/repo
cd /tmp/repo

echo "📦 Repository cloned successfully"

if [ -f "./build.sh" ]; then
    echo "🔨 Running custom build.sh..."
    chmod +x ./build.sh
    ./build.sh
else
    echo "📦 Running npm install..."
    npm install
    
    echo "🏗️  Building project..."
    npm run build
fi

echo "📂 Finding build output..."
# Find the directory containing index.html
BUILD_DIR=$(find . -name "index.html" -type f | head -1 | xargs dirname)

if [ -z "$BUILD_DIR" ]; then
    echo "❌ Error: No index.html found in build output"
    exit 1
fi

echo "📤 Copying files from $BUILD_DIR to /output..."
cp -r "$BUILD_DIR"/* /output/

echo "✅ Build complete!"
