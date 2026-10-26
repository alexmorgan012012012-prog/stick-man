import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import {
  ShoppingBag,
  Heart,
  Share2,
  Check,
  Shield,
  Layers,
  Sparkles,
  Sliders,
  Ruler,
  ChevronRight,
  ArrowLeft,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, color: string, size: string, quantity: number) => void;
  onCustomize: (product: Product) => void;
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onCustomize,
  onSelectRelated,
}) => {
  const [activeImageKey, setActiveImageKey] = useState<'front' | 'back' | 'detail'>('front');
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'fabric' | 'care' | 'shipping'>('specs');
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [showSizeModal, setShowSizeModal] = useState<boolean>(false);

  const selectedColor = product.colorways[selectedColorIdx] || product.colorways[0];
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    onAddToCart(product, selectedColor.name, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="w-full bg-white min-h-screen py-8 sm:py-12 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation & breadcrumbs */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Collection</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>COLLECTION</span>
            <span>/</span>
            <span className="uppercase text-zinc-600">{product.category}</span>
            <span>/</span>
            <span className="text-zinc-950 font-bold uppercase truncate max-w-xs">{product.name}</span>
          </div>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Column: Gallery & Alternate Views */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Primary High-Resolution Image Frame */}
            <div className="relative aspect-square sm:aspect-[4/3] w-full bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200 shadow-sm">
              <motion.img
                key={activeImageKey}
                src={product.images[activeImageKey]}
                alt={product.name}
                className="w-full h-full object-cover select-none"
                initial={{ opacity: 0.85, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
              />

              {/* View Overlay Indicators */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm border border-zinc-200 font-mono text-[10px] uppercase font-bold text-zinc-800">
                VIEW: {activeImageKey.toUpperCase()}
              </div>

              {product.stockQuantity <= 10 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-2.5 py-1 rounded-sm font-mono text-[10px] uppercase font-bold">
                  Low Stock ({product.stockQuantity} Remaining)
                </div>
              )}
            </div>

            {/* Thumbnail Switcher */}
            <div className="grid grid-cols-3 gap-3">
              {(['front', 'back', 'detail'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveImageKey(view)}
                  className={`aspect-[4/3] rounded-sm overflow-hidden border-2 cursor-pointer transition-all ${
                    activeImageKey === view ? 'border-zinc-950 shadow-md' : 'border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <img
                    src={product.images[view]}
                    alt={view}
                    className="w-full h-full object-cover"
                  />
                  <span className="block text-[10px] font-mono uppercase text-center py-1 bg-zinc-50 border-t border-zinc-200 text-zinc-600">
                    {view}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Category, SKU & Stock */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
              <span className="uppercase text-red-600 font-bold">{product.category}</span>
              <span>SKU: {product.sku}</span>
            </div>

            {/* Product Title */}
            <h1 className="font-display text-3xl sm:text-4xl font-black text-zinc-950 uppercase tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Price with Sale Price comparison */}
            <div className="flex items-center gap-3 mb-6">
              {product.salePrice ? (
                <>
                  <span className="font-display text-3xl font-black text-red-600 tabular-nums">
                    ${product.salePrice}
                  </span>
                  <span className="font-display text-xl text-zinc-400 line-through tabular-nums">
                    ${product.price}
                  </span>
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-mono font-bold uppercase rounded">
                    Sale
                  </span>
                </>
              ) : (
                <span className="font-display text-3xl font-black text-zinc-950 tabular-nums">
                  ${product.price}
                </span>
              )}
              <span className="text-xs font-mono text-zinc-500 ml-auto">
                {product.inStock ? '✓ Ready for Dispatch' : 'Backorder'}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Colorway Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-zinc-900 uppercase">Selected Color:</span>
                <span className="font-mono text-zinc-500">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colorways.map((col, idx) => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                      selectedColorIdx === idx
                        ? 'scale-115 border-zinc-950 ring-2 ring-red-500/20'
                        : 'border-zinc-300 hover:border-zinc-400'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {selectedColorIdx === idx && (
                      <Check
                        className={`w-4 h-4 ${
                          col.hex === '#FFFFFF' || col.hex === '#F4F4F5' ? 'text-zinc-950' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizing & Size Guide Modal Trigger */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-zinc-900 uppercase">Select Athletic Size:</span>
                <button
                  onClick={() => setShowSizeModal(true)}
                  className="flex items-center gap-1 text-zinc-600 hover:text-red-600 underline font-mono text-[11px] cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5 text-red-600" />
                  <span>Size Chart (CM / IN)</span>
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 text-xs font-mono font-bold uppercase rounded-sm border transition-all cursor-pointer ${
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

            {/* Quantity Stepper & Actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-zinc-300 rounded-sm bg-zinc-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-xs font-bold text-zinc-700 hover:bg-zinc-200 rounded cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono font-bold text-zinc-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-xs font-bold text-zinc-700 hover:bg-zinc-200 rounded cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAdd}
                className={`flex-1 py-3.5 px-6 font-bold text-xs uppercase tracking-wider rounded-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                  isAdded ? 'bg-emerald-600 text-white' : 'bg-zinc-950 hover:bg-red-600 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · ${(product.salePrice || product.price) * quantity}</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3.5 border rounded-sm transition-colors cursor-pointer ${
                  isWishlisted ? 'border-red-600 text-red-600 bg-red-50' : 'border-zinc-300 text-zinc-700 hover:border-zinc-950'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
              </button>
            </div>

            {/* Secondary Customization Action */}
            <button
              onClick={() => onCustomize(product)}
              className="w-full py-3 px-4 border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 bg-white shadow-sm mb-8"
            >
              <Sliders className="w-4 h-4 text-red-600" />
              <span>Customize Colors & Add Logo in Design Lab</span>
            </button>

            {/* Collapsible / Tabbed Details */}
            <div className="border-t border-zinc-200 pt-6">
              <div className="flex items-center gap-4 border-b border-zinc-200 pb-2 mb-4 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeTab === 'specs' ? 'text-zinc-950 border-b-2 border-red-600' : 'text-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  Specs
                </button>
                <button
                  onClick={() => setActiveTab('fabric')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeTab === 'fabric' ? 'text-zinc-950 border-b-2 border-red-600' : 'text-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  Fabric & Weave
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeTab === 'care' ? 'text-zinc-950 border-b-2 border-red-600' : 'text-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  Care Guide
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeTab === 'shipping' ? 'text-zinc-950 border-b-2 border-red-600' : 'text-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  Shipping
                </button>
              </div>

              {activeTab === 'specs' && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 font-mono">FIT & CUT:</span>
                    <span className="font-semibold text-zinc-900">{product.specs.cut}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 font-mono">BREATHABILITY:</span>
                    <span className="font-semibold text-zinc-900">{product.specs.breathability}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 font-mono">FINISH:</span>
                    <span className="font-semibold text-zinc-900">{product.specs.treatment}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500 font-mono">FACILITY:</span>
                    <span className="font-semibold text-zinc-900">{product.specs.origin}</span>
                  </div>
                </div>
              )}

              {activeTab === 'fabric' && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 font-mono">COMPOSITION:</span>
                    <span className="font-semibold text-zinc-900">{product.fabric}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 font-mono">GSM WEIGHT:</span>
                    <span className="font-semibold text-zinc-900 tabular-nums">{product.gsm} GSM Pro</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500 font-mono">CERTIFICATION:</span>
                    <span className="font-semibold text-emerald-700">OEKO-TEX Standard 100</span>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="text-xs text-zinc-600 space-y-1.5 leading-relaxed">
                  <p>• Machine wash cold at 30°C inside out with like colors.</p>
                  <p>• Do not bleach or use aggressive industrial fabric softeners.</p>
                  <p>• Hang dry in shade or tumble dry low to preserve 3D silicone graphics.</p>
                  <p>• Cool iron on reverse side; never iron directly over printed emblems.</p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="text-xs text-zinc-600 space-y-2 leading-relaxed">
                  <p>• Complimentary international express courier on all orders over $150.</p>
                  <p>• Standard delivery: 3–5 business days with tracked signature dispatch.</p>
                  <p>• 30-day return & exchange policy on unworn merchandise in original tags.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-zinc-200 pt-16">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-red-600" />
              <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                COMPLETE THE LOOK
              </span>
            </div>
            <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight mb-8">
              COMPLEMENTARY APPAREL
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="group cursor-pointer border border-zinc-200 rounded-sm p-4 hover:shadow-lg transition-all"
                >
                  <div className="aspect-[4/3] bg-zinc-100 rounded overflow-hidden mb-3">
                    <img
                      src={rel.images.front}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase">{rel.category}</span>
                  <h4 className="font-display text-sm font-bold text-zinc-950 uppercase truncate group-hover:text-red-600">
                    {rel.name}
                  </h4>
                  <span className="font-display font-bold text-sm text-zinc-900 mt-1 block tabular-nums">
                    ${rel.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-sm border border-zinc-200 shadow-2xl p-6">
            <button
              onClick={() => setShowSizeModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-950 cursor-pointer"
            >
              ×
            </button>
            <h3 className="font-display text-xl font-black text-zinc-950 uppercase tracking-tight mb-1">
              ATHLETIC SIZE MEASUREMENTS
            </h3>
            <p className="font-mono text-xs text-zinc-500 mb-4">
              All dimensions calibrated in centimeters (CM) for standard athletic posture.
            </p>
            <table className="w-full text-xs text-left border border-zinc-200">
              <thead className="bg-zinc-100 font-mono text-[11px] text-zinc-700 uppercase">
                <tr>
                  <th className="p-2 border-b">Size</th>
                  <th className="p-2 border-b">Chest</th>
                  <th className="p-2 border-b">Waist</th>
                  <th className="p-2 border-b">Length</th>
                  <th className="p-2 border-b">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-mono">
                <tr><td className="p-2 font-bold">XS</td><td className="p-2">88-92</td><td className="p-2">72-76</td><td className="p-2">68</td><td className="p-2">61</td></tr>
                <tr><td className="p-2 font-bold">S</td><td className="p-2">92-98</td><td className="p-2">76-82</td><td className="p-2">70</td><td className="p-2">63</td></tr>
                <tr><td className="p-2 font-bold">M</td><td className="p-2">98-104</td><td className="p-2">82-88</td><td className="p-2">72</td><td className="p-2">65</td></tr>
                <tr><td className="p-2 font-bold">L</td><td className="p-2">104-110</td><td className="p-2">88-94</td><td className="p-2">74</td><td className="p-2">67</td></tr>
                <tr><td className="p-2 font-bold">XL</td><td className="p-2">110-118</td><td className="p-2">94-102</td><td className="p-2">76</td><td className="p-2">69</td></tr>
                <tr><td className="p-2 font-bold">2XL</td><td className="p-2">118-126</td><td className="p-2">102-110</td><td className="p-2">78</td><td className="p-2">71</td></tr>
              </tbody>
            </table>
            <div className="mt-4 text-[11px] text-zinc-500">
              Tip: For an oversized contemporary streetwear drape, choose one size up from your regular fit.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
