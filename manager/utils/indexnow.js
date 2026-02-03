const https = require('https');

/**
 * Submit URLs to IndexNow for instant indexing
 * @param {string[]} urls - Array of URLs to submit
 * @returns {Promise<boolean>} Success status
 */
async function submitToIndexNow(urls) {
    const indexNowKey = process.env.INDEXNOW_KEY;
    const indexNowEnabled = process.env.INDEXNOW_ENABLED !== 'false';
    
    if (!indexNowEnabled) {
        console.log('ℹ️  IndexNow is disabled');
        return false;
    }

    if (!indexNowKey) {
        console.warn('⚠️  INDEXNOW_KEY not set in .env');
        return false;
    }

    if (!urls || urls.length === 0) {
        console.warn('⚠️  No URLs to submit to IndexNow');
        return false;
    }

    try {
        const payload = JSON.stringify({
            host: 'knowabt.me',
            key: indexNowKey,
            keyLocation: `https://knowabt.me/${indexNowKey}.txt`,
            urlList: urls
        });

        const options = {
            hostname: 'api.indexnow.org',
            port: 443,
            path: '/indexnow',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200 || res.statusCode === 202) {
                        console.log(`✅ IndexNow: Submitted ${urls.length} URL(s)`);
                        urls.forEach(url => console.log(`   📤 ${url}`));
                        resolve(true);
                    } else {
                        console.error(`❌ IndexNow error: ${res.statusCode} - ${data}`);
                        resolve(false);
                    }
                });
            });

            req.on('error', (error) => {
                console.error('❌ IndexNow request failed:', error.message);
                resolve(false);
            });

            req.write(payload);
            req.end();
        });
    } catch (error) {
        console.error('❌ IndexNow submission error:', error.message);
        return false;
    }
}

/**
 * Submit a single portfolio URL to IndexNow
 * @param {string} subdomain - The portfolio subdomain
 */
async function submitPortfolioToIndexNow(subdomain) {
    const urls = [
        `https://${subdomain}.knowabt.me`,
        `https://${subdomain}.knowabt.me/` // Some crawlers prefer trailing slash
    ];
    
    return await submitToIndexNow(urls);
}

/**
 * Submit main site pages to IndexNow
 */
async function submitMainSiteToIndexNow() {
    const urls = [
        'https://knowabt.me',
        'https://knowabt.me/',
        'https://knowabt.me/search',
        'https://knowabt.me/form'
    ];
    
    return await submitToIndexNow(urls);
}

module.exports = {
    submitToIndexNow,
    submitPortfolioToIndexNow,
    submitMainSiteToIndexNow
};
