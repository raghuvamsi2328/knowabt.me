FROM node:20-slim
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y \
    docker.io \
    && rm -rf /var/lib/apt/lists/* \
    && docker --version
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
