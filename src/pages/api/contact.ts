import type { APIRoute } from "astro";
import { supabaseAdmin, isAdminConfigured } from "../../lib/supabase-admin";
import { resend, isResendConfigured, CONTACT_EMAIL_TO, FROM_EMAIL, buildContactEmailHtml } from "../../lib/resend";
import { contactSchema, apiSuccess, apiError } from "../../lib/validators";

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify(apiError("Request body tidak valid.")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validasi Zod
    const result = contactSchema.safeParse(body);
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

    const { name, email, subject, message, website } = result.data;

    // Honeypot — bot trap
    if (website && website.length > 0) {
      return new Response(JSON.stringify(apiSuccess(null, "Pesan terkirim!")), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert ke Supabase jika terkonfigurasi
    if (isAdminConfigured) {
      const { error: dbError } = await supabaseAdmin
        .from("contact_messages")
        .insert({ name, email, subject: subject || null, message });

      if (dbError) {
        console.error("[contact] Supabase insert error:", dbError);
        return new Response(JSON.stringify(apiError("Gagal menyimpan pesan. Coba lagi.")), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      console.warn("[contact] Supabase not configured, skipping DB insert.");
    }

    // Kirim email via Resend jika terkonfigurasi
    if (isResendConfigured) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: CONTACT_EMAIL_TO,
          subject: `📬 Pesan baru dari ${name}: ${subject || "Portofolio Contact Form"}`,
          html: buildContactEmailHtml({ name, email, subject, message }),
        });
      } catch (emailError) {
        console.error("[contact] Resend error:", emailError);
        // Tidak gagalkan request — pesan sudah tersimpan di DB
      }
    }

    return new Response(
      JSON.stringify(apiSuccess(null, "Pesan berhasil terkirim! Saya akan segera membalas.")),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return new Response(JSON.stringify(apiError("Terjadi kesalahan server.")), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(apiError("Method not allowed.")), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
