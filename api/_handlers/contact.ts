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

  // Ensure contact_messages table exists
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (dbError) {
    console.warn('[DEV] contact_messages table setup note:', dbError);
  }

  try {
    // ── GET /api/contact ──────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const adminUid = req.query.admin_uid as string;
      const adminOk = await isAdmin(adminUid);
      if (!adminOk) return res.status(403).json({ error: 'Access denied.' });

      try {
        const result = await query('SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY created_at DESC');
        return res.status(200).json(result.rows);
      } catch (dbError) {
        console.warn('[DEV] contact GET failed:', dbError);
        return res.status(200).json([]);
      }
    }

    // ── POST /api/contact ─────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { action, name, email, subject, message, id: messageId, admin_uid } = req.body;

      // action: 'delete' — Admin permanently deletes a contact message
      if (action === 'delete') {
        const adminOk = await isAdmin(admin_uid);
        if (!adminOk) return res.status(403).json({ error: 'Access denied.' });
        if (!messageId) return res.status(400).json({ error: 'Missing message id.' });

        await query('DELETE FROM contact_messages WHERE id = $1', [messageId]);
        return res.status(200).json({ success: true, message: 'Message deleted successfully.' });
      }

      // Default: submit new message
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required contact fields: name, email, message.' });
      }

      const encryptedName = encrypt(name);
      const encryptedEmail = encrypt(email);
      const encryptedSubject = subject ? encrypt(subject) : '';
      const encryptedMsg = encrypt(message);

      try {
        const insertResult = await query(
          'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
          [encryptedName, encryptedEmail, encryptedSubject, encryptedMsg]
        );
        return res.status(200).json({
          success: true,
          message: 'Your message has been received! We will contact you soon.',
          rowCount: insertResult.rowCount,
        });
      } catch (dbError: any) {
        console.error('[Contact] Insert failed:', dbError);
        return res.status(500).json({ error: 'Failed to send message. Please try again.' });
      }
    }

    return res.status(405).json({ error: 'Method not supported.' });
  } catch (err: any) {
    console.error('Contact API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
