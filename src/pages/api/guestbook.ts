import type { APIRoute } from "astro";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { supabaseAdmin, isAdminConfigured } from "../../lib/supabase-admin";
import { guestbookSchema, apiSuccess, apiError } from "../../lib/validators";

// In-memory rate limiting: IP → last timestamp
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 menit

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const last = rateLimitMap.get(ip);
  if (!last) return false;
  if (Date.now() - last < RATE_LIMIT_MS) return true;
  rateLimitMap.delete(ip);
  return false;
}

// GET — list guestbook entries
export const GET: APIRoute = async () => {
  try {
    if (!isSupabaseConfigured) {
      return new Response(JSON.stringify(apiSuccess([])), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("guestbook_entries")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[guestbook GET] error:", error);
      return new Response(JSON.stringify(apiError("Gagal memuat guestbook.")), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(apiSuccess(data ?? [])), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[guestbook GET] unexpected:", err);
    return new Response(JSON.stringify(apiSuccess([])), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// POST — tambah entry baru
export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify(apiError("Terlalu banyak pesan. Coba lagi dalam 5 menit.")),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify(apiError("Request body tidak valid.")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = guestbookSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.errors.forEach((err) => {
        const key = String(err.path[0] ?? "general");
        if (!errors[key]) errors[key] = [];
        errors[key].push(err.message);
      });
      return new Response(JSON.stringify(apiError("Validasi gagal.", errors)), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, message, website } = result.data;

    // Honeypot
    if (website && website.length > 0) {
      return new Response(JSON.stringify(apiSuccess(null, "Pesan terkirim!")), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!isAdminConfigured) {
      return new Response(
        JSON.stringify(apiError("Database belum dikonfigurasi. Hubungi admin.")),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error: dbError } = await supabaseAdmin
      .from("guestbook_entries")
      .insert({ name: name.trim(), message: message.trim() })
      .select()
      .single();

    if (dbError) {
      console.error("[guestbook POST] error:", dbError);
      return new Response(JSON.stringify(apiError("Gagal menyimpan pesan.")), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    rateLimitMap.set(ip, Date.now());

    return new Response(JSON.stringify(apiSuccess(data, "Pesan berhasil ditambahkan!")), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[guestbook POST] unexpected:", err);
    return new Response(JSON.stringify(apiError("Server error.")), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
