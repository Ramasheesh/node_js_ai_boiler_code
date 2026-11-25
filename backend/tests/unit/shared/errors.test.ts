import { describe, it, expect } from 'vitest';
import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  TooManyRequestsError,
} from '../../../src/shared/errors/index.js';

describe('AppError', () => {
  it('should create an error with correct properties', () => {
    const err = new AppError('Test error', 400, 'TEST_ERROR');
    expect(err.message).toBe('Test error');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('TEST_ERROR');
    expect(err.isOperational).toBe(true);
    expect(err.name).toBe('AppError');
  });

  it('should default to 500 statusCode and INTERNAL_ERROR code', () => {
    const err = new AppError('Internal error');
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe('INTERNAL_ERROR');
  });

  it('should be an instance of Error', () => {
    const err = new AppError('Test');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('NotFoundError', () => {
  it('should create a 404 error', () => {
    const err = new NotFoundError('User');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toContain('User');
  });

  it('should use "Resource" as default name', () => {
    const err = new NotFoundError();
    expect(err.message).toContain('Resource');
  });
});

describe('ValidationError', () => {
  it('should create a 400 error with details', () => {
    const details = { field: ['required'] };
    const err = new ValidationError('Validation failed', details);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.details).toEqual(details);
  });

  it('should work without details', () => {
    const err = new ValidationError('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.details).toBeUndefined();
  });
});

describe('UnauthorizedError', () => {
  it('should create a 401 error', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('should accept custom message', () => {
    const err = new UnauthorizedError('Token expired');
    expect(err.message).toBe('Token expired');
  });
});

describe('ForbiddenError', () => {
  it('should create a 403 error', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });
});

describe('ConflictError', () => {
  it('should create a 409 error', () => {
    const err = new ConflictError('Already exists');
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONFLICT');
    expect(err.message).toBe('Already exists');
  });
});

describe('TooManyRequestsError', () => {
  it('should create a 429 error', () => {
    const err = new TooManyRequestsError();
    expect(err.statusCode).toBe(429);
    expect(err.code).toBe('TOO_MANY_REQUESTS');
  });
});
