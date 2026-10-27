import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import './config/env';
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { connectDB } from './config/db';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// CORS configuration for local development and production
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? true : corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Payload limit to support photo uploads and event briefs
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Directories
const UPLOADS_DIR = path.resolve(__dirname, '../frontend/public/uploads');
const PUBLIC_DIR = path.resolve(__dirname, '../frontend/public');
const DIST_DIR = path.resolve(__dirname, '../frontend/dist');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded images and static public brand assets
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(PUBLIC_DIR));

// Mount Central API Router
app.use('/api', apiRouter);

// Global Error Handler for API errors
app.use(errorHandler);

// Vite Integration & Static Frontend Serving
async function startServer() {
  // Connect to MongoDB Atlas (or graceful local fallback if URI is not yet configured)
  await connectDB();

  if (!isProduction) {
    // In dev mode, mount Vite middleware for instant hot-reload
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: path.resolve(__dirname, '../frontend'),
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built frontend assets
    app.use(express.static(DIST_DIR));
    app.use('/src', express.static(path.resolve(__dirname, '../frontend/src')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`  🚀 Movement Craft Server running at http://localhost:${PORT}`);
    console.log(`  📁 Mode: ${isProduction ? 'Production' : 'Development (Vite Live Middleware)'}`);
    console.log(`  🌐 Public Website: http://localhost:${PORT}`);
    console.log(`  ⚙️  API Endpoint:   http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

export { app, startServer };

// Auto-start server if executed directly and not in test mode
const isMain = process.argv[1] && fileURLToPath(import.meta.url).replace(/\\/g, '/') === process.argv[1].replace(/\\/g, '/');
if (process.env.NODE_ENV !== 'test' && (isMain || !process.env.NODE_ENV)) {
  startServer().catch((err) => {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  });
}

export default app;
