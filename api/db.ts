import pg from 'pg';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { decrypt } from './security.js';

dotenv.config();

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

// Determine if we should use PostgreSQL or SQLite
const usePostgres = !!(databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')));

let pool: any = null;
let sqliteDb: sqlite3.Database | null = null;
let initialized = false;

function initializeDb() {
  if (initialized) return;
  
  if (usePostgres) {
    console.log('🔌 Database: Initializing PostgreSQL Connection Pool...');
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  } else {
    console.log('🔌 Database: PostgreSQL not configured. Initializing local SQLite database...');
    
    let dbDir = path.join(process.cwd(), 'api', 'data');
    try {
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
    } catch (err) {
      console.warn('⚠️ Unable to write to api/data. Falling back to /tmp/data directory for SQLite...');
      dbDir = path.join('/tmp', 'data');
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
    }
    
    const sqlitePath = path.join(dbDir, 'blackcypher.sqlite');
    
    sqliteDb = new sqlite3.Database(sqlitePath, (err) => {
      if (err) {
        console.error('❌ SQLite connection error:', err);
      } else {
        console.log('🚀 SQLite connected successfully at:', sqlitePath);
        // Enforce foreign key constraints
        sqliteDb?.run('PRAGMA foreign_keys = ON;', (pragmaErr) => {
          if (pragmaErr) {
            console.error('❌ Failed to enable SQLite PRAGMA foreign_keys:', pragmaErr);
          }
        });
      }
    });
  }
  initialized = true;
}

/**
 * Translates PostgreSQL parameterized queries (e.g. $1, $2) to SQLite format (?)
 * and aligns the parameters in order of their appearance in the query.
 * Also translates PostgreSQL-specific syntax to SQLite equivalents.
 */
function translatePostgresToSqlite(sql: string, params?: any[]): { sql: string; params: any[] } {
  // Translate ON CONFLICT ... DO NOTHING → INSERT OR IGNORE
  let translatedSql = sql.replace(
    /INSERT\s+INTO/gi,
    (match) => {
      if (/ON\s+CONFLICT\s+.*DO\s+NOTHING/i.test(sql)) {
        return 'INSERT OR IGNORE INTO';
      }
      return match;
    }
  );
  // Remove the ON CONFLICT ... DO NOTHING clause entirely (SQLite uses OR IGNORE instead)
  translatedSql = translatedSql.replace(/\s+ON\s+CONFLICT\s+\([^)]*\)\s+DO\s+NOTHING/gi, '');
  translatedSql = translatedSql.replace(/\s+ON\s+CONFLICT\s+DO\s+NOTHING/gi, '');

  if (!params || params.length === 0) {
    return { sql: translatedSql, params: [] };
  }

  const placeholderRegex = /\$(\d+)/g;
  const matches = [...translatedSql.matchAll(placeholderRegex)];
  
  if (matches.length === 0) {
    return { sql: translatedSql, params };
  }

  const newParams: any[] = [];
  const reorderedSql = translatedSql.replace(placeholderRegex, (match, numStr) => {
    const index = parseInt(numStr, 10) - 1;
    newParams.push(params[index]);
    return '?';
  });

  return { sql: reorderedSql, params: newParams };
}


/**
 * Post-processes row data to automatically decrypt any GCM-encrypted columns
 */
function decryptRows(rows: any[]): any[] {
  if (!rows || !Array.isArray(rows)) return rows;
  
  return rows.map(row => {
    if (!row || typeof row !== 'object') return row;
    
    const decryptedRow = { ...row };
    for (const key of Object.keys(decryptedRow)) {
      const val = decryptedRow[key];
      if (typeof val === 'string') {
        decryptedRow[key] = decrypt(val);
      }
    }
    return decryptedRow;
  });
}

/**
 * Unified query runner that works with Postgres and SQLite
 */
export async function query(text: string, params?: any[]) {
  initializeDb();
  const start = Date.now();
  
  if (usePostgres) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed PG query', { duration, rows: res.rowCount });
      return {
        rows: decryptRows(res.rows),
        rowCount: res.rowCount,
        command: res.command,
        oid: res.oid,
        fields: res.fields
      };
    } catch (error) {
      console.error('❌ PostgreSQL query failed:', error);
      throw error;
    }
  } else {
    // SQLite driver execution
    return new Promise<{ rows: any[]; rowCount: number }>((resolve, reject) => {
      const translated = translatePostgresToSqlite(text, params);
      
      sqliteDb!.all(translated.sql, translated.params, (err, rows) => {
        const duration = Date.now() - start;
        if (err) {
          console.error('❌ SQLite query failed:', { sql: translated.sql, error: err.message });
          reject(err);
        } else {
          const decrypted = decryptRows(rows || []);
          resolve({
            rows: decrypted,
            rowCount: decrypted.length
          });
        }
      });
    });
  }
}

