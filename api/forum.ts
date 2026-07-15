import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';

/**
 * Ensures a user row exists before inserting forum content.
 * Prevents FK constraint failures for mock/new users.
 */
async function ensureUserExists(uid: string, name: string): Promise<void> {
  try {
    // Use INSERT OR IGNORE for SQLite; PostgreSQL uses ON CONFLICT DO NOTHING
    await query(
      `INSERT INTO users (id, email, name, role)
       VALUES ($1, $2, $3, 'student')
       ON CONFLICT (id) DO NOTHING`,
      [uid, `${uid}@blackcypher.local`, name || 'Anonymous Operator']
    );
  } catch {
    // Ignore — user likely already exists or DB doesn't support syntax
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
    // 1. GET: Fetch community posts or single post with comments
    if (method === 'GET') {
      const { id, category } = req.query;

      if (id) {
        // Fetch specific post
        const postRes = await query(
          'SELECT * FROM forum_posts WHERE id = $1',
          [id]
        );

        if (postRes.rows.length === 0) {
          return res.status(404).json({ error: 'Post not found.' });
        }

        // Fetch comments for this post
        const commentsRes = await query(
          'SELECT * FROM forum_comments WHERE post_id = $1 ORDER BY created_at ASC',
          [id]
        );

        return res.status(200).json({
          post: postRes.rows[0],
          comments: commentsRes.rows
        });
      }

      // Fetch all posts, optionally filtered by category
      let postsQuery = `
        SELECT fp.*, COUNT(fc.id) as comment_count 
        FROM forum_posts fp 
        LEFT JOIN forum_comments fc ON fp.id = fc.post_id 
      `;
      const queryParams: any[] = [];

      if (category && category !== 'All') {
        postsQuery += ' WHERE fp.category = $1 ';
        queryParams.push(category);
      }

      postsQuery += ' GROUP BY fp.id ORDER BY fp.created_at DESC ';

      const postsRes = await query(postsQuery, queryParams);
      return res.status(200).json(postsRes.rows);
    }

    // 2. POST: Create posts, comments or like posts
    if (method === 'POST') {
      const { action } = req.body;

      if (action === 'create_post') {
        const { uid, title, content, category, author_name, author_avatar } = req.body;
        if (!uid || !title || !content) {
          return res.status(400).json({ error: 'Missing required parameters.' });
        }

        // Ensure user exists in DB before inserting (avoids FK constraint error)
        await ensureUserExists(uid, author_name || 'Anonymous Operator');

        const insertPost = await query(
          `INSERT INTO forum_posts (title, content, category, user_id, author_name, author_avatar) 
           VALUES ($1, $2, $3, $4, $5, $6) 
           RETURNING *`,
          [
            title,
            content,
            category || 'General',
            uid,
            author_name || 'Anonymous Operator',
            author_avatar || ''
          ]
        );

        return res.status(201).json({ success: true, post: insertPost.rows[0] });
      }

      if (action === 'create_comment') {
        const { uid, post_id, content, author_name, author_avatar } = req.body;
        if (!uid || !post_id || !content) {
          return res.status(400).json({ error: 'Missing comment parameters.' });
        }

        // Ensure user exists in DB before inserting (avoids FK constraint error)
        await ensureUserExists(uid, author_name || 'Anonymous Operator');

        const insertComment = await query(
          `INSERT INTO forum_comments (post_id, content, user_id, author_name, author_avatar) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING *`,
          [
            post_id,
            content,
            uid,
            author_name || 'Anonymous Operator',
            author_avatar || ''
          ]
        );

        return res.status(201).json({ success: true, comment: insertComment.rows[0] });
      }

      if (action === 'like_post') {
        const { post_id } = req.body;
        if (!post_id) {
          return res.status(400).json({ error: 'Missing post ID.' });
        }

        const updateLike = await query(
          'UPDATE forum_posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
          [post_id]
        );

        if (updateLike.rows.length === 0) {
          return res.status(404).json({ error: 'Post not found.' });
        }

        return res.status(200).json({ success: true, post: updateLike.rows[0] });
      }

      return res.status(400).json({ error: 'Invalid action.' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err: any) {
    console.error('Forum API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
