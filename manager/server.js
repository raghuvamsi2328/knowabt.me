const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const corsMiddleware = require('./middleware/cors');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(corsMiddleware);

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static portfolios (optional, for local dev)
app.use('/portfolios', express.static('/var/www/portfolios'));

// Routes
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const sitesRoutes = require('./routes/sites');
const adminRoutes = require('./routes/admin');

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Sites routes (multiple paths for compatibility)
app.use('/sites', sitesRoutes);
app.use('/deployments', (req, res, next) => {
    req.url = '/';
    sitesRoutes(req, res, next);
});
app.use('/deploy', (req, res, next) => {
    req.url = '/deploy';
    sitesRoutes(req, res, next);
});
app.use('/skills', (req, res, next) => {
    req.url = req.url.replace('/skills', '/skills');
    sitesRoutes(req, res, next);
});
app.use('/top-repos', (req, res, next) => {
    req.url = '/top-repos';
    sitesRoutes(req, res, next);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('=================================');
    console.log('🚀 Manager API running on port', PORT);
    console.log('=================================');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:3001');
    console.log('=================================');
});
