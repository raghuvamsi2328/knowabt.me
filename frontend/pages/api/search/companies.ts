import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const MANAGER_URL = process.env.MANAGER_URL || 'http://manager:3000';
  
  try {
    const response = await fetch(`${MANAGER_URL}/search/companies`);
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Companies API error:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
}
