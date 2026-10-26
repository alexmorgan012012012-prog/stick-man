import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ASSET_PATHS } from '../data/mockData';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Layers,
  Scissors,
  Palette,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
} from 'lucide-react';

interface ScrollFilmSequenceProps {
  onStartCustomOrder: () => void;
  onExploreProducts: () => void;
}

export const ScrollFilmSequence: React.FC<ScrollFilmSequenceProps> = ({
  onStartCustomOrder,
  onExploreProducts,
}) => {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeCustomColor, setActiveCustomColor] = useState<string>('#18181B');

  const scenes = [
    {
      id: 'fashion-reveal',
      number: '01',
      title: 'FASHION REVEAL',
      headline: 'YOUR STYLE. YOUR STANDARD.',
      subtitle: 'Tailored athletic silhouettes sculpted with ergonomic cut-lines, articulated joints, and contemporary streetwear proportion.',
      badge: 'SS26 SILHOUETTE ARCHITECTURE',
      image: ASSET_PATHS.heroModel,
    },
    {
      id: 'fabric-texture',
      number: '02',
      title: 'FABRIC & TEXTURE',
      headline: 'DESIGNED TO MOVE.',
      subtitle: 'Macro-engineered technical weaves. 480 GSM organic cotton terry and 4-way AeroStretch diamond micro-mesh with zero-friction bonded seams.',
      badge: 'TEXTILE LAB CALIBRATION',
      image: ASSET_PATHS.fabricMacro,
    },
    {
      id: 'manufacturing',
      number: '03',
      title: 'MANUFACTURING CRAFT',
      headline: 'FROM CONCEPT TO CREATION.',
      subtitle: 'Millimeter-precise laser pattern cutting, computerized pattern grading, and multi-ply vacuum cutting tables in our modern athletic atelier.',
      badge: 'ATELIER PRECISION CUTTING',
      image: ASSET_PATHS.manufacturingCraft,
    },
    {
      id: 'custom-apparel',
      number: '04',
      title: 'CUSTOM APPAREL MATRIX',
      headline: 'YOUR BRAND. YOUR COLLECTION.',
      subtitle: 'High-density 3D silicone badges, 15-thread Japanese embroidery, and zero-fade digital sublimation engineered for international teams and luxury brands.',
      badge: 'BESPOKE CUSTOMIZATION',
      image: ASSET_PATHS.customCollection,
    },
    {
      id: 'finished-collection',
      number: '05',
      title: 'FINISHED COLLECTION',
      headline: 'BUILT AROUND YOUR VISION.',
      subtitle: 'Every garment individually hand-checked, steam finished, and packaged to commercial retail standards for athletes and luxury streetwear brands worldwide.',
      badge: 'COMMERCIAL FINISH & QC',
      image: ASSET_PATHS.customCollection,
    },
    {
      id: 'final-reveal',
      number: '06',
      title: 'BRAND CLIMAX',
      headline: 'YOUR VISION. OUR CRAFT.',
      subtitle: 'Transform your concept into a world-class sportswear collection. Low MOQ starting at 25 pieces with full end-to-end manufacturing support.',
      badge: 'MK SPORTS ATELIER',
      image: ASSET_PATHS.heroModel,
    },
  ];

  // Auto-play timer when enabled
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, scenes.length]);

  const active = scenes[currentScene];

  return (
    <section className="relative w-full bg-white py-16 sm:py-24 border-b border-zinc-200 overflow-hidden">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Kinetic Tag */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-red-600" />
              <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                SCROLL FILM EXPERIENCE // 6 SCENES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tight font-display">
              THE MK SPORTS MOTION FILM
            </h2>
          </div>

          {/* Film Controls & Scene Index */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono tracking-wider uppercase border border-zinc-200 hover:border-zinc-950 rounded-sm transition-colors cursor-pointer bg-white"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-red-600" />
                  <span>PAUSE FILM</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-zinc-950" />
                  <span>PLAY FILM</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentScene((prev) => (prev > 0 ? prev - 1 : scenes.length - 1))}
                aria-label="Previous Scene"
                className="p-2 border border-zinc-200 hover:border-zinc-950 rounded-sm bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-zinc-800" />
              </button>
              <span className="font-mono text-xs font-bold px-2 tabular-nums">
                0{currentScene + 1} / 0{scenes.length}
              </span>
              <button
                onClick={() => setCurrentScene((prev) => (prev + 1) % scenes.length)}
                aria-label="Next Scene"
                className="p-2 border border-zinc-200 hover:border-zinc-950 rounded-sm bg-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-zinc-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Scene Scrubber Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
          {scenes.map((scene, idx) => {
            const isCurrent = currentScene === idx;
            return (
              <button
                key={scene.id}
                onClick={() => {
                  setCurrentScene(idx);
                  setIsPlaying(false);
                }}
                className={`relative text-left p-3 border transition-all rounded-sm cursor-pointer ${
                  isCurrent
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                    : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider ${
                      isCurrent ? 'text-red-400' : 'text-zinc-400'
                    }`}
                  >
                    SCENE {scene.number}
                  </span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                </div>
                <p className="font-display text-xs font-bold mt-1 tracking-tight truncate">
                  {scene.title}
                </p>
                {isCurrent && (
                  <motion.div
                    layoutId="activeSceneIndicator"
                    className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-red-600"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Cinema Canvas */}
        <div className="relative bg-zinc-50 border border-zinc-200 rounded-sm overflow-hidden p-6 sm:p-10 lg:p-12 shadow-sm min-h-[520px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Left Column: Kinetic Text & Scene Details */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-red-600 tracking-widest uppercase">
                    SCENE {active.number} // {active.badge}
                  </span>
                </div>

                <motion.h3
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 uppercase tracking-tight font-display mb-4 leading-tight"
                >
                  {active.headline}
                </motion.h3>

                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-8">
                  {active.subtitle}
                </p>

                {/* Specific Scene Interactive Enhancements */}
                {currentScene === 0 && (
                  <div className="space-y-3 p-4 bg-white border border-zinc-200 rounded-sm mb-6">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                      KINETIC ENTRANCE SPECS
                    </span>
                    <div className="flex items-center justify-between text-xs font-medium text-zinc-800">
                      <span>Articulated Knee Seam</span>
                      <span className="font-mono text-zinc-500">4-Way Stretch Poly</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-zinc-800">
                      <span>Reflective Accent Piping</span>
                      <span className="font-mono text-red-600">3M Scotchlite High-Vis</span>
                    </div>
                  </div>
                )}

                {currentScene === 1 && (
                  <div className="p-4 bg-white border border-zinc-200 rounded-sm mb-6 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500">WEAVE DENSITY:</span>
                      <span className="font-bold text-zinc-950">480 GSM DUAL-FACED</span>
                    </div>
                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ duration: 1 }}
                        className="bg-red-600 h-full"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <span>Breathability Index: 9.2/10</span>
                      <span>Zero Friction Flatlock</span>
                    </div>
                  </div>
                )}

                {currentScene === 2 && (
                  <div className="p-4 bg-white border border-zinc-200 rounded-sm mb-6 grid grid-cols-2 gap-3 text-xs">
                    <div className="border-r border-zinc-200 pr-2">
                      <span className="block font-mono text-zinc-400 text-[10px]">CUT TOLERANCE</span>
                      <span className="font-display font-bold text-zinc-950 text-base">±0.5 mm</span>
                    </div>
                    <div>
                      <span className="block font-mono text-zinc-400 text-[10px]">SEAM REINFORCE</span>
                      <span className="font-display font-bold text-red-600 text-base">14 SPI Flatlock</span>
                    </div>
                  </div>
                )}

                {currentScene === 3 && (
                  <div className="p-4 bg-white border border-zinc-200 rounded-sm mb-6">
                    <span className="block text-[11px] font-mono text-zinc-500 uppercase mb-2">
                      Interactive Swatch Color Shift:
                    </span>
                    <div className="flex items-center gap-3">
                      {[
                        { label: 'Onyx', hex: '#18181B' },
                        { label: 'Crimson', hex: '#DC2626' },
                        { label: 'Chalk White', hex: '#F4F4F5' },
                        { label: 'Cobalt', hex: '#2563EB' },
                      ].map((c) => (
                        <button
                          key={c.label}
                          onClick={() => setActiveCustomColor(c.hex)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                            activeCustomColor === c.hex ? 'scale-115 border-zinc-950' : 'border-zinc-300'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.label}
                        />
                      ))}
                      <span className="font-mono text-xs text-zinc-600 ml-2">
                        {activeCustomColor === '#DC2626'
                          ? 'Racing Crimson'
                          : activeCustomColor === '#18181B'
                          ? 'Stealth Onyx'
                          : activeCustomColor === '#2563EB'
                          ? 'Pro Cobalt'
                          : 'Chalk White'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Final Climax CTA Button for Scene 6 */}
                {currentScene === 5 ? (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={onStartCustomOrder}
                      className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>START YOUR CUSTOM ORDER</span>
                    </button>
                    <button
                      onClick={onExploreProducts}
                      className="px-6 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>EXPLORE PRODUCTS</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentScene((prev) => (prev + 1) % scenes.length)}
                      className="px-5 py-3 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Next Scene</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onStartCustomOrder}
                      className="px-5 py-3 bg-white border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                    >
                      Custom Order
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Visual Stage with Motion Overlays */}
              <div className="lg:col-span-7 relative">
                {/* Visual Frame */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-sm overflow-hidden border border-zinc-200 shadow-xl bg-zinc-900">
                  <motion.img
                    src={active.image}
                    alt={active.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                  {/* Dynamic Technical HUD Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white font-mono text-[10px] pointer-events-none">
                    <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-white/10 uppercase tracking-widest">
                      CAM FEED // SCENE 0{currentScene + 1}
                    </span>
                    <span className="bg-red-600/90 px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                      LIVE RENDER
                    </span>
                  </div>

                  {/* Scene Specific Overlay Effects */}
                  {currentScene === 1 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="w-48 h-48 border border-red-500/80 rounded-full flex items-center justify-center relative"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="absolute -top-6 font-mono text-[10px] text-white bg-black/80 px-2 py-0.5 rounded">
                          WEAVE SCANNER 480 GSM
                        </span>
                      </motion.div>
                    </div>
                  )}

                  {currentScene === 2 && (
                    <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
                      <div className="border-t border-l border-red-500 w-16 h-16" />
                      <div className="border-b border-r border-red-500 w-16 h-16 self-end" />
                    </div>
                  )}

                  {currentScene === 5 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/40 backdrop-blur-[2px]">
                      <motion.h4
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight font-display"
                      >
                        MK SPORTS
                      </motion.h4>
                      <p className="text-zinc-200 font-mono text-sm tracking-widest mt-2 uppercase">
                        YOUR VISION. OUR CRAFT.
                      </p>
                    </div>
                  )}

                  {/* Bottom Technical Caption */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                    <span className="font-mono text-xs uppercase tracking-wider">
                      {active.badge}
                    </span>
                    <span className="font-mono text-xs text-zinc-300">
                      MK-PRO-SPECS // REV 2026
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
