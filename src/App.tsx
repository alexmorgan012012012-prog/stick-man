import React, { useState, useEffect } from 'react';
import { Product, CartItem, SiteContent } from './types';
import { PRODUCTS } from './data/mockData';
import { api, authStorage } from './services/api';
import { CinematicIntro } from './components/CinematicIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ScrollFilmSequence } from './components/ScrollFilmSequence';
import { ProductShowcase3D } from './components/ProductShowcase3D';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CustomDesignStudio } from './components/CustomDesignStudio';
import { ManufacturingVisualizer } from './components/ManufacturingVisualizer';
import { ManufacturingWholesalePage } from './components/ManufacturingWholesalePage';
import { StaticPages } from './components/StaticPages';
import { FinalCampaignCTA } from './components/FinalCampaignCTA';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('campaign');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Live Products & Content
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mk_cart_items');
      return saved ? JSON.parse(saved) : [
        {
          id: 'initial-hoodie',
          productId: 'mk-01-hoodie',
          name: 'Apex Heavyweight Fleece Hoodie',
          price: 165,
          image: '/src/assets/images/hoodie_product_editorial_1793036217712.jpg',
          selectedColor: 'Chalk White / Charcoal',
          selectedSize: 'L',
          quantity: 1,
        },
      ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Load live data from backend
  useEffect(() => {
    loadStorefrontData();

    // Check URL hash / path for direct admin navigation
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mk_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const loadStorefrontData = async () => {
    try {
      const [prods, content] = await Promise.all([
        api.getProducts().catch(() => PRODUCTS),
        api.getSiteContent().catch(() => null),
      ]);
      if (prods && prods.length > 0) setProducts(prods);
      if (content) setSiteContent(content);
    } catch (e) {
      console.error('Storefront load error:', e);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, color: string, size: string, qty: number = 1) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.productId === product.id && item.selectedColor === color && item.selectedSize === size
    );

    if (existingIndex > -1) {
      setCartItems((prev) =>
        prev.map((item, idx) => (idx === existingIndex ? { ...item, quantity: item.quantity + qty } : item))
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          id: `${product.id}-${color}-${size}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.salePrice || product.price,
          image: product.images.front,
          selectedColor: color,
          selectedSize: size,
          quantity: qty,
        },
      ]);
    }
    setIsCartOpen(true);
  };

  const handleAddToCartCustom = (customItem: CartItem) => {
    setCartItems((prev) => [...prev, customItem]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomizeProduct = (product?: Product) => {
    setActiveTab('custom-lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* 1. Cinematic Motion Graphics Opening Film (Skippable) */}
      {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}

      {/* 2. Top Navigation Bar with Mega Menus */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        replayIntro={() => {
          setShowIntro(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        announcementText={siteContent?.announcementBar}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW: HOME CAMPAIGN */}
        {activeTab === 'campaign' && (
          <>
            {/* Advanced Hero Motion Graphics */}
            <HeroSection
              onExploreCollection={() => {
                setActiveTab('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onCreateDesign={() => {
                setActiveTab('custom-lab');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenShowcase={() => {
                setActiveTab('showcase3d');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 6-Scene Scroll-Based Motion Graphics Film */}
            <ScrollFilmSequence
              onStartCustomOrder={() => {
                setActiveTab('custom-lab');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreProducts={() => {
                setActiveTab('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 3D Product Perspective Showcase */}
            <ProductShowcase3D
              onAddToCart={(p, c, s) => handleAddToCart(p, c, s, 1)}
              onOpenCustomizer={handleCustomizeProduct}
            />

            {/* Featured Product Catalog Section */}
            <ProductGrid
              products={products}
              initialCategory={selectedCategory}
              onOpenDetail={handleOpenDetail}
              onQuickView={(p) => setQuickViewProduct(p)}
              onAddToCart={(p, c, s) => handleAddToCart(p, c, s, 1)}
              onCustomize={handleCustomizeProduct}
            />

            {/* Custom Manufacturing Visualizer */}
            <ManufacturingVisualizer
              onStartOrderDirectly={() => {
                setActiveTab('custom-lab');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Animated Final Call to Action */}
            <FinalCampaignCTA
              onStartCustomOrder={() => {
                setActiveTab('custom-lab');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreProducts={() => {
                setActiveTab('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {/* VIEW: COLLECTION CATALOG */}
        {activeTab === 'collection' && (
          <div className="pt-2">
            <ProductGrid
              products={products}
              initialCategory={selectedCategory}
              onOpenDetail={handleOpenDetail}
              onQuickView={(p) => setQuickViewProduct(p)}
              onAddToCart={(p, c, s) => handleAddToCart(p, c, s, 1)}
              onCustomize={handleCustomizeProduct}
            />
          </div>
        )}

        {/* VIEW: PRODUCT DETAIL PAGE */}
        {activeTab === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={() => setActiveTab('collection')}
            onAddToCart={handleAddToCart}
            onCustomize={handleCustomizeProduct}
            onSelectRelated={(p) => setSelectedProduct(p)}
          />
        )}

        {/* VIEW: 3D SHOWCASE */}
        {activeTab === 'showcase3d' && (
          <div className="pt-2">
            <ProductShowcase3D
              onAddToCart={(p, c, s) => handleAddToCart(p, c, s, 1)}
              onOpenCustomizer={handleCustomizeProduct}
            />
          </div>
        )}

        {/* VIEW: CUSTOM DESIGN STUDIO */}
        {activeTab === 'custom-lab' && (
          <div className="pt-2">
            <CustomDesignStudio
              onAddToCartCustom={handleAddToCartCustom}
              onInquirySubmitted={() => {}}
            />
          </div>
        )}

        {/* VIEW: MANUFACTURING & WHOLESALE PORTAL */}
        {activeTab === 'manufacturing' && (
          <ManufacturingWholesalePage />
        )}

        {/* VIEW: STATIC PAGES (Our Story, Process, Size Guide, FAQs, Contact, Policies) */}
        {(activeTab === 'story' ||
          activeTab === 'process' ||
          activeTab === 'size-guide' ||
          activeTab === 'faqs' ||
          activeTab === 'contact' ||
          activeTab === 'policies') && (
          <StaticPages
            page={activeTab as any}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, c, s) => handleAddToCart(p, c, s, 1)}
        onCustomize={handleCustomizeProduct}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onSelectProduct={handleOpenDetail}
      />

      {/* 9. Separate, Private Administrator Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
        onStorefrontRefresh={loadStorefrontData}
      />

      {/* Luxury White Footer with subtle and discreet "Admin" link */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReplayIntro={() => {
          setShowIntro(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
