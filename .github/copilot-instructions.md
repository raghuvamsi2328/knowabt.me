# knowabt.me - Automated Portfolio Ecosystem

This project consists of a **Manager Service** (Node.js) that automates the deployment of **Static Portfolios** using Docker and Caddy.

## 🏗 System Architecture
- **Manager (Node.js/Express):** Orchestrates builds and tracks them in SQLite.
- **Builder (Docker):** A temporary container that clones, builds, and exports static files.
- **Caddy (Host):** Serves the exported static files from `/var/www/portfolios`.

## 📁 Project Structure
```text
.
├── manager/             # Node.js API Service
│   ├── server.js        # Main logic & Docker orchestration
│   ├── data/            # SQLite database storage
│   └── Dockerfile       # Container for the Manager
├── builder/             # Deployment Engine
│   ├── Dockerfile       # Generic Node build environment
│   └── entrypoint.sh    # Script to clone and run repo build.sh
└── portfolios/          # Root directory for static assets (Served by Caddy)


---

### 2. `INSTRUCTIONS.md` (The "Agent Prompt")
Copy and paste this entire block into your AI agent (like ChatGPT, Claude, or Cursor) to have it write the specific code you need.

```markdown
# Task: Build the knowabt.me Deployment Manager

I need a Node.js Express server that acts as a deployment manager. 

### Requirements:
1. **Express API:** - Endpoint: `POST /deploy`
   - Payload: `{ "name": "project-slug", "repoUrl": "https://github.com/user/repo" }`
2. **Database (SQLite):**
   - Use `sqlite3`.
   - Table `sites`: `id`, `name`, `url`, `status` (building/success/failed), `created_at`.
3. **Docker Integration:**
   - Use `child_process.exec` to run:
     `docker run --rm -v /var/www/portfolios/[name]:/output portfolio-builder [repoUrl]`
4. **Error Handling:**
   - If the docker command fails, update the DB status to 'failed'.
   - If successful, update to 'success'.

### File to Create:
Please provide the full code for `manager/server.js`.

---

# Task: Build the Generic Docker Builder

I need a Dockerfile and a bash entrypoint script for the "Builder".

### Requirements:
1. **Dockerfile:** - Based on `node:20-slim`.
   - Install `git` and `bash`.
   - Set `WORKDIR /app`.
2. **entrypoint.sh:**
   - Take `REPO_URL` as the first argument.
   - Clone the repo.
   - If `./build.sh` exists in the repo, run it.
   - If not, run `npm install && npm run build`.
   - Automatically find the `index.html` in the build output and copy all files in that directory to `/output`.