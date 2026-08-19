"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, RefreshCw } from "lucide-react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const guestbookSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(50),
  message: z.string().min(1, "Pesan tidak boleh kosong").max(280, "Maksimal 280 karakter"),
  website: z.string().max(0).optional(), // honeypot
});

type Entry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

type FormState = "idle" | "loading" | "success" | "error";

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// Warna avatar deterministik berdasar nama
function getAvatarColor(name: string): string {
  const colors = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-green-500 to-emerald-400",
    "from-orange-500 to-yellow-400",
    "from-red-500 to-rose-400",
    "from-indigo-500 to-violet-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMsg, setServerMsg] = useState("");
  const [msgLen, setMsgLen] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const fetchEntries = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const res = await fetch("/api/guestbook");
      const json = await res.json();
      if (json.success) setEntries(json.data ?? []);
    } catch {
      /* silently fail */
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    // Auto-refresh setiap 30 detik
    const interval = setInterval(() => fetchEntries(), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    setErrors({});
    setServerMsg("");

    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      message: fd.get("message") as string,
      website: (fd.get("website") as string) || undefined,
    };

    const result = guestbookSchema.safeParse(data);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fe[err.path[0] as string] = err.message;
      });
      setErrors(fe);
      setFormState("idle");
      return;
    }

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setFormState("success");
        setServerMsg("Pesan kamu sudah masuk! Terima kasih 🎉");
        formRef.current?.reset();
        setMsgLen(0);
        setTimeout(() => {
          setFormState("idle");
          setServerMsg("");
          fetchEntries();
        }, 2500);
      } else {
        setFormState("error");
        setServerMsg(json.message || "Gagal mengirim. Coba lagi.");
      }
    } catch {
      setFormState("error");
      setServerMsg("Koneksi bermasalah.");
    }
  };

  return (
    <section id="guestbook" className="section-padding bg-[var(--bg-secondary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[var(--brand-primary)] text-sm font-semibold tracking-widest uppercase mb-3">
            Community
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Guestbook ✍️
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Tinggalkan pesan singkat, sapa, atau feedback. Senang mendengar dari pengunjung!
          </p>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-purple-500 mx-auto mt-4" />
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 mb-8 shadow-[var(--shadow-sm)]">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Tinggalkan Pesan</h3>
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-3">
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Nama kamu *"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 transition-colors ${errors.name ? "border-red-500" : "border-[var(--border-color)] focus:border-[var(--brand-primary)]"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="relative">
                <textarea
                  name="message"
                  required
                  rows={1}
                  placeholder="Pesan singkat (maks. 280 karakter) *"
                  maxLength={280}
                  onChange={(e) => setMsgLen(e.target.value.length)}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 resize-none transition-colors ${errors.message ? "border-red-500" : "border-[var(--border-color)] focus:border-[var(--brand-primary)]"}`}
                />
                <span className={`absolute bottom-2 right-3 text-xs ${msgLen > 260 ? "text-orange-500" : "text-[var(--text-muted)]"}`}>
                  {msgLen}/280
                </span>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
            </div>

            {serverMsg && (
              <div className={`p-3 rounded-xl text-sm ${formState === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                {serverMsg}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={formState === "loading" || formState === "success"}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {formState === "loading" ? (
                  <><Loader2 size={14} className="animate-spin" /> Mengirim...</>
                ) : formState === "success" ? (
                  <>✅ Terkirim!</>
                ) : (
                  <><Send size={14} /> Kirim</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Entries List */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[var(--text-primary)]">
              Pesan Masuk{" "}
              <span className="text-[var(--text-muted)] font-normal text-sm">({entries.length})</span>
            </h3>
            <button
              onClick={() => fetchEntries(true)}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors"
            >
              <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-[var(--border-color)] p-4 flex gap-3">
                  <div className="w-9 h-9 rounded-full skeleton flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 skeleton rounded" />
                    <div className="h-3 w-full skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <p className="text-3xl mb-2">📭</p>
              <p>Belum ada pesan. Jadilah yang pertama!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {entries.map((entry, idx) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 flex gap-3 hover:border-[var(--border-color-hover)] transition-colors"
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(entry.name)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-[var(--text-primary)]">{entry.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">·</span>
                        <span className="text-xs text-[var(--text-muted)]">{timeAgo(entry.created_at)}</span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed break-words">{entry.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
