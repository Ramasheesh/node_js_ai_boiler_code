import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase, disconnectDatabase } from './database/prisma.js';
import { connectRedis, disconnectRedis } from './config/redis.js';

async function bootstrap(): Promise<void> {
  // Connect dependencies first
  await connectDatabase();
  await connectRedis();

  const app = createApp();
  const server = http.createServer(app);

  // HTTP keep-alive and timeout configuration
  server.keepAliveTimeout = 65_000; // slightly above ALB's 60s
  server.headersTimeout = 66_000;
  server.timeout = 30_000; // 30s request timeout

  server.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT, env: env.NODE_ENV, version: env.API_VERSION },
      `🚀 Server running on port ${env.PORT}`,
    );
    if (env.NODE_ENV !== 'production') {
      logger.info(`📚 Swagger UI: http://localhost:${env.PORT}/api-docs`);
      logger.info(`🔗 Health: http://localhost:${env.PORT}/api/${env.API_VERSION}/health`);
    }
  });

  // ─── Graceful Shutdown ───────────────────────────────────────
  async function shutdown(signal: string): Promise<void> {
    logger.info(`${signal} received — starting graceful shutdown`);

    server.close(async (err) => {
      if (err) {
        logger.error({ err }, 'Error closing HTTP server');
      }
      try {
        await disconnectDatabase();
        await disconnectRedis();
        logger.info('Graceful shutdown complete ✓');
        process.exit(0);
      } catch (shutdownErr) {
        logger.error({ err: shutdownErr }, 'Error during resource cleanup');
        process.exit(1);
      }
    });

    // Force exit after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  }

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  // ─── Fatal Error Handlers ────────────────────────────────────
  process.on('uncaughtException', (err) => {
    logger.fatal({ err }, 'Uncaught exception — shutting down');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.fatal({ reason }, 'Unhandled promise rejection — shutting down');
    process.exit(1);
  });
}

void bootstrap();
