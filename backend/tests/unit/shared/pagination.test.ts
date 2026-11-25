import { describe, it, expect } from 'vitest';
import { buildPaginationMeta } from '../../../src/shared/utils/pagination.js';

describe('buildPaginationMeta', () => {
  it('should compute pagination correctly for first page', () => {
    const meta = buildPaginationMeta(1, 20, 100);
    expect(meta.page).toBe(1);
    expect(meta.limit).toBe(20);
    expect(meta.total).toBe(100);
    expect(meta.totalPages).toBe(5);
    expect(meta.hasNext).toBe(true);
    expect(meta.hasPrev).toBe(false);
  });

  it('should compute pagination correctly for last page', () => {
    const meta = buildPaginationMeta(5, 20, 100);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(true);
    expect(meta.totalPages).toBe(5);
  });

  it('should compute pagination correctly for middle page', () => {
    const meta = buildPaginationMeta(3, 10, 50);
    expect(meta.hasNext).toBe(true);
    expect(meta.hasPrev).toBe(true);
    expect(meta.totalPages).toBe(5);
  });

  it('should handle empty results', () => {
    const meta = buildPaginationMeta(1, 20, 0);
    expect(meta.totalPages).toBe(0);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(false);
    expect(meta.total).toBe(0);
  });

  it('should handle single page', () => {
    const meta = buildPaginationMeta(1, 20, 5);
    expect(meta.totalPages).toBe(1);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(false);
  });
});
