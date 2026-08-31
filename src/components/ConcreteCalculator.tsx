import React, { useState } from 'react';
import { 
  Mountain, 
  ShoppingCart, 
  Check, 
  Truck, 
  ArrowRight, 
  Layers,
  Sparkles
} from 'lucide-react';
import { SlabCalculationInput, Product } from '../types';
import { calculateSlabConcrete, formatCurrency, formatWeight } from '../utils/calculator';
import { PRODUCTS } from '../data/products';

interface ConcreteCalculatorProps {
  onAddMaterialsToCart: (items: Array<{ product: Product; quantity: number }>) => void;
}

export const ConcreteCalculator: React.FC<ConcreteCalculatorProps> = ({
  onAddMaterialsToCart,
}) => {
  const [lengthMeters, setLengthMeters] = useState<number>(10);
  const [widthMeters, setWidthMeters] = useState<number>(8);
  const [depthMm, setDepthMm] = useState<number>(150); // 150mm slab
  const [mixRatio, setMixRatio] = useState<'1:2:4' | '1:1.5:3' | '1:3:6'>('1:2:4');
  const [wastagePercent, setWastagePercent] = useState<number>(5);
  const [isAdded, setIsAdded] = useState(false);

  const input: SlabCalculationInput = {
    lengthMeters,
    widthMeters,
    depthMeters: depthMm / 1000,
    mixRatio,
    wastagePercent,
  };

  const results = calculateSlabConcrete(input);

  const handleAddMixToCart = () => {
    const cementProduct = PRODUCTS.find(p => p.id === 'cem-portland-425r');
    const sandProduct = PRODUCTS.find(p => p.id === 'agg-sharp-sand-tipper');
    const graniteProduct = PRODUCTS.find(p => p.id === 'agg-granite-34');

    const itemsToAdd: Array<{ product: Product; quantity: number }> = [];

    if (cementProduct && results.cementBagsNeeded > 0) {
      itemsToAdd.push({ product: cementProduct, quantity: results.cementBagsNeeded });
    }

    // 1 tipper truck = 20 tons
    if (sandProduct && results.sandTonsNeeded > 0) {
      const sandTipperCount = Math.max(1, Math.ceil(results.sandTonsNeeded / 20));
      itemsToAdd.push({ product: sandProduct, quantity: sandTipperCount });
    }

    if (graniteProduct && results.graniteTonsNeeded > 0) {
      const graniteTipperCount = Math.max(1, Math.ceil(results.graniteTonsNeeded / 20));
      itemsToAdd.push({ product: graniteProduct, quantity: graniteTipperCount });
    }

    if (itemsToAdd.length > 0) {
      onAddMaterialsToCart(itemsToAdd);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div id="concrete-calculator-component" className="bg-white rounded-sm border border-slate-200 shadow-xl overflow-hidden">
      <div className="bg-slate-950 text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-orange-500 text-white flex items-center justify-center font-bold">
            <Mountain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Concrete Slab & Foundation Mix Calculator</h2>
            <p className="text-xs text-slate-400">Calculate exact cubic volume, cement bags, sand tonnage, and 3/4" granite gravel</p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-xs bg-slate-900 text-orange-400 font-mono font-bold border border-slate-800">
          Standard 1.54 Dry-to-Wet Volumetric Factor
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Mix Ratio Selector */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-2">
              1. Structural Concrete Grade / Mix Ratio:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: '1:2:4' as const, label: '1 : 2 : 4 (C20 / C25)', sub: 'Slabs, Beams & Columns', tag: 'Standard' },
                { id: '1:1.5:3' as const, label: '1 : 1.5 : 3 (C30)', sub: 'Heavy Industrial / Water Retaining', tag: 'High Strength' },
                { id: '1:3:6' as const, label: '1 : 3 : 6 (C15)', sub: 'Ground Blinding / Mass Footings', tag: 'Mass Concrete' },
              ].map((mr) => (
                <button
                  key={mr.id}
                  onClick={() => setMixRatio(mr.id)}
                  className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                    mixRatio === mr.id
                      ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{mr.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{mr.sub}</div>
                  <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-orange-100 text-orange-900 font-bold">
                    {mr.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Slab Dimensions */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Length (m):
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={lengthMeters}
                onChange={(e) => setLengthMeters(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2.5 text-sm font-bold text-slate-900 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Width (m):
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={widthMeters}
                onChange={(e) => setWidthMeters(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2.5 text-sm font-bold text-slate-900 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Depth / Thickness (mm):
              </label>
              <select
                value={depthMm}
                onChange={(e) => setDepthMm(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2.5 text-sm font-bold text-slate-900 font-mono focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value={75}>75mm (Pavement/Walkway)</option>
                <option value={100}>100mm (4" Light Slab)</option>
                <option value={150}>150mm (6" Standard Floor)</option>
                <option value={200}>200mm (8" Heavy Deck / Beam)</option>
                <option value={250}>250mm (10" Raft Foundation)</option>
                <option value={300}>300mm (12" Heavy Footing)</option>
              </select>
            </div>
          </div>

          {/* Wastage */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Poured Concrete Wastage Margin:
              </label>
              <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-xs border border-orange-200">
                +{wastagePercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={wastagePercent}
              onChange={(e) => setWastagePercent(parseInt(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 bg-slate-50 p-6 rounded-sm border border-slate-200">
          <div>
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-500" />
              Calculated Concrete Batch Breakdown
            </h3>

            <div className="bg-orange-50/70 border border-orange-200 rounded-sm p-4 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-orange-950 uppercase tracking-wider block">
                  Total Wet Cast Volume
                </span>
                <p className="text-xs text-orange-800 mt-0.5">
                  Includes {wastagePercent}% site wastage & formwork deflection
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-orange-950 font-mono">
                  {results.volumeWithWastageM3} m³
                </div>
                <span className="text-xs font-bold text-orange-800">
                  Total Cast Mass: ~{results.estimatedWeightTons} Tons
                </span>
              </div>
            </div>

            {/* Individual Material Lines */}
            <div className="space-y-2.5">
              <div className="bg-white border border-slate-200 rounded-sm p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Portland Cement Grade 42.5R</span>
                  <span className="text-slate-500">Standard 50kg Bags</span>
                </div>
                <div className="text-right font-mono font-bold text-slate-900 text-sm">
                  {results.cementBagsNeeded} Bags (~{(results.cementBagsNeeded * 50 / 1000).toFixed(1)}t)
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-sm p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Washed Sharp River Sand</span>
                  <span className="text-slate-500">Clean coarse construction aggregate</span>
                </div>
                <div className="text-right font-mono font-bold text-slate-900 text-sm">
                  {results.sandTonsNeeded} Metric Tons
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-sm p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Crushed Blue Granite Stones (3/4" / 20mm)</span>
                  <span className="text-slate-500">Angular structural aggregate</span>
                </div>
                <div className="text-right font-mono font-bold text-slate-900 text-sm">
                  {results.graniteTonsNeeded} Metric Tons
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={handleAddMixToCart}
              className={`w-full py-3.5 px-4 rounded-sm font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 hover:bg-orange-500 hover:text-white text-white active:scale-98'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>{results.cementBagsNeeded} Bags Cement & Aggregates Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add Concrete Mix Materials to Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
