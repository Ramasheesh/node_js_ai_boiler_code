import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service.js';
import { sendSuccess, sendPaginated, sendNoContent } from '../../shared/responses/index.js';

export class UserController {
  /**
   * @openapi
   * /users:
   *   get:
   *     tags: [Users]
   *     summary: List all users (admin only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *         description: Search by email or username
   *       - in: query
   *         name: role
   *         schema: { type: string, enum: [USER, ADMIN, MODERATOR] }
   *       - in: query
   *         name: isActive
   *         schema: { type: boolean }
   *       - in: query
   *         name: page
   *         schema: { type: integer, default: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 20 }
   *     responses:
   *       200:
   *         description: Paginated list of users
   *       403:
   *         description: Forbidden — admin only
   */
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { users, pagination } = await userService.getUsers(req);
      sendPaginated(res, users, pagination, 'Users retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /users/{id}:
   *   get:
   *     tags: [Users]
   *     summary: Get user by ID (admin only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: User data
   *       404:
   *         description: User not found
   */
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.params['id'] as string);
      sendSuccess(res, user, 'User retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /users/profile:
   *   patch:
   *     tags: [Users]
   *     summary: Update own profile
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName: { type: string }
   *               lastName: { type: string }
   *               bio: { type: string }
   *               avatarUrl: { type: string, format: uri }
   *     responses:
   *       200:
   *         description: Profile updated
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await userService.updateProfile(req.user!.id, req.body);
      sendSuccess(res, profile, 'Profile updated');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /users/{id}:
   *   patch:
   *     tags: [Users]
   *     summary: Update user (admin only)
   *     security:
   *       - bearerAuth: []
   */
  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUser(req.params['id'] as string, req.body);
      sendSuccess(res, user, 'User updated');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @openapi
   * /users/{id}:
   *   delete:
   *     tags: [Users]
   *     summary: Delete user (admin only)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       204:
   *         description: User deleted
   *       404:
   *         description: User not found
   */
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteUser(req.params['id'] as string);
      sendNoContent(res);
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
