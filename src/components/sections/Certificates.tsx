"use client";

import { useState } from "react";
import { X, ExternalLink, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  image_url: string;
  credential_url: string | null;
  category: string;
  display_order: number;
};

type Props = {
  initialCertificates: Certificate[];
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

export default function Certificates({ initialCertificates }: Props) {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="section-padding bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[var(--brand-primary)] text-sm font-semibold tracking-widest uppercase mb-3">
            Achievements
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Sertifikat & Lisensi
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Sertifikasi profesional dan kursus yang telah diselesaikan. Klik untuk melihat detail.
          </p>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-purple-500 mx-auto mt-4" />
        </div>

        {initialCertificates.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <div className="text-4xl mb-3">🏆</div>
            <p>Sertifikat akan segera ditambahkan.</p>
          </div>
        ) : (
          /* Certificates Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {initialCertificates.map((cert, idx) => (
              <motion.button
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.07 }}
                onClick={() => setSelected(cert)}
                className="group text-left rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--brand-primary)]/40 hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative h-36 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] overflow-hidden">
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                    <span className="text-white text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                      Klik untuk detail
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug mb-1 group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">{cert.issuer}</p>
                  {cert.issue_date && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">{formatDate(cert.issue_date)}</p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-2xl w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>

              {/* Certificate image */}
              <div className="bg-[var(--bg-secondary)] flex items-center justify-center min-h-[300px]">
                <img
                  src={selected.image_url}
                  alt={selected.title}
                  className="max-w-full max-h-[400px] object-contain"
                />
              </div>

              {/* Certificate info */}
              <div className="p-6">
                <h3 className="font-bold text-[var(--text-primary)] text-xl mb-2">
                  {selected.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] mb-4">
                  <span className="font-medium">{selected.issuer}</span>
                  {selected.issue_date && (
                    <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                      <Calendar size={13} />
                      {formatDate(selected.issue_date)}
                    </span>
                  )}
                </div>

                {selected.credential_url && (
                  <a
                    href={selected.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink size={14} />
                    Verifikasi Sertifikat
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
