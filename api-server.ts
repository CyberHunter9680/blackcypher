import express from 'express';
import cors from 'cors';
import { initDatabase } from './api/_handlers/db.js';
import handler from './api/index.js';

// Automatically initialize database schema on startup
await initDatabase();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Delegate local API routing to the unified handler
app.all('/api/:route', async (req, res) => {
  try {
    await handler(req as any, res as any);
  } catch (error: any) {
    console.error(`Local API handler failed:`, error.message);
    res.status(500).json({ error: `API request failed.`, details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Local Vercel Serverless API Server running at http://localhost:${PORT}`);
});
