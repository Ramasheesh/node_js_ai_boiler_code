import { z } from 'zod';
import { Role } from '@prisma/client';

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

export const userListQuerySchema = z.object({
  search: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
