/**
 * Security utilities for build process validation
 */

const SUSPICIOUS_PATTERNS = [
    /curl.*\|.*bash/gi,
    /wget.*\|.*sh/gi,
    /eval\s*\(/gi,
    /rm\s+-rf\s+\//gi,
    /chmod\s+777/gi,
    />\s*\/etc\//gi,
    /nc\s+-l/gi,
    /bash\s+-i/gi,
    /\/dev\/tcp/gi,
    /\.exec\(/gi,
    /child_process/gi,
    /require\(['"]child_process['"]\)/gi
];

const ALLOWED_REPO_DOMAINS = [
    'github.com',
    'gitlab.com'
];

/**
 * Validates if a repository URL is from an allowed domain
 * @param {string} repoUrl - Repository URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidRepoUrl(repoUrl) {
    try {
        const url = new URL(repoUrl);
        return ALLOWED_REPO_DOMAINS.some(domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
    } catch (error) {
        return false;
    }
}

/**
 * Scans text content for suspicious patterns
 * @param {string} content - Content to scan
 * @returns {Object} { safe: boolean, matches: string[] }
 */
function scanForSuspiciousContent(content) {
    const matches = [];
    
    for (const pattern of SUSPICIOUS_PATTERNS) {
        const match = content.match(pattern);
        if (match) {
            matches.push(match[0]);
        }
    }
    
    return {
        safe: matches.length === 0,
        matches
    };
}

/**
 * Validates deployment request
 * @param {Object} params - { name, repoUrl, contact, skills }
 * @returns {Object} { valid: boolean, error: string }
 */
function validateDeploymentRequest({ name, repoUrl, contact, skills }) {
    // Validate subdomain name
    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(name)) {
        return { valid: false, error: 'Invalid subdomain format' };
    }
    
    // Validate length
    if (name.length < 3 || name.length > 63) {
        return { valid: false, error: 'Subdomain must be between 3 and 63 characters' };
    }
    
    // Validate repository URL
    if (!isValidRepoUrl(repoUrl)) {
        return { valid: false, error: 'Only GitHub and GitLab repositories are allowed' };
    }
    
    // Validate contact email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (contact && !emailPattern.test(contact)) {
        return { valid: false, error: 'Invalid email format' };
    }
    
    return { valid: true };
}

/**
 * Rate limiting check (simple in-memory implementation)
 */
const deploymentAttempts = new Map();

function checkRateLimit(identifier, maxAttempts = 10, windowMs = 3600000) {
    const now = Date.now();
    const attempts = deploymentAttempts.get(identifier) || [];
    
    // Clean old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
        return {
            allowed: false,
            error: `Rate limit exceeded. Maximum ${maxAttempts} deployments per hour.`
        };
    }
    
    // Add current attempt
    recentAttempts.push(now);
    deploymentAttempts.set(identifier, recentAttempts);
    
    return { allowed: true };
}

module.exports = {
    isValidRepoUrl,
    scanForSuspiciousContent,
    validateDeploymentRequest,
    checkRateLimit,
    SUSPICIOUS_PATTERNS,
    ALLOWED_REPO_DOMAINS
};
