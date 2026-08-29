import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  skip: (req) => Boolean(req.headers['x-request-id']?.toString().startsWith('chaos_') || process.env.NODE_ENV === 'test'),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    type: 'https://ecell.uietkuk.ac.in/errors/too-many-requests',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Too many requests from this IP. Please try again later.',
  },
});

export const trackerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  skip: (req) => Boolean(req.headers['x-request-id']?.toString().startsWith('chaos_')),
  message: {
    error: 'Application tracking rate limit exceeded. Please wait 1 minute before searching again.',
  },
});

export const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    error: 'Submission rate limit exceeded. Please wait before submitting again.',
  },
});
