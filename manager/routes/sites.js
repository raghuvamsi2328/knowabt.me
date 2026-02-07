const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const db = require('../config/database');
const { slugPattern, skillsCatalog } = require('../config/constants');
const { normalizeSkills } = require('../utils/helpers');
const { crawlPortfolio, buildSearchText } = require('../utils/crawler');
const { submitPortfolioToIndexNow } = require('../utils/indexnow');
const { sendDeploymentSuccessEmail, sendDeleteRequestEmail } = require('../utils/mailer');
const { validateDeploymentRequest, checkRateLimit } = require('../utils/security');

// Queue build function
const queueBuild = ({ name, repoUrl, contact, skills, userId }, res) => {
    // Security validation
    const validation = validateDeploymentRequest({ name, repoUrl, contact, skills });
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }
    
    // Rate limiting (by subdomain name as identifier)
    const rateLimitCheck = checkRateLimit(name);
    if (!rateLimitCheck.allowed) {
        return res.status(429).json({ error: rateLimitCheck.error });
    }
    
    const proceed = () => {
        if (!slugPattern.test(name)) {
            return res.status(400).json({ error: 'Invalid subdomain. Use letters, numbers, and hyphens only.' });
        }
        
        db.get('SELECT 1 FROM sites WHERE name = ? AND status = ? LIMIT 1', [name, 'success'], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) return res.status(409).json({ error: 'Subdomain is already taken.' });

            db.run(
                'INSERT INTO sites (name, url, status, contact, skills, user_id) VALUES (?, ?, ?, ?, ?, ?)',
                [name, repoUrl, 'building', contact || null, skills || null, userId || null]
            );

            const outputVolume = `/var/www/portfolios/${name}`;
            const builderImage = process.env.BUILDER_IMAGE || 'portfolio-builder';
            
            // Security-hardened Docker command
            // Note: Network access is required to clone from GitHub, but we limit it with firewall rules
                const dockerCmd = `docker run --rm \
                    --user 0:0 \
                --read-only \
                --tmpfs /tmp:rw,exec,nosuid,size=1g \
                --tmpfs /app:rw,exec,nosuid \
                --tmpfs /home/builder:rw,exec,nosuid,size=512m \
                --network bridge \
                --memory="1g" \
                --cpus="1.0" \
                --security-opt=no-new-privileges \
                --cap-drop=ALL \
                -v ${outputVolume}:/output:rw \
                ${builderImage} ${repoUrl}`;
            
            console.log(`🔨 Starting secure build for ${name}...`);
            
            exec(dockerCmd, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Build Error for ${name}: ${stderr}`);
                    db.run('UPDATE sites SET status = ? WHERE name = ?', ['failed', name]);
                    return;
                }
                console.log(`Build Success for ${name}`);
                db.run('UPDATE sites SET status = ? WHERE name = ?', ['success', name], async () => {
                    if (contact) {
                        const siteUrl = `https://${name}.knowabt.me`;
                        sendDeploymentSuccessEmail({
                            to: contact,
                            subdomain: name,
                            siteUrl
                        }).then((result) => {
                            if (!result.ok) {
                                console.error(`Email send error for ${name}: ${result.error}`);
                            }
                        });
                    }

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

    if (userId) {
        db.get('SELECT 1 FROM sites WHERE user_id = ? LIMIT 1', [userId], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) {
                return res.status(409).json({ error: 'Only one portfolio is allowed per account.' });
            }
            return proceed();
        });
    } else {
        return proceed();
    }
};

// List all deployments (filtered by user if authenticated)
router.get('/deployments', (req, res) => {
    // If user is authenticated, return only their sites
    if (req.isAuthenticated() && req.user) {
        db.all('SELECT * FROM sites WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ sites: rows, user: req.user });
        });
    } else {
        // For non-authenticated users, return all sites
        db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
});

// Deploy endpoint (legacy)
router.post('/deploy', (req, res) => {
    const { name, repoUrl } = req.body;
    if (!name || !repoUrl) {
        return res.status(400).json({ error: 'Missing name or repoUrl' });
    }
    
    // Require authentication
    if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: 'Authentication required. Please log in to deploy.' });
    }
    
    const userId = req.user.id;
    return queueBuild({ name, repoUrl, userId }, res);
});

