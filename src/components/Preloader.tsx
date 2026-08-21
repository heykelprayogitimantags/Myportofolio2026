'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Preloader — Terminal boot sequence with dynamic motion background.
 */

const EASE = [0.76, 0, 0.24, 1] as const;
const TOTAL_MS = 2400;
const BAR_WIDTH = 24;

type Line = { delay: number; content: React.ReactNode };

const LINES: Line[] = [
  {
    delay: 0.1,
    content: (
      <>
        <span className="text-emerald-400">➜</span>{' '}
        <span className="text-neutral-500">~/portfolio</span>{' '}
        <span className="text-neutral-200">whoami</span>
      </>
    ),
  },
  { delay: 0.55, content: <span className="text-neutral-100">Heykel Prayogi</span> },
  {
    delay: 0.95,
    content: (
      <>
        <span className="text-emerald-400">➜</span>{' '}
        <span className="text-neutral-500">~/portfolio</span>{' '}
        <span className="text-neutral-200">cat role.txt</span>
      </>
    ),
  },
  {
    delay: 1.35,
    content: <span className="text-neutral-100">Software Engineer &amp; AI Specialist</span>,
  },
  {
    delay: 1.75,
    content: (
      <>
        <span className="text-emerald-400">➜</span>{' '}
        <span className="text-neutral-500">~/portfolio</span>{' '}
        <span className="text-neutral-200">npm run build</span>
      </>
    ),
  },
];

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Progress & Boot Animation Timer
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const pct = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setProgress(pct);
      if (elapsed < TOTAL_MS) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'unset';
    }, TOTAL_MS + 350);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // 2. Dynamic Motion Canvas Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes setup
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.5 + 1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
        ctx.fill();

        // Connect nearby points
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 120) * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const filled = Math.round((progress / 100) * BAR_WIDTH);
  const bar = '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
  const done = progress >= 100;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#07080a] px-4 overflow-hidden"
        >
          {/* Canvas Interactive Motion Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full pointer-events-none opacity-70"
          />

          {/* Animated Ambient Glowing Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.2, 0.35, 0.2],
              x: [-20, 20, -20],
              y: [-10, 15, -10],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/3 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/25 blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.3, 0.15],
              x: [20, -20, 20],
              y: [15, -15, 15],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 right-1/3 h-[380px] w-[380px] rounded-full bg-indigo-500/20 blur-[130px] pointer-events-none"
          />

          {/* Subtle Grain Overlay */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>

          {/* Terminal Window Card */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#0C0D10]/90 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* macOS Style Header Bar */}
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-3">
              <span className="h-[10px] w-[10px] rounded-full bg-[#FF5F57]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#FEBC2E]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#28C840]" />
              <span className="ml-3 font-mono text-[11px] text-neutral-500">
                zsh — heykel-prayogi
              </span>
            </div>

            {/* Terminal Body */}
            <div className="space-y-2 px-5 py-5 font-mono text-[13px] leading-relaxed">
              {LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ clipPath: 'inset(0 100% 0 0)' }}
                  animate={{ clipPath: 'inset(0 0% 0 0)' }}
                  transition={{ duration: 0.4, delay: line.delay, ease: 'linear' }}
                  className="whitespace-nowrap"
                >
                  {line.content}
                </motion.div>
              ))}

              {/* ASCII Progress Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.3 }}
                className="flex items-center gap-3 pt-1 text-neutral-400"
              >
                <span className="text-neutral-200">{bar}</span>
                <span className="tabular-nums text-neutral-500">
                  {String(progress).padStart(3, ' ')}%
                </span>
              </motion.div>

              {/* Final Prompt Line */}
              <div className="flex items-center gap-2 pt-1">
                {done && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-emerald-400"
                  >
                    ✓ build ready
                  </motion.span>
                )}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  className="inline-block h-[14px] w-[7px] bg-neutral-200"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}