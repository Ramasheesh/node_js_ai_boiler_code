import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import { checkDatabaseHealth } from '../database/health-check.js';
import { env } from '../config/env.js';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Full health check with DB status
 *     security: []
 *     responses:
 *       200:
 *         description: Service healthy
 *       503:
 *         description: Service degraded
 */
router.get('/health', async (_req, res) => {
  const dbHealth = await checkDatabaseHealth();
  const status = dbHealth.status === 'healthy' ? 200 : 503;

  res.status(status).json({
    status: dbHealth.status === 'healthy' ? 'ok' : 'degraded',
    version: env.API_VERSION,
    environment: env.NODE_ENV,
    database: dbHealth,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @openapi
 * /health/live:
 *   get:
 *     tags: [Health]
 *     summary: Liveness probe — is the process alive?
 *     security: []
 *     responses:
 *       200:
 *         description: Alive
 */
router.get('/health/live', (_req, res) => {
  res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
});

/**
 * @openapi
 * /health/ready:
 *   get:
 *     tags: [Health]
 *     summary: Readiness probe — is the service ready to accept traffic?
 *     security: []
 *     responses:
 *       200:
 *         description: Ready
 *       503:
 *         description: Not ready
 */
router.get('/health/ready', async (_req, res) => {
  const dbHealth = await checkDatabaseHealth();
  if (dbHealth.status === 'unhealthy') {
    res
      .status(503)
      .json({ status: 'not ready', database: dbHealth, timestamp: new Date().toISOString() });
    return;
  }
  res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
});

// Feature routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
