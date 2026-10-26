import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomDesignState, Product } from '../types';
import {
  Upload,
  RotateCw,
  Sparkles,
  Layers,
  Palette,
  CheckCircle2,
  Sliders,
  ShoppingBag,
  Download,
  Share2,
  FileCheck,
  Check,
  Undo2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomDesignStudioProps {
  initialGarment?: string;
  onAddToCartCustom: (customItem: any) => void;
  onInquirySubmitted?: (inquiry: any) => void;
}

export const CustomDesignStudio: React.FC<CustomDesignStudioProps> = ({
  initialGarment = 'hoodie',
  onAddToCartCustom,
  onInquirySubmitted,
}) => {
  const [designState, setDesignState] = useState<CustomDesignState>({
    garmentType: (initialGarment as any) || 'hoodie',
    baseColor: '#F4F4F5',
    secondaryColor: '#27272A',
    accentColor: '#DC2626',
    logoUrl: '',
    logoPosition: 'chest-left',
    logoScale: 1,
    logoRotation: 0,
    customText: 'MK ATHLETICS',
    customNumber: '26',
    fontFamily: 'Outfit',
    textColor: '#18181B',
    printMethod: '3D High-Density Silicone',
    quantity: 50,
    deliverySpeed: 'standard',
    notes: '',
  });

  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [selectedPresetLogo, setSelectedPresetLogo] = useState<string>('mk-crest');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [inquiryId, setInquiryId] = useState<string>('');
  const [customAddedToCart, setCustomAddedToCart] = useState<boolean>(false);

  const garments = [
    { id: 'hoodie', name: 'Apex Fleece Hoodie', baseGsm: 480, defaultPrice: 78 },
    { id: 'tracksuit', name: 'Pro Aero Tracksuit', baseGsm: 320, defaultPrice: 95 },
    { id: 'jersey', name: 'HyperVent Match Jersey', baseGsm: 180, defaultPrice: 42 },
    { id: 'windbreaker', name: 'WeatherShield Anorak', baseGsm: 210, defaultPrice: 85 },
    { id: 'tee', name: 'Core Kinetic Tee', baseGsm: 240, defaultPrice: 32 },
  ];

  const presetColors = [
    { name: 'Chalk White', hex: '#FFFFFF' },
    { name: 'Onyx Black', hex: '#18181B' },
    { name: 'Racing Crimson', hex: '#DC2626' },
    { name: 'Graphite Slate', hex: '#3F3F46' },
    { name: 'Glacier Blue', hex: '#0284C7' },
    { name: 'Forest Green', hex: '#166534' },
    { name: 'Desert Sand', hex: '#D6D3D1' },
  ];

  const presetLogos = [
    { id: 'mk-crest', label: 'MK Crest', icon: 'M·K' },
    { id: 'apex-wing', label: 'Apex Wing', icon: '▲' },
    { id: 'velocity-star', label: 'Velocity Star', icon: '✦' },
    { id: 'minimal-line', label: 'Aero Bar', icon: '≡' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setDesignState((prev) => ({
            ...prev,
            logoUrl: uploadEvent.target?.result as string,
          }));
          setSelectedPresetLogo('custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Pricing formula with quantity curve
  const currentGarment = garments.find((g) => g.id === designState.garmentType) || garments[0];
  const quantityDiscount =
    designState.quantity >= 250
      ? 0.4
      : designState.quantity >= 100
      ? 0.3
      : designState.quantity >= 50
      ? 0.15
      : 0;

  const unitPrice = Math.round(currentGarment.defaultPrice * (1 - quantityDiscount));
  const estimatedTotal = unitPrice * designState.quantity;

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `MK-CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      setInquiryId(generatedId);
      setIsSubmitting(false);
      setIsSubmitted(true);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#DC2626', '#18181B', '#E4E4E7'],
      });

      if (onInquirySubmitted) {
        onInquirySubmitted({
          id: generatedId,
          design: designState,
          unitPrice,
          total: estimatedTotal,
          date: new Date().toLocaleDateString(),
        });
      }
    }, 1200);
  };

  const handleAddSampleToCart = () => {
    onAddToCartCustom({
      id: `custom-${Date.now()}`,
      productId: `mk-custom-${designState.garmentType}`,
      name: `Custom ${currentGarment.name} (Sample Spec)`,
      price: currentGarment.defaultPrice + 20, // Sample surcharge
      image: '/src/assets/images/hoodie_product_editorial_1793036217712.jpg',
      selectedColor: designState.baseColor,
      selectedSize: 'L',
      quantity: 1,
      isCustom: true,
      customDetails: {
        garment: currentGarment.name,
        colors: `Base: ${designState.baseColor}, Trim: ${designState.secondaryColor}`,
        printMethod: designState.printMethod,
        customText: `${designState.customText} #${designState.customNumber}`,
      },
    });

    setCustomAddedToCart(true);
    setTimeout(() => setCustomAddedToCart(false), 2000);
  };

  return (
    <section className="relative w-full bg-white py-16 sm:py-24 border-b border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-red-600" />
              <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                BESPOKE APPAREL CONFIGURATOR
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tight font-display">
              MK CUSTOM DESIGN LAB
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-500 uppercase">
              LIVE 2.5D TECH PACK ENGINE
            </span>
          </div>
        </div>

        {/* Main Design Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive 2.5D Apparel Render Stage */}
          <div className="lg:col-span-7 flex flex-col sticky top-24">
            {/* The Live Interactive Canvas Stage */}
            <div className="relative aspect-square sm:aspect-[4/3] w-full bg-zinc-50 rounded-sm border border-zinc-200 p-8 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Background Hairlines */}
              <div className="absolute inset-0 bg-grid-subtle opacity-60 pointer-events-none" />

              {/* View Indicators */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  RENDER: {activeView.toUpperCase()} VIEW
                </span>
              </div>

              <div className="absolute top-4 right-4 font-mono text-[10px] text-zinc-400">
                {currentGarment.baseGsm} GSM FABRIC WEIGHT
              </div>

              {/* SVG / Vector Apparel Mockup with Live Dynamic Color Fill & Geometry */}
              <motion.div
                key={`${designState.garmentType}-${activeView}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative w-4/5 h-4/5 max-w-sm flex items-center justify-center select-none"
              >
                {/* Simulated Soft Ambient Shadow */}
                <div className="absolute -bottom-6 w-3/4 h-8 bg-zinc-900/10 rounded-full blur-xl" />

                {/* SVG Silhouettes with Live Reactive Color Fills */}
                <svg
                  viewBox="0 0 400 450"
                  className="w-full h-full drop-shadow-xl overflow-visible transition-colors duration-300"
                >
                  <defs>
                    <linearGradient id="fabricShading" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
                    </linearGradient>
                  </defs>

                  {/* Garment Base Body */}
                  <path
                    d={
                      designState.garmentType === 'hoodie'
                        ? 'M 140 70 C 170 85 230 85 260 70 L 330 110 L 300 240 L 260 220 L 260 410 L 140 410 L 140 220 L 100 240 L 70 110 Z'
                        : designState.garmentType === 'tracksuit'
                        ? 'M 130 80 L 200 95 L 270 80 L 340 120 L 310 260 L 270 240 L 270 415 L 130 415 L 130 240 L 90 260 L 60 120 Z'
                        : designState.garmentType === 'jersey'
                        ? 'M 140 60 C 170 80 230 80 260 60 L 340 110 L 300 220 L 265 200 L 265 420 L 135 420 L 135 200 L 100 220 L 60 110 Z'
                        : 'M 140 60 C 170 75 230 75 260 60 L 340 110 L 305 210 L 265 190 L 265 420 L 135 420 L 135 190 L 95 210 L 60 110 Z'
                    }
                    fill={designState.baseColor}
                    stroke="#18181B"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />

                  {/* Shading overlay */}
                  <path
                    d={
                      designState.garmentType === 'hoodie'
                        ? 'M 140 70 C 170 85 230 85 260 70 L 330 110 L 300 240 L 260 220 L 260 410 L 140 410 L 140 220 L 100 240 L 70 110 Z'
                        : 'M 140 60 C 170 80 230 80 260 60 L 340 110 L 300 220 L 265 200 L 265 420 L 135 420 L 135 200 L 100 220 L 60 110 Z'
                    }
                    fill="url(#fabricShading)"
                  />

                  {/* Secondary Panel Trims (Sleeves / Flanks) */}
                  <path
                    d="M 260 220 L 260 410 L 275 410 L 275 210 Z"
                    fill={designState.secondaryColor}
                  />
                  <path
                    d="M 140 220 L 140 410 L 125 410 L 125 210 Z"
                    fill={designState.secondaryColor}
                  />

                  {/* Accent Seam Lines */}
                  <line
                    x1="140"
                    y1="220"
                    x2="140"
                    y2="410"
                    stroke={designState.accentColor}
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                  <line
                    x1="260"
                    y1="220"
                    x2="260"
                    y2="410"
                    stroke={designState.accentColor}
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />

                  {/* Collar / Hood Detail */}
                  {designState.garmentType === 'hoodie' ? (
                    <g>
                      <path
                        d="M 140 70 C 160 30 240 30 260 70 C 240 100 160 100 140 70 Z"
                        fill={designState.secondaryColor}
                        stroke="#18181B"
                        strokeWidth="2.5"
                      />
                      {/* Drawstrings */}
                      <line x1="185" y1="95" x2="185" y2="150" stroke={designState.accentColor} strokeWidth="3" />
                      <line x1="215" y1="95" x2="215" y2="150" stroke={designState.accentColor} strokeWidth="3" />
                    </g>
                  ) : (
                    <path
                      d="M 160 68 C 180 85 220 85 240 68 C 220 95 180 95 160 68 Z"
                      fill={designState.secondaryColor}
                      stroke="#18181B"
                      strokeWidth="2"
                    />
                  )}

                  {/* Kangaroo Pocket (for hoodie front) */}
                  {designState.garmentType === 'hoodie' && activeView === 'front' && (
                    <path
                      d="M 160 310 L 240 310 L 255 380 L 145 380 Z"
                      fill={designState.baseColor}
                      stroke="#18181B"
                      strokeWidth="2"
                      filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
                    />
                  )}

                  {/* Hem & Cuff Ribbing */}
                  <rect x="140" y="400" width="120" height="15" fill={designState.secondaryColor} stroke="#18181B" strokeWidth="2" />
                </svg>

                {/* Animated Logo Placement Overlay */}
                {activeView === 'front' && (
                  <motion.div
                    animate={{
                      scale: designState.logoScale,
                      rotate: designState.logoRotation,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`absolute flex items-center justify-center p-1 cursor-move transition-all ${
                      designState.logoPosition === 'chest-left'
                        ? 'top-[32%] left-[34%]'
                        : designState.logoPosition === 'chest-center'
                        ? 'top-[32%] left-[45%]'
                        : 'top-[35%] right-[25%]'
                    }`}
                  >
                    {designState.logoUrl ? (
                      <img
                        src={designState.logoUrl}
                        alt="Custom Logo"
                        className="w-10 h-10 object-contain drop-shadow"
                      />
                    ) : (
                      <div className="px-2 py-1 bg-zinc-950 text-white font-display text-[10px] font-black rounded-sm border border-red-500 shadow-sm flex items-center gap-1">
                        <span className="text-red-500">
                          {presetLogos.find((l) => l.id === selectedPresetLogo)?.icon || 'M·K'}
                        </span>
                        <span>{designState.customText.slice(0, 6)}</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Rear View Typography Placement */}
                {activeView === 'back' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
                    <p
                      className="font-display font-black text-xl tracking-wider uppercase drop-shadow"
                      style={{ color: designState.textColor }}
                    >
                      {designState.customText}
                    </p>
                    <p
                      className="font-display font-black text-6xl tracking-tight uppercase leading-none drop-shadow"
                      style={{ color: designState.textColor }}
                    >
                      {designState.customNumber}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* View Toggle Bar (Front / Back) */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white p-1 rounded-sm border border-zinc-200 shadow-sm">
                <button
                  onClick={() => setActiveView('front')}
                  className={`px-3 py-1 text-xs font-mono tracking-wider uppercase rounded-sm cursor-pointer transition-colors ${
                    activeView === 'front'
                      ? 'bg-zinc-950 text-white font-bold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  Front View
                </button>
                <button
                  onClick={() => setActiveView('back')}
                  className={`px-3 py-1 text-xs font-mono tracking-wider uppercase rounded-sm cursor-pointer transition-colors ${
                    activeView === 'back'
                      ? 'bg-zinc-950 text-white font-bold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  Back View
                </button>
              </div>

              {/* Reset to Default */}
              <button
                onClick={() =>
                  setDesignState({
                    garmentType: 'hoodie',
                    baseColor: '#F4F4F5',
                    secondaryColor: '#27272A',
                    accentColor: '#DC2626',
                    logoUrl: '',
                    logoPosition: 'chest-left',
                    logoScale: 1,
                    logoRotation: 0,
                    customText: 'MK ATHLETICS',
                    customNumber: '26',
                    fontFamily: 'Outfit',
                    textColor: '#18181B',
                    printMethod: '3D High-Density Silicone',
                    quantity: 50,
                    deliverySpeed: 'standard',
                    notes: '',
                  })
                }
                title="Reset Configuration"
                className="absolute bottom-4 right-4 p-2 bg-white text-zinc-500 hover:text-zinc-950 border border-zinc-200 rounded-sm cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Sample Order Trigger Under Stage */}
            <div className="mt-4 p-4 bg-zinc-50 border border-zinc-200 rounded-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-900 uppercase">
                  Need a Physical Prototype First?
                </span>
                <p className="text-[11px] text-zinc-500">
                  Order 1 custom-tailored sample with your colors and logo before mass production.
                </p>
              </div>
              <button
                onClick={handleAddSampleToCart}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                  customAddedToCart
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-950 hover:bg-red-600 text-white'
                }`}
              >
                {customAddedToCart ? 'Sample Added!' : 'Add Sample to Bag'}
              </button>
            </div>
          </div>

          {/* Right Column: Customization Controls Panel */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Step 1: Silhouette Choice */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  01 // Choose Silhouette
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  {currentGarment.name}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {garments.map((g) => {
                  const active = designState.garmentType === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setDesignState({ ...designState, garmentType: g.id as any })}
                      className={`p-2.5 text-left border rounded-sm transition-all cursor-pointer ${
                        active
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                          : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-800'
                      }`}
                    >
                      <p className="font-display text-xs font-bold uppercase truncate">{g.name}</p>
                      <span className={`text-[10px] font-mono ${active ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {g.baseGsm} GSM
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Tri-Color Palette Architecture */}
            <div>
              <span className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                02 // Tri-Tone Color Architecture
              </span>
              <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-200 rounded-sm">
                {/* Base Body Color */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-zinc-700">Base Fabric Tone:</span>
                    <span className="font-mono text-zinc-500">{designState.baseColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {presetColors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setDesignState({ ...designState, baseColor: c.hex })}
                        className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                          designState.baseColor === c.hex ? 'scale-120 border-zinc-950 ring-2 ring-red-500/20' : 'border-zinc-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Secondary Panels Color */}
                <div className="pt-2 border-t border-zinc-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-zinc-700">Secondary Panels & Cuffs:</span>
                    <span className="font-mono text-zinc-500">{designState.secondaryColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {presetColors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setDesignState({ ...designState, secondaryColor: c.hex })}
                        className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                          designState.secondaryColor === c.hex ? 'scale-120 border-zinc-950 ring-2 ring-red-500/20' : 'border-zinc-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Accent Trim Color */}
                <div className="pt-2 border-t border-zinc-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-zinc-700">Accent Seams & Cords:</span>
                    <span className="font-mono text-red-600 font-bold">{designState.accentColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {presetColors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setDesignState({ ...designState, accentColor: c.hex })}
                        className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                          designState.accentColor === c.hex ? 'scale-120 border-zinc-950 ring-2 ring-red-500/20' : 'border-zinc-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Logo & Crest Placement */}
            <div>
              <span className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                03 // Logo & Crest Positioning
              </span>
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-3">
                {/* Preset emblems or upload */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {presetLogos.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPresetLogo(p.id);
                        setDesignState({ ...designState, logoUrl: '' });
                      }}
                      className={`p-2 text-center border rounded-sm transition-all cursor-pointer ${
                        selectedPresetLogo === p.id
                          ? 'border-zinc-950 bg-zinc-950 text-white'
                          : 'border-zinc-200 bg-white text-zinc-700'
                      }`}
                    >
                      <span className="font-bold text-sm block">{p.icon}</span>
                      <span className="text-[10px] font-mono uppercase">{p.label}</span>
                    </button>
                  ))}
                </div>

                {/* Upload own logo button */}
                <label className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-dashed border-zinc-300 hover:border-zinc-950 rounded-sm cursor-pointer text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-950 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-red-600" />
                  <span>Upload Vector / Image File (PNG/SVG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>

                {/* Position Switcher */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200">
                  <span className="text-xs font-semibold text-zinc-700">Placement:</span>
                  <div className="flex items-center gap-1">
                    {(['chest-left', 'chest-center', 'sleeve'] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setDesignState({ ...designState, logoPosition: pos })}
                        className={`px-2.5 py-1 text-[11px] font-mono uppercase rounded-sm border cursor-pointer ${
                          designState.logoPosition === pos
                            ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                            : 'bg-white border-zinc-200 text-zinc-600'
                        }`}
                      >
                        {pos.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Rear Custom Typography */}
            <div>
              <span className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                04 // Rear Team Name & Athletic Number
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                    Squad Name / Brand
                  </label>
                  <input
                    type="text"
                    value={designState.customText}
                    onChange={(e) => setDesignState({ ...designState, customText: e.target.value })}
                    className="w-full px-3 py-2 text-xs uppercase font-bold bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                    Jersey Number
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={designState.customNumber}
                    onChange={(e) => setDesignState({ ...designState, customNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Manufacturing Method & Quantity */}
            <div>
              <span className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                05 // Production Run & Technique
              </span>
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                    Application Method
                  </label>
                  <select
                    value={designState.printMethod}
                    onChange={(e) => setDesignState({ ...designState, printMethod: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                  >
                    <option>3D High-Density Silicone</option>
                    <option>Tactile Precision Embroidery</option>
                    <option>Digital Breathable Sublimation</option>
                    <option>Ultra-Matte Heat Seal</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-zinc-700">Batch Quantity (MOQ 25):</span>
                    <span className="font-mono font-bold text-zinc-950">{designState.quantity} Units</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="500"
                    step="25"
                    value={designState.quantity}
                    onChange={(e) => setDesignState({ ...designState, quantity: parseInt(e.target.value) })}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mt-1">
                    <span>25 pcs</span>
                    <span>100 pcs (-15%)</span>
                    <span>250 pcs (-30%)</span>
                    <span>500+ pcs (-40%)</span>
                  </div>
                </div>

                {/* Instant Quote Totals */}
                <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-zinc-500 uppercase">
                      Calculated Unit Price
                    </span>
                    <span className="font-display font-bold text-zinc-950 text-lg tabular-nums">
                      ${unitPrice} <span className="text-xs text-zinc-500 font-normal">/ pc</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-mono text-zinc-500 uppercase">
                      Total Production Cost
                    </span>
                    <span className="font-display font-black text-red-600 text-2xl tabular-nums">
                      ${estimatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Section */}
            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-sm text-center animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-display text-lg font-black text-zinc-950 uppercase tracking-tight">
                  TECH PACK INQUIRY REGISTERED!
                </h4>
                <p className="font-mono text-xs text-zinc-600 mt-1">
                  REFERENCE NUMBER: <span className="font-bold text-zinc-900">{inquiryId}</span>
                </p>
                <p className="text-xs text-zinc-600 mt-2">
                  Our pattern masters are preparing the CAD cutting file for your {currentGarment.name}. We will email you the formal tech pack proof within 4 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-zinc-950 text-white text-xs font-bold uppercase rounded-sm cursor-pointer"
                >
                  Create Another Spec
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmitInquiry}
                disabled={isSubmitting}
                className="w-full py-4 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="font-mono animate-pulse">GENERATING CAD TECH PACK...</span>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4 text-red-500" />
                    <span>Lock In Design & Request Atelier Tech Pack</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
