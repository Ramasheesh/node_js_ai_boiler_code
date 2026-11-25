import { prisma } from '../../database/prisma.js';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
        isActive: true,
      },
    });
  }

  async createUser(data: { email: string; username: string; password: string }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async storeRefreshToken(data: { token: string; userId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({ data });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: { select: { id: true, email: true, role: true, isActive: true } },
      },
    });
  }

  async revokeRefreshToken(token: string) {
    return prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }

  async revokeAllUserRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  async cleanExpiredTokens() {
    return prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}

export const authRepository = new AuthRepository();
