import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  RotateCcw,
  Search,
  User,
  Heart,
  ChevronDown,
  Layers,
  Ruler,
  HelpCircle,
  Phone,
  Package,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  replayIntro: () => void;
  onOpenAccount: () => void;
  onOpenTracking: () => void;
  announcementText?: string;
  onSelectCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  replayIntro,
  onOpenAccount,
  onOpenTracking,
  announcementText = 'COMPLIMENTARY INTERNATIONAL EXPRESS DISPATCH OVER $150 · BESPOKE PRODUCTION MOQS FROM 25 PIECES',
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleNavClick = (tabId: string, categoryFilter?: string) => {
    setActiveTab(tabId);
    if (categoryFilter && onSelectCategory) {
      onSelectCategory(categoryFilter);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Slim Announcement Bar */}
      <div className="w-full bg-zinc-950 text-white text-[11px] font-mono tracking-widest py-2 px-4 text-center overflow-hidden border-b border-zinc-800">
        <div className="flex items-center justify-center gap-3">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
          <span className="truncate">{announcementText}</span>
        </div>
      </div>

      {/* 2. Top Navigation Bar (Strict Top Bar Contract: 3 Zones) */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-18">
          {/* Zone 1: Single Text Element Brand Wordmark */}
          <button
            onClick={() => handleNavClick('campaign')}
            className="flex items-center gap-1.5 text-xl sm:text-2xl font-black tracking-tighter text-zinc-950 uppercase font-display whitespace-nowrap shrink-0 group cursor-pointer text-left"
          >
            <span>MK</span>
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block group-hover:scale-125 transition-transform" />
            <span>SPORTS</span>
          </button>

          {/* Zone 2: 4–5 Clean Navigation Roots with Rich Mega Dropdowns */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wider text-zinc-700 uppercase">
            {/* Dropdown 1: Shop & Garment Categories */}
            <div
              className="relative py-4"
              onMouseEnter={() => setActiveDropdown('shop')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('collection')}
                className={`flex items-center gap-1 hover:text-zinc-950 cursor-pointer ${
                  activeTab === 'collection' ? 'text-zinc-950 font-bold' : ''
                }`}
              >
                <span>Shop Catalog</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {activeDropdown === 'shop' && (
                <div className="absolute top-full left-0 w-80 bg-white border border-zinc-200 shadow-xl rounded-sm p-4 grid grid-cols-2 gap-4 animate-in fade-in duration-150">
                  <div>
                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block mb-2">
                      APPAREL SILHOUETTES
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-600 font-medium">
                      <li>
                        <button
                          onClick={() => handleNavClick('collection', 'All')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          Shop All
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('collection', 'Hoodies')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          Hoodies (480 GSM)
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('collection', 'Tracksuits')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          Tracksuits
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('collection', 'Sports Jerseys')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          Sports Jerseys
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('collection', 'Jackets')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          Technical Jackets
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('collection', 'T-Shirts')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          Training T-Shirts
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('collection', 'Shorts')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          Performance Shorts
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block mb-2">
                      COLLECTIONS
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-600 font-medium">
                      <li>
                        <button
                          onClick={() => handleNavClick('collection')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          New Arrivals
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('collection')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          Best Sellers
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('collection')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          Men's Collection
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('collection')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          Women's Series
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavClick('collection')}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          Youth & Kids
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Link 2: 3D Product Explorer */}
            <button
              onClick={() => handleNavClick('showcase3d')}
              className={`hover:text-zinc-950 cursor-pointer ${
                activeTab === 'showcase3d' ? 'text-zinc-950 font-bold' : ''
              }`}
            >
              3D Showcase
            </button>

            {/* Link 3: Custom Design Studio */}
            <button
              onClick={() => handleNavClick('custom-lab')}
              className={`hover:text-zinc-950 cursor-pointer flex items-center gap-1 ${
                activeTab === 'custom-lab' ? 'text-zinc-950 font-bold' : ''
              }`}
            >
              <Sparkles className="w-3 h-3 text-red-600" />
              <span>Custom Studio</span>
            </button>

            {/* Link 4: Manufacturing & Wholesale Portal */}
            <button
              onClick={() => handleNavClick('manufacturing')}
              className={`hover:text-zinc-950 cursor-pointer ${
                activeTab === 'manufacturing' ? 'text-zinc-950 font-bold' : ''
              }`}
            >
              Manufacturing & Wholesale
            </button>

            {/* Dropdown 5: Atelier & Info */}
            <div
              className="relative py-4"
              onMouseEnter={() => setActiveDropdown('atelier')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 hover:text-zinc-950 cursor-pointer">
                <span>Atelier</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {activeDropdown === 'atelier' && (
                <div className="absolute top-full right-0 w-64 bg-white border border-zinc-200 shadow-xl rounded-sm p-4 space-y-2 animate-in fade-in duration-150">
                  <button
                    onClick={() => handleNavClick('story')}
                    className="w-full text-left text-xs font-semibold text-zinc-700 hover:text-red-600 py-1"
                  >
                    Our Story & Heritage
                  </button>
                  <button
                    onClick={() => handleNavClick('process')}
                    className="w-full text-left text-xs font-semibold text-zinc-700 hover:text-red-600 py-1"
                  >
                    6-Stage Manufacturing Process
                  </button>
                  <button
                    onClick={() => handleNavClick('size-guide')}
                    className="w-full text-left text-xs font-semibold text-zinc-700 hover:text-red-600 py-1"
                  >
                    Size Guide (CM / IN)
                  </button>
                  <button
                    onClick={() => handleNavClick('faqs')}
                    className="w-full text-left text-xs font-semibold text-zinc-700 hover:text-red-600 py-1"
                  >
                    FAQs & Support
                  </button>
                  <button
                    onClick={() => handleNavClick('contact')}
                    className="w-full text-left text-xs font-semibold text-zinc-700 hover:text-red-600 py-1"
                  >
                    Contact Concierge
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Actions (Replay Film, Track, Account, Bag) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Replay Film Intro Button */}
            <button
              onClick={replayIntro}
              title="Replay Motion Intro"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono tracking-wider text-zinc-500 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-400 rounded-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-600" />
              <span>REPLAY FILM</span>
            </button>

            {/* Track Order Trigger */}
            <button
              onClick={onOpenTracking}
              title="Track Order Status"
              className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-600 hover:text-zinc-950 p-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-zinc-600" />
              <span className="hidden md:inline">Track</span>
            </button>

            {/* Customer Account Trigger */}
            <button
              onClick={onOpenAccount}
              title="My Account"
              className="p-2 text-zinc-800 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Shopping Bag Trigger with Tabular Count */}
            <button
              onClick={openCart}
              className="relative p-2 text-zinc-800 hover:text-zinc-950 transition-colors cursor-pointer"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 bg-red-600 text-white text-[11px] font-bold font-mono rounded-full tabular-nums shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('custom-lab')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wider text-white bg-zinc-950 hover:bg-red-600 uppercase rounded-sm transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Design Custom</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-800 hover:text-zinc-950"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation with Full Architecture */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[108px] bottom-0 z-40 bg-white border-b border-zinc-200 overflow-y-auto px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3 text-sm font-bold uppercase tracking-wider text-zinc-800">
            <button
              onClick={() => handleNavClick('campaign')}
              className="text-left py-2 border-b border-zinc-100 flex justify-between"
            >
              <span>Home Campaign</span>
            </button>

            <button
              onClick={() => handleNavClick('collection')}
              className="text-left py-2 border-b border-zinc-100 flex justify-between"
            >
              <span>Shop All Products</span>
            </button>

            <div className="pl-4 space-y-2 py-1 text-xs text-zinc-600 normal-case">
              <button
                onClick={() => handleNavClick('collection', 'Hoodies')}
                className="block hover:text-red-600"
              >
                Hoodies (480 GSM)
              </button>
              <button
                onClick={() => handleNavClick('collection', 'Tracksuits')}
                className="block hover:text-red-600"
              >
                Tracksuits
              </button>
              <button
                onClick={() => handleNavClick('collection', 'Sports Jerseys')}
                className="block hover:text-red-600"
              >
                Sports Jerseys
              </button>
              <button
                onClick={() => handleNavClick('collection', 'Jackets')}
                className="block hover:text-red-600"
              >
                Technical Jackets
              </button>
              <button
                onClick={() => handleNavClick('collection', 'T-Shirts')}
                className="block hover:text-red-600"
              >
                Training T-Shirts
              </button>
              <button
                onClick={() => handleNavClick('collection', 'Shorts')}
                className="block hover:text-red-600"
              >
                Performance Shorts
              </button>
            </div>

            <button
              onClick={() => handleNavClick('showcase3d')}
              className="text-left py-2 border-b border-zinc-100 flex justify-between"
            >
              <span>3D Product Showcase</span>
            </button>

            <button
              onClick={() => handleNavClick('custom-lab')}
              className="text-left py-2 border-b border-zinc-100 flex justify-between text-red-600"
            >
              <span>Custom Clothing Designer</span>
            </button>

            <button
              onClick={() => handleNavClick('manufacturing')}
              className="text-left py-2 border-b border-zinc-100 flex justify-between"
            >
              <span>Manufacturing & Wholesale</span>
            </button>

            <button
              onClick={() => handleNavClick('story')}
              className="text-left py-2 border-b border-zinc-100 flex justify-between"
            >
              <span>Our Story</span>
            </button>

            <button
              onClick={() => handleNavClick('size-guide')}
              className="text-left py-2 border-b border-zinc-100 flex justify-between"
            >
              <span>Size Guide</span>
            </button>

            <button
              onClick={() => handleNavClick('faqs')}
              className="text-left py-2 border-b border-zinc-100 flex justify-between"
            >
              <span>FAQs</span>
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-2 border-b border-zinc-100 flex justify-between"
            >
              <span>Contact Atelier</span>
            </button>

            <div className="pt-4 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAccount();
                }}
                className="w-full py-3 bg-zinc-950 text-white font-bold text-xs uppercase tracking-wider rounded-sm text-center"
              >
                My Account / Sign In
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="w-full py-2.5 border border-zinc-300 text-zinc-800 font-semibold text-xs uppercase tracking-wider rounded-sm text-center"
              >
                Track My Order
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  replayIntro();
                }}
                className="w-full py-2.5 text-zinc-500 font-mono text-xs uppercase tracking-wider text-center"
              >
                Replay Cinematic Intro
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
