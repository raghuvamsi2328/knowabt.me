FROM node:20-alpine
RUN apk add --no-cache git bash
WORKDIR /app
COPY build-script.sh /usr/local/bin/build-script.sh
RUN chmod +x /usr/local/bin/build-script.sh
ENTRYPOINT ["build-script.sh"]
