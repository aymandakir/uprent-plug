/**
 * Health Check API Endpoints
 */

import { ApiClient } from './client';
import type { HealthCheckResponse } from './types';

export class HealthApi {
  constructor(private client: ApiClient) {}

  /**
   * Check API health status
   */
  async check(): Promise<HealthCheckResponse> {
    return this.client.get<HealthCheckResponse>('/api/health');
  }
}

