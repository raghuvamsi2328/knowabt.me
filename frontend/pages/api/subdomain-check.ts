import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const name = typeof req.query.name === 'string' ? req.query.name : '';
  if (!name) {
    return res.status(400).json({ error: 'Missing name' });
  }

  const managerUrl = process.env.MANAGER_URL || 'http://knowabt-manager:3000';

  try {
    const backendRes = await fetch(`${managerUrl}/sites/check?name=${encodeURIComponent(name)}`);
    const payload = await backendRes.json().catch(() => ({ available: false }));
    return res.status(backendRes.ok ? 200 : backendRes.status).json(payload);
  } catch (err) {
    return res.status(500).json({ error: 'Internal error' });
  }
}
