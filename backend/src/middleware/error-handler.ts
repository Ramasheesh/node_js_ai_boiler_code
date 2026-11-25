import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/index.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';
import { Prisma } from '@prisma/client';

function handlePrismaError(err: Prisma.PrismaClientKnownRequestError): AppError {
  switch (err.code) {
    case 'P2002':
      return new AppError('A record with this value already exists', 409, 'CONFLICT');
    case 'P2025':
      return new AppError('Record not found', 404, 'NOT_FOUND');
    case 'P2003':
      return new AppError('Foreign key constraint failed', 400, 'FOREIGN_KEY_VIOLATION');
    default:
      return new AppError('Database operation failed', 500, 'DATABASE_ERROR');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  let error = err;
  const requestId = res.locals['requestId'] as string | undefined;

  // Convert Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  }

  if (error instanceof AppError) {
    if (!error.isOperational) {
      logger.error({ err: error, requestId }, 'Non-operational error');
    } else {
      logger.warn({ err: error, requestId }, 'Operational error');
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      ...('details' in error && error.details ? { details: error.details } : {}),
      ...(requestId && { requestId }),
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Unexpected error — do not leak internals
  logger.error({ err: error, requestId }, 'Unexpected error');

  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    ...(requestId && { requestId }),
    timestamp: new Date().toISOString(),
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}
