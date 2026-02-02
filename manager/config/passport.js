const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('./database');

// Configure GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        // Find or create user in database
        db.get('SELECT * FROM users WHERE github_id = ?', [profile.id], (err, user) => {
            if (err) return done(err);
            
            if (user) {
                // Update existing user
                db.run(
                    'UPDATE users SET username = ?, email = ?, avatar_url = ? WHERE github_id = ?',
                    [profile.username, profile.emails?.[0]?.value, profile.photos?.[0]?.value, profile.id],
                    (err) => {
                        if (err) return done(err);
                        return done(null, { ...user, username: profile.username });
                    }
                );
            } else {
                // Create new user
                db.run(
                    'INSERT INTO users (github_id, username, email, avatar_url) VALUES (?, ?, ?, ?)',
                    [profile.id, profile.username, profile.emails?.[0]?.value, profile.photos?.[0]?.value],
                    function(err) {
                        if (err) return done(err);
                        return done(null, {
                            id: this.lastID,
                            github_id: profile.id,
                            username: profile.username,
                            email: profile.emails?.[0]?.value,
                            avatar_url: profile.photos?.[0]?.value
                        });
                    }
                );
            }
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
            done(err, user);
        });
    });

    console.log('✅ GitHub OAuth configured');
} else {
    console.warn('⚠️  GitHub OAuth not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env');
}

module.exports = passport;
