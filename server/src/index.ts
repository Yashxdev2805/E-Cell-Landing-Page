import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { portalRouter } from './routes/portalRoutes.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { OutboxWorker } from './services/outboxWorker.js';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', true);

// ── Security & Headers ──
app.use(
  helmet({
    contentSecurityPolicy: false, // Served as API
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

app.use(
  cors({
    origin: ['http://localhost:5174', 'http://127.0.0.1:5174', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'cf-turnstile-response'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-Cache-Lookup'],
    credentials: true,
  })
);

app.use(compression());
app.use(express.json({ limit: '32kb' }));
app.use(generalLimiter);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Health & Diagnostics ──
app.get('/health', (_req, res) => {
  res.json({
    service: 'E-Cell UIET KUK Enterprise Hub API',
    version: '2.0.0',
    status: 'OPERATIONAL',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'HEALTHY',
    shards: 10,
    timestamp: new Date().toISOString(),
  });
});

// ── Mount Portal Routes ──
app.use('/api/portal', portalRouter);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({
    error: `Endpoint '${req.method} ${req.originalUrl}' not found.`,
  });
});

// ── Server Listen & Outbox Initialization ──
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 [E-CellHubServer] Listening on http://127.0.0.1:${PORT}`);
    // Start background outbox processor
    OutboxWorker.start(5000);
  });
}

export default app;
