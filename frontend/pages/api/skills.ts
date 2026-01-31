import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const managerUrl = process.env.MANAGER_URL || 'http://manager:3000';

  try {
    const backendRes = await fetch(`${managerUrl}/skills`);
    const payload = await backendRes.json().catch(() => ({ skills: [] }));
    return res.status(backendRes.ok ? 200 : backendRes.status).json(payload);
  } catch (err) {
    return res.status(500).json({ error: 'Internal error' });
  }
}
