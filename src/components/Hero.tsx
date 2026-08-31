import React from 'react';
import { 
   ShieldCheck, 
   Truck, 
   Layers, 
   ArrowRight, 
   Calculator, 
   Award,
   CheckCircle2,
   Sparkles,
   PhoneCall
} from 'lucide-react';
import { COMPANY_INFO } from '../data/products';
import { ProductCategory } from '../types';

interface HeroProps {
  onOpenCalculator: () => void;
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenTradeModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenCalculator,
  onSelectCategory,
  onOpenTradeModal,
}) => {
  const quickFilters: Array<{ label: string; cat: ProductCategory }> = [
    { label: 'Hollow Blocks', cat: 'blocks' },
    { label: 'Heavy Duty Pavers', cat: 'pavers' },
    { label: 'Grade 42.5R Cement', cat: 'cement-aggregates' },
    { label: 'Sand & 3/4" Granite', cat: 'cement-aggregates' },
    { label: 'High-Yield Rebar', cat: 'steel-reinforcement' },
    { label: 'Roofing Sheets', cat: 'roofing-timber' },
  ];

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Certified Vibro-Compressed Concrete & Direct Yard Dispatch</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase font-sans leading-[1.15]">
              INDUSTRIAL BUILDING MATERIALS <span className="text-orange-500">SUPPLY</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Industrial-grade supply for large-scale development. Supplying commercial contractors, civil engineers, and developers with precision-molded vibro-pressed blocks, interlocking pavers, Portland cement, quarry aggregates, and high-yield rebar.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 bg-slate-800 p-2.5 rounded border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-semibold">5.5–7.0 N/mm² Tested</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 bg-slate-800 p-2.5 rounded border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-semibold">Zero Crumbling Standard</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 bg-slate-800 p-2.5 rounded border border-slate-700 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-semibold">Same-Day Fleet Dispatch</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-explore-materials-btn"
                onClick={() => onSelectCategory('all')}
                className="px-6 py-3.5 rounded bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2.5 shadow-lg shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <span>Explore Catalog & Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-open-calculator-btn"
                onClick={onOpenCalculator}
                className="px-5 py-3.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 border border-slate-700 transition-all hover:border-orange-500 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-orange-500" />
                <span>Calculate Takeoff</span>
              </button>

              <button
                id="hero-trade-apply-btn"
                onClick={onOpenTradeModal}
                className="px-4 py-3.5 rounded text-slate-300 hover:text-orange-400 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4 text-orange-500" />
                <span>Trade Credit Terms</span>
              </button>
            </div>

            {/* Quick Filter Chips */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-2">
                Quick Category Jump:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((qf, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectCategory(qf.cat)}
                    className="text-xs px-3 py-1.5 rounded bg-slate-800 hover:bg-orange-500/20 hover:text-orange-300 text-slate-300 border border-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    {qf.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Hero Feature Showcase Box */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/95 rounded-lg p-6 border border-slate-700 shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded bg-orange-500 text-slate-950 font-black">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight">Direct Supply Guarantee</h3>
                    <p className="text-xs text-slate-400 font-medium">Hydraulic Vibro-Press Verified</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-black text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/20 uppercase">
                  ISO / BS 771-3
                </span>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-4 rounded border border-slate-700">
                  <div className="flex items-center gap-2 text-orange-400 mb-1">
                    <Layers className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Daily Capacity</span>
                  </div>
                  <div className="text-xl font-black text-white">45,000+ Units</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hydraulic automated line</p>
                </div>

                <div className="bg-slate-900 p-4 rounded border border-slate-700">
                  <div className="flex items-center gap-2 text-orange-400 mb-1">
                    <Truck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Logistics Fleet</span>
                  </div>
                  <div className="text-xl font-black text-white">12 Active Tippers</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Direct site crane offloading</p>
                </div>
              </div>

              {/* Instant Quote / Direct Order Contact */}
              <div className="bg-orange-500/10 rounded p-4 border border-orange-500/30 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black text-orange-400 uppercase tracking-wider">Fast Site Dispatch Desk</p>
                  <p className="text-sm font-bold text-white mt-0.5">Immediate 2-Hour Dispatch Check</p>
                </div>
                <a
                  href={`tel:${COMPANY_INFO.whatsapp}`}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider shrink-0 transition-colors shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Desk</span>
                </a>
              </div>

              {/* Delivery info */}
              <div className="text-xs text-slate-400 space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span>Standard Water Curing Period:</span>
                  <span className="text-slate-200 font-semibold">14-21 Days Sprinkler Cured</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Minimum Wholesale Block Order:</span>
                  <span className="text-slate-200 font-semibold">100 Pieces (Free Yard Loading)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Contractor Volume Tier Savings:</span>
                  <span className="text-orange-400 font-bold">Up to 24% Off</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
