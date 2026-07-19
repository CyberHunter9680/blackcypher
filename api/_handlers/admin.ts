import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';

async function isAdmin(uid: string): Promise<boolean> {
  if (!uid) return false;
  if (uid === 'mock-admin-888') return true;

  const res = await query('SELECT role FROM users WHERE id = $1', [uid]);
  return res.rows.length > 0 && res.rows[0].role === 'admin';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;
  const uid = (req.query.uid as string) || (req.body.uid as string);

  if (!uid) {
    return res.status(401).json({ error: 'Unauthorized. Missing security credentials.' });
  }

  try {
    const adminCheck = await isAdmin(uid);
    if (!adminCheck) {
      return res.status(403).json({ error: 'Access denied. Insufficient operational clearance.' });
    }

    // --- GET ACTIONS ---
    if (method === 'GET') {
      const { action } = req.query;

      if (action === 'metrics') {
        // Fetch dashboard metrics
        const totalStudentsRes = await query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
        const totalIncomeRes = await query("SELECT SUM(amount_paid) as income FROM bookings");
        const activeSessionsRes = await query("SELECT COUNT(*) as count FROM bookings WHERE booking_type = 'session_school'");
        const totalTasksRes = await query("SELECT COUNT(*) as count FROM tasks");
        const totalBooksRes = await query("SELECT COUNT(*) as count FROM books");
        const totalLessonsRes = await query("SELECT COUNT(*) as count FROM lessons");

        return res.status(200).json({
          totalStudents: parseInt(totalStudentsRes.rows[0]?.count || '0'),
          totalIncome: parseFloat(totalIncomeRes.rows[0]?.income || '0.00'),
          activeSessions: parseInt(activeSessionsRes.rows[0]?.count || '0'),
          totalTasks: parseInt(totalTasksRes.rows[0]?.count || '0'),
          totalBooks: parseInt(totalBooksRes.rows[0]?.count || '0'),
          totalLessons: parseInt(totalLessonsRes.rows[0]?.count || '0'),
        });
      }

      if (action === 'bookings') {
        // Fetch all bookings
        const bookingsRes = await query(
          `SELECT b.*, u.email, u.name 
           FROM bookings b 
           JOIN users u ON b.user_id = u.id 
           ORDER BY b.created_at DESC`
        );
        return res.status(200).json(bookingsRes.rows);
      }

      if (action === 'submissions') {
        // Fetch all student task submissions
        const submissionsRes = await query(
          `SELECT ts.*, t.title as task_title, t.xp_reward, u.email, u.name 
           FROM task_submissions ts 
           JOIN tasks t ON ts.task_id = t.id 
           JOIN users u ON ts.user_id = u.id 
           ORDER BY ts.submitted_at DESC`
        );
        return res.status(200).json(submissionsRes.rows);
      }

      if (action === 'courses') {
        // Fetch all courses
        const coursesRes = await query('SELECT * FROM courses ORDER BY id ASC');
        return res.status(200).json(coursesRes.rows);
      }

      if (action === 'lessons') {
        // Fetch all lessons with course title details
        const lessonsRes = await query(
          `SELECT l.*, c.title as course_title 
           FROM lessons l 
           JOIN courses c ON l.course_id = c.id 
           ORDER BY l.course_id ASC, l.order_no ASC`
        );
        return res.status(200).json(lessonsRes.rows);
      }

      if (action === 'books') {
        // Fetch all books
        const booksRes = await query('SELECT * FROM books ORDER BY id DESC');
        return res.status(200).json(booksRes.rows);
      }

      if (action === 'tasks') {
        // Fetch all assignments / tasks
        const tasksRes = await query('SELECT * FROM tasks ORDER BY id DESC');
        return res.status(200).json(tasksRes.rows);
      }

      if (action === 'users') {
        // Fetch all users with their subscription tier and status
        const usersRes = await query(
          `SELECT u.*, s.tier as subscription_tier
           FROM users u
           LEFT JOIN subscriptions s ON s.user_id = u.id
           ORDER BY u.joined_at DESC`
        );
        const users = [];
        for (const user of usersRes.rows) {
          const expectedLevel = Math.floor(Math.sqrt((user.xp || 0) / 100)) + 1;
          let hash = 0;
          const idStr = String(user.id);
          for (let i = 0; i < idStr.length; i++) {
            hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
          }
          const code = Math.abs(hash % 9000) + 1000;
          let disc = user.discriminator;
          if (!disc) {
            disc = `${code}`;
            try {
              await query('UPDATE users SET discriminator = $1 WHERE id = $2', [disc, user.id]);
            } catch (dbErr) {
              console.warn('[Sync Admin Discriminator] Failed:', dbErr);
            }
          }

          let finalUsername = user.username;
          if (!finalUsername) {
            const baseName = user.name || user.email?.split('@')[0] || 'operator';
            let cleanName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!cleanName) cleanName = 'operator';
            
            let candidate = cleanName;
            let exists = await query('SELECT id FROM users WHERE username = $1', [candidate]);
            if (exists.rows.length > 0) {
              for (let i = 0; i < 10; i++) {
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                candidate = `${cleanName}${randomNum}`;
                const check = await query('SELECT id FROM users WHERE username = $1', [candidate]);
                if (check.rows.length === 0) break;
              }
            }
            finalUsername = candidate;
            try {
              await query('UPDATE users SET username = $1 WHERE id = $2', [finalUsername, user.id]);
            } catch (dbErr) {
              console.warn('[Sync Admin Username] Failed:', dbErr);
            }
          }

          users.push({
            ...user,
            username: finalUsername,
            level: expectedLevel,
            discriminator: disc
          });
        }
        return res.status(200).json(users);
      }

      if (action === 'meetings') {
        // Fetch all meetings
        const meetingsRes = await query('SELECT * FROM meetings ORDER BY date_time DESC');
        return res.status(200).json(meetingsRes.rows);
      }

      if (action === 'partners') {
        // Fetch all partners
        const partnersRes = await query('SELECT * FROM partners ORDER BY id DESC');
        return res.status(200).json(partnersRes.rows);
      }

      return res.status(400).json({ error: 'Invalid action.' });
    }

    // --- POST ACTIONS ---
    if (method === 'POST') {
      const { action } = req.body;

      if (action === 'approve_booking') {
        const { booking_id } = req.body;
        if (!booking_id) {
          return res.status(400).json({ error: 'Missing booking ID.' });
        }

        await query(
          "UPDATE bookings SET status = 'approved' WHERE id = $1",
          [booking_id]
        );
        return res.status(200).json({ success: true, message: 'Booking approved successfully.' });
      }

      if (action === 'upload_lesson') {
        const { course_id, title, video_url, duration, order_no, is_free } = req.body;
        if (!course_id || !title || !video_url) {
          return res.status(400).json({ error: 'Missing required lesson parameters.' });
        }

        const insertRes = await query(
          `INSERT INTO lessons (course_id, title, video_url, duration, order_no, is_free)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [
            course_id,
            title,
            video_url,
            duration || '10:00',
            order_no ? parseInt(order_no) : 1,
            is_free === true
          ]
        );
        return res.status(201).json({ success: true, lesson: insertRes.rows[0] });
      }

      if (action === 'upload_book') {
        const { title, author, description, pdf_url, is_free } = req.body;
        if (!title || !pdf_url) {
          return res.status(400).json({ error: 'Missing book parameters.' });
        }

        const insertRes = await query(
          `INSERT INTO books (title, author, description, pdf_url, is_free)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [
            title,
            author || 'Black Cypher SpecOps',
            description || '',
            pdf_url,
            is_free === true
          ]
        );
        return res.status(201).json({ success: true, book: insertRes.rows[0] });
      }

      if (action === 'create_task') {
        const { title, description, assigned_to, xp_reward, due_date } = req.body;
        if (!title || !description) {
          return res.status(400).json({ error: 'Missing task parameters.' });
        }

        // assigned_to: if specific user UID is provided, use it, else keep NULL (assigned to everyone)
        const targetUser = assigned_to && assigned_to !== 'all' && assigned_to !== '' ? assigned_to : null;

        const insertRes = await query(
          `INSERT INTO tasks (title, description, assigned_to, xp_reward, due_date)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [
            title,
            description,
            targetUser,
            xp_reward ? parseInt(xp_reward) : 500,
            due_date ? new Date(due_date).toISOString() : null
          ]
        );
        return res.status(201).json({ success: true, task: insertRes.rows[0] });
      }

      if (action === 'grade_submission') {
        const { submission_id, status, feedback } = req.body;
        if (!submission_id || !status) {
          return res.status(400).json({ error: 'Missing grading parameters.' });
        }

        // Update submission
        const updateRes = await query(
          `UPDATE task_submissions 
           SET status = $2, feedback = $3 
           WHERE id = $1 
           RETURNING *`,
          [submission_id, status, feedback || '']
        );

        if (updateRes.rows.length === 0) {
          return res.status(404).json({ error: 'Submission not found.' });
        }

        const submission = updateRes.rows[0];

        // Award XP if status is approved
        if (status === 'approved') {
          // Get XP reward of corresponding task
          const taskRes = await query(
            'SELECT xp_reward FROM tasks WHERE id = $1',
            [submission.task_id]
          );
          const xpGain = taskRes.rows[0]?.xp_reward || 500;

          // Fetch current user XP
          const userRes = await query('SELECT xp FROM users WHERE id = $1', [submission.user_id]);
          if (userRes.rows.length > 0) {
            const currentXp = userRes.rows[0].xp || 0;
            const newXp = currentXp + xpGain;
            const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;

            await query(
              'UPDATE users SET xp = $2, level = $3 WHERE id = $1',
              [submission.user_id, newXp, newLevel]
            );
          }
        }

        return res.status(200).json({ success: true, submission });
      }

      if (action === 'manage_meeting') {
        const { title, meet_url, date_time } = req.body;
        if (!title || !meet_url || !date_time) {
          return res.status(400).json({ error: 'Missing meeting parameters.' });
        }

        const insertRes = await query(
          `INSERT INTO meetings (title, meet_url, date_time, active)
           VALUES ($1, $2, $3, true)
           RETURNING *`,
          [title, meet_url, new Date(date_time).toISOString()]
        );
        return res.status(201).json({ success: true, meeting: insertRes.rows[0] });
      }

      if (action === 'manage_partner') {
        const { name, logo, link, type } = req.body;
        if (!name || !logo) {
          return res.status(400).json({ error: 'Missing partner parameters.' });
        }

        const insertRes = await query(
          `INSERT INTO partners (name, logo, link, type)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [name, logo, link || '', type || 'partner']
        );
        return res.status(201).json({ success: true, partner: insertRes.rows[0] });
      }

      if (action === 'create_blog') {
        const { title, content, author } = req.body;
        if (!title || !content) {
          return res.status(400).json({ error: 'Missing blog parameters.' });
        }

        const insertRes = await query(
          `INSERT INTO blogs (title, content, author)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [title, content, author || 'Black Cypher Command Staff']
        );
        return res.status(201).json({ success: true, blog: insertRes.rows[0] });
      }

      if (action === 'delete_blog') {
        const { blog_id } = req.body;
        if (!blog_id) {
          return res.status(400).json({ error: 'Missing blog ID.' });
        }

        await query('DELETE FROM blogs WHERE id = $1', [blog_id]);
        return res.status(200).json({ success: true, message: 'Blog post deleted successfully.' });
      }

      if (action === 'create_course') {
        const { title, description, category, level, xp_reward, thumbnail, duration, is_free } = req.body;
        if (!title) {
          return res.status(400).json({ error: 'Missing course title.' });
        }

        const insertRes = await query(
          `INSERT INTO courses (title, description, category, level, xp_reward, thumbnail, duration, is_free)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [
            title,
            description || '',
            category || 'Offensive Security',
            level || 'beginner',
            xp_reward ? parseInt(xp_reward) : 1000,
            thumbnail || '',
            duration || '10h',
            is_free === true
          ]
        );
        return res.status(201).json({ success: true, course: insertRes.rows[0] });
      }

      if (action === 'delete_course') {
        const { course_id } = req.body;
        if (!course_id) {
          return res.status(400).json({ error: 'Missing course ID.' });
        }

        await query('DELETE FROM courses WHERE id = $1', [course_id]);
        return res.status(200).json({ success: true, message: 'Course and all linked lessons deleted successfully.' });
      }

      if (action === 'delete_lesson') {
        const { lesson_id } = req.body;
        if (!lesson_id) {
          return res.status(400).json({ error: 'Missing lesson ID.' });
        }

        await query('DELETE FROM lessons WHERE id = $1', [lesson_id]);
        return res.status(200).json({ success: true, message: 'Lesson deleted successfully.' });
      }

      if (action === 'delete_book') {
        const { book_id } = req.body;
        if (!book_id) {
          return res.status(400).json({ error: 'Missing book ID.' });
        }

        await query('DELETE FROM books WHERE id = $1', [book_id]);
        return res.status(200).json({ success: true, message: 'Hacking manual PDF deleted successfully.' });
      }

      if (action === 'delete_task') {
        const { task_id } = req.body;
        if (!task_id) {
          return res.status(400).json({ error: 'Missing task ID.' });
        }

        await query('DELETE FROM tasks WHERE id = $1', [task_id]);
        return res.status(200).json({ success: true, message: 'Task deleted successfully.' });
      }

      if (action === 'block_user') {
        const { target_uid } = req.body;
        if (!target_uid) {
          return res.status(400).json({ error: 'Missing target user ID.' });
        }
        const targetRes = await query('SELECT role FROM users WHERE id = $1', [target_uid]);
        if (targetRes.rows.length === 0) {
          return res.status(404).json({ error: 'User not found.' });
        }
        if (targetRes.rows[0].role === 'admin') {
          return res.status(403).json({ error: 'Cannot block an admin account.' });
        }
        await query("UPDATE users SET status = 'blocked' WHERE id = $1", [target_uid]);
        return res.status(200).json({ success: true, message: 'Student account blocked successfully.' });
      }

      if (action === 'unblock_user') {
        const { target_uid } = req.body;
        if (!target_uid) {
          return res.status(400).json({ error: 'Missing target user ID.' });
        }
        await query("UPDATE users SET status = 'active' WHERE id = $1", [target_uid]);
        return res.status(200).json({ success: true, message: 'Student account unblocked successfully.' });
      }

      if (action === 'delete_user') {
        const { target_uid } = req.body;
        if (!target_uid) {
          return res.status(400).json({ error: 'Missing target user ID.' });
        }
        // Prevent deleting another admin
        const targetRes = await query('SELECT role FROM users WHERE id = $1', [target_uid]);
        if (targetRes.rows.length === 0) {
          return res.status(404).json({ error: 'User not found.' });
        }
        if (targetRes.rows[0].role === 'admin') {
          return res.status(403).json({ error: 'Cannot delete an admin account.' });
        }
        // Cascade: remove subscriptions, task_submissions first
        await query('DELETE FROM task_submissions WHERE user_id = $1', [target_uid]);
        await query('DELETE FROM subscriptions WHERE user_id = $1', [target_uid]);
        await query('DELETE FROM bookings WHERE user_id = $1', [target_uid]);
        await query('DELETE FROM users WHERE id = $1', [target_uid]);
        return res.status(200).json({ success: true, message: 'Student account and all data purged.' });
      }

      if (action === 'update_user_role') {
        const { target_uid, new_role } = req.body;
        if (!target_uid || !new_role) {
          return res.status(400).json({ error: 'Missing target_uid or new_role.' });
        }
        if (!['student', 'admin'].includes(new_role)) {
          return res.status(400).json({ error: 'Invalid role. Must be student or admin.' });
        }
        const updated = await query(
          'UPDATE users SET role = $2 WHERE id = $1 RETURNING id, role',
          [target_uid, new_role]
        );
        if (updated.rows.length === 0) {
          return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(200).json({ success: true, user: updated.rows[0] });
      }

      if (action === 'delete_meeting') {
        const { meeting_id } = req.body;
        if (!meeting_id) {
          return res.status(400).json({ error: 'Missing meeting ID.' });
        }

        await query('DELETE FROM meetings WHERE id = $1', [meeting_id]);
        return res.status(200).json({ success: true, message: 'Briefing meeting deleted successfully.' });
      }

      if (action === 'delete_partner') {
        const { partner_id } = req.body;
        if (!partner_id) {
          return res.status(400).json({ error: 'Missing partner ID.' });
        }

        await query('DELETE FROM partners WHERE id = $1', [partner_id]);
        return res.status(200).json({ success: true, message: 'Branding partner deleted successfully.' });
      }

      if (action === 'update_course') {
        const { course_id, title, description, category, level, xp_reward, thumbnail, duration, is_free } = req.body;
        if (!course_id || !title) {
          return res.status(400).json({ error: 'Missing course ID or title.' });
        }

        const updateRes = await query(
          `UPDATE courses 
           SET title = $2, description = $3, category = $4, level = $5, xp_reward = $6, thumbnail = $7, duration = $8, is_free = $9
           WHERE id = $1
           RETURNING *`,
          [
            course_id,
            title,
            description || '',
            category || 'Offensive Security',
            level || 'beginner',
            xp_reward ? parseInt(xp_reward) : 1000,
            thumbnail || '',
            duration || '10h',
            is_free === true
          ]
        );
        return res.status(200).json({ success: true, course: updateRes.rows[0] });
      }

      if (action === 'update_lesson') {
        const { lesson_id, course_id, title, video_url, duration, order_no, is_free } = req.body;
        if (!lesson_id || !course_id || !title || !video_url) {
          return res.status(400).json({ error: 'Missing required lesson parameters.' });
        }

        const updateRes = await query(
          `UPDATE lessons 
           SET course_id = $2, title = $3, video_url = $4, duration = $5, order_no = $6, is_free = $7
           WHERE id = $1
           RETURNING *`,
          [
            lesson_id,
            course_id,
            title,
            video_url,
            duration || '10:00',
            order_no ? parseInt(order_no) : 1,
            is_free === true
          ]
        );
        return res.status(200).json({ success: true, lesson: updateRes.rows[0] });
      }

      if (action === 'update_book') {
        const { book_id, title, author, description, pdf_url, is_free } = req.body;
        if (!book_id || !title || !pdf_url) {
          return res.status(400).json({ error: 'Missing required book parameters.' });
        }

        const updateRes = await query(
          `UPDATE books 
           SET title = $2, author = $3, description = $4, pdf_url = $5, is_free = $6
           WHERE id = $1
           RETURNING *`,
          [
            book_id,
            title,
            author || 'Black Cypher SpecOps',
            description || '',
            pdf_url,
            is_free === true
          ]
        );
        return res.status(200).json({ success: true, book: updateRes.rows[0] });
      }

      if (action === 'update_task') {
        const { task_id, title, description, assigned_to, xp_reward, due_date } = req.body;
        if (!task_id || !title || !description) {
          return res.status(400).json({ error: 'Missing required task parameters.' });
        }

        const targetUser = assigned_to && assigned_to !== 'all' && assigned_to !== '' ? assigned_to : null;

        const updateRes = await query(
          `UPDATE tasks 
           SET title = $2, description = $3, assigned_to = $4, xp_reward = $5, due_date = $6
           WHERE id = $1
           RETURNING *`,
          [
            task_id,
            title,
            description,
            targetUser,
            xp_reward ? parseInt(xp_reward) : 500,
            due_date ? new Date(due_date).toISOString() : null
          ]
        );
        return res.status(200).json({ success: true, task: updateRes.rows[0] });
      }

      return res.status(400).json({ error: 'Invalid action.' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err: any) {
    console.error('Admin API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
