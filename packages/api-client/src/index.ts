/**
 * @uprent-plus/api-client
 * Shared API client for calling Next.js API routes
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { ApiClient } from './client';
import { AuthApi } from './auth';
import { AiApi } from './ai';
import { NotificationsApi } from './notifications';
import { HealthApi } from './health';

// Export types
export * from './types';
export * from './errors';

// Export API classes
export { ApiClient, AuthApi, AiApi, NotificationsApi, HealthApi };

/**
 * Create a configured API client instance
 */
export function createApiClient(config: { baseUrl: string; supabase: SupabaseClient }) {
  const client = new ApiClient(config);
  
  return {
    client,
    auth: new AuthApi(client),
    ai: new AiApi(client),
    notifications: new NotificationsApi(client),
    health: new HealthApi(client),
  };
}

/**
 * Default export - convenience function
 */
export default createApiClient;

