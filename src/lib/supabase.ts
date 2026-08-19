import { createClient } from "@supabase/supabase-js";

// Tipe database
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          full_description: string | null;
          category: "web_app" | "ai_ml" | "script_tool";
          tech_stack: string[];
          thumbnail_url: string | null;
          gallery_urls: string[];
          live_url: string | null;
          github_url: string | null;
          is_featured: boolean;
          display_order: number;
          view_count: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at">;
      };
      experiences: {
        Row: {
          id: string;
          type: "education" | "work" | "organization";
          title: string;
          institution: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          description: string | null;
          tags: string[];
          display_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["experiences"]["Row"], "id">;
      };
      certificates: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          issue_date: string | null;
          image_url: string;
          credential_url: string | null;
          category: string;
          display_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["certificates"]["Row"], "id">;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contact_messages"]["Row"], "id" | "created_at" | "is_read">;
      };
      guestbook_entries: {
        Row: {
          id: string;
          name: string;
          message: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["guestbook_entries"]["Row"], "id" | "created_at">;
      };
    };
  };
};

// ✅ SAFE: Tidak throw di module level — Vercel tidak crash saat env belum diset
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? "";

// Fallback URL agar createClient tidak crash saat env kosong
const FALLBACK_URL = "https://placeholder.supabase.co";

export const supabase = createClient<Database>(
  supabaseUrl || FALLBACK_URL,
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: false,
    },
  }
);

// Helper: cek apakah Supabase benar-benar terkonfigurasi
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
