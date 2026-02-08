// Configuration constants
const slugPattern = /^[a-z0-9-]+$/i;

const skillsCatalog = [
    'React',
    'React Native',
    'Next.js',
    'Svelte',
    'SolidJS',
    'Vue',
    'Angular',
    'TypeScript',
    'Node.js',
    'Express',
    'NestJS',
    'Fastify',
    'GraphQL',
    'REST API',
    'Prisma',
    'Mongoose',
    'Tailwind CSS',
    'Bootstrap',
    'Material UI',
    'HTML',
    'CSS',
    'JavaScript',
    'Python',
    'Django',
    'Flask',
    'Go',
    'Rust',
    'Java',
    'Spring',
    'Kotlin',
    'Swift',
    'Flutter',
    'SQLite',
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'GitHub Actions',
    'Vercel',
    'Netlify',
    'Caddy',
    'Git',
    'Linux',
    'Bash',
    'Jest',
    'Cypress',
    'Playwright',
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
    views_count: 'INTEGER DEFAULT 0',
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
