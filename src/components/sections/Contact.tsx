"use client";

import { useState, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Format email tidak valid"),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(2000),
  website: z.string().max(0).optional(), // honeypot
});

type FormState = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMsg, setServerMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("loading");
    setErrors({});
    setServerMsg("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: (formData.get("subject") as string) || undefined,
      message: formData.get("message") as string,
      website: (formData.get("website") as string) || undefined,
    };

    // Client-side validation
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setState("idle");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setState("success");
        setServerMsg(json.message || "Pesan terkirim! Saya akan segera membalas.");
        formRef.current?.reset();
      } else {
        setState("error");
        setServerMsg(json.message || "Terjadi kesalahan. Coba lagi.");
      }
    } catch {
      setState("error");
      setServerMsg("Koneksi bermasalah. Periksa internet kamu.");
    }
  };

  return (
    <section id="contact" className="section-padding bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[var(--brand-primary)] text-sm font-semibold tracking-widest uppercase mb-3">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Contact Me
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Ada proyek menarik atau peluang kolaborasi? Jangan ragu untuk menghubungi saya!
          </p>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-purple-500 mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-4xl mx-auto">
          {/* Left: Info */}
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Mari Berkolaborasi! 🚀
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              Saya terbuka untuk peluang kerja fullstack maupun AI/Computer Vision.
              Baik itu full-time, freelance, atau penelitian kolaboratif.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:heykelprayogi123@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-glow)] transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--brand-primary)]/20 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">Email</p>
                  <p className="text-[var(--text-primary)] text-sm font-medium">heykelprayogi123@gmail.com</p>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/heykelprayogi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-glow)] transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--brand-primary)]/20 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--brand-primary)">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">LinkedIn</p>
                  <p className="text-[var(--text-primary)] text-sm font-medium">linkedin.com/in/heykelprayogi</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Honeypot - hidden dari user */}
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Nama kamu"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 ${errors.name ? "border-red-500" : "border-[var(--border-color)] focus:border-[var(--brand-primary)]"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="email@kamu.com"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 ${errors.email ? "border-red-500" : "border-[var(--border-color)] focus:border-[var(--brand-primary)]"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Subjek <span className="text-[var(--text-muted)] font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Tentang apa?"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Pesan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Ceritakan projekmu atau pertanyaanmu..."
                className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 resize-none ${errors.message ? "border-red-500" : "border-[var(--border-color)] focus:border-[var(--brand-primary)]"}`}
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>

            {/* Server message */}
            {serverMsg && (
              <div className={`p-3 rounded-xl text-sm font-medium ${state === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                {state === "success" ? "✅ " : "❌ "}{serverMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={state === "loading" || state === "success"}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-primary)] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              {state === "loading" ? (
                <><Loader2 size={16} className="animate-spin" /> Mengirim...</>
              ) : state === "success" ? (
                <><span>✅</span> Terkirim!</>
              ) : (
                <><Send size={16} /> Kirim Pesan</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
