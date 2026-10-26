import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ShoppingBag, Eye, Check, Sliders } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
  onCustomize: (product: Product) => void;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onCustomize,
  index,
}) => {
  const [activeColorIdx, setActiveColorIdx] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const activeColor = product.colorways[activeColorIdx] || product.colorways[0];

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, activeColor.name, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col bg-white border border-zinc-200 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-zinc-400"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area with Alternate View Reveal */}
      <div className="relative aspect-[4/5] w-full bg-zinc-100 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        {/* Main Front Image */}
        <motion.img
          src={product.images.front}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
        />

        {/* Secondary Detail Image on Hover */}
        <motion.img
          src={product.images.detail}
          alt={`${product.name} detail`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
          }`}
        />

        {/* Subtle Top Tags */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="font-mono text-[10px] tracking-widest text-zinc-600 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-sm uppercase border border-zinc-200">
            {product.gsm} GSM
          </span>
          <span className="font-mono text-[10px] tracking-wider text-red-600 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-sm uppercase border border-red-200">
            IN STOCK
          </span>
        </div>

        {/* Quick Action Overlay (Desktop Hover & Mobile Accessible) */}
        <div
          className={`absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white/95 hover:bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-sm shadow-md transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-700" />
            <span>Quick View</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCustomize(product);
            }}
            title="Custom Design this item"
            className="p-2 bg-white/95 hover:bg-zinc-950 hover:text-white text-zinc-950 rounded-sm shadow-md transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Category & Color Count */}
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
            <span className="font-mono uppercase tracking-widest text-[11px] text-zinc-400">
              {product.category}
            </span>
            <span className="font-mono text-[11px]">
              {product.colorways.length} Colors
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-display text-base font-bold text-zinc-950 uppercase tracking-tight line-clamp-1 hover:text-red-600 cursor-pointer transition-colors mb-2"
          >
            {product.name}
          </h3>

          {/* Fabric Line */}
          <p className="text-xs text-zinc-500 line-clamp-1 mb-4">
            {product.fabric}
          </p>
        </div>

        <div>
          {/* Colorway Swatches */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              {product.colorways.map((col, cIdx) => (
                <button
                  key={col.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveColorIdx(cIdx);
                  }}
                  className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                    activeColorIdx === cIdx ? 'scale-120 border-zinc-950 ring-1 ring-zinc-400' : 'border-zinc-300'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>

            {/* Price in Tabular Numerals */}
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-zinc-950 tabular-nums">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-400 line-through tabular-nums">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer shadow-sm ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-950 hover:bg-red-600 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
