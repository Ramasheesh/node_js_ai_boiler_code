import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../shared/errors/index.js';
import { Role } from '@prisma/client';

interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  type: 'access' | 'refresh';
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    if (payload.type !== 'access') {
      throw new UnauthorizedError('Invalid token type');
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid or expired token'));
    } else {
      next(err);
    }
  }
}
