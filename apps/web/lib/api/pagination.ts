/**
 * Pagination utilities for API responses
 */

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  cursor: {
    next: string | null;
    previous: string | null;
  };
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  totalItems: number,
  page: number,
  pageSize: number
) {
  const totalPages = Math.ceil(totalItems / pageSize);
  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Get offset for pagination
 */
export function getOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Generate cursor for cursor-based pagination
 */
export function generateCursor(item: { id: string; createdAt: Date }): string {
  return Buffer.from(
    JSON.stringify({ id: item.id, createdAt: item.createdAt.toISOString() })
  ).toString('base64');
}

/**
 * Decode cursor from cursor-based pagination
 */
export function decodeCursor(cursor: string): { id: string; createdAt: Date } | null {
  try {
    const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString());
    return {
      id: decoded.id,
      createdAt: new Date(decoded.createdAt),
    };
  } catch {
    return null;
  }
}

