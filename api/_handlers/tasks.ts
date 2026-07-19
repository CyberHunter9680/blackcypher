import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';
import { encrypt } from './security.js';

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
    // 1. GET ALL ASSIGNED TASKS & SUBMISSIONS FOR USER
    if (method === 'GET') {
      const { uid } = req.query;
      if (!uid) {
        return res.status(400).json({ error: 'Missing uid parameter.' });
      }

      // Fetch tasks assigned to user specifically or globally
      const tasksRes = await query(
        `SELECT * FROM tasks 
         WHERE assigned_to = $1 OR assigned_to IS NULL OR assigned_to = 'all' 
         ORDER BY created_at DESC`,
        [uid]
      );

      // Fetch all submissions by this user
      const submissionsRes = await query(
        'SELECT * FROM task_submissions WHERE user_id = $1',
        [uid]
      );

      return res.status(200).json({
        tasks: tasksRes.rows,
        submissions: submissionsRes.rows
      });
    }

    // 2. SUBMIT A HACKING TASK WORK
    if (method === 'POST') {
      const { uid, task_id, submission_content } = req.body;

      if (!uid || !task_id || !submission_content) {
        return res.status(400).json({ error: 'Missing required parameters.' });
      }

      // Check if user already submitted for this task
      const checkSub = await query(
        'SELECT id FROM task_submissions WHERE task_id = $1 AND user_id = $2',
        [task_id, uid]
      );

      let result;
      if (checkSub.rows.length > 0) {
        // Update existing submission
        result = await query(
          `UPDATE task_submissions 
           SET submission_content = $3, status = 'submitted', submitted_at = CURRENT_TIMESTAMP 
           WHERE task_id = $1 AND user_id = $2 
           RETURNING *`,
          [task_id, uid, encrypt(submission_content)]
        );
      } else {
        // Insert new submission
        result = await query(
          `INSERT INTO task_submissions (task_id, user_id, submission_content, status) 
           VALUES ($1, $2, $3, 'submitted') 
           RETURNING *`,
          [task_id, uid, encrypt(submission_content)]
        );
      }

      return res.status(201).json({ success: true, submission: result.rows[0] });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err: any) {
    console.error('Tasks API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
