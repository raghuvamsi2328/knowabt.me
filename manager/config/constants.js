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
    skills: 'TEXT'
};

module.exports = {
    slugPattern,
    skillsCatalog,
    requiredColumns
};
