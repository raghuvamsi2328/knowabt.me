const express = require('express');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize SQLite Database
const db = new sqlite3.Database(path.join(__dirname, 'data', 'sites.db'));
db.run(`CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    url TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// List all deployments
app.get('/deployments', (req, res) => {
    db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Deploy endpoint
app.post('/deploy', (req, res) => {
    const { name, repoUrl } = req.body;
    if (!name || !repoUrl) {
        return res.status(400).send({ error: "Missing name or repoUrl" });
    }
    db.run("INSERT INTO sites (name, url, status) VALUES (?, ?, ?)", [name, repoUrl, 'building']);
    const outputVolume = `/var/www/portfolios/${name}`;
    const dockerCmd = `docker run --rm -v ${outputVolume}:/output portfolio-builder ${repoUrl}`;
    exec(dockerCmd, (error, stdout, stderr) => {
        const status = error ? 'failed' : 'success';
        db.run("UPDATE sites SET status = ? WHERE name = ?", [status, name]);
        if (error) {
            console.error(`Build Error: ${stderr}`);
            return;
        }
        console.log(`Build Success: ${stdout}`);
    });
    res.send({ message: "Build initiated", folder: name });
});

// Serve static portfolios (optional, for local dev)
app.use('/portfolios', express.static('/var/www/portfolios'));

app.listen(3000, () => console.log('Manager API running on port 3000'));
