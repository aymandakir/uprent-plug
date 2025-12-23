import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Use dummy values for build-time safety
// Will be validated at runtime when actually used
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key-for-build",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-service-key-for-build",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

