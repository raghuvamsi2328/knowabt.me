// Configuration constants
const slugPattern = /^[a-z0-9-]+$/i;

const skillsCatalog = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Express',
    'Tailwind CSS',
    'HTML',
    'CSS',
    'JavaScript',
    'SQLite',
    'Docker',
    'Caddy',
    'Git',
    'Figma',
    'UI/UX',
    'SEO',
    'Analytics',
    'Markdown',
    'Open Source'
];

const requiredColumns = {
    contact: 'TEXT',
    skills: 'TEXT',
    user_id: 'INTEGER',
    // Metadata fields from crawled portfolio
    metadata_title: 'TEXT',
    metadata_description: 'TEXT',
    metadata_company: 'TEXT',
    metadata_location: 'TEXT',
    metadata_experience: 'TEXT',
    metadata_education: 'TEXT',
    metadata_bio: 'TEXT',
    metadata_social_links: 'TEXT', // JSON string
    metadata_projects: 'TEXT', // JSON string
    metadata_crawled_at: 'DATETIME',
    // Search optimization
    search_text: 'TEXT' // Combined searchable text
};

module.exports = {
    slugPattern,
    skillsCatalog,
    requiredColumns
};
