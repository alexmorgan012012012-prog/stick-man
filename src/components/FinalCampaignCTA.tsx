import React from 'react';
import { motion } from 'motion/react';
import { ASSET_PATHS } from '../data/mockData';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';

interface FinalCampaignCTAProps {
  onStartCustomOrder: () => void;
  onExploreProducts: () => void;
}

export const FinalCampaignCTA: React.FC<FinalCampaignCTAProps> = ({
  onStartCustomOrder,
  onExploreProducts,
}) => {
  const steps = ['YOUR IDEA.', 'YOUR DESIGN.', 'YOUR COLLECTION.'];

  return (
    <section className="relative w-full bg-white py-20 sm:py-32 border-b border-zinc-200 overflow-hidden">
      {/* Background Subtle Grid & Hairline Guides */}
      <div className="absolute inset-0 bg-grid-subtle opacity-50 pointer-events-none" />

      {/* Decorative Technical Borders */}
      <div className="hidden lg:block absolute left-12 top-0 bottom-0 w-[1px] bg-zinc-100" />
      <div className="hidden lg:block absolute right-12 top-0 bottom-0 w-[1px] bg-zinc-100" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Kinetic Stepped Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Precision Micro-Kicker */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-red-600" />
              <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                MK SPORTS // THE APPAREL PARTNERSHIP
              </span>
            </div>

            {/* Stepped Animated Words */}
            <div className="space-y-1 mb-6">
              {steps.map((step, idx) => (
                <motion.h3
                  key={step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-400 uppercase tracking-tight font-display hover:text-zinc-950 transition-colors"
                >
                  {step}
                </motion.h3>
              ))}
            </div>

            {/* Climax Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-zinc-950 uppercase tracking-tight font-display leading-[1.05] mb-8"
            >
              LET’S BUILD SOMETHING GREAT.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-xl mb-10"
            >
              From bespoke team kits to private-label luxury streetwear drops, we handle fabric milling, pattern engineering, 3D silicone printing, and global fulfillment.
            </motion.p>

            {/* The Dual CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={onStartCustomOrder}
                className="group flex items-center gap-3 px-8 py-4 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all duration-200 shadow-md cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-red-400 group-hover:text-white" />
                <span>START YOUR CUSTOM ORDER</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreProducts}
                className="flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-sm border border-zinc-300 hover:border-zinc-950 transition-colors cursor-pointer whitespace-nowrap shadow-sm hover:bg-zinc-50"
              >
                <span>EXPLORE PRODUCTS</span>
              </button>
            </motion.div>
          </div>

          {/* Right Column: High-End Fashion Showroom Visual */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-3 -right-3 w-20 h-20 border-t-2 border-r-2 border-red-600 pointer-events-none" />
            <div className="absolute -bottom-3 -left-3 w-20 h-20 border-b-2 border-l-2 border-zinc-400 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] rounded-sm overflow-hidden border border-zinc-200 shadow-2xl bg-zinc-100 group"
            >
              <img
                src={ASSET_PATHS.customCollection}
                alt="MK SPORTS Showroom Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                <span className="font-mono text-[10px] tracking-widest bg-red-600 px-2 py-0.5 rounded uppercase block w-fit mb-2">
                  CUSTOM RUN ARCHIVE
                </span>
                <h4 className="font-display text-xl font-bold uppercase tracking-tight">
                  INTERNATIONAL CLIENT SHOWCASE
                </h4>
                <p className="font-mono text-xs text-zinc-300 mt-1">
                  1,200+ TEAMS & LABELS EQUIPPED WORLDWIDE
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
