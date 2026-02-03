import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const MANAGER_URL = process.env.MANAGER_URL || 'http://manager:3000';
  
  try {
    const response = await fetch(`${MANAGER_URL}/search/locations`);
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Locations API error:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
}
