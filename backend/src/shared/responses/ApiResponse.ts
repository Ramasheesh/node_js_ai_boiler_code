import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  requestId?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  details?: unknown;
  requestId?: string;
  timestamp: string;
}

export interface ApiPaginatedResponse<T = unknown> extends Omit<ApiSuccessResponse<T[]>, 'data'> {
  data: T[];
  pagination: PaginationMeta;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
): void {
  const requestId = res.locals['requestId'] as string | undefined;
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(requestId && { requestId }),
    timestamp: new Date().toISOString(),
  });
}

export function sendCreated<T>(res: Response, data: T, message: string = 'Created'): void {
  sendSuccess(res, data, message, 201);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message: string = 'Success',
): void {
  const requestId = res.locals['requestId'] as string | undefined;
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
    ...(requestId && { requestId }),
    timestamp: new Date().toISOString(),
  });
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}
