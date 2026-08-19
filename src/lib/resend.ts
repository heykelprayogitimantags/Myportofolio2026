import { Resend } from "resend";

const resendApiKey = import.meta.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY in .env.local");
}

export const resend = new Resend(resendApiKey);

export const CONTACT_EMAIL_TO = import.meta.env.CONTACT_EMAIL_TO || "heykelprayogi123@gmail.com";
export const FROM_EMAIL = "Portfolio Contact <noreply@heykel.dev>";

// Template email notifikasi kontak masuk
export function buildContactEmailHtml(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pesan Kontak Baru — Portofolio Heykel</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">
            📬 Pesan Baru dari Portofolio
          </h1>
        </div>
        
        <!-- Body -->
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Dari</strong>
                <p style="margin: 4px 0 0; color: #0f172a; font-size: 16px;">${data.name}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Email</strong>
                <p style="margin: 4px 0 0; color: #0f172a; font-size: 16px;">
                  <a href="mailto:${data.email}" style="color: #3b82f6; text-decoration: none;">${data.email}</a>
                </p>
              </td>
            </tr>
            ${data.subject ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Subjek</strong>
                <p style="margin: 4px 0 0; color: #0f172a; font-size: 16px;">${data.subject}</p>
              </td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 12px 0;">
                <strong style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Pesan</strong>
                <div style="margin: 8px 0 0; background: #f8fafc; border-radius: 8px; padding: 16px; color: #0f172a; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>
              </td>
            </tr>
          </table>
          
          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${data.email}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Balas Sekarang
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 16px 32px; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            Email ini dikirim otomatis dari portofolio Heykel Prayogi Timanta G.s
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
