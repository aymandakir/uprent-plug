export { supabase, supabaseAdmin } from "./client";
import type { Database } from "./database.types";
export type { Database };
export type User = Database["public"]["Tables"]["users"]["Row"];
export type SearchProfile = Database["public"]["Tables"]["search_profiles"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type ActivityFeed = Database["public"]["Tables"]["activity_feed"]["Row"];

