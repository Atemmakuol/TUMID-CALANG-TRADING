import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Clock, 
  ShoppingCart, 
  Calculator, 
  Truck, 
  ShieldCheck, 
  FileText, 
  Menu, 
  X,
  Search,
  MapPin
} from 'lucide-react';
import { ProductCategory } from '../types';
import { COMPANY_INFO } from '../data/products';
import { formatWeight } from '../utils/calculator';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  cartCount: number;
  totalCartWeightKg: number;
  onOpenCart: () => void;
  onOpenCalculator: () => void;
  onOpenTradeModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  totalCartWeightKg,
  onOpenCart,
  onOpenCalculator,
  onOpenTradeModal,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'catalog', label: 'Catalog' },
    { id: 'blocks', label: 'Hollow Blocks', cat: 'blocks' as ProductCategory },
    { id: 'pavers', label: 'Pavers', cat: 'pavers' as ProductCategory },
    { id: 'aggregates', label: 'Aggregates', cat: 'cement-aggregates' as ProductCategory },
    { id: 'estimators', label: 'Estimators' },
    { id: 'fleet', label: 'Logistics' },
    { id: 'quality', label: 'Testing' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.cat) {
      setSelectedCategory(item.cat);
      setActiveTab('catalog');
    } else {
      setActiveTab(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-xl border-b-4 border-orange-500">
      {/* Top Trade Bar */}
      <div className="bg-slate-950 px-4 py-2 text-xs text-slate-400 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-orange-400 font-semibold tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Yards Open: Automated Vibro-Press & Fleet Active
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              Mon - Sat: 6:30 AM - 6:30 PM
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              Plot 14 Industrial Layout, Calang Expressway
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button
              id="header-trade-account-btn"
              onClick={onOpenTradeModal}
              className="text-slate-300 hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider text-[11px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              Contractor Trade Portal
            </button>
            <span className="text-slate-700">|</span>
            <a 
              href={`tel:${COMPANY_INFO.whatsapp}`} 
              className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-bold tracking-wide"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div 
            id="brand-logo-btn"
            onClick={() => { setActiveTab('catalog'); setSelectedCategory('all'); }} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 bg-orange-500 flex items-center justify-center font-black text-2xl text-slate-950 shadow-md group-hover:bg-orange-400 transition-colors">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-bold tracking-tighter text-white uppercase font-sans">
                  TUMID CALANG <span className="text-orange-500 font-light">TRADING</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase font-bold">
                Industrial Masonry & Construction Supply
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 6&quot; blocks, 9&quot; blocks, pavers, cement, 16mm rebar..."
                className="w-full bg-slate-800 border border-slate-700 rounded pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons: Estimator & Cart */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              id="header-open-calculator-btn"
              onClick={onOpenCalculator}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider border border-slate-700 transition-all hover:border-orange-500 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-orange-500" />
              <span>Calculators</span>
            </button>

            <button
              id="header-cart-toggle-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden xs:inline">Quote / Order</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center bg-slate-900 text-orange-400 text-xs font-black px-2 py-0.5 rounded-full ml-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 lg:hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="header-search-mobile"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blocks, pavers, cement, steel, sand..."
              className="w-full bg-slate-800 border border-slate-700 rounded pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 mt-3 pt-3 border-t border-slate-800 text-xs font-semibold uppercase tracking-widest">
          {navItems.map((item) => {
            const isActive = activeTab === item.id || (item.cat && activeTab === 'catalog' && selectedCategory === item.cat);
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item)}
                className={`py-1 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-orange-500 font-bold border-b-2 border-orange-500'
                    : 'text-slate-300 hover:text-orange-400'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
            {totalCartWeightKg > 0 && (
              <span className="flex items-center gap-1.5 bg-slate-800 text-orange-400 px-2.5 py-1 rounded border border-slate-700 font-mono font-bold">
                <Truck className="w-3.5 h-3.5 text-orange-500" />
                Est. Load: {formatWeight(totalCartWeightKg)}
              </span>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="w-full text-left px-3 py-2 rounded text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-800 hover:text-orange-400 flex items-center justify-between"
            >
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => { onOpenCalculator(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider"
            >
              <Calculator className="w-4 h-4 text-orange-500" />
              Calculators
            </button>
            <button
              onClick={() => { onOpenTradeModal(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-orange-500 text-slate-950 text-xs font-black uppercase tracking-wider"
            >
              <ShieldCheck className="w-4 h-4" />
              Trade Registration
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
