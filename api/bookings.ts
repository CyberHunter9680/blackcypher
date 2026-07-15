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
    // 1. FETCH BOOKINGS FOR STUDENT
    if (method === 'GET') {
      const { uid, id, receipt_no } = req.query;

      if (receipt_no) {
        // Fetch booking by receipt_no pattern
        const bookingRes = await query('SELECT * FROM bookings WHERE receipt_url LIKE $1', [`%${receipt_no}%`]);
        if (bookingRes.rows.length === 0) {
          res.setHeader('Content-Type', 'text/html');
          return res.status(404).send('<body style="background:#0b0f19;color:#ff5555;font-family:sans-serif;text-align:center;padding:50px;"><h1>SECURE CHANNEL EXPIRED: RECEIPT NOT FOUND</h1></body>');
        }
        const b = bookingRes.rows[0];
        
        // Fetch user email/name for detail overlay
        const userRes = await query('SELECT email, name FROM users WHERE id = $1', [b.user_id]);
        const user = userRes.rows[0] || { email: 'operator@blackcypher.org', name: 'Standard Operator' };

        // Premium print-friendly cyberpunk receipt page
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>BLACK CYPHER - SECURE TRANSACTION INVOICE</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
            body {
              background-color: #05070f;
              color: #e2e8f0;
              font-family: 'Share Tech Mono', monospace;
              padding: 40px;
              margin: 0;
              display: flex;
              justify-content: center;
            }
            .invoice-box {
              width: 100%;
              max-width: 800px;
              background: #0b0f19;
              border: 1px solid #00f0ff;
              box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
              padding: 40px;
              border-radius: 12px;
              position: relative;
            }
            .invoice-box::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 4px;
              background: linear-gradient(90deg, #00f0ff, #7b2cbf);
              border-radius: 12px 12px 0 0;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-b: 1px solid rgba(0, 240, 255, 0.2);
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-family: 'Orbitron', sans-serif;
              font-size: 24px;
              font-weight: 900;
              color: #ffffff;
              letter-spacing: 2px;
            }
            .logo span {
              color: #00f0ff;
            }
            .invoice-title {
              font-family: 'Orbitron', sans-serif;
              text-align: right;
              color: #7b2cbf;
              font-weight: 700;
              letter-spacing: 1px;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 40px;
            }
            .detail-card {
              background: #02040a;
              border: 1px solid rgba(255, 255, 255, 0.05);
              padding: 20px;
              border-radius: 8px;
            }
            .card-title {
              color: #00f0ff;
              font-size: 14px;
              border-bottom: 1px solid rgba(0, 240, 255, 0.1);
              padding-bottom: 6px;
              margin-bottom: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .item-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            .item-table th {
              background: #02040a;
              color: #00f0ff;
              text-align: left;
              padding: 12px;
              font-size: 14px;
              text-transform: uppercase;
              border: 1px solid rgba(0, 240, 255, 0.1);
            }
            .item-table td {
              padding: 16px 12px;
              border: 1px solid rgba(255, 255, 255, 0.05);
              font-size: 14px;
            }
            .total-row {
              font-weight: bold;
              background: rgba(0, 240, 255, 0.05);
            }
            .total-row td {
              border-top: 2px solid #00f0ff;
            }
            .footer-note {
              text-align: center;
              font-size: 11px;
              color: #4a5568;
              margin-top: 40px;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
              padding-top: 20px;
            }
            .print-btn {
              display: inline-block;
              background: #00f0ff;
              color: #000000;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-family: 'Orbitron', sans-serif;
              font-weight: 700;
              text-transform: uppercase;
              font-size: 12px;
              margin-top: 20px;
              transition: all 0.3s;
            }
            .print-btn:hover {
              box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
              background: #33f3ff;
            }
            @media print {
              .print-btn { display: none; }
              body { background: white; color: black; padding: 0; }
              .invoice-box { border: 1px solid #ccc; box-shadow: none; background: white; color: black; }
              .invoice-box::before { display: none; }
              .detail-card { background: #f7fafc; border: 1px solid #e2e8f0; color: black; }
              .item-table th { background: #edf2f7; color: black; border: 1px solid #cbd5e0; }
              .item-table td { border: 1px solid #cbd5e0; color: black; }
              .logo, .logo span { color: black; }
              .card-title { color: black; border-bottom: 1px solid #cbd5e0; }
              .invoice-title { color: black; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div class="logo">BLACK<span>CYPHER</span></div>
              <div class="invoice-title">
                INVOICE RECEIPT<br/>
                <span style="font-size:12px;color:#a0aec0;">SECURED ENCRYPTED LEDGER</span>
              </div>
            </div>

            <div class="details-grid">
              <div class="detail-card">
                <div class="card-title">Billing Coordinates</div>
                <strong>Name:</strong> ${b.contact_name}<br/>
                <strong>Email:</strong> ${user.email}<br/>
                <strong>Phone:</strong> ${b.contact_phone}<br/>
                ${b.institute_name ? `<strong>Institution:</strong> ${b.institute_name}` : ''}
              </div>
              <div class="detail-card">
                <div class="card-title">Transaction Audit</div>
                <strong>Receipt Ref:</strong> ${receipt_no}<br/>
                <strong>Booking Date:</strong> ${b.booking_date ? new Date(b.booking_date).toLocaleDateString() : 'N/A'}<br/>
                <strong>Order Timestamp:</strong> ${new Date(b.created_at).toLocaleDateString()}<br/>
                <strong>Gate ID:</strong> BLKCYPH-TRAN-${b.id}
              </div>
            </div>

            <table class="item-table">
              <thead>
                <tr>
                  <th>Clearance Description</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th style="text-align:right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>${b.booking_type === 'session_school' ? 'Cybersecurity Institutional Workshop & Bootcamp' : 'Individual Advanced Operator Training Plan'}</strong><br/>
                    <span style="font-size:11px;color:#718096;">Includes live ethical hacking sessions, customized syllabus, verified certificates dual-branded by educational partners.</span>
                  </td>
                  <td>${b.booking_type === 'session_school' ? 'Institutional' : 'Individual'}</td>
                  <td>${b.plan_duration || '1 Month'}</td>
                  <td style="text-align:right;">₹${parseFloat(b.amount_paid).toLocaleString()} INR</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3" style="text-align:right;">TOTAL AMOUNT PAID (INR):</td>
                  <td style="text-align:right;color:#00f0ff;">₹${parseFloat(b.amount_paid).toLocaleString()} INR</td>
                </tr>
              </tbody>
            </table>

            <div style="text-align:right;">
              <button class="print-btn" onclick="window.print()">Print Secure Receipt</button>
            </div>

            <div class="footer-note">
              This receipt has been cryptographically generated and registered under Black Cypher security database records.<br/>
              Security Clearance: LEVEL 1 &bull; System Signature: SHA-256 Verified
            </div>
          </div>
        </body>
        </html>
        `;
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
      }

      if (id) {
        // Fetch specific booking for receipt display
        const bookingRes = await query('SELECT * FROM bookings WHERE id = $1', [id]);
        if (bookingRes.rows.length === 0) {
          return res.status(404).json({ error: 'Receipt not found.' });
        }
        return res.status(200).json(bookingRes.rows[0]);
      }

      if (!uid) {
        return res.status(400).json({ error: 'Missing uid parameter.' });
      }

      const bookingsRes = await query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC', [uid]);
      return res.status(200).json(bookingsRes.rows);
    }

    // 2. CREATE NEW SESSION BOOKING
    if (method === 'POST') {
      const { uid, booking_type, institute_name, contact_name, contact_phone, plan_duration, amount_paid, booking_date } = req.body;

      if (!uid || !booking_type || !contact_name || !contact_phone) {
        return res.status(400).json({ error: 'Missing required parameters.' });
      }

      // Generate random receipt file name
      const receiptNo = `BC-${Math.floor(Math.random() * 900000) + 100000}`;
      const receiptUrl = `/api/bookings?receipt_no=${receiptNo}`;

      // Insert booking record
      const insertQuery = `
        INSERT INTO bookings (user_id, booking_type, institute_name, contact_name, contact_phone, plan_duration, amount_paid, receipt_url, booking_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      const values = [
        uid,
        booking_type,
        institute_name ? encrypt(institute_name) : null,
        encrypt(contact_name),
        encrypt(contact_phone),
        plan_duration || null,
        amount_paid ? parseFloat(amount_paid) : 0.00,
        receiptUrl,
        booking_date || null
      ];

      const newBookingRes = await query(insertQuery, values);
      const newBooking = newBookingRes.rows[0];

      // If it is an individual training program, also update user's active subscription training plan
      if (booking_type === 'training_individual' || plan_duration) {
        const now = new Date();
        let expiryDays = 7;
        
        if (plan_duration === '1_month') expiryDays = 30;
        else if (plan_duration === '2_month') expiryDays = 60;
        else if (plan_duration === '3_month') expiryDays = 90;

        const trainingExpiry = new Date(now.setDate(now.getDate() + expiryDays)).toISOString();

        // Check if subscription exists, insert or update
        const subExists = await query('SELECT id FROM subscriptions WHERE user_id = $1', [uid]);
        if (subExists.rows.length > 0) {
          await query(
            'UPDATE subscriptions SET active_training_plan = $2, training_plan_expiry = $3 WHERE user_id = $1',
            [uid, plan_duration, trainingExpiry]
          );
        } else {
          await query(
            'INSERT INTO subscriptions (user_id, tier, active_training_plan, training_plan_expiry) VALUES ($1, $2, $3, $4)',
            [uid, 'pro', plan_duration, trainingExpiry]
          );
        }
      }

      return res.status(201).json({ success: true, booking: newBooking, receipt_url: receiptUrl });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err: any) {
    console.error('Bookings API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
