/**
 * API Client Setup for Mobile App (Standalone - no workspace deps)
 */

import { supabase } from './supabase';
import { API_URL } from '@/constants/config';

// Simple fetch-based API client (replaces @uprent-plus/api-client)
export const api = {
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API request failed: ${response.status}`);
    }

    return response.json();
  },

  get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