/**
 * Seed default cybersecurity courses, lessons, books, blogs, and meetings if the database is brand new.
 */
async function seedDefaultData() {
  try {
    const coursesCount = await query('SELECT COUNT(*) as count FROM courses');
    const count = parseInt(coursesCount.rows[0]?.count || '0', 10);
    
    if (count === 0) {
      console.log('🌱 Database: Empty database detected. Seeding default training and intel data...');
      
      // Seed default admin user ('mock-admin-888')
      await query(`
        INSERT INTO users (id, email, phone, name, role, qualification, age, gender, xp, level, dob)
        VALUES ('mock-admin-888', 'admin@blackcypher.org', '+919999999999', 'Cypher Command Admin', 'admin', 'CISO / Security Director', 32, 'male', 99999, 99, '1994-01-01')
        ON CONFLICT (id) DO NOTHING
      `);
      
      // Seed admin subscription
      await query(`
        INSERT INTO subscriptions (id, user_id, tier, active_training_plan)
        VALUES (1, 'mock-admin-888', 'pro', 'none')
        ON CONFLICT (id) DO NOTHING
      `);
      
      // Seed courses
      await query(`
        INSERT INTO courses (id, title, description, category, level, xp_reward, thumbnail, duration, is_free) VALUES
        (1, 'Offensive Security Fundamentals', 'Master the art of ethical hacking and penetration testing with hands-on labs and real-world scenarios.', 'Offensive Security', 'intermediate', 2500, '', '40h', true),
        (2, 'Cloud Security Architecture', 'Design and implement secure cloud infrastructure across AWS, Azure, and GCP.', 'Cloud Security', 'advanced', 2000, '', '35h', false),
        (3, 'Network Defense & SOC Operations', 'Learn to detect, respond to, and prevent cyber threats in enterprise environments.', 'Defense', 'intermediate', 1800, '', '30h', true)
        ON CONFLICT (id) DO NOTHING
      `);
      
      // Seed lessons
      await query(`
        INSERT INTO lessons (id, course_id, title, video_url, duration, order_no, is_free) VALUES
        (1, 1, 'Introduction to Recon', 'https://www.w3schools.com/html/mov_bbb.mp4', '12m', 1, true),
        (2, 1, 'Passive Information Gathering', 'https://www.w3schools.com/html/mov_bbb.mp4', '18m', 2, true),
        (3, 1, 'Active Enumeration Techniques', 'https://www.w3schools.com/html/mov_bbb.mp4', '25m', 3, false),
        (4, 1, 'OSINT Tools Deep Dive', 'https://www.w3schools.com/html/mov_bbb.mp4', '20m', 4, false),
        (5, 2, 'Introduction to IAM & Cloud Misconfigs', 'https://www.w3schools.com/html/mov_bbb.mp4', '15m', 1, true),
        (6, 2, 'AWS S3 Bucket Exploitation', 'https://www.w3schools.com/html/mov_bbb.mp4', '22m', 2, false),
        (7, 2, 'Cloud Persistence Vectors', 'https://www.w3schools.com/html/mov_bbb.mp4', '18m', 3, false),
        (8, 3, 'SIEM and Log Auditing Basics', 'https://www.w3schools.com/html/mov_bbb.mp4', '14m', 1, true),
        (9, 3, 'Detecting Port Scanning & Intrusion', 'https://www.w3schools.com/html/mov_bbb.mp4', '20m', 2, false),
        (10, 3, 'Threat Intelligence Reporting', 'https://www.w3schools.com/html/mov_bbb.mp4', '17m', 3, false)
        ON CONFLICT (id) DO NOTHING
      `);
      
      // Seed books
      await query(`
        INSERT INTO books (id, title, author, description, pdf_url, is_free) VALUES
        (1, 'Practical Malware Analysis', 'Michael Sikorski', 'The hands-on guide to dissecting malicious software.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', true),
        (2, 'The Web Application Hackers Handbook', 'Dafydd Stuttard', 'Discovering and exploiting security flaws in web applications.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', false)
        ON CONFLICT (id) DO NOTHING
      `);
      
      // Seed blogs
      await query(`
        INSERT INTO blogs (id, title, content, author) VALUES
        (1, 'Defeating GCM Cryptography Flaws', 'In this advisory, we look at GCM authentication tags and how to properly validate them in custom Node.js and Express backend security microservices.', 'Cypher Command'),
        (2, 'The Rise of Hinglish Social Engineering', 'A case study of localized phishing templates targeting enterprise organizations in South Asia, including Hinglish language nuances.', 'Alex Mercer')
        ON CONFLICT (id) DO NOTHING
      `);
      
      // Seed meetings
      await query(`
        INSERT INTO meetings (id, title, meet_url, date_time, active) VALUES
        (1, 'Saturday Doubt Clearing & Exploit Debugging', 'https://meet.google.com/abc-defg-hij', '2026-07-04 10:00:00+05:30', true)
        ON CONFLICT (id) DO NOTHING
      `);
      
      // Seed forum posts
      await query(`
        INSERT INTO forum_posts (id, title, content, category, user_id, author_name, author_avatar, likes) VALUES
        (1, 'Buffer Overflow Exploitation in CEH v13 labs', 'Can anyone explain the payload alignment for the target host in lab 4? I keep getting partial registers overwritten but no system shell pop.', 'Lab Help', 'mock-admin-888', 'Cypher Command Admin', '', 5),
        (2, 'Latest Zero-Day in Core VPN Protocols', 'We are observing active scanning targeting port 500/udp on custom VPN gateways. Ensure security updates are applied immediately.', 'General', 'mock-admin-888', 'Cypher Command Admin', '', 12)
        ON CONFLICT (id) DO NOTHING
      `);
 
      // Seed forum comments
      await query(`
        INSERT INTO forum_comments (id, post_id, content, user_id, author_name, author_avatar) VALUES
        (1, 1, 'Try checking the NOP sled size. Sometimes the sandbox environment shifts the stack pointer slightly. EIP offset is exactly 76 bytes.', 'mock-admin-888', 'Cypher Command Admin', '')
        ON CONFLICT (id) DO NOTHING
      `);
 
      // Seed default real notifications
      await query(`
        INSERT INTO notifications (id, type, title, message, target_user_id) VALUES
        (1, 'course', 'New Course Available', 'CEH v13 Advanced Modules are now live on your dashboard!', NULL),
        (2, 'update', 'Platform Update', 'Enhanced dashboard, new certificate design, and improved chatbot deployed.', NULL),
        (3, 'alert', 'Session Reminder', 'Your Saturday doubt session is scheduled for this weekend. Check your dashboard!', NULL)
        ON CONFLICT (id) DO NOTHING
      `);
      
      console.log('✅ Database: Default data successfully seeded!');
    }
  } catch (error) {
    console.error('❌ Database: Seeding failed:', error);
  }
}

