/**
 * API Client Error Handling
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: Response, data?: any): ApiError {
    const statusCode = response.status;
    const message = data?.error || data?.message || response.statusText || 'Unknown error';
    return new ApiError(message, statusCode, data);
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network request failed', public originalError?: any) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

