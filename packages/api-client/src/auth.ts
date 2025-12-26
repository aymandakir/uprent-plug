/**
 * Auth API Endpoints
 */

import { ApiClient } from './client';
import type { AuthMeResponse } from './types';

export class AuthApi {
  constructor(private client: ApiClient) {}

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<AuthMeResponse> {
    return this.client.get<AuthMeResponse>('/api/auth/me');
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ success: boolean }> {
    return this.client.post<{ success: boolean }>('/api/auth/signout');
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<{ success: boolean }> {
    return this.client.post<{ success: boolean }>('/api/auth/delete-account');
  }
}

