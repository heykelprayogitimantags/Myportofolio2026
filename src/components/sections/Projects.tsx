"use client";

import { useState } from "react";
import { Star, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Project = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  category: "web_app" | "ai_ml" | "script_tool";
  tech_stack: string[];
  thumbnail_url: string | null;
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  display_order: number;
};

type Props = {
  initialProjects: Project[];
};

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "ai_ml", label: "AI & ML" },
  { key: "web_app", label: "Web App" },
  { key: "script_tool", label: "Script & Tools" },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  ai_ml: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  web_app: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  script_tool: "text-green-500 bg-green-500/10 border-green-500/20",
};

const CATEGORY_LABELS: Record<string, string> = {
  ai_ml: "AI & ML",
  web_app: "Web App",
  script_tool: "Script & Tools",
};

export default function Projects({ initialProjects }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // 1. Tambahkan state untuk tombol lihat selengkapnya
  const [showAll, setShowAll] = useState<boolean>(false);

  const filtered =
    activeFilter === "all"
      ? initialProjects
      : initialProjects.filter((p) => p.category === activeFilter);

  // 2. Potong array yang sudah di-filter menjadi 3 saja jika showAll = false
  const displayedProjects = showAll ? filtered : filtered.slice(0, 3);

  return (
    <section id="projects" className="section-padding bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[var(--brand-primary)] text-sm font-semibold tracking-widest uppercase mb-3">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Projects Showcase
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Koleksi proyek yang menunjukkan kemampuan{" "}
            <strong className="text-[var(--text-primary)]">fullstack</strong> dan{" "}
            <strong className="text-[var(--text-primary)]">AI/Computer Vision</strong>.
          </p>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-purple-500 mx-auto mt-4" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFilter(tab.key);
                setShowAll(false); // 3. Reset tombol saat pindah kategori
              }}
              className={`
                px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                ${activeFilter === tab.key
                  ? "bg-[var(--brand-primary)] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  : "border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                }
              `}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-70">
                ({tab.key === "all"
                  ? initialProjects.length
                  : initialProjects.filter((p) => p.category === tab.key).length})
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16 text-[var(--text-muted)]"
              >
                Tidak ada proyek di kategori ini.
              </motion.div>
            ) : (
              // 4. Gunakan displayedProjects di sini
              displayedProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group relative rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--brand-primary)]/40 hover:shadow-[var(--shadow-glow)] transition-all duration-300 flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] overflow-hidden">
                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--brand-primary)]/10 flex items-center justify-center">
                          <span className="text-3xl">
                            {project.category === "ai_ml" ? "🧠" : project.category === "web_app" ? "🌐" : "⚙️"}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Featured badge */}
                    {project.is_featured && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-semibold">
                        <Star size={10} fill="white" />
                        Featured
                      </div>
                    )}
                    {/* Category badge */}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full border text-xs font-semibold backdrop-blur-sm ${CATEGORY_COLORS[project.category]}`}>
                      {CATEGORY_LABELS[project.category]}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-bold text-[var(--text-primary)] text-base leading-snug mb-2 group-hover:text-[var(--brand-primary)] transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 flex-1 line-clamp-3">
                      {project.short_description}
                    </p>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-color)]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-color)]">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-color)]">
                      <a
                        href={`/projects/${project.slug}`}
                        className="flex-1 text-center text-xs font-semibold py-2 px-3 rounded-lg bg-[var(--brand-primary)] text-white hover:opacity-90 transition-opacity"
                      >
                        Detail
                      </a>
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-color-hover)] transition-all"
                        >
                          <svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="16" height="16" 
  viewBox="0 0 24 24" fill="none" 
  stroke="currentColor" strokeWidth="2" 
  strokeLinecap="round" strokeLinejoin="round"
>
  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  <path d="M12 18h.01"></path>
</svg>
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Live Demo"
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] transition-all"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* 5. Tombol Lihat Selengkapnya (Hanya muncul jika item > 3) */}
        {filtered.length > 3 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mt-12 flex justify-center"
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

      </div>
    </section>
  );
}