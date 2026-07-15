import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;

  try {
    if (method === 'GET') {
      // Fetch active Google Meet sessions
      const meetingsRes = await query(
        'SELECT * FROM meetings WHERE active = true ORDER BY date_time ASC'
      );
      return res.status(200).json(meetingsRes.rows);
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err: any) {
    console.error('Meetings API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
