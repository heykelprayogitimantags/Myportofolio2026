import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase";

// ⚠️ SERVICE ROLE CLIENT — HANYA dipakai di API routes (/pages/api/*.ts)
// JANGAN import file ini di komponen client-side atau Astro components yang SSR
// Service role bypasses RLS — akses penuh ke semua tabel

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase service role environment variables. Check SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
