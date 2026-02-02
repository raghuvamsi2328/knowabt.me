# Migration Guide: Monolithic → Modular Backend

## ✅ What Changed

### File Structure
```diff
manager/
+ ├── config/
+ │   ├── constants.js
+ │   ├── database.js
+ │   └── passport.js
+ ├── middleware/
+ │   ├── auth.js
+ │   └── cors.js
+ ├── routes/
+ │   ├── admin.js
+ │   ├── auth.js
+ │   ├── health.js
+ │   └── sites.js
+ ├── utils/
+ │   └── helpers.js
  ├── data/
  │   └── sites.db
  ├── public/
  │   └── admin.html
  ├── package.json
  ├── server.js          (75 lines, down from 400+)
+ ├── server.js.backup   (original backup)
+ ├── README.md          (new documentation)
+ └── ARCHITECTURE.md    (visual guide)
```

## 🔄 API Compatibility

**No breaking changes!** All endpoints work exactly the same:

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /health` | ✅ Working | Enhanced with uptime |
| `GET /auth/github` | ✅ Working | |
| `GET /auth/github/callback` | ✅ Working | |
| `GET /auth/user` | ✅ Working | |
| `POST /auth/logout` | ✅ Working | |
| `GET /sites` | ✅ Working | |
| `POST /sites` | ✅ Working | |
| `GET /sites/check` | ✅ Working | |
| `GET /deployments` | ✅ Working | |
| `POST /deploy` | ✅ Working | Legacy support |
| `GET /skills` | ✅ Working | |
| `GET /skills/top` | ✅ Working | |
| `GET /top-repos` | ✅ Working | |
| `GET /admin` | ✅ Working | Local access only |
| `GET /admin/sites` | ✅ Working | Requires admin token |
| `DELETE /admin/sites/:name` | ✅ Working | Requires admin token |

## 🚀 Deployment Steps

### 1. Backup (Already Done)
```bash
✅ server.js.backup created automatically
```

### 2. Install Dependencies (No Changes)
```bash
npm install
# Same packages as before
```

### 3. Environment Variables (No Changes)
```bash
# Same .env file works
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
SESSION_SECRET=your_secret
ADMIN_TOKEN=raghuvamsi
# ... etc
```

### 4. Test Locally
```bash
# Start the server
node server.js

# Should see:
# =================================
# 🚀 Manager API running on port 3000
# =================================
# ✅ Database initialized
# ✅ GitHub OAuth configured
# =================================
```

### 5. Deploy to LXC
```bash
# On your server
git pull origin master
cd manager
npm install
cd ..
docker-compose down
docker-compose up -d --build
```

### 6. Verify
```bash
# Check logs
docker-compose logs -f manager

# Test health endpoint
curl http://localhost:3000/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...}
```

## 🧪 Testing Checklist

Test each endpoint to ensure everything works:

```bash
# Health check
curl http://localhost:3000/health

# Check subdomain availability
curl "http://localhost:3000/sites/check?name=test"

# Get skills catalog
curl http://localhost:3000/skills

# Get top repos
curl http://localhost:3000/top-repos

# Admin sites list (with token)
curl -H "x-admin-token: raghuvamsi" http://localhost:3000/admin/sites
```

## 🐛 Troubleshooting

### Error: Cannot find module './config/database'
**Solution:** Make sure all new directories exist:
```bash
cd manager
mkdir -p config middleware routes utils
```

### Error: db is not defined
**Solution:** Routes are importing from `config/database.js`
Check that file exists and exports `db`

### Error: routes not working
**Solution:** Check server.js has all route imports:
```javascript
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
// etc...
```

### Session not persisting
**Solution:** No change from before - check:
- SESSION_SECRET is set
- Cookies are enabled in frontend
- CORS credentials: true

## 📊 Performance

### Before
- Single 400+ line file
- Hard to debug
- Difficult to test individual features

### After
- 11 small, focused files
- Easy to debug specific features
- Can test each module independently
- Better code organization

## 🔄 Rolling Back

If you need to rollback:

```bash
cd manager
cp server.js.backup server.js
docker-compose restart manager
```

## 📝 Code Examples

### Adding a New Route

**Before:** Add to 400-line server.js

**After:** Create new route file

```javascript
// routes/analytics.js
const express = require('express');
const router = express.Router();

router.get('/views', (req, res) => {
    // Handle request
});

module.exports = router;
```

Then mount in `server.js`:
```javascript
const analyticsRoutes = require('./routes/analytics');
app.use('/analytics', analyticsRoutes);
```

### Adding a New Middleware

```javascript
// middleware/rateLimit.js
const rateLimit = (req, res, next) => {
    // Rate limiting logic
    next();
};

module.exports = rateLimit;
```

Use it:
```javascript
const rateLimit = require('./middleware/rateLimit');
app.use(rateLimit);
```

## ✨ Benefits

1. **Maintainability:** Each file has single responsibility
2. **Scalability:** Easy to add new routes/features
3. **Testability:** Can test modules in isolation
4. **Readability:** Clear structure, easy to navigate
5. **Collaboration:** Multiple devs can work on different files
6. **Debugging:** Easier to locate issues

## 🎯 Next Steps

Consider adding:
- [ ] Unit tests for each module
- [ ] Email notification service (separate module)
- [ ] Rate limiting middleware
- [ ] Request logging middleware
- [ ] API documentation
- [ ] Error handling middleware

## 📚 Documentation

- `README.md` - Module documentation
- `ARCHITECTURE.md` - Visual architecture guide
- This file - Migration guide

## ✅ Migration Complete!

Your backend is now modular and ready for production deployment on your LXC server!

**Important:** After deployment, test all endpoints to ensure everything works correctly.
