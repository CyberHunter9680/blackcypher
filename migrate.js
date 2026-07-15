import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function runMigration() {
  try {
    console.log('Connecting to Neon PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log(`Reading SQL schema from ${schemaPath}...`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema queries...');
    await client.query(schemaSql);
    console.log('Database tables migrated successfully!');

    // Add default admin user if not present (Firebase UID can be setup or added later, let's add a placeholder)
    console.log('Migration completed.');
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await client.end();
  }
}

runMigration();
