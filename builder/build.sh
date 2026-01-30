#!/bin/bash
set -e

echo "📦 Starting Build Process..."
npm install
npm run build
if [ -d "out" ]; then
    echo "✅ Build successful. Exporting to Caddy directory..."
    cp -r out/* /output/
else
    echo "❌ Error: 'out' directory not found. Check next.config.mjs for 'output: export'"
    exit 1
fi
echo "🚀 Deployment Complete!"
