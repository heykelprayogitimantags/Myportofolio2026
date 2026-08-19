"use client";

import { useState } from "react";
import { ExternalLink, Star } from "lucide-react";

// GitHub SVG inline (lucide-react v1+ tidak include GitHub brand icon)
const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);
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

  const filtered =
    activeFilter === "all"
      ? initialProjects
      : initialProjects.filter((p) => p.category === activeFilter);

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
              onClick={() => setActiveFilter(tab.key)}
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
              filtered.map((project, idx) => (
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
                          <GithubIcon />
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
      </div>
    </section>
  );
}
