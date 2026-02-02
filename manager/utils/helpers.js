// Normalize skills from comma-separated string to array
const normalizeSkills = (value) => {
    if (!value) return [];
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

// Normalize IP address (remove IPv6 prefix)
const normalizeIp = (value) => {
    if (!value) return '';
    return value.replace('::ffff:', '');
};

// Check if IP is private/local
const isPrivateIp = (ip) => {
    if (!ip) return false;
    if (ip === '127.0.0.1' || ip === '::1') return true;
    if (ip.startsWith('192.168.')) return true;
    if (ip.startsWith('10.')) return true;
    if (ip.startsWith('172.')) {
        const parts = ip.split('.');
        const second = Number(parts[1]);
        return second >= 16 && second <= 31;
    }
    return false;
};

module.exports = {
    normalizeSkills,
    normalizeIp,
    isPrivateIp
};
