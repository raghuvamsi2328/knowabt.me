# knowabt.me Monorepo

This repository contains the full stack for knowabt.me:

- **manager/**: Node.js API (Express, SQLite, Docker integration)
- **builder/**: Docker build image and scripts
- **portfolios/**: Static output for Caddy

## Quick Start

1. Build all images and start services:
   ```sh
   docker-compose up --build -d
   ```
2. The manager API will be available at `http://your-server:3000`.
3. Caddy will serve all static sites from the `portfolios` directory.

## API Endpoints
- `POST /deploy` — Deploy a new site
- `GET /deployments` — List all deployments
- `GET /health` — Health check

## Environment
- See `manager/.env.example` for environment variables.

## Security
- Add HTTPS config to Caddy for production.
- Protect the manager API as needed for your use case.
