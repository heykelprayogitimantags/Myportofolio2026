'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const STATUS_STEPS = [
  { at: 0, label: 'Booting environment' },
  { at: 30, label: 'Compiling components' },
  { at: 65, label: 'Linking neural weights' },
  { at: 95, label: 'Ready' },
];

const EASE = [0.76, 0, 0.24, 1] as const;
const TOTAL_MS = 2200;

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const pct = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setProgress(pct);
      if (elapsed < TOTAL_MS) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'unset';
    }, TOTAL_MS + 250);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const status =
    [...STATUS_STEPS].reverse().find((s) => progress >= s.at)?.label ??
    STATUS_STEPS[0].label;

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] pointer-events-auto">
          {/* Split panels — the exit "signature": curtain reveal instead of a plain slide */}
          <motion.div
            key="panel-left"
            initial={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="absolute inset-y-0 left-0 w-1/2 bg-[#050507]"
          />
          <motion.div
            key="panel-right"
            initial={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="absolute inset-y-0 right-0 w-1/2 bg-[#050507]"
          />

          {/* Ambient background: faint circuit grid + a slow pulsing glow (AI motif) */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                backgroundSize: '42px 42px',
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
              style={{
                background:
                  'radial-gradient(circle, rgba(34,211,238,0.35), rgba(139,92,246,0.25) 55%, transparent 75%)',
              }}
            />
          </div>

          {/* Content */}
          <motion.div
            key="content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative flex h-full w-full flex-col items-center justify-center px-4 text-white"
          >
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                  className="text-3xl font-bold tracking-tight md:text-5xl"
                >
                  Heykel Prayogi
                  <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                    .
                  </span>
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-400"
              >
                <span className="text-cyan-400">{'>'}</span>
                Software Engineer &amp; AI Specialist
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block h-3 w-[6px] bg-cyan-400"
                />
              </motion.p>

              {/* Progress: gradient bar + live status + percentage counter */}
              <div className="mt-5 flex w-56 flex-col gap-2">
                <div className="h-[2px] w-full overflow-hidden rounded-full bg-neutral-800">
                  <motion.div
                    style={{ width: `${progress}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                    transition={{ ease: 'linear' }}
                  />
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-neutral-500">
                  <motion.span
                    key={status}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="uppercase"
                  >
                    {status}
                  </motion.span>
                  <span className="tabular-nums text-neutral-300">
                    {String(progress).padStart(3, '0')}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}