import React from 'react';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Truck, 
  ArrowUp,
  Award
} from 'lucide-react';
import { COMPANY_INFO } from '../data/products';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenCalculator: () => void;
  onOpenTradeModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenCalculator,
  onOpenTradeModal,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-orange-500 flex items-center justify-center text-white font-black">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white font-sans tracking-tight uppercase">
                  TUMID CALANG TRADING
                </span>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Masonry & Building Supplies
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your certified heavy-duty supplier for precision vibro-compressed concrete blocks, 
              interlocking stone pavers, Portland cement, quarry-washed river sand, 3/4" granite gravel, and high-yield TMT steel rebar.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-orange-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>BS EN 771-3 / ISO 9001 Batch Tested</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Materials Catalog
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => onSelectCategory('blocks')} 
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  6" & 9" Heavy Vibro Blocks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('pavers')} 
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Zig-Zag & Cobblestone Pavers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('cement-aggregates')} 
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Portland Cement & Sand Tippers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('steel-reinforcement')} 
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  12mm, 16mm & 20mm TMT Rebar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('roofing-timber')} 
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Aluminum Roofing & Formwork
                </button>
              </li>
            </ul>
          </div>

          {/* Calculators & Trade Services */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contractor Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={onOpenCalculator} 
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Wall Block Calculator
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenCalculator} 
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Concrete Slab Estimator
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenTradeModal} 
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Contractor Credit Terms
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenTradeModal} 
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Lab Test Batch Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Yard Location */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Loading Yards & Dispatch
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{COMPANY_INFO.workingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`tel:${COMPANY_INFO.whatsapp}`} className="hover:text-orange-400 transition-colors font-bold text-white">
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{COMPANY_INFO.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} TUMID CALANG TRADING. All rights reserved. Registered Heavy Building Materials Supplier.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Truck className="w-3.5 h-3.5 text-orange-400" />
              Direct-to-Site Tipper & Crane Haulage
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-sm bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer border border-slate-800"
              title="Scroll to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
