import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const MANAGER_URL = process.env.MANAGER_URL || 'http://manager:3000';
  
  try {
    // Forward query parameters
    const queryParams = new URLSearchParams(req.query as Record<string, string>);
    const url = `${MANAGER_URL}/search?${queryParams}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}
