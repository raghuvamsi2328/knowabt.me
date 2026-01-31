const express = require('express');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs/promises');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const adminToken = process.env.ADMIN_TOKEN;
const adminPagePath = path.join(__dirname, 'public', 'admin.html');

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

const normalizeSkills = (value) => {
    if (!value) return [];
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

const requireAdmin = (req, res, next) => {
    if (!adminToken) {
        return res.status(503).json({ error: 'Admin token not configured' });
    }
    const token = req.header('x-admin-token') || req.query.token;
    if (!token || token !== adminToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    return next();
};

const normalizeIp = (value) => {
    if (!value) return '';
    return value.replace('::ffff:', '');
};

const isPrivateIp = (ip) => {
    if (!ip) return false;
    if (ip === '127.0.0.1' || ip === '::1') return true;
    if (ip.startsWith('192.168.')) return true;
    if (ip.startsWith('10.')) return true;
    if (ip.startsWith('172.')) {
        const parts = ip.split('.');
        const second = Number(parts[1]);
        return second >= 16 && second <= 31;
    }
    return false;
};

const requireLocal = (req, res, next) => {
    const remote = normalizeIp(req.socket.remoteAddress);
    if (!isPrivateIp(remote)) {
        return res.status(403).send('Forbidden');
    }
    return next();
};

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
    db.get('SELECT 1 FROM sites WHERE name = ? AND status = ? LIMIT 1', [name, 'success'], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.status(409).json({ error: 'Subdomain is already taken.' });

        db.run(
            'INSERT INTO sites (name, url, status, contact, skills) VALUES (?, ?, ?, ?, ?)',
            [name, repoUrl, 'building', contact || null, skills || null]
        );

        const outputVolume = `/var/www/portfolios/${name}`;
        const builderImage = process.env.BUILDER_IMAGE || 'portfolio-builder';
        const dockerCmd = `docker run --rm -v ${outputVolume}:/output ${builderImage} ${repoUrl}`;
        exec(dockerCmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Build Error for ${name}: ${stderr}`);
                db.run('UPDATE sites SET status = ? WHERE name = ?', ['failed', name]);
                return;
            }
            db.run('UPDATE sites SET status = ? WHERE name = ?', ['success', name]);
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
    db.get('SELECT 1 FROM sites WHERE name = ? AND status = ? LIMIT 1', [name, 'success'], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ available: !row });
    });
});

// Fetch skills catalog
app.get('/skills', (req, res) => {
    res.json({ skills: skillsCatalog });
});

// Fetch top skills based on submissions
app.get('/skills/top', (req, res) => {
    db.all('SELECT skills FROM sites WHERE skills IS NOT NULL AND skills != ""', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const counts = new Map();
        rows.forEach((row) => {
            normalizeSkills(row.skills).forEach((skill) => {
                const key = skill.toLowerCase();
                counts.set(key, (counts.get(key) || 0) + 1);
            });
        });
        const topSkills = [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([skill]) => skill);
        res.json({ skills: topSkills });
    });
});

// Fetch top repos from database
app.get('/top-repos', (req, res) => {
    db.all(
        'SELECT name, url, skills, created_at, status FROM sites WHERE status = ? ORDER BY created_at DESC LIMIT 10',
        ['success'],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            const repos = rows.map((row) => ({
                name: row.name,
                url: row.url,
                skills: normalizeSkills(row.skills),
                created_at: row.created_at,
                status: row.status
            }));
            res.json({ repos });
        }
    );
});

// List all sites
app.get('/sites', (req, res) => {
    db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Admin: list sites
app.get('/admin/sites', requireAdmin, (req, res) => {
    db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ sites: rows });
    });
});

// Admin: delete site record (and optionally files)
app.delete('/admin/sites/:name', requireAdmin, (req, res) => {
    const name = req.params.name;
    const removeFiles = String(req.query.removeFiles || '').toLowerCase() === 'true';

    db.run('DELETE FROM sites WHERE name = ?', [name], async (err) => {
        if (err) return res.status(500).json({ error: err.message });

        if (removeFiles) {
            const sitePath = `/var/www/portfolios/${name}`;
            try {
                await fs.rm(sitePath, { recursive: true, force: true });
            } catch (error) {
                console.error('Failed to remove files', error);
            }
        }

        res.json({ success: true });
    });
});

// Admin panel (local only)
app.get('/admin', requireLocal, async (req, res) => {
    try {
        const html = await fs.readFile(adminPagePath, 'utf8');
        res.type('html').send(html);
    } catch (error) {
        res.status(500).send('Admin panel not found');
    }
});

// Serve static portfolios (optional, for local dev)
app.use('/portfolios', express.static('/var/www/portfolios'));

app.listen(3000, () => console.log('Manager API running on port 3000'));
