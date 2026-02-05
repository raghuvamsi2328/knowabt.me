#!/bin/bash
set -e

export NODE_OPTIONS="${NODE_OPTIONS:---openssl-legacy-provider}"
export npm_config_cache="/tmp/.npm"
export HOME="/tmp"

REPO_URL=$1
OUTPUT_PATH=${2:-/output}

# Security: Validate repository URL
if [[ ! "$REPO_URL" =~ ^https://github\.com/ ]]; then
    echo "ERROR: Only GitHub repositories are allowed"
    exit 1
fi

echo "🔄 Cloning repository..."
# Clone into /tmp/repo to avoid permission issues with read-only /app
git clone --depth=1 "$REPO_URL" /tmp/repo
cd /tmp/repo

echo "📦 Repository cloned successfully"

# Security: Scan package.json for suspicious commands
if [ -f "package.json" ]; then
    # Check for dangerous patterns in scripts
    SUSPICIOUS_PATTERNS=(
        "curl.*sh"
        "wget.*sh"
        "eval"
        "rm -rf /"
        "chmod 777"
        "> /etc/"
        "nc -l"
        "bash -i"
        "/dev/tcp"
    )
    
    for pattern in "${SUSPICIOUS_PATTERNS[@]}"; do
        if grep -qE "$pattern" package.json; then
            echo "ERROR: Suspicious command detected in package.json: $pattern"
            exit 1
        fi
    done
fi

# Run build with timeout (10 minutes max)
timeout 600 npm install --production=false --ignore-scripts
timeout 600 npm run build

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
