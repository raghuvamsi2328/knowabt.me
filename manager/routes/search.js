const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * Search portfolios with filters
 * GET /search?q=query&skills=React,Node&location=bangalore&company=google&page=1&limit=20
 */
router.get('/', (req, res) => {
    const {
        q = '',           // General search query
        skills = '',      // Comma-separated skills
        location = '',    // Location filter
        company = '',     // Company filter
        page = 1,         // Pagination
        limit = 20
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const conditions = [];
    const params = [];

    // Only show successfully deployed sites
    conditions.push('status = ?');
    params.push('success');

    // General text search across all metadata
    if (q && q.trim()) {
        conditions.push(`(
            search_text LIKE ? OR
            name LIKE ? OR
            skills LIKE ? OR
            metadata_title LIKE ? OR
            metadata_description LIKE ? OR
            metadata_company LIKE ? OR
            metadata_location LIKE ?
        )`);
        const searchTerm = `%${q.toLowerCase()}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Skills filter - match any of the provided skills
    if (skills && skills.trim()) {
        const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
        if (skillList.length > 0) {
            const skillConditions = skillList.map(() => 'skills LIKE ?').join(' OR ');
            conditions.push(`(${skillConditions})`);
            skillList.forEach(skill => params.push(`%${skill}%`));
        }
    }

    // Location filter
    if (location && location.trim()) {
        conditions.push('metadata_location LIKE ?');
        params.push(`%${location}%`);
    }

    // Company filter
    if (company && company.trim()) {
        conditions.push('metadata_company LIKE ?');
        params.push(`%${company}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM sites ${whereClause}`;
    
    db.get(countQuery, params, (err, countResult) => {
        if (err) {
            console.error('Search count error:', err);
            return res.status(500).json({ error: 'Search failed' });
        }

        const total = countResult.total;

        // Get paginated results
        const dataQuery = `
            SELECT 
                id,
                name,
                url,
                skills,
                metadata_title,
                metadata_description,
                metadata_company,
                metadata_location,
                metadata_experience,
                metadata_bio,
                metadata_social_links,
                created_at
            FROM sites 
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;

        db.all(dataQuery, [...params, parseInt(limit), offset], (err, sites) => {
            if (err) {
                console.error('Search query error:', err);
                return res.status(500).json({ error: 'Search failed' });
            }

            // Parse JSON fields
            const results = sites.map(site => ({
                ...site,
                social_links: site.metadata_social_links ? 
                    JSON.parse(site.metadata_social_links) : [],
                portfolio_url: `https://${site.name}.knowabt.me`
            }));

            res.json({
                results,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            });
        });
    });
});

/**
 * Get unique locations for filter dropdown
 * GET /search/locations
 */
router.get('/locations', (req, res) => {
    const query = `
        SELECT DISTINCT metadata_location as location
        FROM sites
        WHERE metadata_location IS NOT NULL 
        AND metadata_location != ''
        AND status = 'success'
        ORDER BY metadata_location
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Locations query error:', err);
            return res.status(500).json({ error: 'Failed to fetch locations' });
        }
        res.json({ locations: rows.map(r => r.location) });
    });
});

/**
 * Get unique companies for filter dropdown
 * GET /search/companies
 */
router.get('/companies', (req, res) => {
    const query = `
        SELECT DISTINCT metadata_company as company
        FROM sites
        WHERE metadata_company IS NOT NULL 
        AND metadata_company != ''
        AND status = 'success'
        ORDER BY metadata_company
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Companies query error:', err);
            return res.status(500).json({ error: 'Failed to fetch companies' });
        }
        res.json({ companies: rows.map(r => r.company) });
    });
});

module.exports = router;
