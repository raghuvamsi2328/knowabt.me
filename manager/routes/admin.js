const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const db = require('../config/database');
const { requireAdmin, requireLocal } = require('../middleware/auth');

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

module.exports = router;
