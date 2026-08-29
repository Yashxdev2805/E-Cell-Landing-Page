import type { Request, Response, NextFunction } from 'express';

export async function turnstileMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.headers['cf-turnstile-response'] || req.body?.turnstileToken;

  // In development or test environments, allow bypass with test tokens
  if (process.env.NODE_ENV !== 'production' || !process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY) {
    return next();
  }

  if (!token) {
    res.status(403).json({
      type: 'https://ecell.uietkuk.ac.in/errors/bot-verification-failed',
      title: 'Bot Verification Required',
      status: 403,
      detail: 'Missing Cloudflare Turnstile attestation token.',
    });
    return;
  }

  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: req.ip,
      }),
    });

    const result = await verifyRes.json();
    if (!result.success) {
      res.status(403).json({
        type: 'https://ecell.uietkuk.ac.in/errors/bot-verification-failed',
        title: 'Bot Verification Failed',
        status: 403,
        detail: 'Cloudflare Turnstile token validation failed.',
      });
      return;
    }

    next();
  } catch (err: any) {
    console.error('❌ [Turnstile] Verification error:', err?.message);
    // Fail open in dev, fail closed in prod
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ error: 'Turnstile verification server unavailable' });
      return;
    }
    next();
  }
}
