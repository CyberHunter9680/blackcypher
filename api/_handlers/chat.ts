import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';
import { encrypt, decrypt } from './security.js';

// CORS support
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version'
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // Ensure messages table exists and support reply / edit fields
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id TEXT NOT NULL,
        receiver_id TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reply_to_id INTEGER DEFAULT NULL,
        is_edited INTEGER DEFAULT 0
      )
    `);
  } catch (dbError) {
    console.warn('[DEV] messages table setup note:', dbError);
  }

  // Safe migrations for databases that already exist
  try {
    await query('ALTER TABLE messages ADD COLUMN reply_to_id INTEGER DEFAULT NULL');
  } catch {}
  try {
    await query('ALTER TABLE messages ADD COLUMN is_edited INTEGER DEFAULT 0');
  } catch {}

  const { uid } = req.query;
  if (!uid) {
    return res.status(400).json({ error: 'Missing uid parameter.' });
  }

  try {
    // ── GET /api/chat ──────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const search = req.query.search as string;
      const chatWith = req.query.chat_with as string;

      // Scenario A: Search users by username (only users who have registered accounts)
      if (search) {
        try {
          let cleanSearch = search.trim();
          if (cleanSearch.startsWith('@')) {
            cleanSearch = cleanSearch.substring(1);
          }
          let discriminatorFilter: string | null = null;

          if (cleanSearch.includes('#')) {
            const parts = cleanSearch.split('#');
            cleanSearch = parts[0].trim();
            discriminatorFilter = parts[1].trim();
          }

          let result;
          if (cleanSearch === '' && discriminatorFilter) {
            result = await query(
              'SELECT id, username, name, role, avatar, discriminator FROM users WHERE id != $1 LIMIT 100',
              [uid]
            );
          } else {
            result = await query(
              `SELECT id, username, name, role, avatar, discriminator 
               FROM users 
               WHERE (LOWER(username) LIKE LOWER($1) OR LOWER(name) LIKE LOWER($1) OR id = $2) AND id != $3 LIMIT 50`,
              [`%${cleanSearch}%`, cleanSearch, uid]
            );
          }

          let users = result.rows.map(user => {
            let hash = 0;
            const idStr = String(user.id);
            for (let i = 0; i < idStr.length; i++) {
              hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
            }
            const code = Math.abs(hash % 9000) + 1000;
            return {
              ...user,
              username: user.username || user.name?.toLowerCase().replace(/\s+/g, '') || 'operator',
              discriminator: user.discriminator || `${code}`
            };
          });

          if (discriminatorFilter) {
            users = users.filter(u => u.discriminator.startsWith(discriminatorFilter!));
          }

          return res.status(200).json(users.slice(0, 10));
        } catch (dbError) {
          console.error('[Chat API] Search failed:', dbError);
          return res.status(500).json({ error: 'Search failed.' });
        }
      }

      // Scenario B: Get specific chat history between current user and another user
      if (chatWith) {
        try {
          // Mark incoming messages as read
          await query(
            'UPDATE messages SET is_read = 1 WHERE sender_id = $1 AND receiver_id = $2 AND is_read = 0',
            [chatWith, uid]
          );

          // Retrieve messages
          const result = await query(
            'SELECT id, sender_id, receiver_id, message, created_at, is_read, reply_to_id, is_edited FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at ASC',
            [uid, chatWith]
          );

          // Decrypt cleartext messages before transmitting to client
          const decryptedRows = result.rows.map(row => ({
            ...row,
            message: decrypt(row.message)
          }));

          return res.status(200).json(decryptedRows);
        } catch (dbError) {
          console.error('[Chat API] Fetch history failed:', dbError);
          return res.status(500).json({ error: 'Failed to retrieve message history.' });
        }
      }

      // Scenario C: List all active chat rooms (threads) for the current user
      try {
        const threadUsersRes = await query(
          `SELECT DISTINCT 
            CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS other_user_id
           FROM messages 
           WHERE sender_id = $1 OR receiver_id = $1`,
          [uid]
        );

        const threads = [];
        for (const row of threadUsersRes.rows) {
          const otherUserId = row.other_user_id;

          // Get user details
          const userDetailsRes = await query(
            'SELECT id, username, name, role, avatar, discriminator FROM users WHERE id = $1',
            [otherUserId]
          );
          if (userDetailsRes.rows.length === 0) continue;
          const otherUser = userDetailsRes.rows[0];

          // Get last message
          const lastMsgRes = await query(
            'SELECT message, created_at, sender_id, is_read FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at DESC LIMIT 1',
            [uid, otherUserId]
          );
          if (lastMsgRes.rows.length === 0) continue;
          const lastMsg = lastMsgRes.rows[0];
          const decryptedLastMsg = decrypt(lastMsg.message);

          // Get unread count
          const unreadRes = await query(
            'SELECT COUNT(*) AS unread_count FROM messages WHERE sender_id = $1 AND receiver_id = $2 AND is_read = 0',
            [otherUserId, uid]
          );
          const unreadCount = parseInt(unreadRes.rows[0].unread_count || '0', 10);

          let hash = 0;
          const idStr = String(otherUser.id);
          for (let i = 0; i < idStr.length; i++) {
            hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
          }
          const code = Math.abs(hash % 9000) + 1000;

          threads.push({
            id: otherUser.id,
            name: otherUser.name || otherUser.username || 'Operator',
            username: otherUser.username,
            discriminator: otherUser.discriminator || `${code}`,
            avatar: otherUser.avatar,
            role: otherUser.role,
            lastMsg: decryptedLastMsg,
            time: lastMsg.created_at,
            unread: unreadCount,
            online: false
          });
        }

        // Sort threads by last message time descending
        threads.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        return res.status(200).json(threads);
      } catch (dbError) {
        console.error('[Chat API] Threads list failed:', dbError);
        return res.status(200).json([]);
      }
    }

    // ── POST /api/chat ─────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { receiver_id, message, reply_to_id } = req.body;
      if (!receiver_id || !message) {
        return res.status(400).json({ error: 'Missing required parameters: receiver_id, message.' });
      }

      const encryptedMessage = encrypt(message);

      try {
        const insertResult = await query(
          'INSERT INTO messages (sender_id, receiver_id, message, is_read, reply_to_id) VALUES ($1, $2, $3, 0, $4) RETURNING id',
          [uid, receiver_id, encryptedMessage, reply_to_id || null]
        );
        return res.status(200).json({
          success: true,
          message: 'Message sent successfully.',
          id: insertResult.rows[0]?.id || Date.now()
        });
      } catch (dbError) {
        console.error('[Chat API] Send failed:', dbError);
        return res.status(500).json({ error: 'Failed to send message.' });
      }
    }

    // ── PUT /api/chat ──────────────────────────────────────────────────────
    if (req.method === 'PUT') {
      const { message_id, message } = req.body;
      if (!message_id || !message) {
        return res.status(400).json({ error: 'Missing required parameters: message_id, message.' });
      }

      const encryptedMessage = encrypt(message);

      try {
        await query(
          'UPDATE messages SET message = $1, is_edited = 1 WHERE id = $2 AND sender_id = $3',
          [encryptedMessage, message_id, uid]
        );
        return res.status(200).json({ success: true, message: 'Message edited successfully.' });
      } catch (dbError) {
        console.error('[Chat API] Edit failed:', dbError);
        return res.status(500).json({ error: 'Failed to edit message.' });
      }
    }

    // ── DELETE /api/chat ───────────────────────────────────────────────────
    if (req.method === 'DELETE') {
      const { message_id } = req.body;
      if (!message_id) {
        return res.status(400).json({ error: 'Missing required parameter: message_id.' });
      }

      try {
        const encryptedMsg = encrypt('🚫 This message was deleted');
        await query(
          'UPDATE messages SET message = $1, is_edited = 0 WHERE id = $2 AND sender_id = $3',
          [encryptedMsg, message_id, uid]
        );
        return res.status(200).json({ success: true, message: 'Message deleted successfully.' });
      } catch (dbError) {
        console.error('[Chat API] Delete failed:', dbError);
        return res.status(500).json({ error: 'Failed to delete message.' });
      }
    }

    return res.status(405).json({ error: 'Method not supported.' });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
