import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup
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
    // 1. GET ALL NOTIFICATIONS FOR CURRENT USER OR ALL NOTIFICATIONS (FOR ADMIN)
    if (method === 'GET') {
      const { uid, admin_view } = req.query;
      if (!uid) {
        return res.status(400).json({ error: 'Missing uid parameter.' });
      }

      // If requested by an admin to view all broadcasts
      if (admin_view === 'true') {
        const adminCheck = await query('SELECT role FROM users WHERE id = $1', [uid]);
        if (adminCheck.rows.length === 0 || adminCheck.rows[0].role !== 'admin') {
          return res.status(403).json({ error: 'UNAUTHORIZED ACCESS: ADMINISTRATIVE PRIVILEGES REQUIRED.' });
        }

        const allNotif = await query('SELECT * FROM notifications ORDER BY created_at DESC');
        return res.status(200).json(allNotif.rows);
      }

      // Fetch notifications joined with user-specific read/dismissed states
      const notifRes = await query(
        `SELECT 
          n.id, 
          n.type, 
          n.title, 
          n.message, 
          n.created_at,
          n.target_user_id,
          COALESCE(uns.is_read, false) as is_read,
          COALESCE(uns.is_dismissed, false) as is_dismissed
         FROM notifications n
         LEFT JOIN user_notification_states uns 
           ON n.id = uns.notification_id AND uns.user_id = $1
         WHERE (n.target_user_id IS NULL OR n.target_user_id = $1)
           AND (uns.is_dismissed IS NULL OR uns.is_dismissed = false)
         ORDER BY n.created_at DESC`,
        [uid]
      );

      // Map response format to frontend config
      const formatted = notifRes.rows.map(row => ({
        id: row.id.toString(),
        type: row.type,
        title: row.title,
        message: row.message,
        time: formatRelativeTime(row.created_at),
        created_at: row.created_at,
        read: row.is_read === 1 || row.is_read === true || row.is_read === 'true'
      }));

      return res.status(200).json(formatted);
    }

    // 2. MARK AS READ, DISMISS, DELETE OR CREATE NOTIFICATIONS
    if (method === 'POST') {
      const { action, uid, notification_id, type, title, message, target_user_id } = req.body;

      if (!action) {
        return res.status(400).json({ error: 'Missing action parameter.' });
      }

      // Action: MARK READ
      if (action === 'mark_read') {
        if (!uid || !notification_id) {
          return res.status(400).json({ error: 'Missing uid or notification_id.' });
        }

        const checkRes = await query(
          'SELECT id FROM user_notification_states WHERE user_id = $1 AND notification_id = $2',
          [uid, notification_id]
        );

        if (checkRes.rows.length > 0) {
          await query(
            'UPDATE user_notification_states SET is_read = true, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND notification_id = $2',
            [uid, notification_id]
          );
        } else {
          await query(
            'INSERT INTO user_notification_states (user_id, notification_id, is_read) VALUES ($1, $2, true)',
            [uid, notification_id]
          );
        }

        return res.status(200).json({ success: true });
      }

      // Action: DISMISS
      if (action === 'dismiss') {
        if (!uid || !notification_id) {
          return res.status(400).json({ error: 'Missing uid or notification_id.' });
        }

        const checkRes = await query(
          'SELECT id FROM user_notification_states WHERE user_id = $1 AND notification_id = $2',
          [uid, notification_id]
        );

        if (checkRes.rows.length > 0) {
          await query(
            'UPDATE user_notification_states SET is_dismissed = true, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND notification_id = $2',
            [uid, notification_id]
          );
        } else {
          await query(
            'INSERT INTO user_notification_states (user_id, notification_id, is_dismissed) VALUES ($1, $2, true)',
            [uid, notification_id]
          );
        }

        return res.status(200).json({ success: true });
      }

      // Action: MARK ALL READ
      if (action === 'mark_all_read') {
        if (!uid) {
          return res.status(400).json({ error: 'Missing uid parameter.' });
        }

        // Get all unread notifications for this user
        const unreadRes = await query(
          `SELECT n.id FROM notifications n
           LEFT JOIN user_notification_states uns 
             ON n.id = uns.notification_id AND uns.user_id = $1
           WHERE (n.target_user_id IS NULL OR n.target_user_id = $1)
             AND (uns.is_read IS NULL OR uns.is_read = false)`,
          [uid]
        );

        for (const notif of unreadRes.rows) {
          const checkRes = await query(
            'SELECT id FROM user_notification_states WHERE user_id = $1 AND notification_id = $2',
            [uid, notif.id]
          );

          if (checkRes.rows.length > 0) {
            await query(
              'UPDATE user_notification_states SET is_read = true, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND notification_id = $2',
              [uid, notif.id]
            );
          } else {
            await query(
              'INSERT INTO user_notification_states (user_id, notification_id, is_read) VALUES ($1, $2, true)',
              [uid, notif.id]
            );
          }
        }

        return res.status(200).json({ success: true });
      }

      // Action: CREATE (Admin Only)
      if (action === 'create') {
        const { admin_uid } = req.body;
        if (!admin_uid) {
          return res.status(400).json({ error: 'Missing admin_uid.' });
        }

        // Check if admin
        const adminCheck = await query('SELECT role FROM users WHERE id = $1', [admin_uid]);
        if (adminCheck.rows.length === 0 || adminCheck.rows[0].role !== 'admin') {
          return res.status(403).json({ error: 'UNAUTHORIZED ACCESS: ADMINISTRATIVE PRIVILEGES REQUIRED.' });
        }

        if (!type || !title || !message) {
          return res.status(400).json({ error: 'Missing type, title or message.' });
        }

        const insertRes = await query(
          'INSERT INTO notifications (type, title, message, target_user_id) VALUES ($1, $2, $3, $4) RETURNING *',
          [type, title, message, target_user_id || null]
        );

        return res.status(201).json({ success: true, notification: insertRes.rows[0] });
      }

      // Action: DELETE (Admin Only)
      if (action === 'delete') {
        const { admin_uid } = req.body;
        if (!admin_uid) {
          return res.status(400).json({ error: 'Missing admin_uid.' });
        }

        // Check if admin
        const adminCheck = await query('SELECT role FROM users WHERE id = $1', [admin_uid]);
        if (adminCheck.rows.length === 0 || adminCheck.rows[0].role !== 'admin') {
          return res.status(403).json({ error: 'UNAUTHORIZED ACCESS: ADMINISTRATIVE PRIVILEGES REQUIRED.' });
        }

        if (!notification_id) {
          return res.status(400).json({ error: 'Missing notification_id.' });
        }

        await query('DELETE FROM notifications WHERE id = $1', [notification_id]);
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'Invalid action.' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err: any) {
    console.error('Notifications API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

// Relative time formatting helper
function formatRelativeTime(dateInput: any): string {
  try {
    let normalized = dateInput;
    if (typeof dateInput === 'string') {
      // Convert SQLite space-separated "YYYY-MM-DD HH:MM:SS" or "YYYY-MM-DD HH:MM:SS.SSS" to ISO "YYYY-MM-DDTHH:MM:SSZ"
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateInput)) {
        normalized = dateInput.replace(' ', 'T') + 'Z';
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+$/.test(dateInput)) {
        normalized = dateInput.replace(' ', 'T') + 'Z';
      }
    }
    const timestamp = typeof normalized === 'string' ? Date.parse(normalized) : new Date(normalized).getTime();
    if (isNaN(timestamp)) return 'Recently';

    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return 'Yesterday';
    return `${diffDay} days ago`;
  } catch {
    return 'Recently';
  }
}

