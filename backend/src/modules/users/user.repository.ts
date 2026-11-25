import { prisma } from '../../database/prisma.js';
import type { UserFilters } from './user.types.js';
import { Role, Prisma } from '@prisma/client';

const userSelect = {
  id: true,
  email: true,
  username: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  profile: {
    select: {
      firstName: true,
      lastName: true,
      bio: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.UserSelect;

export class UserRepository {
  async findAll(filters: UserFilters, skip: number, take: number) {
    const where: Prisma.UserWhereInput = {};

    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { username: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.role !== undefined) {
      where.role = filters.role;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: userSelect,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: userSelect });
  }

  async update(id: string, data: { username?: string; role?: Role; isActive?: boolean }) {
    return prisma.user.update({ where: { id }, data, select: userSelect });
  }

  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; bio?: string; avatarUrl?: string },
  ) {
    return prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export const userRepository = new UserRepository();
