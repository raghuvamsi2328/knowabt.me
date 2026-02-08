const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { requiredColumns } = require('./constants');

// Initialize SQLite Database
const db = new sqlite3.Database(path.join(__dirname, '..', 'data', 'sites.db'));

// Setup database tables and schema
db.serialize(() => {
    // Create sites table
    db.run(`CREATE TABLE IF NOT EXISTS sites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        url TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create users table for GitHub OAuth
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        github_id TEXT UNIQUE,
        username TEXT,
        email TEXT,
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create site_views table for unique view tracking
    db.run(`CREATE TABLE IF NOT EXISTS site_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        site_id INTEGER NOT NULL,
        viewer_hash TEXT NOT NULL,
        view_date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(site_id, viewer_hash, view_date)
    )`);

    // Add missing columns to sites table if needed
    db.all('PRAGMA table_info(sites)', (err, columns) => {
        if (err) {
            console.error('Failed to read table schema', err);
            return;
        }
        const existing = new Set(columns.map((col) => col.name));
        Object.entries(requiredColumns).forEach(([column, type]) => {
            if (!existing.has(column)) {
                db.run(`ALTER TABLE sites ADD COLUMN ${column} ${type}`, (err) => {
                    if (err) {
                        console.error(`Failed to add column ${column}:`, err);
                    } else {
                        console.log(`✅ Added column: ${column}`);
                    }
                });
            }
        });
    });

    console.log('✅ Database initialized');
});

module.exports = db;
