import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MANUFACTURING_STAGES, ASSET_PATHS } from '../data/mockData';
import {
  Scissors,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Calculator,
  ArrowRight,
  X,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ManufacturingVisualizerProps {
  onStartOrderDirectly: () => void;
}

export const ManufacturingVisualizer: React.FC<ManufacturingVisualizerProps> = ({
  onStartOrderDirectly,
}) => {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);

  // Quote form state
  const [quoteData, setQuoteData] = useState({
    name: '',
    email: '',
    brandOrTeam: '',
    garment: 'Apex Heavyweight Fleece Hoodie',
    quantity: 50,
    technique: '3D High-Density Silicone',
    notes: '',
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState<boolean>(false);

  const activeStage = MANUFACTURING_STAGES[activeStepIdx];

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#DC2626', '#18181B', '#F4F4F5'],
    });
    setQuoteSubmitted(true);
    setTimeout(() => {
      setIsQuoteModalOpen(false);
      setQuoteSubmitted(false);
    }, 2800);
  };

  // Instant calculation
  const unitCost =
    quoteData.quantity >= 250
      ? 48
      : quoteData.quantity >= 100
      ? 56
      : quoteData.quantity >= 50
      ? 68
      : 82;
  const estimatedTotal = unitCost * quoteData.quantity;

  return (
    <section className="relative w-full bg-white py-16 sm:py-24 border-b border-zinc-200 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-red-600" />
              <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                ATELIER WORKSHOP & CRAFTSMANSHIP
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tight font-display">
              FROM YOUR IDEA TO YOUR COLLECTION.
            </h2>
          </div>

          <button
            onClick={() => setIsQuoteModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Calculator className="w-4 h-4" />
            <span>REQUEST A CUSTOM QUOTE</span>
          </button>
        </div>

        {/* 6-Step Interactive Stage Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {MANUFACTURING_STAGES.map((stg, idx) => {
            const isCurrent = activeStepIdx === idx;
            return (
              <button
                key={stg.step}
                onClick={() => setActiveStepIdx(idx)}
                className={`relative p-4 border text-left transition-all rounded-sm cursor-pointer ${
                  isCurrent
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-md'
                    : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      isCurrent ? 'text-red-400' : 'text-zinc-400'
                    }`}
                  >
                    STAGE {stg.step}
                  </span>
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />}
                </div>
                <h4 className="font-display text-xs font-bold uppercase tracking-tight line-clamp-2">
                  {stg.title}
                </h4>
                {isCurrent && (
                  <motion.div
                    layoutId="manufacturingLineIndicator"
                    className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-red-600"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Workshop Inspection Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-zinc-50 border border-zinc-200 rounded-sm p-6 sm:p-10">
          {/* Workshop Media with Technical CAD Overlay */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/10] w-full rounded-sm overflow-hidden border border-zinc-200 shadow-xl bg-zinc-900 group">
              <motion.img
                key={activeStepIdx}
                src={ASSET_PATHS.manufacturingCraft}
                alt={activeStage.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0.7, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />

              {/* Laser Cutting Alignment Lines Simulation */}
              <div className="absolute inset-0 pointer-events-none p-6">
                <div className="border border-white/20 h-full w-full relative">
                  {/* Horizontal scanning laser line */}
                  <motion.div
                    animate={{ y: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="w-full h-[1px] bg-red-500 shadow-[0_0_8px_#ef4444]"
                  />
                  {/* Measurement crosses */}
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-white/70">
                    ALIGN: CAD-0{activeStepIdx + 1}
                  </div>
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono text-red-400">
                    TOLERANCE: ±0.5MM
                  </div>
                </div>
              </div>

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Bottom Stage Details */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white pointer-events-none">
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-red-400 uppercase block mb-1">
                    MK INDUSTRIAL ATELIER // FACILITY 02
                  </span>
                  <p className="font-display text-lg font-bold uppercase tracking-tight">
                    {activeStage.tagline}
                  </p>
                </div>
                <span className="font-mono text-xs bg-red-600 px-2 py-0.5 rounded font-bold">
                  {activeStage.metric}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Stage Description & Technical Specs */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-mono text-xs font-bold text-red-600 uppercase tracking-widest mb-2">
              STAGE {activeStage.step} OF 06
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight font-display mb-4">
              {activeStage.title}
            </h3>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-6">
              {activeStage.description}
            </p>

            {/* Technical Bullet Points with Hairline Dividers */}
            <div className="space-y-3 mb-8 border-t border-b border-zinc-200 py-4">
              {activeStage.specs.map((spec, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="px-6 py-3 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-sm flex items-center gap-2"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onStartOrderDirectly}
                className="px-5 py-3 bg-white border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Open Design Studio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Request Custom Quote Interactive Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-sm border border-zinc-200 shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-950 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {quoteSubmitted ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight mb-2">
                  CUSTOM SPECIFICATION SAVED
                </h3>
                <p className="text-sm text-zinc-600 max-w-md">
                  Thank you, {quoteData.name}. Your custom quote inquiry for {quoteData.quantity} units of {quoteData.garment} has been registered with MK Atelier Production. An engineer will respond within 4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-[2px] bg-red-600" />
                  <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                    MK BESPOKE QUOTATION
                  </span>
                </div>
                <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight mb-6">
                  REQUEST MANUFACTURING QUOTE
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={quoteData.name}
                        onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })}
                        placeholder="Marcus Vance"
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Business / Team Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={quoteData.email}
                        onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                        placeholder="marcus@apexclub.com"
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Brand or Organization
                      </label>
                      <input
                        type="text"
                        value={quoteData.brandOrTeam}
                        onChange={(e) => setQuoteData({ ...quoteData, brandOrTeam: e.target.value })}
                        placeholder="Apex Athletic"
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Garment Type
                      </label>
                      <select
                        value={quoteData.garment}
                        onChange={(e) => setQuoteData({ ...quoteData, garment: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none font-medium"
                      >
                        <option>Apex Heavyweight Fleece Hoodie (480 GSM)</option>
                        <option>Aero-Speed Pro Tracksuit (2-Piece)</option>
                        <option>HyperVent Matchday Jersey</option>
                        <option>WeatherShield Technical Anorak</option>
                        <option>Core Kinetic Training Tee (240 GSM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Order Quantity (MOQ: 25)
                      </label>
                      <input
                        type="number"
                        min="25"
                        max="5000"
                        step="5"
                        value={quoteData.quantity}
                        onChange={(e) => setQuoteData({ ...quoteData, quantity: parseInt(e.target.value) || 25 })}
                        className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Graphic Execution
                      </label>
                      <select
                        value={quoteData.technique}
                        onChange={(e) => setQuoteData({ ...quoteData, technique: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      >
                        <option>3D High-Density Silicone</option>
                        <option>Tactile Precision Embroidery</option>
                        <option>Digital Breathable Sublimation</option>
                        <option>Ultra-Matte Heat Seal</option>
                      </select>
                    </div>
                  </div>

                  {/* Live Cost Estimation Summary */}
                  <div className="p-4 bg-zinc-100 rounded-sm border border-zinc-200 flex items-center justify-between">
                    <div>
                      <span className="block font-mono text-[10px] text-zinc-500 uppercase">
                        ESTIMATED UNIT TIER
                      </span>
                      <span className="font-display font-bold text-zinc-950 text-base tabular-nums">
                        ${unitCost} / piece
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block font-mono text-[10px] text-zinc-500 uppercase">
                        ESTIMATED RUN TOTAL
                      </span>
                      <span className="font-display font-bold text-red-600 text-xl tabular-nums">
                        ${estimatedTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Project Notes & Custom Requirements
                    </label>
                    <textarea
                      rows={2}
                      value={quoteData.notes}
                      onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                      placeholder="Color palette, pantone matches, target delivery date..."
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold uppercase text-zinc-600 hover:text-zinc-950 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Tech Pack Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
