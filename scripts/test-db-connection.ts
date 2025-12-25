#!/usr/bin/env tsx
/**
 * Simple database connection test
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), 'apps/web/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

console.log('🔗 Testing Supabase connection...');
console.log(`URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Try to query a table (even if it doesn't exist, we'll get a specific error)
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log('✅ Connection successful! (Tables may need migration)');
        console.log('ℹ️  Run database migration in Supabase SQL Editor');
        return true;
      } else {
        console.error('❌ Database error:', error.message);
        return false;
      }
    } else {
      console.log('✅ Connection successful! Database is ready.');
      return true;
    }
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

testConnection().then((success) => {
  process.exit(success ? 0 : 1);
});

