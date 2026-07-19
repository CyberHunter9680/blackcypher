import type { VercelRequest, VercelResponse } from '@vercel/node';
import adminHandler from './_handlers/admin.js';
import authHandler from './_handlers/auth.js';
import blogsHandler from './_handlers/blogs.js';
import bookingsHandler from './_handlers/bookings.js';
import chatHandler from './_handlers/chat.js';
import contactHandler from './_handlers/contact.js';
import contentHandler from './_handlers/content.js';
import feedbackHandler from './_handlers/feedback.js';
import forumHandler from './_handlers/forum.js';
import meetingsHandler from './_handlers/meetings.js';
import notificationsHandler from './_handlers/notifications.js';
import otpHandler from './_handlers/otp.js';
import progressHandler from './_handlers/progress.js';
import tasksHandler from './_handlers/tasks.js';
import usersHandler from './_handlers/users.js';
import verifyHandler from './_handlers/verify.js';

const handlers: Record<string, (req: VercelRequest, res: VercelResponse) => any> = {
  admin: adminHandler,
  auth: authHandler,
  blogs: blogsHandler,
  bookings: bookingsHandler,
  chat: chatHandler,
  contact: contactHandler,
  content: contentHandler,
  feedback: feedbackHandler,
  forum: forumHandler,
  meetings: meetingsHandler,
  notifications: notificationsHandler,
  otp: otpHandler,
  progress: progressHandler,
  tasks: tasksHandler,
  users: usersHandler,
  verify: verifyHandler
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extract route name from request URL
  const url = req.url || '';
  const pathname = url.split('?')[0];
  const parts = pathname.split('/');
  const route = parts[2] || parts[parts.length - 1];
  
  const routeHandler = handlers[route];
  
  if (routeHandler) {
    try {
      await routeHandler(req, res);
    } catch (err: any) {
      console.error(`Error in /api/${route}:`, err);
      res.status(500).json({ error: `API route /api/${route} failed.`, details: err.message });
    }
  } else {
    res.status(404).json({ error: `API Route /api/${route} not found` });
  }
}