/**
 * Initializes/Migrates the database structure automatically on startup
 */
export async function initDatabase() {
  initializeDb();
  try {
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.warn(`⚠️ Warning: Schema file not found at ${schemaPath}. Skipping schema initialization.`);
      return;
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    if (usePostgres) {
      console.log('⚙️ Database: Running PostgreSQL migrations...');
      const client = await pool.connect();
      try {
        await client.query(schemaSql);
        console.log('✅ PostgreSQL database tables created/verified successfully!');
      } finally {
        client.release();
      }
    } else {
      console.log('⚙️ Database: Running SQLite migrations...');
      const translatedSchemaSql = schemaSql
        .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/TIMESTAMP WITH TIME ZONE/gi, 'TIMESTAMP');

      await new Promise<void>((resolve, reject) => {
        sqliteDb!.exec(translatedSchemaSql, (err) => {
          if (err) {
            console.error('❌ Failed to run SQLite schema migrations:', err);
            reject(err);
          } else {
            console.log('✅ SQLite database tables created/verified successfully!');
            resolve();
          }
        });
      });
    }

    // Auto-seed database with initial roadmap nodes if empty
    await seedDefaultData();

    // Ensure discriminator column exists
    try {
      await query('ALTER TABLE users ADD COLUMN discriminator VARCHAR(10)');
      console.log('✅ Checked/Added discriminator column to users table.');
    } catch (e) {
      // Column probably already exists, safe to ignore
    }
  } catch (error) {
    console.error('❌ Database migration/initialization failed:', error);
  }
}
