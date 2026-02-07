FROM node:20-alpine

# Install required packages
RUN apk add --no-cache git bash

# Create non-root user for build isolation
RUN addgroup -g 1001 builder && \
    adduser -D -u 1001 -G builder builder

# Setup directories with proper permissions
WORKDIR /app
RUN chown -R builder:builder /app

ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy and set permissions for build script
COPY build-script.sh /usr/local/bin/build-script.sh
RUN chmod +x /usr/local/bin/build-script.sh

# Run as root to allow writing to mounted /output
USER root

ENTRYPOINT ["build-script.sh"]
