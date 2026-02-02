const cors = require('cors');

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
};

module.exports = cors(corsOptions);
