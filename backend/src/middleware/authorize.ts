import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../shared/errors/index.js';

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}
