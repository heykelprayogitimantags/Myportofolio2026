import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";
import { supabaseAdmin } from "../../lib/supabase-admin";
import { apiSuccess, apiError } from "../../lib/validators";

// GET — ambil semua projects (opsional untuk client-side refresh)
export const GET: APIRoute = async ({ url }) => {
  try {
    const category = url.searchParams.get("category");
    const featured = url.searchParams.get("featured");

    let query = supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[projects GET] Supabase error:", error);
      return new Response(JSON.stringify(apiError("Gagal memuat projects.")), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(apiSuccess(data ?? [])), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    console.error("[projects GET] error:", err);
    return new Response(JSON.stringify(apiError("Server error.")), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// POST — increment view count saat detail page dibuka
export const POST: APIRoute = async ({ request }) => {
  try {
    let body: { slug?: string };
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify(apiError("Bad request.")), { status: 400 });
    }

    if (!body.slug) {
      return new Response(JSON.stringify(apiError("slug diperlukan.")), { status: 400 });
    }

    const { error } = await supabaseAdmin.rpc("increment_view_count", {
      project_slug: body.slug,
    });

    if (error) {
      // Coba manual update jika RPC belum ada
      await supabaseAdmin
        .from("projects")
        .update({ view_count: 1 } as never)
        .eq("slug", body.slug);
    }

    return new Response(JSON.stringify(apiSuccess(null, "View count updated.")), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify(apiSuccess(null)), { status: 200 });
  }
};
