import { prisma } from './prisma.js';

export interface DatabaseHealthResult {
  status: 'healthy' | 'unhealthy';
  latencyMs?: number;
  error?: string;
}

export async function checkDatabaseHealth(): Promise<DatabaseHealthResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'healthy',
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err instanceof Error ? err.message : 'Unknown database error',
    };
  }
}
