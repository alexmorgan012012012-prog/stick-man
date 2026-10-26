import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, ASSET_PATHS } from '../data/mockData';
import { Product } from '../types';
import {
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Sliders,
  Maximize2,
  ZoomIn,
  Check,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ProductShowcase3DProps {
  onAddToCart: (product: Product, color: string, size: string) => void;
  onOpenCustomizer: (product: Product) => void;
}

export const ProductShowcase3D: React.FC<ProductShowcase3DProps> = ({
  onAddToCart,
  onOpenCustomizer,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);
  const [currentAngle, setCurrentAngle] = useState<'front' | 'threeQuarter' | 'side' | 'back'>('front');
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [isZoomLens, setIsZoomLens] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const product = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const selectedColor = product.colorways[selectedColorIdx] || product.colorways[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10 to +10 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleAdd = () => {
    onAddToCart(product, selectedColor.name, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Rotation angles configuration
  const angles: { id: 'front' | 'threeQuarter' | 'side' | 'back'; label: string; rotY: number }[] = [
    { id: 'front', label: 'Front 0°', rotY: 0 },
    { id: 'threeQuarter', label: '3/4 Angle 45°', rotY: 25 },
    { id: 'side', label: 'Profile 90°', rotY: 55 },
    { id: 'back', label: 'Rear View 180°', rotY: 180 },
  ];

  return (
    <section className="relative w-full bg-white py-16 sm:py-24 border-b border-zinc-200 overflow-hidden">
      {/* Background Architectural Elements */}
      <div className="absolute inset-0 bg-grid-subtle opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-red-600" />
              <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                INTERACTIVE 2.5D / 3D SHOWCASE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tight font-display">
              DIMENSIONAL APPAREL EXPLORER
            </h2>
          </div>

          {/* Product Category Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {PRODUCTS.map((p) => {
              const active = p.id === selectedProductId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProductId(p.id);
                    setSelectedColorIdx(0);
                    setCurrentAngle('front');
                  }}
                  className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-zinc-950 text-white shadow-sm'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {p.category}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main 3D / Perspective Interactive Stage */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Interactive Stage Box */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-square sm:aspect-[4/3] w-full bg-gradient-to-b from-zinc-50 via-zinc-100/60 to-zinc-50 rounded-sm border border-zinc-200 p-8 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing shadow-inner perspective-1000 group"
            >
              {/* Technical Measurement Crosshairs */}
              <div className="absolute top-4 left-4 font-mono text-[10px] text-zinc-400 tracking-widest pointer-events-none">
                3D COORD // X: {tilt.y.toFixed(1)}° Y: {tilt.x.toFixed(1)}°
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                  LIGHT SHIFT ACTIVE
                </span>
              </div>

              {/* Floating Layered Product with Dynamic 3D CSS Transform */}
              <motion.div
                animate={{
                  rotateX: tilt.x,
                  rotateY: tilt.y + (angles.find((a) => a.id === currentAngle)?.rotY || 0),
                  scale: isZoomLens ? 1.35 : 1,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="relative w-4/5 h-4/5 max-w-md max-h-md flex items-center justify-center transform-style-3d select-none"
              >
                {/* Simulated dynamic soft shadow under floating garment */}
                <div
                  className="absolute -bottom-8 w-3/4 h-8 bg-zinc-950/15 rounded-full blur-xl transition-all duration-300"
                  style={{
                    transform: `translateX(${tilt.y * 1.5}px) scale(${isZoomLens ? 1.2 : 1})`,
                  }}
                />

                {/* Main Product Image Container */}
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-zinc-200/80 shadow-2xl bg-white">
                  <motion.img
                    key={`${product.id}-${currentAngle}-${selectedColorIdx}-${isZoomLens}`}
                    src={
                      isZoomLens
                        ? product.images.detail
                        : currentAngle === 'back'
                        ? product.images.back
                        : product.images.front
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0.8, filter: 'blur(2px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.35 }}
                  />

                  {/* Dynamic Lighting Glare Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at ${50 + tilt.y * 2}% ${
                        50 + tilt.x * 2
                      }%, rgba(255,255,255,0.8), transparent 60%)`,
                    }}
                  />

                  {/* Zoom mode indicator */}
                  {isZoomLens && (
                    <div className="absolute top-3 left-3 bg-zinc-950/90 text-white font-mono text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                      FABRIC MACRO LENS // 480 GSM
                    </div>
                  )}

                  {/* Rear view watermark */}
                  {currentAngle === 'back' && !isZoomLens && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white font-mono text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                      REAR SEAM ARCHITECTURE
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Floating Dimension Markers */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-zinc-500 pointer-events-none">
                <span>CHEST: 108CM · LENGTH: 72CM</span>
                <span className="text-red-600 font-bold uppercase">{selectedColor.name}</span>
              </div>
            </div>

            {/* Bottom 3D Angle Controls & Fabric Zoom Toggle */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {/* Rotation Angle Pills */}
              <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-sm border border-zinc-200">
                {angles.map((ang) => (
                  <button
                    key={ang.id}
                    onClick={() => {
                      setCurrentAngle(ang.id);
                      setIsZoomLens(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase rounded-sm transition-all cursor-pointer ${
                      currentAngle === ang.id && !isZoomLens
                        ? 'bg-zinc-950 text-white font-bold shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200'
                    }`}
                  >
                    {ang.label}
                  </button>
                ))}
              </div>

              {/* Zoom Macro Button */}
              <button
                onClick={() => setIsZoomLens(!isZoomLens)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider border rounded-sm transition-colors cursor-pointer ${
                  isZoomLens
                    ? 'border-red-600 bg-red-50 text-red-600 font-bold'
                    : 'border-zinc-200 bg-white hover:border-zinc-950 text-zinc-700'
                }`}
              >
                <ZoomIn className="w-3.5 h-3.5 text-red-600" />
                <span>{isZoomLens ? 'Exit Fabric Zoom' : 'Fabric Weave Zoom'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Specifications */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Category & Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600">
                {product.category}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                ITEM ID: {product.id}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight font-display mb-2">
              {product.name}
            </h3>

            {/* Price with Tabular Figures */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl sm:text-3xl font-bold font-display text-zinc-950 tabular-nums">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-base text-zinc-400 line-through tabular-nums">
                  ${product.originalPrice}
                </span>
              )}
              <span className="text-xs font-mono px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded uppercase">
                Free Express Over $150
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Colorway Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Select Colorway
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  {selectedColor.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colorways.map((c, idx) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                      selectedColorIdx === idx
                        ? 'scale-110 border-zinc-950 ring-2 ring-red-500/20'
                        : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColorIdx === idx && (
                      <Check
                        className={`w-4 h-4 ${
                          c.hex === '#FFFFFF' || c.hex === '#F4F4F5' ? 'text-zinc-950' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Select Athletic Size
                </span>
                <span className="text-xs text-zinc-500 hover:text-zinc-950 cursor-pointer underline">
                  Size Guide (CM/INCH)
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 text-xs font-bold font-mono uppercase tracking-wider border rounded-sm transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                        : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-8">
              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 font-bold text-xs uppercase tracking-wider rounded-sm transition-all duration-200 shadow-sm cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-950 hover:bg-red-600 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Shopping Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · ${product.price}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onOpenCustomizer(product)}
                className="flex items-center justify-center gap-2 py-3.5 px-5 border border-zinc-300 hover:border-zinc-950 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer bg-white"
              >
                <Sliders className="w-4 h-4 text-red-600" />
                <span>Customize in Lab</span>
              </button>
            </div>

            {/* Technical Specifications Accordion Details */}
            <div className="border-t border-zinc-200 pt-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">FABRIC WEAVE:</span>
                <span className="font-semibold text-zinc-900">{product.fabric}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">WEIGHT RATING:</span>
                <span className="font-semibold text-zinc-900 tabular-nums">{product.gsm} GSM Pro</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">FIT PROFILE:</span>
                <span className="font-semibold text-zinc-900">{product.specs.cut}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">MANUFACTURE:</span>
                <span className="font-semibold text-zinc-900">{product.specs.origin}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