// Rebuild portfolio (pull latest and rebuild)
router.post('/:name/rebuild', (req, res) => {
    const name = (req.params.name || '').toString().trim();
    if (!name) return res.status(400).json({ error: 'Missing name' });

    if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: 'Authentication required. Please log in to rebuild.' });
    }

    const userId = req.user.id;
    db.get('SELECT * FROM sites WHERE name = ? AND user_id = ? LIMIT 1', [name, userId], (err, site) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!site) return res.status(404).json({ error: 'Site not found.' });

        db.run('UPDATE sites SET status = ? WHERE name = ?', ['building', name]);
        const outputVolume = `/var/www/portfolios/${name}`;
        const builderImage = process.env.BUILDER_IMAGE || 'portfolio-builder';
        const repoUrl = site.url;
        const skills = site.skills;
        const contact = site.contact;

            const dockerCmd = `docker run --rm \
                --user 0:0 \
            --read-only \
            --tmpfs /tmp:rw,exec,nosuid,size=1g \
            --tmpfs /app:rw,exec,nosuid \
            --tmpfs /home/builder:rw,exec,nosuid,size=512m \
            --network bridge \
            --memory="1g" \
            --cpus="1.0" \
            --security-opt=no-new-privileges \
            --cap-drop=ALL \
            -v ${outputVolume}:/output:rw \
            ${builderImage} ${repoUrl}`;

        exec(dockerCmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Build Error for ${name}: ${stderr}`);
                db.run('UPDATE sites SET status = ? WHERE name = ?', ['failed', name]);
                return;
            }
            console.log(`Rebuild Success for ${name}`);
            db.run('UPDATE sites SET status = ? WHERE name = ?', ['success', name], async () => {
                if (contact) {
                    const siteUrl = `https://${name}.knowabt.me`;
                    sendDeploymentSuccessEmail({
                        to: contact,
                        subdomain: name,
                        siteUrl
                    }).then((result) => {
                        if (!result.ok) {
                            console.error(`Email send error for ${name}: ${result.error}`);
                        }
                    });
                }

                setTimeout(async () => {
                    try {
                        const siteUrl = `https://${name}.knowabt.me`;
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
                            ]);
                        }
                    } catch (error) {
                        console.error(`❌ Crawl error for ${name}:`, error.message);
                    }
                }, 5000);
            });
        });

        return res.json({ message: 'Rebuild initiated' });
    });
});

// Request delete of portfolio and data
router.post('/:name/request-delete', (req, res) => {
    const name = (req.params.name || '').toString().trim();
    if (!name) return res.status(400).json({ error: 'Missing name' });

    if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: 'Authentication required. Please log in to request deletion.' });
    }

    const userId = req.user.id;
    db.get('SELECT * FROM sites WHERE name = ? AND user_id = ? LIMIT 1', [name, userId], (err, site) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!site) return res.status(404).json({ error: 'Site not found.' });

        db.run('UPDATE sites SET status = ? WHERE name = ?', ['delete_requested', name]);
        const siteUrl = `https://${name}.knowabt.me`;
        const requesterEmail = req.user.email || site.contact || null;
        sendDeleteRequestEmail({ requesterEmail, subdomain: name, siteUrl }).then((result) => {
            if (!result.ok) {
                console.error(`Delete request email error for ${name}: ${result.error}`);
            }
        });

        return res.json({ message: 'Delete request submitted' });
    });
});

// Form submission endpoint
router.post('/', (req, res) => {
    const { subdomain, gitUrl, contact, skills } = req.body;
    if (!subdomain || !gitUrl || !contact || !skills) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Require authentication for new submissions
    if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: 'Authentication required. Please log in to create a portfolio.' });
    }
    
    const userId = req.user.id;
    return queueBuild({ name: subdomain, repoUrl: gitUrl, contact, skills, userId }, res);
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

// List all sites (filtered by user if authenticated)
router.get('/', (req, res) => {
    // If user is authenticated, return only their sites
    if (req.isAuthenticated() && req.user) {
        db.all('SELECT * FROM sites WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ sites: rows, user: req.user });
        });
    } else {
        // For non-authenticated users, return all sites (for public listing/search)
        db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
});

// List all sites (filtered by user if authenticated)
router.get('/', (req, res) => {
    // If user is authenticated, return only their sites
    if (req.isAuthenticated() && req.user) {
        db.all('SELECT * FROM sites WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ sites: rows, user: req.user });
        });
    } else {
        // For non-authenticated users, return all sites (for public listing/search)
        db.all('SELECT * FROM sites ORDER BY created_at DESC', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
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
