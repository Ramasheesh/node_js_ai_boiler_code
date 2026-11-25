import { Role } from '@prisma/client';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: Role;
  };
  tokens: TokenPair;
}
