const express = require('express');
const router = express.Router();
const passport = require('passport');

// GitHub OAuth login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get('/github/callback',
    passport.authenticate('github', { 
        failureRedirect: process.env.FRONTEND_URL || 'http://localhost:3001/login' 
    }),
    (req, res) => {
        // Successful authentication, redirect to frontend
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:3001');
    }
);

// Get current user
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ user: null });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
