import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowUpDown, Search, Filter } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
  onCustomize: (product: Product) => void;
  initialCategory?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onOpenDetail,
  onQuickView,
  onAddToCart,
  onCustomize,
  initialCategory = 'All',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeGender, setActiveGender] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Hoodies', 'Tracksuits', 'Sports Jerseys', 'Jackets', 'T-Shirts', 'Shorts'];
  const genders = ['All', 'Men', 'Women', 'Unisex', 'Kids'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesGender =
        activeGender === 'All' || p.gender === activeGender || p.gender === 'Unisex';
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesGender && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (a.salePrice || a.price) - (b.salePrice || b.price);
      if (sortBy === 'price-desc') return (b.salePrice || b.price) - (a.salePrice || a.price);
      if (sortBy === 'newest') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      return 0;
    });
  }, [products, activeCategory, activeGender, searchQuery, sortBy]);

  return (
    <section className="relative w-full bg-white py-16 sm:py-24 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-zinc-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-red-600" />
              <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                COMMERCIAL COLLECTION // SS26
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tight font-display">
              LUXURY ATHLETIC CATALOG
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search garments, 480 GSM, terry, SKU..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:outline-none focus:border-zinc-950 transition-colors"
            />
          </div>
        </div>

        {/* Filters and Sorting Bar */}
        <div className="space-y-4 mb-10">
          {/* Categories Strip */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-zinc-950 text-white shadow-sm'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-mono font-medium text-zinc-700 bg-white border border-zinc-200 rounded-sm px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="featured">SORT: FEATURED</option>
                <option value="newest">SORT: NEWEST ARRIVALS</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
              </select>
            </div>
          </div>

          {/* Gender Filter Strip */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>SERIES:</span>
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGender(g)}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  activeGender === g ? 'bg-red-600 text-white font-bold' : 'hover:text-zinc-950'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <div key={product.id} onClick={() => onOpenDetail(product)} className="cursor-pointer">
                <ProductCard
                  product={product}
                  index={idx}
                  onQuickView={(p) => onQuickView(p)}
                  onAddToCart={onAddToCart}
                  onCustomize={onCustomize}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-50 border border-zinc-200 rounded-sm">
            <p className="text-zinc-600 font-medium">No garments found matching your filters.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setActiveGender('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
