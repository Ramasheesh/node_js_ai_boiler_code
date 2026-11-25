import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../../src/app.js';
import type { Application } from 'express';

const app: Application = createApp();

describe('Auth — input validation', () => {
  it('POST /auth/register — should return 400 for invalid email', async () => {
    const res = await supertest(app).post('/api/v1/auth/register').send({
      email: 'not-an-email',
      username: 'testuser',
      password: 'Password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('POST /auth/register — should return 400 for weak password', async () => {
    const res = await supertest(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
      username: 'testuser',
      password: 'weak',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('POST /auth/register — should return 400 for short username', async () => {
    const res = await supertest(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
      username: 'ab',
      password: 'Password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /auth/login — should return 400 for missing password', async () => {
    const res = await supertest(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('POST /auth/login — should return 400 for invalid email', async () => {
    const res = await supertest(app)
      .post('/api/v1/auth/login')
      .send({ email: 'invalid', password: 'pass' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /auth/refresh — should return 400 for missing refreshToken', async () => {
    const res = await supertest(app).post('/api/v1/auth/refresh').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('Auth — authentication required', () => {
  it('GET /auth/me — should return 401 without token', async () => {
    const res = await supertest(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('GET /auth/me — should return 401 with malformed token', async () => {
    const res = await supertest(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer malformed.token.here');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /auth/me — should return 401 with wrong scheme', async () => {
    const res = await supertest(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Basic dXNlcjpwYXNz');
    expect(res.status).toBe(401);
  });
});

describe('Auth — response format', () => {
  it('error responses should include timestamp', async () => {
    const res = await supertest(app)
      .post('/api/v1/auth/login')
      .send({ email: '', password: '' });
    expect(res.body.timestamp).toBeDefined();
  });

  it('error responses should have success: false', async () => {
    const res = await supertest(app).get('/api/v1/auth/me');
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });
});

describe('Not Found handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await supertest(app).get('/api/v1/nonexistent-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 404 for unknown method', async () => {
    const res = await supertest(app).put('/api/v1/health/live');
    expect(res.status).toBe(404);
  });
});
