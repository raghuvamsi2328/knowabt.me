const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { skillsCatalog } = require('../config/constants');
const { normalizeSkills } = require('../utils/helpers');

// Fetch skills catalog
router.get('/', (req, res) => {
    console.log('[Manager] /skills endpoint hit');
    res.json({ skills: skillsCatalog });
});

// Fetch top skills based on submissions
router.get('/top', (req, res) => {
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

module.exports = router;
