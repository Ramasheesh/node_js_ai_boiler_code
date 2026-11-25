import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { logger } from './config/logger.js';
import { swaggerSpec } from './config/swagger.js';
import { globalRateLimiter } from './middleware/rate-limiter.js';
import { requestId } from './middleware/request-id.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import apiRoutes from './routes/index.js';

export function createApp(): Application {
  const app = express();

  // Trust proxy for accurate IP in rate limiting / logging
  app.set('trust proxy', 1);

  // Security headers
  app.use(helmet());

  // CORS
  app.use(cors(corsOptions));

  // Compression
  app.use(compression());

  // Request ID must come first (before logging)
  app.use(requestId);

  // Structured HTTP logging
  app.use(
    pinoHttp({
      logger,
      customLogLevel: (_req, res) => {
        if (res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
      redact: ['req.headers.authorization', 'req.headers.cookie'],
      genReqId: (req) => req.requestId as string,
    }),
  );

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Global rate limiter
  app.use(globalRateLimiter);

  // API documentation (dev/staging only)
  if (env.NODE_ENV !== 'production') {
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customSiteTitle: 'Backend Boilerplate API',
      }),
    );
    app.get('/api-docs.json', (_req, res) => {
      res.json(swaggerSpec);
    });
  }

  // Versioned API routes
  app.use(`/api/${env.API_VERSION}`, apiRoutes);

  // 404 handler
  app.use(notFound);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
