/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowUpDown, 
  ShieldCheck, 
  Truck, 
  Calculator, 
  Layers, 
  Phone, 
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { ProductCategory, Product, CartItem } from './types';
import { PRODUCTS, DELIVERY_ZONES, COMPANY_INFO } from './data/products';
import { calculateCartTotals, formatWeight } from './utils/calculator';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { BlockCalculator } from './components/BlockCalculator';
import { ConcreteCalculator } from './components/ConcreteCalculator';
import { DeliveryFleet } from './components/DeliveryFleet';
import { QualityStandards } from './components/QualityStandards';
import { CartDrawer } from './components/CartDrawer';
import { QuoteModal } from './components/QuoteModal';
import { TradeAccountModal } from './components/TradeAccountModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation & Category State
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [filterLoadBearingOnly, setFilterLoadBearingOnly] = useState<boolean>(false);

  // Cart & Logistics State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tumid_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedZoneId, setSelectedZoneId] = useState<string>(DELIVERY_ZONES[0].id);
  const [needsOffloading, setNeedsOffloading] = useState<boolean>(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState<boolean>(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  
  // Estimator Tab inside Estimators View
  const [activeEstimatorTool, setActiveEstimatorTool] = useState<'wall' | 'concrete'>('wall');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tumid_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, selectedColor?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedColor }];
    });

    showToast(`Added ${quantity} ${product.unit} of ${product.name} to Quote.`);
  };

  const handleAddMultipleToCart = (items: Array<{ product: Product; quantity: number }>) => {
    setCart((prev) => {
      let updated = [...prev];
      items.forEach(({ product, quantity }) => {
        const existingIdx = updated.findIndex((item) => item.product.id === product.id);
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + quantity,
          };
        } else {
          updated.push({ product, quantity });
        }
      });
      return updated;
    });

    showToast(`Added ${items.length} material lines to your Order Quote.`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Category Filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.subCategory?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Load Bearing Only filter
    if (filterLoadBearingOnly) {
      list = list.filter((p) => p.strengthRating && (p.strengthRating.includes('N/mm²') || p.strengthRating.includes('Structural')));
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // featured
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [selectedCategory, searchQuery, filterLoadBearingOnly, sortBy]);

  // Product Counts for Category Badges
  const productCounts = useMemo(() => {
    const counts: Record<ProductCategory, number> = {
      all: PRODUCTS.length,
      blocks: 0,
      pavers: 0,
      'cement-aggregates': 0,
      'steel-reinforcement': 0,
      'roofing-timber': 0,
      'plumbing-drainage': 0,
    };

    PRODUCTS.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    return counts;
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totals = calculateCartTotals(cart, selectedZoneId, needsOffloading);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-slate-100 px-5 py-3 rounded-sm shadow-2xl border border-slate-700 flex items-center gap-3 text-xs sm:text-sm font-semibold animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-orange-400 font-bold underline hover:text-orange-300 cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartCount={cart.length}
        totalCartWeightKg={totals.totalWeightKg}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCalculator={() => {
          setActiveTab('estimators');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onOpenTradeModal={() => setIsTradeModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Switching */}
      <main className="flex-1">
        
        {/* VIEW 1: MATERIALS CATALOG & STORE */}
        {activeTab === 'catalog' && (
          <div>
            {/* Top Hero Banner */}
            <Hero
              onOpenCalculator={() => {
                setActiveTab('estimators');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                const el = document.getElementById('catalog-products-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenTradeModal={() => setIsTradeModalOpen(true)}
            />

            {/* Sticky Category Strip */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setSearchQuery('');
              }}
              productCounts={productCounts}
            />

            {/* Catalog Grid Section */}
            <div id="catalog-products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
              
              {/* Filter / Sort / Results Bar */}
              <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {selectedCategory === 'all'
                      ? 'All Building Materials & Blocks'
                      : selectedCategory === 'blocks'
                      ? 'High-Strength Concrete Blocks'
                      : selectedCategory === 'pavers'
                      ? 'Interlocking Pavers & Kerbs'
                      : selectedCategory === 'cement-aggregates'
                      ? 'Cement, River Sand & Crushed Granite'
                      : selectedCategory === 'steel-reinforcement'
                      ? 'TMT Steel Rebar & BRC Mesh'
                      : selectedCategory === 'roofing-timber'
                      ? 'Roofing Sheets & Structural Timber'
                      : 'Plumbing & Water Tanks'}
                  </h2>
                  <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-sm font-mono font-bold border border-slate-200">
                    {filteredProducts.length} Items Listed
                  </span>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-3 flex-wrap ml-auto">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none bg-slate-50 px-3 py-1.5 rounded-sm border border-slate-200 hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={filterLoadBearingOnly}
                      onChange={(e) => setFilterLoadBearingOnly(e.target.checked)}
                      className="accent-orange-500 rounded-xs"
                    />
                    <span>Load-Bearing Certified Only</span>
                  </label>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-slate-50 border border-slate-200 rounded-sm px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="featured">Featured / High Demand</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name">Product Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Cards Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-sm border border-slate-200 p-12 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No matching materials found</h3>
                  <p className="text-xs text-slate-500">
                    Try clearing search query "{searchQuery}" or reset filters.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setFilterLoadBearingOnly(false); }}
                    className="px-4 py-2 rounded-sm bg-slate-900 text-orange-400 font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetails={(p) => setSelectedProductForModal(p)}
                    />
                  ))}
                </div>
              )}

              {/* Quick Estimator CTA Strip */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-sm p-6 sm:p-8 border border-slate-800 flex flex-wrap items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1.5 max-w-xl">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    Contractor Planning Tool
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    Need Help Calculating Wall Blocks or Foundation Concrete?
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Use our interactive structural calculators to find exact block quantities, 
                    sand tonnage, and Grade 42.5R cement bags required for your project.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('estimators');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-sm bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Launch Takeoff Estimators</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: ESTIMATOR TOOLS */}
        {activeTab === 'estimators' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
            
            {/* Estimator Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                  Construction Material Takeoff Calculators
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Engineered formulas matching standard civil engineering building codes
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-200 p-1 rounded-sm border border-slate-300">
                <button
                  id="tab-wall-calc-btn"
                  onClick={() => setActiveEstimatorTool('wall')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                    activeEstimatorTool === 'wall'
                      ? 'bg-slate-900 text-orange-400 shadow-xs'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Wall & Block Estimator</span>
                </button>

                <button
                  id="tab-concrete-calc-btn"
                  onClick={() => setActiveEstimatorTool('concrete')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                    activeEstimatorTool === 'concrete'
                      ? 'bg-slate-900 text-orange-400 shadow-xs'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Concrete Slab & Mix Estimator</span>
                </button>
              </div>
            </div>

            {activeEstimatorTool === 'wall' ? (
              <BlockCalculator onAddMaterialsToCart={handleAddMultipleToCart} />
            ) : (
              <ConcreteCalculator onAddMaterialsToCart={handleAddMultipleToCart} />
            )}

            {/* Instructions / Guidance */}
            <div className="bg-slate-900 border border-slate-800 text-slate-200 rounded-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="space-y-1.5">
                <h4 className="font-bold text-orange-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  Standard Block Dimension
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Our hollow and solid blocks are molded to nominal 450mm length x 225mm height. Factoring a 10mm mortar bed joint yields exactly 10 blocks per square meter of wall area.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-orange-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-orange-400" />
                  Mortar Cement Consumption
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  For 6-inch blocks, one 50kg bag of Grade 42.5R Portland cement lays approximately 35 blocks with a 1:4 cement-to-sharp-sand mortar ratio.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-orange-400 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-orange-400" />
                  Direct Haulage Booking
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Once calculated, click "Add All Materials to Order Quote" to automatically populate the freight tonnage and book tipper truck dispatch.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: DELIVERY FLEET */}
        {activeTab === 'fleet' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <DeliveryFleet onOpenTradeModal={() => setIsTradeModalOpen(true)} />
          </div>
        )}

        {/* VIEW 4: QUALITY STANDARDS & TESTING */}
        {activeTab === 'quality' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <QualityStandards onOpenTradeModal={() => setIsTradeModalOpen(true)} />
          </div>
        )}

      </main>

      {/* Cart & Quote Side Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenQuoteModal={() => {
          setIsCartOpen(false);
          setIsQuoteModalOpen(true);
        }}
        selectedZoneId={selectedZoneId}
        setSelectedZoneId={setSelectedZoneId}
        needsOffloading={needsOffloading}
        setNeedsOffloading={setNeedsOffloading}
      />

      {/* Product Spec Modal */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Official Proforma Invoice Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        cart={cart}
        selectedZoneId={selectedZoneId}
        needsOffloading={needsOffloading}
      />

      {/* Contractor Trade Registration Modal */}
      <TradeAccountModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('catalog');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onOpenCalculator={() => {
          setActiveTab('estimators');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTradeModal={() => setIsTradeModalOpen(true)}
      />

    </div>
  );
}
