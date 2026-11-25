import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../shared/errors/index.js';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${req.method} ${req.path}`));
}
