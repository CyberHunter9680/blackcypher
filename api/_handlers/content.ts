import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';

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

  try {
    // 1. READ CONTENT (COURSES, SECURE LESSONS, OR PROTECTED BOOKS)
    if (method === 'GET') {
      const { type, course_id, uid, action } = req.query;

      // Action: Leaderboard
      if (action === 'leaderboard') {
        const leaderboardRes = await query(
          "SELECT id, name, username, xp, level, avatar FROM users WHERE status = 'active' ORDER BY xp DESC LIMIT 10"
        );
        const leaderboard = leaderboardRes.rows.map(user => {
          const expectedLevel = Math.floor(Math.sqrt((user.xp || 0) / 100)) + 1;
          return {
            ...user,
            level: expectedLevel
          };
        });
        return res.status(200).json(leaderboard);
      }

      // Type: Books
      if (type === 'books') {
        const booksRes = await query('SELECT * FROM books ORDER BY created_at DESC');
        return res.status(200).json(booksRes.rows);
      }

      // Type: My Courses (Enrolled)
      if (type === 'my_courses') {
        if (!uid) {
          return res.status(400).json({ error: 'Missing user ID.' });
        }
        const enrolledCoursesRes = await query(
          `SELECT DISTINCT c.* 
           FROM courses c
           JOIN lessons l ON l.course_id = c.id
           JOIN progress p ON p.lesson_id = l.id
           WHERE p.user_id = $1
           ORDER BY c.id ASC`,
          [uid]
        );

        const courses = [];
        for (const course of enrolledCoursesRes.rows) {
          const totalLessonsRes = await query(
            'SELECT COUNT(*) as count FROM lessons WHERE course_id = $1',
            [course.id]
          );
          const totalLessons = parseInt(totalLessonsRes.rows[0]?.count || '0', 10);

          const completedLessonsRes = await query(
            `SELECT COUNT(*) as count 
             FROM progress p
             JOIN lessons l ON p.lesson_id = l.id
             WHERE l.course_id = $1 AND p.user_id = $2 AND p.completed = true`,
            [course.id, uid]
          );
          const completedLessons = parseInt(completedLessonsRes.rows[0]?.count || '0', 10);

          const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

          const lastAccessedRes = await query(
            `SELECT MAX(p.updated_at) as last_accessed 
             FROM progress p
             JOIN lessons l ON p.lesson_id = l.id
             WHERE l.course_id = $1 AND p.user_id = $2`,
            [course.id, uid]
          );
          const last_accessed = lastAccessedRes.rows[0]?.last_accessed || new Date().toISOString();

          courses.push({
            ...course,
            progress: progressPercentage,
            completed_modules: completedLessons,
            modules_count: totalLessons,
            last_accessed
          });
        }

        return res.status(200).json(courses);
      }

      // Specific Course Details with Lessons & User Progress
      if (course_id) {
        const courseRes = await query('SELECT * FROM courses WHERE id = $1', [course_id]);
        if (courseRes.rows.length === 0) {
          return res.status(404).json({ error: 'Course node not found.' });
        }

        const lessonsRes = await query(
          'SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_no ASC',
          [course_id]
        );

        let progress: any[] = [];
        if (uid) {
          const progressRes = await query(
            'SELECT lesson_id, completed FROM progress WHERE user_id = $1',
            [uid]
          );
          progress = progressRes.rows;
        }

        return res.status(200).json({
          course: courseRes.rows[0],
          lessons: lessonsRes.rows,
          progress
        });
      }

      // Fetch all courses
      const coursesRes = await query('SELECT * FROM courses ORDER BY id ASC');
      return res.status(200).json(coursesRes.rows);
    }

    // 2. RECORD PROGRESS UPDATE (COMPLETED LESSON)
    if (method === 'POST') {
      const { uid, lesson_id, completed } = req.body;

      if (!uid || !lesson_id) {
        return res.status(400).json({ error: 'Missing required parameters.' });
      }

      const completedBool = completed !== false;

      // Upsert progress record
      const checkProgress = await query(
        'SELECT id FROM progress WHERE user_id = $1 AND lesson_id = $2',
        [uid, lesson_id]
      );

      if (checkProgress.rows.length > 0) {
        await query(
          'UPDATE progress SET completed = $3, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND lesson_id = $2',
          [uid, lesson_id, completedBool]
        );
      } else {
        await query(
          'INSERT INTO progress (user_id, lesson_id, completed) VALUES ($1, $2, $3)',
          [uid, lesson_id, completedBool]
        );
      }

      // Trigger user XP rewards dynamically
      if (completedBool) {
        const lessonInfo = await query(
          'SELECT c.xp_reward FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = $1',
          [lesson_id]
        );
        const xpGain = lessonInfo.rows[0]?.xp_reward ? Math.floor(lessonInfo.rows[0].xp_reward / 10) : 50; // default 50XP per lesson

        // Update user XP & Level (formula: Level = Math.floor(sqrt(XP / 1000)) + 1 or similar)
        const userRes = await query('SELECT xp FROM users WHERE id = $1', [uid]);
        if (userRes.rows.length > 0) {
          const currentXp = userRes.rows[0].xp || 0;
          const newXp = currentXp + xpGain;
          const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1; // simple cyberpunk levelling

          await query(
            'UPDATE users SET xp = $2, level = $3 WHERE id = $1',
            [uid, newXp, newLevel]
          );
        }
      }

      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err: any) {
    console.error('Content API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
