import { z } from "zod";

// =====================================================
// CONTACT FORM SCHEMA
// =====================================================
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .trim(),
  email: z
    .string()
    .email("Format email tidak valid")
    .max(254, "Email terlalu panjang")
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .max(200, "Subjek maksimal 200 karakter")
    .trim()
    .optional(),
  message: z
    .string()
    .min(10, "Pesan minimal 10 karakter")
    .max(2000, "Pesan maksimal 2000 karakter")
    .trim(),
  // Honeypot field — harus kosong (bot biasanya mengisi ini)
  website: z.string().max(0, "Bot detected").optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// =====================================================
// GUESTBOOK SCHEMA
// =====================================================
export const guestbookSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter")
    .trim(),
  message: z
    .string()
    .min(1, "Pesan tidak boleh kosong")
    .max(280, "Pesan maksimal 280 karakter (seperti tweet!)")
    .trim(),
  // Honeypot
  website: z.string().max(0, "Bot detected").optional(),
});

export type GuestbookFormData = z.infer<typeof guestbookSchema>;

// =====================================================
// API RESPONSE HELPERS
// =====================================================
export function apiSuccess<T>(data: T, message?: string) {
  return {
    success: true as const,
    data,
    message,
  };
}

export function apiError(message: string, errors?: Record<string, string[]>) {
  return {
    success: false as const,
    message,
    errors,
  };
}
