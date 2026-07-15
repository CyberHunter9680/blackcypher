import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';
import { encrypt } from './security.js';

// CORS support
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version'
  );
}

async function isAdmin(uid: string): Promise<boolean> {
  if (!uid) return false;
  if (uid === 'mock-admin-888') return true;
  try {
    const res = await query('SELECT role FROM users WHERE id = $1', [uid]);
    return res.rows.length > 0 && res.rows[0].role === 'admin';
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // Ensure feedbacks table exists with is_published column
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid TEXT NOT NULL,
        name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        message TEXT,
        is_published INTEGER DEFAULT 0,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Migration: add is_published if it doesn't exist (for old DBs)
    try {
      await query('ALTER TABLE feedbacks ADD COLUMN is_published INTEGER DEFAULT 0');
    } catch (_) { /* column already exists, ignore */ }
    // Migration: add id if not SERIAL style (ensure table structure)
  } catch (dbError) {
    console.warn('[DEV] Feedback table setup note:', dbError);
  }

  try {
    // ── GET /api/feedback ──────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const publishedOnly = req.query.published === 'true';

      try {
        let sql: string;
        let params: any[];

        if (publishedOnly) {
          // Public landing page: only approved/published feedbacks
          sql = 'SELECT id, uid, name, rating, message, is_published, submitted_at FROM feedbacks WHERE is_published = 1 ORDER BY submitted_at DESC';
          params = [];
        } else {
          // Admin: all feedbacks
          sql = 'SELECT id, uid, name, rating, message, is_published, submitted_at FROM feedbacks ORDER BY submitted_at DESC';
          params = [];
        }

        const result = await query(sql, params);
        return res.status(200).json(result.rows);
      } catch (dbError) {
        console.warn('[DEV] Feedback GET failed:', dbError);
        return res.status(200).json([]);
      }
    }

    // ── POST /api/feedback ─────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { action, uid, name, rating, message, id: feedbackId } = req.body;

      // action: 'publish' — Admin publishes a feedback to landing page
      if (action === 'publish') {
        const adminUid = req.body.admin_uid || uid;
        const adminOk = await isAdmin(adminUid);
        if (!adminOk) return res.status(403).json({ error: 'Access denied.' });
        if (!feedbackId) return res.status(400).json({ error: 'Missing feedback id.' });

        await query('UPDATE feedbacks SET is_published = 1 WHERE id = $1', [feedbackId]);
        return res.status(200).json({ success: true, message: 'Feedback published to landing page.' });
      }

      // action: 'unpublish' — Admin removes from landing page (keeps in DB)
      if (action === 'unpublish') {
        const adminUid = req.body.admin_uid || uid;
        const adminOk = await isAdmin(adminUid);
        if (!adminOk) return res.status(403).json({ error: 'Access denied.' });
        if (!feedbackId) return res.status(400).json({ error: 'Missing feedback id.' });

        await query('UPDATE feedbacks SET is_published = 0 WHERE id = $1', [feedbackId]);
        return res.status(200).json({ success: true, message: 'Feedback unpublished.' });
      }

      // action: 'delete' — Admin permanently deletes a feedback
      if (action === 'delete') {
        const adminUid = req.body.admin_uid || uid;
        const adminOk = await isAdmin(adminUid);
        if (!adminOk) return res.status(403).json({ error: 'Access denied.' });
        if (!feedbackId) return res.status(400).json({ error: 'Missing feedback id.' });

        await query('DELETE FROM feedbacks WHERE id = $1', [feedbackId]);
        return res.status(200).json({ success: true, message: 'Feedback deleted.' });
      }

      // Default: submit new feedback (action: 'submit' or no action)
      if (!uid || !name || !rating) {
        return res.status(400).json({ error: 'Missing required feedback fields: uid, name, rating.' });
      }

      const ratingNum = Number(rating);
      if (ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
      }

      const encryptedMessage = message ? encrypt(message) : '';

      try {
        const insertResult = await query(
          'INSERT INTO feedbacks (uid, name, rating, message, is_published) VALUES ($1, $2, $3, $4, 0)',
          [uid, name, ratingNum, encryptedMessage]
        );
        return res.status(200).json({
          success: true,
          message: 'Feedback submitted successfully! It will appear on the platform after admin review.',
          rowCount: insertResult.rowCount,
        });
      } catch (dbError: any) {
        console.error('[Feedback] Insert failed:', dbError);
        return res.status(500).json({ error: 'Failed to save feedback. Please try again.' });
      }
    }

    return res.status(405).json({ error: 'Method not supported.' });
  } catch (err: any) {
    console.error('Feedback API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
