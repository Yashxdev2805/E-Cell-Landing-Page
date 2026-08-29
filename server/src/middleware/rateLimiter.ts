import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
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
  windowMs: 60 * 1000, // 1 minute
  max: 40,
  message: {
    error: 'Application tracking rate limit exceeded. Please wait 1 minute before searching again.',
  },
});

export const submitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    error: 'Submission rate limit exceeded. Please wait before submitting again.',
  },
});
