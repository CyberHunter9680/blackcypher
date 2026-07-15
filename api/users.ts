import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';
import { encrypt } from './security.js';

async function generateUniqueUsername(name: string, email: string): Promise<string> {
  const baseName = name || email?.split('@')[0] || 'operator';
  let cleanName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!cleanName) cleanName = 'operator';

  let candidate = cleanName;
  let exists = await query('SELECT id FROM users WHERE username = $1', [candidate]);
  if (exists.rows.length === 0) {
    return candidate;
  }

  for (let i = 0; i < 10; i++) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    candidate = `${cleanName}${randomNum}`;
    const check = await query('SELECT id FROM users WHERE username = $1', [candidate]);
    if (check.rows.length === 0) {
      return candidate;
    }
  }

  return `${cleanName}${Date.now().toString().slice(-4)}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
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
    // 1. FETCH USER PROFILE & SUBSCRIPTION STATUS
    if (method === 'GET') {
      const { uid } = req.query;
      if (!uid) {
        return res.status(400).json({ error: 'Missing uid query parameter' });
      }

      // Fetch user profile
      const userRes = await query('SELECT * FROM users WHERE id = $1', [uid]);
      if (userRes.rows.length === 0) {
        return res.status(200).json({ exists: false });
      }

      const user = userRes.rows[0];
      const expectedLevel = Math.floor(Math.sqrt((user.xp || 0) / 100)) + 1;
      if (user.level !== expectedLevel) {
        user.level = expectedLevel;
        try {
          await query('UPDATE users SET level = $1 WHERE id = $2', [expectedLevel, uid]);
        } catch (dbErr) {
          console.warn('[Sync Level] Failed to update db level:', dbErr);
        }
      }

      let hash = 0;
      const idStr = String(user.id);
      for (let i = 0; i < idStr.length; i++) {
        hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
      }
      const code = Math.abs(hash % 9000) + 1000;
      if (!user.discriminator) {
        user.discriminator = `${code}`;
        try {
          await query('UPDATE users SET discriminator = $1 WHERE id = $2', [user.discriminator, uid]);
        } catch (dbErr) {
          console.warn('[Sync Discriminator] Failed to update db discriminator:', dbErr);
        }
      }

      if (!user.username) {
        const generatedUsername = await generateUniqueUsername(user.name, user.email);
        user.username = generatedUsername;
        try {
          await query('UPDATE users SET username = $1 WHERE id = $2', [generatedUsername, uid]);
        } catch (dbErr) {
          console.warn('[Sync Username] Failed to update db username:', dbErr);
        }
      }

      // Fetch subscription tier details
      const subRes = await query('SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [uid]);
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
        exists: true,
        user,
        subscription
      });
    }

    // 2. CREATE, UPDATE & UPGRADE USER
    if (method === 'POST') {
      const { action, uid, email, phone, name, avatar, qualification, age, gender, current_course, referral_source, dob, tier, plan } = req.body;

      if (!uid) {
        return res.status(400).json({ error: 'Missing uid parameter in body' });
      }

      // Action: Register new user
      if (action === 'register') {
        const userExists = await query('SELECT id, username FROM users WHERE id = $1', [uid]);
        if (userExists.rows.length > 0) {
          // If the user already exists (e.g. registered via credentials), complete/update their profile details.
          const existingUser = userExists.rows[0];
          let finalUsername = existingUser.username;
          if (!finalUsername) {
            finalUsername = await generateUniqueUsername(name, email);
          }
          const updateUserQuery = `
            UPDATE users
            SET 
              email = COALESCE(NULLIF($2, ''), email),
              phone = COALESCE($3, phone),
              name = COALESCE(NULLIF($4, ''), name),
              avatar = COALESCE($5, avatar),
              qualification = COALESCE($6, qualification),
              age = COALESCE($7, age),
              gender = COALESCE($8, gender),
              current_course = COALESCE($9, current_course),
              referral_source = COALESCE($10, referral_source),
              dob = COALESCE($11, dob),
              discriminator = COALESCE(discriminator, $12),
              username = $13
            WHERE id = $1
            RETURNING *
          `;
          const computedHash = String(uid).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const computedDisc = (Math.abs(computedHash % 9000) + 1000).toString();
          const userValues = [
            uid, 
            email || '', 
            phone ? encrypt(phone) : null, 
            name || 'Operator', 
            avatar || null, 
            qualification ? encrypt(qualification) : null, 
            age ? parseInt(age) : null, 
            gender ? encrypt(gender) : null, 
            current_course || null, 
            referral_source ? encrypt(referral_source) : null, 
            dob ? encrypt(dob) : null,
            computedDisc,
            finalUsername
          ];
          const updatedUser = await query(updateUserQuery, userValues);

          // Ensure default free subscription exists
          const subExists = await query('SELECT id FROM subscriptions WHERE user_id = $1', [uid]);
          if (subExists.rows.length === 0) {
            await query(
              'INSERT INTO subscriptions (user_id, tier, active_training_plan) VALUES ($1, $2, $3)',
              [uid, 'free', 'none']
            );
          }

          return res.status(200).json({ success: true, user: updatedUser.rows[0] });
        }

        // Insert new user
        const finalUsername = await generateUniqueUsername(name, email);
        const insertUserQuery = `
          INSERT INTO users (id, email, phone, name, avatar, qualification, age, gender, current_course, referral_source, dob, discriminator, username)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING *
        `;
        const computedHash = String(uid).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const computedDisc = (Math.abs(computedHash % 9000) + 1000).toString();
        const userValues = [
          uid, 
          email || '', 
          phone ? encrypt(phone) : null, 
          name || 'Operator', 
          avatar || null, 
          qualification ? encrypt(qualification) : null, 
          age ? parseInt(age) : null, 
          gender ? encrypt(gender) : null, 
          current_course || null, 
          referral_source ? encrypt(referral_source) : null, 
          dob ? encrypt(dob) : null,
          computedDisc,
          finalUsername
        ];
        const newUser = await query(insertUserQuery, userValues);

        // Insert default free subscription
        await query(
          'INSERT INTO subscriptions (user_id, tier, active_training_plan) VALUES ($1, $2, $3)',
          [uid, 'free', 'none']
        );

        return res.status(201).json({ success: true, user: newUser.rows[0] });
      }

      // Action: Update profile details
      if (action === 'update') {
        const fields = [];
        const values: any[] = [];
        let counter = 1;

        const updateableFields = { name, avatar, qualification, age, gender, current_course, referral_source, dob };
        const encryptFields = ['phone', 'dob', 'qualification', 'gender', 'referral_source'];

        for (const [key, val] of Object.entries(updateableFields)) {
          if (val !== undefined) {
            fields.push(`${key} = $${counter}`);
            const finalVal = (val !== null && encryptFields.includes(key)) ? encrypt(String(val)) : val;
            values.push(finalVal);
            counter++;
          }
        }

        if (fields.length === 0) {
          return res.status(400).json({ error: 'No updateable fields provided' });
        }

        values.push(uid);
        const updateQuery = `
          UPDATE users
          SET ${fields.join(', ')}
          WHERE id = $${counter}
          RETURNING *
        `;

        const updatedUser = await query(updateQuery, values);
        return res.status(200).json({ success: true, user: updatedUser.rows[0] });
      }

      // Action: Upgrade to Pro or Training Plan
      if (action === 'upgrade') {
        let meetExpiry = null;
        let trainingPlan = 'none';
        let trainingExpiry = null;

        const now = new Date();

        if (plan === 'pro') {
          // Pro gives 1 month Sat/Sun doubt clearance Google Meet links
          meetExpiry = new Date(now.setDate(now.getDate() + 30)).toISOString();
        } else if (plan === 'meet_1m') {
          meetExpiry = new Date(now.setDate(now.getDate() + 30)).toISOString();
        } else if (plan === 'meet_2m') {
          meetExpiry = new Date(now.setDate(now.getDate() + 60)).toISOString();
        } else if (plan === 'meet_3m') {
          meetExpiry = new Date(now.setDate(now.getDate() + 90)).toISOString();
        } else if (plan === 'training_1w') {
          trainingPlan = '1_week';
          trainingExpiry = new Date(now.setDate(now.getDate() + 7)).toISOString();
        } else if (plan === 'training_1m') {
          trainingPlan = '1_month';
          trainingExpiry = new Date(now.setDate(now.getDate() + 30)).toISOString();
        } else if (plan === 'training_2m') {
          trainingPlan = '2_month';
          trainingExpiry = new Date(now.setDate(now.getDate() + 60)).toISOString();
        } else if (plan === 'training_3m') {
          trainingPlan = '3_month';
          trainingExpiry = new Date(now.setDate(now.getDate() + 90)).toISOString();
        }

        // Check if subscription record already exists
        const subExists = await query('SELECT id FROM subscriptions WHERE user_id = $1', [uid]);
        
        let subRes;
        if (subExists.rows.length > 0) {
          // Update existing subscription
          let updateSubQuery = `
            UPDATE subscriptions
            SET tier = $2
          `;
          const subVals: any[] = [uid, tier || 'pro'];
          let counter = 3;

          if (meetExpiry) {
            updateSubQuery += `, meet_plan_expiry = $${counter}`;
            subVals.push(meetExpiry);
            counter++;
          }
          if (trainingPlan !== 'none') {
            updateSubQuery += `, active_training_plan = $${counter}, training_plan_expiry = $${counter+1}`;
            subVals.push(trainingPlan, trainingExpiry);
            counter += 2;
          }

          updateSubQuery += ` WHERE user_id = $1 RETURNING *`;
          subRes = await query(updateSubQuery, subVals);
        } else {
          // Insert new subscription
          const insertSubQuery = `
            INSERT INTO subscriptions (user_id, tier, meet_plan_expiry, active_training_plan, training_plan_expiry)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
          `;
          subRes = await query(insertSubQuery, [uid, tier || 'pro', meetExpiry, trainingPlan, trainingExpiry]);
        }

        return res.status(200).json({ success: true, subscription: subRes.rows[0] });
      }

      return res.status(400).json({ error: 'Invalid action provided' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err: any) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
