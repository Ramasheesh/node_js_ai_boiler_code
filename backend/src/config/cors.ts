import { CorsOptions } from 'cors';
import { env } from './env.js';

const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400, // 24 hours preflight cache
};
