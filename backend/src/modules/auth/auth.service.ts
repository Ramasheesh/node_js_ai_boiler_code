import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { authRepository } from './auth.repository.js';
import { ConflictError, UnauthorizedError } from '../../shared/errors/index.js';
import type {
  RegisterDto,
  LoginDto,
  RefreshDto,
  AuthResponse,
  TokenPair,
  JwtPayload,
} from './auth.types.js';
import { Role } from '@prisma/client';

export class AuthService {
  private generateTokens(payload: Omit<JwtPayload, 'type' | 'iat' | 'exp'>): TokenPair {
    const accessToken = jwt.sign(
      { ...payload, type: 'access' },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    );

    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    );

    return { accessToken, refreshToken };
  }

  private parseExpiresAt(expiresIn: string): Date {
    const now = Date.now();
    const match = /^(\d+)([smhd])$/.exec(expiresIn);
    if (!match || !match[1] || !match[2]) throw new Error('Invalid expiresIn format');
    const amount = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return new Date(now + amount * (multipliers[unit] ?? 1000));
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await authRepository.findUserByEmail(dto.email);
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    const hashedPassword = await argon2.hash(dto.password, {
      memoryCost: env.ARGON2_MEMORY_COST,
      timeCost: env.ARGON2_TIME_COST,
      parallelism: env.ARGON2_PARALLELISM,
    });

    const user = await authRepository.createUser({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
    });

    const tokens = this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role as Role,
    });

    await authRepository.storeRefreshToken({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: this.parseExpiresAt(env.JWT_REFRESH_EXPIRES_IN),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role as Role,
      },
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await authRepository.findUserByEmail(dto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const tokens = this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role as Role,
    });

    await authRepository.storeRefreshToken({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: this.parseExpiresAt(env.JWT_REFRESH_EXPIRES_IN),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role as Role,
      },
      tokens,
    };
  }

  async refreshTokens(dto: RefreshDto): Promise<TokenPair> {
    let payload: JwtPayload;
    try {
      payload = jwt.verify(dto.refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedError('Invalid token type');
    }

    const storedToken = await authRepository.findRefreshToken(dto.refreshToken);
    if (!storedToken || storedToken.revoked || !storedToken.user.isActive) {
      throw new UnauthorizedError('Refresh token is invalid or revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token has expired');
    }

    await authRepository.revokeRefreshToken(dto.refreshToken);

    const tokens = this.generateTokens({
      sub: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role as Role,
    });

    await authRepository.storeRefreshToken({
      token: tokens.refreshToken,
      userId: storedToken.user.id,
      expiresAt: this.parseExpiresAt(env.JWT_REFRESH_EXPIRES_IN),
    });

    return tokens;
  }

  async logout(refreshToken: string, userId: string): Promise<void> {
    const storedToken = await authRepository.findRefreshToken(refreshToken);
    if (storedToken && storedToken.user.id === userId) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await authRepository.revokeAllUserRefreshTokens(userId);
  }
}

export const authService = new AuthService();
