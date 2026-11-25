import { userRepository } from './user.repository.js';
import { NotFoundError } from '../../shared/errors/index.js';
import type { UpdateUserDto, UpdateProfileDto, UserFilters } from './user.types.js';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/index.js';
import { Request } from 'express';

export class UserService {
  async getUsers(req: Request) {
    const { page, limit, skip } = parsePagination(req);
    const filters: UserFilters = {
      search: req.query['search'] as string | undefined,
      role: req.query['role'] as UserFilters['role'],
      isActive:
        req.query['isActive'] !== undefined
          ? req.query['isActive'] === 'true'
          : undefined,
    };

    const { users, total } = await userRepository.findAll(filters, skip, limit);
    const pagination = buildPaginationMeta(page, limit, total);
    return { users, pagination };
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError('User');
    return userRepository.update(id, dto);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const existing = await userRepository.findById(userId);
    if (!existing) throw new NotFoundError('User');
    return userRepository.updateProfile(userId, dto);
  }

  async deleteUser(id: string) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError('User');
    await userRepository.delete(id);
  }
}

export const userService = new UserService();
