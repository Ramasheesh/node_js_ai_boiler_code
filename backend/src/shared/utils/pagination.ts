import { Request } from 'express';
import { PAGINATION_DEFAULTS } from '../constants/index.js';
import { PaginationMeta } from '../responses/ApiResponse.js';

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(req: Request): PaginationQuery {
  const page = Math.max(1, parseInt(String(req.query['page'] ?? PAGINATION_DEFAULTS.PAGE), 10));
  const limit = Math.min(
    PAGINATION_DEFAULTS.MAX_LIMIT,
    Math.max(1, parseInt(String(req.query['limit'] ?? PAGINATION_DEFAULTS.LIMIT), 10)),
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
