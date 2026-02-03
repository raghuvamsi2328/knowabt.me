const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * Crawl a deployed portfolio site and extract metadata
 * @param {string} siteUrl - The URL of the portfolio site
 * @returns {Promise<Object>} Extracted metadata
 */
async function crawlPortfolio(siteUrl) {
    try {
        const html = await fetchHtml(siteUrl);
        const metadata = extractMetadata(html);
        return metadata;
    } catch (error) {
        console.error(`Failed to crawl ${siteUrl}:`, error.message);
        return null;
    }
}

/**
 * Fetch HTML content from a URL
 */
function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'User-Agent': 'KnowabtBot/1.0 (Portfolio Indexer)'
            },
            timeout: 10000 // 10 second timeout
        };

        const req = client.request(options, (res) => {
            let data = '';
            
            // Only accept HTML responses
            const contentType = res.headers['content-type'] || '';
            if (!contentType.includes('text/html')) {
                reject(new Error('Not an HTML page'));
                return;
            }

            res.on('data', (chunk) => {
                data += chunk;
                // Limit to first 500KB to avoid memory issues
                if (data.length > 500000) {
                    req.destroy();
                    reject(new Error('Response too large'));
                }
            });

            res.on('end', () => {
                resolve(data);
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

/**
 * Extract metadata from HTML content
 */
function extractMetadata(html) {
    const metadata = {
        title: extractTag(html, 'title') || extractMetaTag(html, 'og:title'),
        description: extractMetaTag(html, 'description') || extractMetaTag(html, 'og:description'),
        company: null,
        location: null,
        experience: null,
        education: null,
        bio: null,
        social_links: [],
        projects: []
    };

    // Extract company information
    const companyPatterns = [
        /(?:work(?:ed|ing)?\s+(?:at|for|with)\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
        /(?:company|employer):\s*([^<\n]+)/gi,
        /(?:currently\s+at|employed\s+at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
    ];
    const companies = extractPatterns(html, companyPatterns);
    metadata.company = companies.length > 0 ? companies.join(', ') : null;

    // Extract location
    const locationPatterns = [
        /(?:location|based\s+in|from):\s*([^<\n,]+(?:,\s*[^<\n,]+)?)/gi,
        /(?:lives?\s+in|located\s+in)\s+([A-Z][a-z]+(?:,?\s+[A-Z][a-z]+)*)/gi,
        /\b(Bangalore|Bengaluru|Mumbai|Delhi|Hyderabad|Chennai|Pune|Kolkata|San Francisco|New York|London|Singapore|Dubai|Sydney|Toronto|Berlin|Paris|Tokyo)\b/gi
    ];
    const locations = extractPatterns(html, locationPatterns);
    metadata.location = locations.length > 0 ? locations[0] : null;

    // Extract experience
    const experiencePatterns = [
        /(\d+)\+?\s*years?\s+(?:of\s+)?experience/gi,
        /experience:\s*([^<\n]+)/gi
    ];
    const experiences = extractPatterns(html, experiencePatterns);
    metadata.experience = experiences.length > 0 ? experiences.join(', ') : null;

    // Extract education
    const educationPatterns = [
        /(?:graduated\s+from|studied\s+at|degree\s+(?:in|from))\s+([^<\n]+)/gi,
        /(?:B\.?Tech|M\.?Tech|B\.?E|M\.?E|B\.?S|M\.?S|PhD|Bachelor|Master)(?:\s+(?:in|of))?\s+([^<\n]+)/gi,
        /education:\s*([^<\n]+)/gi
    ];
    const education = extractPatterns(html, educationPatterns);
    metadata.education = education.length > 0 ? education.join(', ') : null;

    // Extract bio/about
    const bioPatterns = [
        /<(?:p|div)[^>]*(?:class|id)=["'][^"']*(?:bio|about|intro|description)[^"']*["'][^>]*>([^<]+)/gi,
        /(?:about\s+me|bio|introduction):\s*([^<\n]{20,200})/gi
    ];
    const bios = extractPatterns(html, bioPatterns);
    metadata.bio = bios.length > 0 ? bios[0].substring(0, 500) : null;

    // Extract social links
    const socialPatterns = [
        /https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/gi,
        /https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi,
        /https?:\/\/(?:www\.)?twitter\.com\/[a-zA-Z0-9_]+/gi,
        /https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+/gi,
        /https?:\/\/(?:www\.)?dribbble\.com\/[a-zA-Z0-9_-]+/gi,
        /https?:\/\/(?:www\.)?behance\.net\/[a-zA-Z0-9_-]+/gi
    ];
    const socialLinks = new Set();
    socialPatterns.forEach(pattern => {
        const matches = html.match(pattern) || [];
        matches.forEach(link => socialLinks.add(link));
    });
    metadata.social_links = Array.from(socialLinks);

    // Extract project names/links
    const projectPatterns = [
        /<(?:h2|h3|div)[^>]*(?:class|id)=["'][^"']*project[^"']*["'][^>]*>([^<]{3,100})/gi,
        /(?:project|built|created):\s*([A-Z][a-zA-Z\s]{3,50})/gi
    ];
    const projects = extractPatterns(html, projectPatterns);
    metadata.projects = projects.slice(0, 10); // Limit to 10 projects

    return metadata;
}

/**
 * Extract content from HTML tag
 */
function extractTag(html, tagName) {
    const regex = new RegExp(`<${tagName}[^>]*>([^<]+)<\/${tagName}>`, 'i');
    const match = html.match(regex);
    return match ? cleanText(match[1]) : null;
}

/**
 * Extract content from meta tag
 */
function extractMetaTag(html, name) {
    const patterns = [
        new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta\\s+property=["']${name}["']\\s+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+name=["']${name}["']`, 'i')
    ];
    
    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return cleanText(match[1]);
    }
    return null;
}

/**
 * Extract matches from multiple patterns
 */
function extractPatterns(html, patterns) {
    const results = new Set();
    patterns.forEach(pattern => {
        let match;
        // Reset regex state
        pattern.lastIndex = 0;
        while ((match = pattern.exec(html)) !== null && results.size < 5) {
            const text = cleanText(match[1] || match[0]);
            if (text.length > 2 && text.length < 200) {
                results.add(text);
            }
        }
    });
    return Array.from(results);
}

/**
 * Clean and normalize text
 */
function cleanText(text) {
    return text
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/&[a-z]+;/gi, ' ') // Remove HTML entities
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
}

/**
 * Build search text from metadata for full-text search
 */
function buildSearchText(site) {
    const parts = [
        site.name,
        site.skills,
        site.metadata_title,
        site.metadata_description,
        site.metadata_company,
        site.metadata_location,
        site.metadata_experience,
        site.metadata_education,
        site.metadata_bio
    ].filter(Boolean);
    
    return parts.join(' ').toLowerCase();
}

module.exports = {
    crawlPortfolio,
    buildSearchText
};
