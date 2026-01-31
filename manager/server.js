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
const requiredColumns = {
    contact: 'TEXT',
    skills: 'TEXT'
};

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS sites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        url TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.all('PRAGMA table_info(sites)', (err, columns) => {
        if (err) {
            console.error('Failed to read table schema', err);
            return;
        }
        const existing = new Set(columns.map((col) => col.name));
        Object.entries(requiredColumns).forEach(([column, type]) => {
            if (!existing.has(column)) {
                db.run(`ALTER TABLE sites ADD COLUMN ${column} ${type}`);
            }
        });
    });
});

const slugPattern = /^[a-z0-9-]+$/i;
const skillsCatalog = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Express',
    'Tailwind CSS',
    'HTML',
    'CSS',
    'JavaScript',
    'SQLite',
    'Docker',
    'Caddy',
    'Git',
    'Figma',
    'UI/UX',
    'SEO',
    'Analytics',
    'Markdown',
    'Open Source'
];

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

const queueBuild = ({ name, repoUrl, contact, skills }, res) => {
    if (!slugPattern.test(name)) {
        return res.status(400).json({ error: 'Invalid subdomain. Use letters, numbers, and hyphens only.' });
    }
    db.get('SELECT 1 FROM sites WHERE name = ? LIMIT 1', [name], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.status(409).json({ error: 'Subdomain is already taken.' });

        db.run(
            'INSERT INTO sites (name, url, status, contact, skills) VALUES (?, ?, ?, ?, ?)',
            [name, repoUrl, 'building', contact || null, skills || null]
        );

        const outputVolume = `/var/www/portfolios/${name}`;
        const dockerCmd = `docker run --rm -v ${outputVolume}:/output portfolio-builder ${repoUrl}`;
        exec(dockerCmd, (error, stdout, stderr) => {
            const status = error ? 'failed' : 'success';
            db.run('UPDATE sites SET status = ? WHERE name = ?', [status, name]);
            if (error) {
                console.error(`Build Error: ${stderr}`);
                return;
            }
            console.log(`Build Success: ${stdout}`);
        });

        return res.json({ message: 'Build initiated', folder: name });
    });
};

// Deploy endpoint (legacy)
app.post('/deploy', (req, res) => {
    const { name, repoUrl } = req.body;
    if (!name || !repoUrl) {
        return res.status(400).json({ error: 'Missing name or repoUrl' });
    }
    return queueBuild({ name, repoUrl }, res);
});

// Form submission endpoint
app.post('/sites', (req, res) => {
    const { subdomain, gitUrl, contact, skills } = req.body;
    if (!subdomain || !gitUrl || !contact || !skills) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    return queueBuild({ name: subdomain, repoUrl: gitUrl, contact, skills }, res);
});

// Check subdomain availability
app.get('/sites/check', (req, res) => {
    const name = (req.query.name || '').toString().trim();
    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!slugPattern.test(name)) {
        return res.status(400).json({ error: 'Invalid subdomain format' });
    }
    db.get('SELECT 1 FROM sites WHERE name = ? LIMIT 1', [name], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ available: !row });
    });
});

// Fetch skills catalog
app.get('/skills', (req, res) => {
    res.json({ skills: skillsCatalog });
});

// List all sites
app.get('/sites', (req, res) => {
    db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Serve static portfolios (optional, for local dev)
app.use('/portfolios', express.static('/var/www/portfolios'));

app.listen(3000, () => console.log('Manager API running on port 3000'));
