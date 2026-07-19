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

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { id } = req.query;

    if (id) {
      // Fetch single blog post
      const blogRes = await query('SELECT * FROM blogs WHERE id = $1', [id]);
      if (blogRes.rows.length === 0) {
        return res.status(404).json({ error: 'Intel post not found in databases.' });
      }
      return res.status(200).json(blogRes.rows[0]);
    } else {
      // Fetch all blogs
      const blogsRes = await query('SELECT * FROM blogs ORDER BY created_at DESC');
      return res.status(200).json(blogsRes.rows);
    }
  } catch (err: any) {
    console.error('Blogs API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
