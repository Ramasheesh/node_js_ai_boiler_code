import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { sendSuccess, sendCreated } from '../../shared/responses/index.js';
import type { RegisterDto, LoginDto, RefreshDto } from './auth.types.js';

export class AuthController {
  /**
   * @openapi
   * /auth/register:
   *   post:
   *     tags: [Auth]
   *     summary: Register a new user
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, username, password]
   *             properties:
   *               email: { type: string, format: email }
   *               username: { type: string, minLength: 3, maxLength: 30 }
   *               password: { type: string, minLength: 8 }
   *     responses:
   *       201:
   *         description: User registered successfully
   *       409:
   *         description: Email already exists
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body as RegisterDto);
      sendCreated(res, result, 'User registered successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     tags: [Auth]
   *     summary: Login with email and password
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email: { type: string, format: email }
   *               password: { type: string }
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body as LoginDto);
      sendSuccess(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /auth/refresh:
   *   post:
   *     tags: [Auth]
   *     summary: Refresh access token using refresh token
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [refreshToken]
   *             properties:
   *               refreshToken: { type: string }
   *     responses:
   *       200:
   *         description: Tokens refreshed
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tokens = await authService.refreshTokens(req.body as RefreshDto);
      sendSuccess(res, tokens, 'Tokens refreshed');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /auth/logout:
   *   post:
   *     tags: [Auth]
   *     summary: Logout current session
   *     security:
   *       - bearerAuth: []
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body as { refreshToken: string };
      await authService.logout(refreshToken, req.user!.id);
      sendSuccess(res, null, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /auth/logout-all:
   *   post:
   *     tags: [Auth]
   *     summary: Logout from all devices
   *     security:
   *       - bearerAuth: []
   */
  async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.logoutAll(req.user!.id);
      sendSuccess(res, null, 'Logged out from all devices');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /auth/me:
   *   get:
   *     tags: [Auth]
   *     summary: Get current authenticated user
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user info
   *       401:
   *         description: Unauthorized
   */
  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, req.user, 'Current user');
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
