const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const { exec } = require('child_process');
const { promisify } = require('util');
const db = require('../config/database');
const { requireAdmin, requireLocal } = require('../middleware/auth');

const execAsync = promisify(exec);

// Admin panel HTML page (local access only)
router.get('/', requireLocal, async (req, res) => {
    try {
        const adminPagePath = path.join(__dirname, '..', 'public', 'admin.html');
        const html = await fs.readFile(adminPagePath, 'utf8');
        res.type('html').send(html);
    } catch (error) {
        res.status(500).send('Admin panel not found');
    }
});

// Admin: list all sites
router.get('/sites', requireAdmin, (req, res) => {
    db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ sites: rows });
    });
});

// Admin: delete site record (and optionally files)
router.delete('/sites/:name', requireAdmin, (req, res) => {
    const name = req.params.name;
    const removeFiles = String(req.query.removeFiles || '').toLowerCase() === 'true';

    db.run('DELETE FROM sites WHERE name = ?', [name], async (err) => {
        if (err) return res.status(500).json({ error: err.message });

        if (removeFiles) {
            const sitePath = `/var/www/portfolios/${name}`;
            try {
                await fs.rm(sitePath, { recursive: true, force: true });
                console.log(`✅ Deleted portfolio files: ${name}`);
            } catch (error) {
                console.error('Failed to remove files', error);
            }
        }

        res.json({ success: true, message: `Deleted site: ${name}` });
    });
});

// Admin: Get build logs for a specific site
router.get('/sites/:name/logs', requireAdmin, (req, res) => {
    const name = req.params.name;
    const lines = parseInt(req.query.lines) || 100;
    
    // Get logs from database (build status and errors)
    db.get('SELECT * FROM sites WHERE name = ?', [name], (err, site) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!site) return res.status(404).json({ error: 'Site not found' });
        
        res.json({
            site: name,
            status: site.status,
            created_at: site.created_at,
            logs: `Build status: ${site.status}\nCreated: ${site.created_at}`
        });
    });
});

// Admin: Get container logs
router.get('/logs/:container', requireAdmin, async (req, res) => {
    const container = req.params.container;
    const lines = parseInt(req.query.lines) || 100;
    
    // Validate container name
    const validContainers = ['knowabt-manager', 'knowabt-frontend', 'knowabt-caddy', 'portfolio-builder'];
    if (!validContainers.includes(container)) {
        return res.status(400).json({ error: 'Invalid container name' });
    }
    
    try {
        const { stdout, stderr } = await execAsync(`docker logs --tail=${lines} ${container} 2>&1`);
        res.json({
            container,
            lines,
            logs: stdout || stderr
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch logs',
            message: error.message
        });
    }
});

// Admin: Get all container status
router.get('/containers', requireAdmin, async (req, res) => {
    try {
        const { stdout } = await execAsync('docker ps --format "{{.Names}}\t{{.Status}}\t{{.Image}}"');
        const containers = stdout.trim().split('\n').map(line => {
            const [name, status, image] = line.split('\t');
            return { name, status, image };
        });
        res.json({ containers });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch container status',
            message: error.message
        });
    }
});

module.exports = router;
