import { createClient } from "@supabase/supabase-js";

// Tipe database (akan diperluas setelah schema dibuat)
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

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

// Anon client — dipakai di server components (Astro files) dan SSR
// JANGAN pakai ini di API routes untuk operasi yang butuh service role
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // SSR — jangan simpan session di server
  },
});
