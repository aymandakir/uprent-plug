/**
 * Web Vitals tracking
 */

import { ReportHandler } from 'web-vitals';

export function reportWebVitals(onPerfEntry?: ReportHandler) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onINP(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
}

/**
 * Custom performance tracking
 */
export function trackSearchPerformance(duration: number, filters: any, resultCount: number) {
  if (typeof window !== 'undefined') {
    // Send to analytics
    import('@/lib/analytics').then(({ analytics }) => {
      analytics.track('Search Performance', {
        duration,
        filters: JSON.stringify(filters),
        resultCount,
      });
    });
  }
}

/**
 * Measure async function execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    if (typeof window !== 'undefined') {
      import('@/lib/analytics').then(({ analytics }) => {
        analytics.track('Performance Metric', {
          name,
          duration,
        });
      });
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
}

