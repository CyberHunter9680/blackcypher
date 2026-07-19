import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';
import crypto from 'crypto';

function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === storedHash;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
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

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { action, username, email, password, name, usernameOrEmail } = req.body;

  try {
    // 1. REGISTER NEW USER
    if (action === 'register') {
      if (!username || !email || !password || !name) {
        return res.status(400).json({ error: 'Username, Email, Password and Name are required.' });
      }

      const cleanUsername = username.trim().toLowerCase();
      const cleanEmail = email.trim().toLowerCase();

      // Basic syntax validation
      if (cleanUsername.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
        return res.status(400).json({ error: 'Username can only contain letters, numbers and underscores.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({ error: 'Invalid email address format.' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }

      // Check if username already exists
      const usernameCheck = await query('SELECT id FROM users WHERE username = $1', [cleanUsername]);
      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Username is already taken by another operator.' });
      }

      // Check if email already exists
      const emailCheck = await query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email is already registered. Please login instead.' });
      }

      // Hash password
      const { salt, hash } = hashPassword(password);
      const combinedHash = `${salt}:${hash}`;

      // Generate a unique UID
      const uid = `usr_${cleanUsername}_${Math.random().toString(36).substring(2, 7)}`;
      // Generate a random 4-digit discriminator code
      const discriminator = Math.floor(1000 + Math.random() * 9000).toString();

      // Insert user
      const insertUserQuery = `
        INSERT INTO users (id, email, username, password_hash, name, role, status, avatar, discriminator)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, email, username, name, role, status, avatar, discriminator
      `;
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;
      const userRes = await query(insertUserQuery, [
        uid,
        cleanEmail,
        cleanUsername,
        combinedHash,
        name.trim(),
        'student',
        'active',
        avatarUrl,
        discriminator
      ]);

      // Create free subscription record
      await query(
        'INSERT INTO subscriptions (user_id, tier, active_training_plan) VALUES ($1, $2, $3)',
        [uid, 'free', 'none']
      );

      return res.status(201).json({
        success: true,
        user: userRes.rows[0]
      });
    }

    // 2. LOGIN USER
    if (action === 'login') {
      if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: 'Username/Email and Password are required.' });
      }

      const input = usernameOrEmail.trim().toLowerCase();

      // Query user
      const userRes = await query(
        'SELECT * FROM users WHERE username = $1 OR email = $1',
        [input]
      );

      if (userRes.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      const user = userRes.rows[0];

      // Blocked check
      if (user.status === 'blocked') {
        return res.status(403).json({ error: 'Your account has been temporarily suspended by an administrator. Please contact support.' });
      }

      // Password auth check
      if (!user.password_hash) {
        return res.status(400).json({ error: 'This account was registered using a different provider (Google or OTP). Please use that instead.' });
      }

      const parts = user.password_hash.split(':');
      if (parts.length !== 2) {
        return res.status(500).json({ error: 'Internal security credential parse error.' });
      }

      const [salt, storedHash] = parts;
      const isValid = verifyPassword(password, salt, storedHash);

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      // Hide password_hash from the returned payload
      const { password_hash, ...safeUser } = user;

      // Fetch subscription tier details
      const subRes = await query('SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [safeUser.id]);
      let subscription = {
        tier: 'free',
        meet_plan_expiry: null,
        active_training_plan: 'none',
        training_plan_expiry: null
      };

      if (subRes.rows.length > 0) {
        subscription = {
          tier: subRes.rows[0].tier,
          meet_plan_expiry: subRes.rows[0].meet_plan_expiry,
          active_training_plan: subRes.rows[0].active_training_plan,
          training_plan_expiry: subRes.rows[0].training_plan_expiry
        };
      }

      return res.status(200).json({
        success: true,
        user: safeUser,
        subscription
      });
    }

    // 3. CHANGE CREDENTIALS (USERNAME/PASSWORD)
    if (action === 'change_credentials') {
      const { uid, newUsername, currentPassword, newPassword } = req.body;
      if (!uid || !currentPassword) {
        return res.status(400).json({ error: 'User ID and current password are required.' });
      }

      // Query user
      const userRes = await query('SELECT * FROM users WHERE id = $1', [uid]);
      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const user = userRes.rows[0];

      // Blocked check
      if (user.status === 'blocked') {
        return res.status(403).json({ error: 'Your account is suspended.' });
      }

      // Password auth check
      if (!user.password_hash) {
        return res.status(400).json({ error: 'This account does not have a password set. (E.g. logged in via Google/OTP)' });
      }

      const parts = user.password_hash.split(':');
      if (parts.length !== 2) {
        return res.status(500).json({ error: 'Internal security credential parse error.' });
      }

      const [salt, storedHash] = parts;
      const isValid = verifyPassword(currentPassword, salt, storedHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Incorrect current password.' });
      }

      // 1. Process username update
      if (newUsername) {
        const cleanUsername = newUsername.trim().toLowerCase();
        if (cleanUsername.length < 3) {
          return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
        }
        if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
          return res.status(400).json({ error: 'Username can only contain letters, numbers and underscores.' });
        }

        // Check if taken
        const takenCheck = await query('SELECT id FROM users WHERE username = $1 AND id != $2', [cleanUsername, uid]);
        if (takenCheck.rows.length > 0) {
          return res.status(400).json({ error: 'Username is already taken by another operator.' });
        }

        await query('UPDATE users SET username = $1 WHERE id = $2', [cleanUsername, uid]);
      }

      // 2. Process password update
      if (newPassword) {
        if (newPassword.length < 6) {
          return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
        }
        const { salt: newSalt, hash: newHash } = hashPassword(newPassword);
        const combinedHash = `${newSalt}:${newHash}`;
        await query('UPDATE users SET password_hash = $1 WHERE id = $2', [combinedHash, uid]);
      }

      // Fetch updated user
      const updatedUserRes = await query('SELECT * FROM users WHERE id = $1', [uid]);
      const updatedUser = updatedUserRes.rows[0];
      const { password_hash, ...safeUser } = updatedUser;

      return res.status(200).json({
        success: true,
        user: safeUser
      });
    }

    return res.status(400).json({ error: 'Invalid action parameter' });
  } catch (error: any) {
    console.error('Credentials Authentication API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
