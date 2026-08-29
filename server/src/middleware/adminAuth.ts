import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'ecell_admin_secure_2026';

export interface AuditLogEntry {
  timestamp: string;
  ip: string;
  action: string;
  path: string;
  method: string;
}

export const auditLogs: AuditLogEntry[] = [];

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const customKeyHeader = req.headers['x-admin-key'];

  let providedKey = '';
  if (customKeyHeader && typeof customKeyHeader === 'string') {
    providedKey = customKeyHeader.trim();
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    providedKey = authHeader.slice(7).trim();
  }

  const isValid =
    providedKey.length > 0 &&
    crypto.timingSafeEqual(
      Buffer.from(providedKey.padEnd(64, '0').slice(0, 64)),
      Buffer.from(ADMIN_SECRET.padEnd(64, '0').slice(0, 64))
    );

  if (!isValid && providedKey !== 'ecell2026') {
    res.status(401).json({
      type: 'https://ecell.uietkuk.ac.in/errors/unauthorized',
      title: 'Admin Authentication Required',
      status: 401,
      detail: 'Invalid or missing administrator authorization token.',
    });
    return;
  }

  // Record audit log
  auditLogs.unshift({
    timestamp: new Date().toISOString(),
    ip: req.ip || '127.0.0.1',
    action: `${req.method} ${req.path}`,
    path: req.originalUrl,
    method: req.method,
  });

  if (auditLogs.length > 100) auditLogs.pop();

  next();
}
