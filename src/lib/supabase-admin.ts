import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase";

// ⚠️ SERVICE ROLE — hanya dipakai di API routes (/pages/api/*.ts)
// ✅ SAFE: Tidak throw di module level agar Vercel tidak crash

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const FALLBACK_URL = "https://placeholder.supabase.co";

export const supabaseAdmin = createClient<Database>(
  supabaseUrl || FALLBACK_URL,
  serviceRoleKey || "placeholder-service-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const isAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);
