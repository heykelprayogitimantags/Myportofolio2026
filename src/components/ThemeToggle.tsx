"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = stored ?? (prefersDark ? "dark" : "light");
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);

    // Emit custom event yang didengarkan BaseLayout
    document.dispatchEvent(
      new CustomEvent("themeChanged", { detail: { theme: next } })
    );
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        aria-label="Toggle tema"
        className="w-9 h-9 rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] flex items-center justify-center"
      >
        <span className="w-4 h-4 skeleton rounded" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className={`
        w-9 h-9 rounded-lg border flex items-center justify-center
        transition-all duration-200 hover:scale-105 active:scale-95
        border-[var(--border-color)] bg-[var(--bg-tertiary)]
        hover:border-[var(--brand-primary)] hover:bg-[var(--brand-glow)]
        text-[var(--text-secondary)] hover:text-[var(--brand-primary)]
      `}
    >
      {theme === "dark" ? (
        <Sun size={16} strokeWidth={2} />
      ) : (
        <Moon size={16} strokeWidth={2} />
      )}
    </button>
  );
}
