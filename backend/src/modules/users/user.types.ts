import { Role } from '@prisma/client';

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
  } | null;
}

export interface UpdateUserDto {
  username?: string;
  role?: Role;
  isActive?: boolean;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UserFilters {
  search?: string;
  role?: Role;
  isActive?: boolean;
}
