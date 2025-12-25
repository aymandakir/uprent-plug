/**
 * Analytics utilities
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

interface AnalyticsPage {
  name: string;
  properties?: Record<string, any>;
}

class Analytics {
  private initialized = false;

  init() {
    if (this.initialized) return;
    
    // Initialize analytics providers
    if (typeof window !== 'undefined') {
      this.initialized = true;
    }
  }

  /**
   * Track a custom event
   */
  track(event: string, properties?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    // Send to analytics service
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') {
      // Vercel Analytics
      if (typeof window.va !== 'undefined') {
        window.va('track', event, properties);
      }

      // Custom analytics endpoint
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, properties }),
      }).catch(() => {
        // Silently fail
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties);
    }
  }

  /**
   * Track a page view
   */
  page(name: string, properties?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') {
      if (typeof window.va !== 'undefined') {
        window.va('pageview', { url: window.location.pathname });
      }

      fetch('/api/analytics/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, properties }),
      }).catch(() => {
        // Silently fail
      });
    }
  }

  /**
   * Identify a user
   */
  identify(userId: string, traits?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') {
      fetch('/api/analytics/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, traits }),
      }).catch(() => {
        // Silently fail
      });
    }
  }
}

export const analytics = new Analytics();

// Initialize on client
if (typeof window !== 'undefined') {
  analytics.init();
}

