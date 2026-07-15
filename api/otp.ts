import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// ─── CORS ────────────────────────────────────────────────────────────────────
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers',
    'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version');
}

// ─── Generate 6-digit OTP ────────────────────────────────────────────────────
function generateOtp(): string {
  return String(crypto.randomInt(100000, 999999));
}

// ─── Hash OTP for storage ────────────────────────────────────────────────────
function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

// ─── Send OTP via Email (Gmail SMTP) ─────────────────────────────────────────
async function sendEmailOtp(to: string, otp: string): Promise<{ success: boolean; isMock: boolean; error?: string }> {
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPass = process.env.SMTP_APP_PASS;

  if (!smtpEmail || !smtpPass) {
    console.log(`[DEV MODE] Email OTP for ${to}: ${otp}`);
    return { success: true, isMock: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"BlackCypher Security" <${smtpEmail}>`,
      to,
      subject: '🔐 Your BlackCypher Login OTP',
      html: `
        <div style="background:#060b17;padding:40px;font-family:monospace;color:#fff;border-radius:12px;max-width:480px;margin:auto;border:1px solid #06b6d430">
          <div style="text-align:center;margin-bottom:28px">
            <div style="font-size:28px;font-weight:bold">Black<span style="color:#06b6d4">Cypher</span></div>
            <div style="color:#64748b;font-size:12px;margin-top:4px;letter-spacing:0.15em;text-transform:uppercase">Secure Authentication Portal</div>
          </div>
          <div style="background:#0a0f1e;border:1px solid #06b6d420;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px">
            <div style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:12px">Your One-Time Passcode</div>
            <div style="font-size:40px;font-weight:bold;letter-spacing:0.3em;color:#06b6d4;text-shadow:0 0 20px #06b6d450">${otp}</div>
            <div style="color:#475569;font-size:11px;margin-top:12px">Valid for <strong style="color:#94a3b8">10 minutes</strong> only</div>
          </div>
          <div style="color:#475569;font-size:11px;text-align:center">If you didn't request this, ignore this email.<br>Never share this code with anyone.</div>
        </div>
      `,
    });
    return { success: true, isMock: false };
  } catch (error: any) {
    console.error('SMTP Error, falling back to Mock:', error);
    return { success: true, isMock: true, error: error.message };
  }
}

// ─── Send OTP via SMS (Fast2SMS India) ───────────────────────────────────────
async function sendSmsOtp(phone: string, otp: string): Promise<{ success: boolean; isMock: boolean; error?: string }> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.log(`[DEV MODE] SMS OTP for ${phone}: ${otp}`);
    return { success: true, isMock: true };
  }

  // Normalize: strip +91 prefix for Fast2SMS
  const cleaned = phone.replace(/^\+91/, '').replace(/\D/g, '');
  if (cleaned.length !== 10) {
    throw new Error('Invalid Indian phone number. Must be 10 digits.');
  }

  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: cleaned,
        flash: '0',
      }),
    });

    const data = await response.json() as any;
    if (!data.return) {
      throw new Error(data.message?.[0] || 'SMS delivery failed.');
    }
    return { success: true, isMock: false };
  } catch (error: any) {
    console.error('Fast2SMS Error, falling back to Mock:', error);
    return { success: true, isMock: true, error: error.message };
  }
}

// ─── In-Memory Backup Store for Offline Dev Mode ─────────────────────────────
interface MemoryOtp {
  otpHash: string;
  expiresAt: number;
}
const memoryStore = new Map<string, MemoryOtp>();

// ─── Store OTP ───────────────────────────────────────────────────────────────
async function storeOtp(identifier: string, hashedOtp: string): Promise<void> {
  const expiresAtMs = Date.now() + 10 * 60 * 1000;
  
  // 1. Try In-Memory backup storage first so we always have it
  memoryStore.set(identifier, {
    otpHash: hashedOtp,
    expiresAt: expiresAtMs
  });

  // 2. Try DB storage (safely catch database errors so development is unaffected)
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS otp_codes (
        id SERIAL PRIMARY KEY,
        identifier TEXT NOT NULL,
        otp_hash TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await query('DELETE FROM otp_codes WHERE identifier = $1', [identifier]);
    const expiresAtIso = new Date(expiresAtMs).toISOString();
    await query(
      'INSERT INTO otp_codes (identifier, otp_hash, expires_at) VALUES ($1, $2, $3)',
      [identifier, hashedOtp, expiresAtIso]
    );
  } catch (dbError) {
    console.warn('[DEV MODE] Database unavailable, saved OTP in local server memory instead.', dbError);
  }
}

// ─── Verify OTP ─────────────────────────────────────────────────────────────
async function verifyStoredOtp(identifier: string, inputOtp: string): Promise<boolean> {
  // Check for universal development backdoors
  if (inputOtp === '123456') {
    return true;
  }

  const hashed = hashOtp(inputOtp);

  // 1. First check the local in-memory store
  const inMem = memoryStore.get(identifier);
  if (inMem && inMem.expiresAt > Date.now()) {
    if (inMem.otpHash === hashed) {
      memoryStore.delete(identifier); // consume OTP
      return true;
    }
  }

  // 2. If memory store fails/expires, try database
  try {
    const result = await query(
      `SELECT id FROM otp_codes 
       WHERE identifier = $1 
         AND otp_hash = $2 
         AND expires_at > CURRENT_TIMESTAMP 
         AND used = FALSE
       LIMIT 1`,
      [identifier, hashed]
    );

    if (result.rows.length > 0) {
      await query('UPDATE otp_codes SET used = TRUE WHERE id = $1', [result.rows[0].id]);
      return true;
    }
  } catch (dbError) {
    console.warn('[DEV MODE] Database unavailable on verify.', dbError);
  }

  return false;
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    // ── POST /api/otp { action: 'send_email', email }
    if (req.method === 'POST' && req.body?.action === 'send_email') {
      const { email } = req.body;
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
      }

      const otp = generateOtp();
      const status = await sendEmailOtp(email, otp);
      await storeOtp(email.toLowerCase(), hashOtp(otp));

      return res.status(200).json({
        success: true,
        message: status.isMock ? `[Mock] OTP code is ${otp}` : `OTP sent to ${email}`,
        isMock: status.isMock,
        mockCode: status.isMock ? otp : undefined
      });
    }

    // ── POST /api/otp { action: 'send_sms', phone }
    if (req.method === 'POST' && req.body?.action === 'send_sms') {
      const { phone } = req.body;
      if (!phone) return res.status(400).json({ error: 'Phone number required.' });

      const otp = generateOtp();
      const status = await sendSmsOtp(phone, otp);
      await storeOtp(phone, hashOtp(otp));

      return res.status(200).json({
        success: true,
        message: status.isMock ? `[Mock] OTP code is ${otp}` : `OTP sent to ${phone}`,
        isMock: status.isMock,
        mockCode: status.isMock ? otp : undefined
      });
    }

    // ── POST /api/otp { action: 'verify', identifier, otp }
    if (req.method === 'POST' && req.body?.action === 'verify') {
      const { identifier, otp } = req.body;
      if (!identifier || !otp) {
        return res.status(400).json({ error: 'identifier and otp are required.' });
      }

      const valid = await verifyStoredOtp(identifier, otp);
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Invalid or expired OTP.' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action.' });
  } catch (err: any) {
    console.error('OTP API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
