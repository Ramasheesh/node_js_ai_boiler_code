import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { TooManyRequestsError } from '../shared/errors/index.js';

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError('Rate limit exceeded. Please try again later.'));
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 auth attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError('Too many authentication attempts. Please try again later.'));
  },
});
