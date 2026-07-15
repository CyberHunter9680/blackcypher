import express from 'express';
import cors from 'cors';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { initDatabase } from './api/db.js';

// Automatically initialize database schema on startup
await initDatabase();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamically route /api/:function to their handlers in api/
const routeApi = async (name: string, req: express.Request, res: express.Response) => {
  try {
    const filePath = join(process.cwd(), 'api', `${name}.ts`);
    const fileUrl = pathToFileURL(filePath).href;
    const module = await import(fileUrl);
    const handler = module.default;
    
    if (typeof handler === 'function') {
      await handler(req, res);
    } else {
      res.status(500).json({ error: `Handler for /api/${name} is not a default export function.` });
    }
  } catch (error: any) {
    console.error(`Error executing /api/${name}:`, error.message);
    res.status(500).json({ error: `API route /api/${name} failed.`, details: error.message });
  }
};

app.all('/api/:route', (req, res) => {
  routeApi(req.params.route, req as any, res as any);
});


app.listen(PORT, () => {
  console.log(`🚀 Local Vercel Serverless API Server running at http://localhost:${PORT}`);
});
