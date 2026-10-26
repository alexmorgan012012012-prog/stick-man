import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ASSET_PATHS } from '../data/mockData';
import { ArrowRight, Compass, Maximize2, ShieldCheck, Flame, Sliders } from 'lucide-react';

interface HeroSectionProps {
  onExploreCollection: () => void;
  onCreateDesign: () => void;
  onOpenShowcase: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCollection,
  onCreateDesign,
  onOpenShowcase,
}) => {
  const [activeView, setActiveView] = useState<'tracksuit' | 'hoodie' | 'fabric'>('tracksuit');

  const headlineWords = ['BUILT', 'TO', 'PERFORM.', 'DESIGNED', 'TO', 'STAND', 'OUT.'];

  const campaignViews = [
    { id: 'tracksuit', label: 'Pro Tracksuit 01', image: ASSET_PATHS.heroModel, tag: 'Aero-Speed Technical Suit' },
    { id: 'hoodie', label: 'Apex Fleece 02', image: ASSET_PATHS.hoodieEditorial, tag: 'Heavy French Terry 480 GSM' },
    { id: 'fabric', label: 'Micro-Mesh 03', image: ASSET_PATHS.fabricMacro, tag: 'Bonded Seams & Moisture Matrix' },
  ];

  const currentView = campaignViews.find((v) => v.id === activeView) || campaignViews[0];

  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-zinc-200">
      {/* Background Architectural Grid & Hairline Coordinate Guides */}
      <div className="absolute inset-0 bg-grid-subtle opacity-60 pointer-events-none" />

      {/* Subtle Hairline Frame Guides */}
      <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-[1px] bg-zinc-100" />
      <div className="hidden lg:block absolute right-8 top-0 bottom-0 w-[1px] bg-zinc-100" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Kinetic Word-by-Word Headline & Campaign Story */}
          <div className="lg:col-span-6 flex flex-col justify-center z-10">
            {/* Top Micro-Kicker with Red Precision Bar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-8 h-[2px] bg-red-600" />
              <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                MK SPORTS // SS26 ATHLETIC CAMPAIGN
              </span>
            </motion.div>

            {/* Word-by-Word Kinetic Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 uppercase font-display leading-[1.08] mb-6">
              {headlineWords.map((word, index) => {
                const isHighlight = word === 'PERFORM.' || word === 'STAND' || word === 'OUT.';
                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.55,
                      delay: 0.1 + index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`inline-block mr-3 ${
                      isHighlight ? 'text-zinc-950 underline decoration-red-600 decoration-4 underline-offset-8' : 'text-zinc-900'
                    }`}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-xl mb-8"
            >
              Premium sportswear. Custom designs. Manufacturing built around your vision. Engineered with precision textiles, ergonomic motion patterns, and bespoke customization.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={onExploreCollection}
                className="group flex items-center gap-3 px-7 py-3.5 bg-zinc-950 text-white font-bold text-xs tracking-wider uppercase rounded-sm hover:bg-red-600 transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onCreateDesign}
                className="group flex items-center gap-3 px-7 py-3.5 bg-white text-zinc-950 font-bold text-xs tracking-wider uppercase border border-zinc-300 hover:border-zinc-950 rounded-sm transition-all duration-200 cursor-pointer whitespace-nowrap shadow-sm hover:bg-zinc-50"
              >
                <Sliders className="w-4 h-4 text-red-600 group-hover:rotate-45 transition-transform" />
                <span>CREATE YOUR OWN DESIGN</span>
              </button>
            </motion.div>

            {/* Quick Proof Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 pt-8 border-t border-zinc-200 grid grid-cols-3 gap-6"
            >
              <div>
                <span className="block font-display text-2xl font-black text-zinc-950 tabular-nums">
                  480<span className="text-red-600 text-lg">GSM</span>
                </span>
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Heavyweight Terry</span>
              </div>
              <div>
                <span className="block font-display text-2xl font-black text-zinc-950 tabular-nums">
                  100%
                </span>
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Bespoke Precision</span>
              </div>
              <div>
                <span className="block font-display text-2xl font-black text-zinc-950 tabular-nums">
                  25<span className="text-red-600 text-lg">PCS</span>
                </span>
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Low MOQ Custom</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Layered Editorial Campaign Showcase with Parallax & Camera Zoom */}
          <div className="lg:col-span-6 relative">
            {/* Outer Decorative Architectural Lines */}
            <div className="absolute -top-4 -right-4 w-28 h-28 border-t-2 border-r-2 border-red-600/70 pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-28 h-28 border-b-2 border-l-2 border-zinc-300 pointer-events-none" />

            {/* Masked Hero Image Container */}
            <motion.div
              initial={{ clipPath: 'inset(10% 10% 10% 10%)', opacity: 0 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200 shadow-2xl group"
            >
              {/* Dynamic Image with subtle continuous camera zoom */}
              <motion.img
                key={currentView.id}
                src={currentView.image}
                alt="MK SPORTS Campaign Model"
                className="w-full h-full object-cover select-none"
                initial={{ scale: 1.08, opacity: 0.7 }}
                animate={{ scale: 1.02, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Subtle Vignette & Light Scrim for crisp text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

              {/* Floating Technical Dimension Labels */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3.5 py-2 border border-zinc-200 rounded-sm shadow-md pointer-events-auto"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-mono text-[10px] font-bold text-zinc-900 uppercase tracking-widest">
                    SPECS: AEROSPACE SEAM
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 font-mono mt-0.5">
                  BONDED DWR · ZERO-FRICTION
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white pointer-events-auto"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono tracking-widest bg-red-600 text-white uppercase rounded-sm mb-2">
                    {currentView.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight font-display">
                    AERO-SPEED ARCHITECTURE
                  </h3>
                  <p className="text-xs text-zinc-200 mt-1 max-w-sm">
                    Engineered for high-output mobility. Laser cut & bonded in atelier facility.
                  </p>
                </div>

                <button
                  onClick={onOpenShowcase}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-lg shrink-0"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Interactive 3D</span>
                </button>
              </motion.div>
            </motion.div>

            {/* Campaign View Switcher (Layered transitions between images) */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {campaignViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id as any)}
                    className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-all rounded-sm cursor-pointer ${
                      activeView === view.id
                        ? 'bg-zinc-950 text-white font-bold shadow-sm'
                        : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200'
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>

              <span className="font-mono text-[11px] text-zinc-400">
                MK CAMPAIGN // 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
