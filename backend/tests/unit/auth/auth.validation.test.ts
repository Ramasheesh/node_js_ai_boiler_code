import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../../../src/modules/auth/auth.validation.js';

describe('registerSchema', () => {
  it('should accept valid registration data', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Password123',
    });
    expect(result.success).toBe(true);
  });

  it('should lowercase the email', () => {
    const result = registerSchema.safeParse({
      email: 'TEST@EXAMPLE.COM',
      username: 'testuser',
      password: 'Password123',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });

  it('should reject invalid email format', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      username: 'testuser',
      password: 'Password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short password (< 8 chars)', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Pass1',
    });
    expect(result.success).toBe(false);
  });

  it('should reject password without uppercase letter', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject password without lowercase letter', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'PASSWORD123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject password without number', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      username: 'testuser',
      password: 'PasswordOnly',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short username (< 3 chars)', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      username: 'ab',
      password: 'Password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject username with spaces', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      username: 'test user',
      password: 'Password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject username with special characters', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      username: 'test@user!',
      password: 'Password123',
    });
    expect(result.success).toBe(false);
  });

  it('should accept username with underscores', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      username: 'test_user_123',
      password: 'Password123',
    });
    expect(result.success).toBe(true);
  });
});

describe('loginSchema', () => {
  it('should accept valid login credentials', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'anypassword',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid',
      password: 'password',
    });
    expect(result.success).toBe(false);
  });

  it('should lowercase email', () => {
    const result = loginSchema.safeParse({
      email: 'USER@EXAMPLE.COM',
      password: 'password',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@example.com');
    }
  });
});

describe('refreshTokenSchema', () => {
  it('should accept a non-empty token', () => {
    const result = refreshTokenSchema.safeParse({ refreshToken: 'some.jwt.token' });
    expect(result.success).toBe(true);
  });

  it('should reject an empty token', () => {
    const result = refreshTokenSchema.safeParse({ refreshToken: '' });
    expect(result.success).toBe(false);
  });

  it('should reject missing token', () => {
    const result = refreshTokenSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
