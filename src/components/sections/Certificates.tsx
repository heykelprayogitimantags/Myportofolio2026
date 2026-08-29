"use client";

import { useState } from "react";
import { X, ExternalLink, Calendar, ChevronDown, ChevronUp } from "lucide-react";
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
  
  // 1. Tambahkan state untuk mengontrol tampilan semua kartu
  const [showAll, setShowAll] = useState(false);

  // 2. Tentukan data yang ditampilkan (Semua vs 4 saja)
  const displayedCertificates = showAll 
    ? initialCertificates 
    : initialCertificates.slice(0, 4);

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
          <>
            {/* Certificates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* 3. Gunakan displayedCertificates di sini, BUKAN initialCertificates */}
              {displayedCertificates.map((cert, idx) => (
                <motion.button
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.07 }}
                  onClick={() => setSelected(cert)}
                  className="group text-left rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--brand-primary)]/40 hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative h-36 bg-[var(--bg-tertiary)] overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/40 bg-black/40 backdrop-blur-sm">
                        Klik untuk detail
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug mb-1 group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-auto">{cert.issuer}</p>
                    {cert.issue_date && (
                      <p className="text-xs text-[var(--text-muted)] mt-1">{formatDate(cert.issue_date)}</p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* 4. Tombol Lihat Selengkapnya */}
            {initialCertificates.length > 4 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="mt-10 flex justify-center"
              >
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="group flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold hover:bg-[var(--brand-primary)] hover:text-white transition-all duration-300"
                >
                  {showAll ? (
                    <>
                      Tampilkan Lebih Sedikit 
                      <ChevronUp size={18} className="group-hover:-translate-y-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      Lihat Selengkapnya 
                      <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal (Tetap Sama) */}
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
              <div className="bg-[var(--bg-secondary)] flex items-center justify-center min-h-[300px] p-6">
                <img
                  src={selected.image_url}
                  alt={selected.title}
                  className="max-w-full max-h-[400px] object-contain drop-shadow-md"
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

                {/* Kondisi jika credential_url ada */}
                {selected.credential_url ? (
                  <a
                    href={selected.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--brand-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink size={14} />
                    Lihat Kredensial Resmi
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] text-sm font-medium cursor-not-allowed">
                    Sertifikat Fisik / Internal
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}