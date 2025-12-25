/**
 * Rate limiting utilities
 * In production, use @upstash/ratelimit or similar
 */

// Simple in-memory rate limiter (replace with Redis-based in production)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  async limit(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): Promise<{ success: boolean; remaining: number; reset: number }> {
    const now = Date.now();
    const key = identifier;
    const windowStart = now - windowMs;

    // Get existing requests for this identifier
    let requests = this.requests.get(key) || [];

    // Filter out requests outside the window
    requests = requests.filter((timestamp) => timestamp > windowStart);

    // Check if limit exceeded
    if (requests.length >= maxRequests) {
      const oldestRequest = requests[0];
      const reset = oldestRequest + windowMs;
      return {
        success: false,
        remaining: 0,
        reset,
      };
    }

    // Add current request
    requests.push(now);
    this.requests.set(key, requests);

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      // 1% chance to cleanup
      this.cleanup();
    }

    return {
      success: true,
      remaining: maxRequests - requests.length,
      reset: now + windowMs,
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, requests] of this.requests.entries()) {
      if (requests.length === 0 || requests[requests.length - 1] < now - 3600000) {
        // Remove entries older than 1 hour
        this.requests.delete(key);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

// Rate limit configurations
export const RATE_LIMITS = {
  '/api/search': { maxRequests: 30, windowMs: 60000 }, // 30 per minute
  '/api/ai/generate-letter': { maxRequests: 5, windowMs: 60000 }, // 5 per minute
  '/api/ai/analyze-contract': { maxRequests: 3, windowMs: 60000 }, // 3 per minute
  '/api/auth/login': { maxRequests: 5, windowMs: 900000 }, // 5 per 15 minutes
  '/api/auth/register': { maxRequests: 3, windowMs: 3600000 }, // 3 per hour
  default: { maxRequests: 100, windowMs: 60000 }, // 100 per minute
};

/**
 * Check rate limit for a route
 */
export async function checkRateLimit(
  identifier: string,
  route: string
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const config = RATE_LIMITS[route as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
  const result = await rateLimiter.limit(identifier, config.maxRequests, config.windowMs);

  return {
    allowed: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Get identifier from request (IP address or user ID)
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP from headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'anonymous';

  return `ip:${ip}`;
}

// Production Redis-based rate limiter (uncomment when ready)
/*
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});
*/

