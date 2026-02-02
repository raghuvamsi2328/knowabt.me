import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const managerUrl = process.env.MANAGER_URL || 'http://localhost:3000';

  try {
    const backendRes = await fetch(`${managerUrl}/top-repos`);
    
    if (!backendRes.ok) {
      return res.status(backendRes.status).json({ error: 'Failed to fetch from backend' });
    }

    const data = await backendRes.json();
    
    // Transform backend data to frontend portfolio format
    const portfolios = (data.repos || []).map((repo: any) => ({
      name: repo.name,
      tech: Array.isArray(repo.skills) ? repo.skills.join(', ') : (repo.skills || 'N/A'),
      subdomain: repo.name,
      repoUrl: repo.url,
      createdAt: repo.created_at,
    }));

    return res.status(200).json({ portfolios });
  } catch (err) {
    console.error('Error fetching top repos:', err);
    return res.status(500).json({ error: 'Internal error', portfolios: [] });
  }
}

