export { supabase, supabaseAdmin } from "./client";
export type { Database } from "./database.types";
export type User = Database["public"]["Tables"]["users"]["Row"];
export type SearchProfile = Database["public"]["Tables"]["search_profiles"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type ActivityFeed = Database["public"]["Tables"]["activity_feed"]["Row"];

