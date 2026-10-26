import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ASSET_PATHS } from '../data/mockData';
import { ChevronRight, Play } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<number>(0);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    // Stage progression:
    // 0: Graphic lines & coordinates draw on pristine white background
    // 1: "MADE TO MOVE."
    // 2: "BUILT TO PERFORM."
    // 3: Sportswear cinematic reveal with camera push
    // 4: "MK SPORTS." final kinetic logo lockup
    // 5: Complete & transition to homepage
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1700),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => setPhase(4), 4100),
      setTimeout(() => {
        onComplete();
      }, 5400),
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const skip = () => {
    setIsSkipped(true);
    setTimeout(onComplete, 250);
  };

  return (
    <AnimatePresence>
      {!isSkipped && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden select-none"
        >
          {/* Subtle technical background grid */}
          <div className="absolute inset-0 bg-grid-subtle opacity-70 pointer-events-none" />

          {/* Precision hairline corner frame markers */}
          <div className="absolute top-8 left-8 flex items-center gap-3">
            <span className="w-4 h-[1px] bg-red-600"></span>
            <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
              MK·MOTION LAB // LAT 45.4642°
            </span>
          </div>

          <div className="absolute top-8 right-8 flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-widest text-zinc-400">
              FRAME 0{phase + 1}/05
            </span>
            <button
              onClick={skip}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-zinc-600 hover:text-zinc-950 uppercase border border-zinc-200 hover:border-zinc-900 transition-all rounded-sm bg-white/80 backdrop-blur-sm cursor-pointer"
            >
              Skip Intro
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute bottom-8 left-8 flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-wider text-zinc-400">
              MK SPORTS CRAFTSMANSHIP FILM
            </span>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              INTERACTIVE REVEAL
            </span>
          </div>

          {/* Central Motion Canvas */}
          <div className="relative w-full max-w-4xl px-6 flex flex-col items-center justify-center min-h-[460px]">
            {/* Animated Technical Rectangles & Hairlines */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-72 h-[1px] bg-zinc-900 -top-8 origin-left"
            />
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute h-40 w-[1px] bg-red-600 -left-6 origin-top"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-72 h-[1px] bg-zinc-300 -bottom-8 origin-right"
            />

            {/* Phase 1: "MADE TO MOVE." */}
            {phase === 1 && (
              <motion.div
                key="phase-1"
                initial={{ opacity: 0, y: 30, letterSpacing: '0.15em' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '-0.02em' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <span className="block font-mono text-xs tracking-widest text-red-600 uppercase mb-3">
                  01 // MOVEMENT
                </span>
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-zinc-950 uppercase tracking-tight font-display">
                  MADE TO MOVE.
                </h2>
              </motion.div>
            )}

            {/* Phase 2: "BUILT TO PERFORM." */}
            {phase === 2 && (
              <motion.div
                key="phase-2"
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <span className="block font-mono text-xs tracking-widest text-zinc-400 uppercase mb-3">
                  02 // ENGINEERING
                </span>
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-zinc-950 uppercase tracking-tight font-display">
                  BUILT TO PERFORM.
                </h2>
              </motion.div>
            )}

            {/* Phase 3: Cinematic Sportswear Apparel Reveal */}
            {phase === 3 && (
              <motion.div
                key="phase-3"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-lg aspect-[4/3] rounded-lg overflow-hidden border border-zinc-200 shadow-xl"
              >
                <motion.img
                  src={ASSET_PATHS.heroModel}
                  alt="MK Sports Apparel Reveal"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider bg-red-600 text-white uppercase rounded-sm mb-1">
                      AERO-SPEED ARCHITECTURE
                    </span>
                    <p className="text-white font-display text-xl font-bold uppercase tracking-wide">
                      MK PERFORMANCE LAB 2026
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 4: "MK SPORTS" kinetic logo lockup */}
            {phase >= 4 && (
              <motion.div
                key="phase-4"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-[2px] bg-red-600"></span>
                  <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
                    EST. 2026 · INTERNATIONAL CRAFT
                  </span>
                  <span className="w-8 h-[2px] bg-red-600"></span>
                </div>

                <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-zinc-950 uppercase font-display flex items-center justify-center">
                  MK
                  <span className="text-red-600 mx-2">·</span>
                  SPORTS
                </h1>

                <p className="mt-3 text-sm sm:text-base font-medium text-zinc-600 tracking-widest uppercase">
                  LUXURY ATHLETIC APPAREL & CUSTOM MANUFACTURING
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={skip}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white font-medium text-xs tracking-widest uppercase rounded-sm hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
                  >
                    Enter Experience
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
