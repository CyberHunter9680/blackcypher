import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not set in .env file!');
  process.exit(1);
}

const { Client } = pg;

const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

async function seedDatabase() {
  try {
    console.log('Connecting to Neon PostgreSQL for database reset...');
    await client.connect();
    console.log('Connected successfully!');

    // Truncate all tables cascaded to remove dummy data, and restart sequence IDs
    console.log('Purging dummy data from Neon database...');
    await client.query(
      `TRUNCATE progress, task_submissions, bookings, lessons, courses, books, tasks, meetings, blogs, partners RESTART IDENTITY CASCADE`
    );
    console.log('Dummy data successfully purged.');

    // Seed default Admin User (Firebase Mock UID 'mock-admin-888')
    console.log('Seeding root administrator account...');
    const adminUser = await client.query(
      `INSERT INTO users (id, email, phone, name, role, qualification, age, gender, xp, level)
       VALUES ('mock-admin-888', 'admin@blackcypher.org', '+919999999999', 'Cypher Command Admin', 'admin', 'CISO / Security Director', 32, 'male', 99999, 99)
       ON CONFLICT (id) DO UPDATE SET role = 'admin'
       RETURNING *`
    );
    console.log('Admin account set:', adminUser.rows[0].email);

    console.log('Seeding Pro subscription tier for administrator...');
    await client.query(
      `INSERT INTO subscriptions (user_id, tier, active_training_plan)
       VALUES ('mock-admin-888', 'pro', 'none')
       ON CONFLICT DO NOTHING`
    );
    console.log('Root administrator subscription activated.');

    console.log('Database successfully reset to a clean state!');
  } catch (err) {
    console.error('Error during database reset/seeding:', err);
  } finally {
    await client.end();
  }
}

seedDatabase();
