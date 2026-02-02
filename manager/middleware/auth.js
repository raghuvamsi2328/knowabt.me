const { normalizeIp, isPrivateIp } = require('../utils/helpers');

// Require authentication middleware
const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
};

// Require admin token middleware
const requireAdmin = (req, res, next) => {
    const adminToken = process.env.ADMIN_TOKEN;
    
    if (!adminToken) {
        return res.status(503).json({ error: 'Admin token not configured' });
    }
    
    const token = req.header('x-admin-token') || req.query.token;
    
    if (!token || token !== adminToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    return next();
};

// Require local IP middleware (for admin panel access)
const requireLocal = (req, res, next) => {
    const remote = normalizeIp(req.socket.remoteAddress);
    
    if (!isPrivateIp(remote)) {
        return res.status(403).send('Forbidden');
    }
    
    return next();
};

module.exports = {
    requireAuth,
    requireAdmin,
    requireLocal
};
