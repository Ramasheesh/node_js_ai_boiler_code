import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../../src/app.js';
import type { Application } from 'express';

let app: Application;

// Create app once for all health tests
app = createApp();

describe('Health endpoints', () => {
  it('GET /api/v1/health/live — should return 200 with alive status', async () => {
    const res = await supertest(app).get('/api/v1/health/live');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('alive');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/v1/health — should return health object with database field', async () => {
    const res = await supertest(app).get('/api/v1/health');
    // DB may be unavailable in CI — allow 200 or 503
    expect([200, 503]).toContain(res.status);
    expect(res.body.database).toBeDefined();
    expect(res.body.database.status).toMatch(/^(healthy|unhealthy)$/);
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.environment).toBe('test');
  });

  it('GET /api/v1/health/ready — should return ready or not-ready', async () => {
    const res = await supertest(app).get('/api/v1/health/ready');
    expect([200, 503]).toContain(res.status);
    expect(res.body.timestamp).toBeDefined();
  });
});
