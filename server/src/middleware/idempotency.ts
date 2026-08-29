import type { Request, Response, NextFunction } from 'express';
import { db } from '../services/firebase.js';

const memoryIdempotency = new Map<string, { statusCode: number; body: any; expireAt: number }>();

export function idempotencyMiddleware(ttlSeconds = 300) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = req.header('Idempotency-Key');
    if (!key || req.method !== 'POST') {
      return next();
    }

    const now = Date.now();

    // 1. Check Persistent Firestore Collection if available
    if (db) {
      try {
        const docRef = db.collection('idempotency_keys').doc(key);
        const snap = await docRef.get();

        if (snap.exists) {
          const cached = snap.data()!;
          if (new Date(cached.expireAt).getTime() > now) {
            res.setHeader('X-Cache-Lookup', 'HIT_CLUSTER_IDEMPOTENT');
            res.status(cached.statusCode).json(cached.body);
            return;
          }
        }
      } catch (err: any) {
        console.warn('⚠️ [Idempotency] Firestore check failed, falling back to local:', err?.message);
      }
    } else {
      const cached = memoryIdempotency.get(key);
      if (cached && cached.expireAt > now) {
        res.setHeader('X-Cache-Lookup', 'HIT_LOCAL_IDEMPOTENT');
        res.status(cached.statusCode).json(cached.body);
        return;
      }
    }

    // Intercept response
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      const statusCode = res.statusCode || 200;
      const expireDate = new Date(now + ttlSeconds * 1000).toISOString();

      if (statusCode >= 200 && statusCode < 300) {
        if (db) {
          db.collection('idempotency_keys')
            .doc(key)
            .set({
              key,
              statusCode,
              body,
              createdAt: new Date().toISOString(),
              expireAt: expireDate,
            })
            .catch(() => {});
        } else {
          memoryIdempotency.set(key, {
            statusCode,
            body,
            expireAt: now + ttlSeconds * 1000,
          });
        }
      }

      return originalJson(body);
    };

    next();
  };
}
