FROM node:20-slim
WORKDIR /app

# Install official Docker CLI
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-26.1.0.tgz \
    | tar -xz -C /usr/local/bin --strip-components=1 docker/docker \
    && docker --version

COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
