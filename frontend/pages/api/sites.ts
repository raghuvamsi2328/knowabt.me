import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { subdomain, gitUrl, contact, skills } = req.body;
  if (!subdomain || !gitUrl || !contact || !skills) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Forward to backend manager API (update URL as needed)
  try {
    const backendRes = await fetch('http://manager:3000/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: subdomain, repoUrl: gitUrl }),
    });
    if (!backendRes.ok) {
      return res.status(500).json({ error: 'Failed to deploy site' });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error' });
  }
}
