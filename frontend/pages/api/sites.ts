import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { subdomain, gitUrl, contact, skills } = req.body;
  if (!subdomain || !gitUrl || !contact || !skills) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const managerUrl = process.env.MANAGER_URL || 'http://manager:3000';
  try {
    const backendRes = await fetch(`${managerUrl}/sites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subdomain, gitUrl, contact, skills }),
    });
    if (!backendRes.ok) {
      const payload = await backendRes.json().catch(() => ({ error: 'Failed to deploy site' }));
      return res.status(backendRes.status).json(payload);
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error' });
  }
}
