import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { X, Check, ShoppingBag, Sliders, ShieldCheck } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
  onCustomize: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onCustomize,
}) => {
  if (!product) return null;

  const [activeImageKey, setActiveImageKey] = useState<'front' | 'back' | 'detail'>('front');
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const selectedColor = product.colorways[selectedColorIdx] || product.colorways[0];

  const handleAdd = () => {
    onAddToCart(product, selectedColor.name, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-sm border border-zinc-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-zinc-400 hover:text-zinc-950 bg-white/80 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image Gallery */}
        <div className="md:w-1/2 bg-zinc-100 flex flex-col justify-between p-6">
          <div className="relative aspect-square w-full rounded-sm overflow-hidden border border-zinc-200 bg-white">
            <motion.img
              key={activeImageKey}
              src={product.images[activeImageKey]}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Thumbnail switcher */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {(['front', 'back', 'detail'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveImageKey(view)}
                className={`aspect-square rounded-sm overflow-hidden border-2 cursor-pointer transition-all ${
                  activeImageKey === view ? 'border-zinc-950' : 'border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <img
                  src={product.images[view]}
                  alt={view}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Action */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-red-600 uppercase tracking-widest">
                {product.category}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="font-mono text-xs text-zinc-400">{product.gsm} GSM</span>
            </div>

            <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight mb-2">
              {product.name}
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <span className="font-display text-2xl font-bold text-zinc-950 tabular-nums">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-zinc-400 line-through tabular-nums">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Colors */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-zinc-800 uppercase">Colorway:</span>
                <span className="font-mono text-zinc-500">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colorways.map((col, idx) => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      selectedColorIdx === idx ? 'scale-115 border-zinc-950 ring-2 ring-red-500/20' : 'border-zinc-300'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <span className="block text-xs font-semibold text-zinc-800 uppercase mb-1.5">
                Size:
              </span>
              <div className="flex items-center gap-1.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-9 h-8 text-xs font-mono font-bold uppercase rounded-sm border cursor-pointer ${
                      selectedSize === s
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-zinc-200">
            <button
              onClick={handleAdd}
              className={`w-full py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer shadow-sm ${
                isAdded ? 'bg-emerald-600 text-white' : 'bg-zinc-950 hover:bg-red-600 text-white'
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
              onClick={() => {
                onClose();
                onCustomize(product);
              }}
              className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 border border-zinc-300 hover:border-zinc-950 rounded-sm transition-colors cursor-pointer bg-white"
            >
              <Sliders className="w-3.5 h-3.5 text-red-600" />
              <span>Configure in Custom Lab</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
