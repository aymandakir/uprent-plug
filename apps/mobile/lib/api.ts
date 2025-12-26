/**
 * API Client Setup for Mobile App
 */

import { createApiClient } from '@uprent-plus/api-client';
import { supabase } from './supabase';
import { API_URL } from '@/constants/config';

export const api = createApiClient({
  baseUrl: API_URL,
  supabase,
});

