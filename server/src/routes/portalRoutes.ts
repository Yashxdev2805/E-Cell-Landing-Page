import { Router, type Request, type Response } from 'express';
import { ShardedCounterService } from '../services/shardedCounterService.js';
import { FirestoreStore } from '../services/firestoreStore.js';
import { JoinApplicationSchema, ContactMessageSchema } from '../schemas/portalSchemas.js';
import { turnstileMiddleware } from '../middleware/turnstile.js';
import { idempotencyMiddleware } from '../middleware/idempotency.js';
import { trackerLimiter, submitLimiter } from '../middleware/rateLimiter.js';

export const portalRouter = Router();

// ── GET /api/portal/stats (Aggregated Sharded Telemetry) ──
portalRouter.get('/stats', async (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
  const stats = await ShardedCounterService.getAggregatedStats();
  res.json({
    success: true,
    data: stats,
  });
});

// ── GET /api/portal/track/:refId (Prefix-Aware Unified Tracker) ──
portalRouter.get('/track/:refId', trackerLimiter, async (req: Request, res: Response): Promise<void> => {
  const rawParam = req.params.refId;
  const refId = Array.isArray(rawParam) ? rawParam[0] : String(rawParam || '').trim();
  if (!refId || refId.length < 3) {
    res.status(400).json({ error: 'Valid Reference ID or Registration Code is required' });
    return;
  }

  const record = await FirestoreStore.trackApplication(refId);
  if (!record) {
    res.status(404).json({
      success: false,
      error: 'No application or pitch registration found matching this code.',
      hint: 'Please check your registration code (e.g. EC26-XXXXX for Pitch Arena or EC-2026-XXXX-NN for Council Join).',
    });
    return;
  }

  res.json({
    success: true,
    data: record,
  });
});

// ── POST /api/portal/join (Recruitment Application Ingest) ──
portalRouter.post(
  '/join',
  submitLimiter,
  idempotencyMiddleware(300),
  turnstileMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const parseResult = JoinApplicationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        type: 'https://ecell.uietkuk.ac.in/errors/validation-error',
        title: 'Validation Error',
        status: 400,
        errors: parseResult.error.format(),
      });
      return;
    }

    try {
      const { refId, record } = await FirestoreStore.submitJoinApplication(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Your council recruitment application has been submitted successfully!',
        refId,
        data: {
          refId: record.refId,
          fullName: record.fullName,
          domain: record.domain,
          branch: record.branch,
          submittedAt: record.createdAt,
        },
      });
    } catch (err: any) {
      console.error('❌ [JoinRoute] Submission error:', err?.message || err);
      res.status(409).json({
        success: false,
        error: err?.message || 'Application submission conflict.',
      });
    }
  }
);

// ── POST /api/portal/contact (General & Sponsor Inquiries) ──
portalRouter.post(
  '/contact',
  submitLimiter,
  idempotencyMiddleware(300),
  turnstileMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const parseResult = ContactMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        type: 'https://ecell.uietkuk.ac.in/errors/validation-error',
        title: 'Validation Error',
        status: 400,
        errors: parseResult.error.format(),
      });
      return;
    }

    try {
      const { id } = await FirestoreStore.submitContactMessage(parseResult.data);
      res.status(201).json({
        success: true,
        message: 'Thank you for reaching out! Our executive coordinators have received your inquiry and will reply shortly.',
        inquiryId: id,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record contact inquiry.' });
    }
  }
);
