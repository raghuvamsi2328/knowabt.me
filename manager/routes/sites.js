const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const db = require('../config/database');
const { slugPattern, skillsCatalog } = require('../config/constants');
const { normalizeSkills } = require('../utils/helpers');
const { crawlPortfolio, buildSearchText } = require('../utils/crawler');
const { submitPortfolioToIndexNow } = require('../utils/indexnow');

// Queue build function
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
            console.log(`Build Success for ${name}`);
            db.run('UPDATE sites SET status = ? WHERE name = ?', ['success', name], async () => {
                // Crawl the deployed site to extract metadata
                setTimeout(async () => {
                    try {
                        const siteUrl = `https://${name}.knowabt.me`;
                        console.log(`🕷️  Crawling ${siteUrl} for metadata...`);
                        const metadata = await crawlPortfolio(siteUrl);
                        
                        if (metadata) {
                            const searchText = buildSearchText({
                                name,
                                skills,
                                ...metadata
                            });
                            
                            db.run(`
                                UPDATE sites SET 
                                    metadata_title = ?,
                                    metadata_description = ?,
                                    metadata_company = ?,
                                    metadata_location = ?,
                                    metadata_experience = ?,
                                    metadata_education = ?,
                                    metadata_bio = ?,
                                    metadata_social_links = ?,
                                    metadata_projects = ?,
                                    metadata_crawled_at = datetime('now'),
                                    search_text = ?
                                WHERE name = ?
                            `, [
                                metadata.title,
                                metadata.description,
                                metadata.company,
                                metadata.location,
                                metadata.experience,
                                metadata.education,
                                metadata.bio,
                                JSON.stringify(metadata.social_links),
                                JSON.stringify(metadata.projects),
                                searchText,
                                name
                            ], (err) => {
                                if (err) {
                                    console.error(`❌ Crawl save error for ${name}:`, err);
                                } else {
                                    console.log(`✅ Metadata saved for ${name}`);
                                    
                                    // Submit to IndexNow for instant indexing
                                    submitPortfolioToIndexNow(name).catch(err => {
                                        console.error(`IndexNow submission error: ${err.message}`);
                                    });
                                }
                            });
                        }
                    } catch (error) {
                        console.error(`❌ Crawl error for ${name}:`, error.message);
                    }
                }, 5000); // Wait 5 seconds for site to be fully available
            });
        });

        return res.json({ message: 'Build initiated', folder: name });
    });
};

// List all deployments
router.get('/deployments', (req, res) => {
    db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Deploy endpoint (legacy)
router.post('/deploy', (req, res) => {
    const { name, repoUrl } = req.body;
    if (!name || !repoUrl) {
        return res.status(400).json({ error: 'Missing name or repoUrl' });
    }
    return queueBuild({ name, repoUrl }, res);
});

// Form submission endpoint
router.post('/', (req, res) => {
    const { subdomain, gitUrl, contact, skills } = req.body;
    if (!subdomain || !gitUrl || !contact || !skills) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    return queueBuild({ name: subdomain, repoUrl: gitUrl, contact, skills }, res);
});

// Check subdomain availability
router.get('/check', (req, res) => {
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

// List all sites
router.get('/', (req, res) => {
    db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Fetch skills catalog
router.get('/skills', (req, res) => {
    res.json({ skills: skillsCatalog });
});

// Fetch top skills based on submissions
router.get('/skills/top', (req, res) => {
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
router.get('/top-repos', (req, res) => {
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

module.exports = router;
