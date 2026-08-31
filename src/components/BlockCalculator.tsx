import React, { useState } from 'react';
import { 
  Calculator, 
  Layers, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Check, 
  Truck, 
  Info,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { WallCalculationInput, Product } from '../types';
import { calculateWallBlocks, formatCurrency, formatWeight } from '../utils/calculator';
import { PRODUCTS } from '../data/products';

interface BlockCalculatorProps {
  onAddMaterialsToCart: (items: Array<{ product: Product; quantity: number }>) => void;
  onClose?: () => void;
}

export const BlockCalculator: React.FC<BlockCalculatorProps> = ({
  onAddMaterialsToCart,
  onClose,
}) => {
  const [lengthMeters, setLengthMeters] = useState<number>(15);
  const [heightMeters, setHeightMeters] = useState<number>(3.0);
  const [blockType, setBlockType] = useState<'6-inch' | '9-inch' | '4-inch'>('6-inch');
  const [wastagePercent, setWastagePercent] = useState<number>(5);
  const [openings, setOpenings] = useState<WallCalculationInput['openings']>([
    { id: '1', type: 'door', widthMeters: 0.9, heightMeters: 2.1, count: 1 },
    { id: '2', type: 'window', widthMeters: 1.2, heightMeters: 1.2, count: 2 },
  ]);
  const [isAdded, setIsAdded] = useState(false);

  const input: WallCalculationInput = {
    lengthMeters,
    heightMeters,
    blockType,
    openings,
    wastagePercent,
  };

  const results = calculateWallBlocks(input);

  const handleAddOpening = (type: 'door' | 'window') => {
    const newOpening = {
      id: Date.now().toString(),
      type,
      widthMeters: type === 'door' ? 0.9 : 1.2,
      heightMeters: type === 'door' ? 2.1 : 1.2,
      count: 1,
    };
    setOpenings([...openings, newOpening]);
  };

  const handleRemoveOpening = (id: string) => {
    setOpenings(openings.filter((op) => op.id !== id));
  };

  const handleUpdateOpening = (id: string, field: 'widthMeters' | 'heightMeters' | 'count', val: number) => {
    setOpenings(
      openings.map((op) => {
        if (op.id === id) {
          return { ...op, [field]: Math.max(0.1, val) };
        }
        return op;
      })
    );
  };

  const handleAddAllToCart = () => {
    const selectedBlockProduct = 
      blockType === '9-inch' 
        ? PRODUCTS.find(p => p.id === 'blk-9-hollow-hd')
        : blockType === '4-inch'
        ? PRODUCTS.find(p => p.id === 'blk-4-solid-partition')
        : PRODUCTS.find(p => p.id === 'blk-6-hollow-hd');

    const cementProduct = PRODUCTS.find(p => p.id === 'cem-portland-425r');

    const itemsToAdd: Array<{ product: Product; quantity: number }> = [];

    if (selectedBlockProduct && results.blocksWithWastage > 0) {
      itemsToAdd.push({
        product: selectedBlockProduct,
        quantity: results.blocksWithWastage,
      });
    }

    if (cementProduct && results.cementBagsNeeded > 0) {
      itemsToAdd.push({
        product: cementProduct,
        quantity: results.cementBagsNeeded,
      });
    }

    if (itemsToAdd.length > 0) {
      onAddMaterialsToCart(itemsToAdd);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div id="block-calculator-component" className="bg-white rounded-sm border border-slate-200 shadow-xl overflow-hidden">
      {/* Calculator Header */}
      <div className="bg-slate-950 text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-orange-500 text-white flex items-center justify-center font-bold">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Masonry Wall & Block Estimator</h2>
            <p className="text-xs text-slate-400">Calculate exact block quantities, joint mortar cement, and tipper freight tonnage</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-xs bg-slate-900 text-orange-400 font-mono font-bold border border-slate-800">
            BS 5628 / 10 Blocks per m²
          </span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Section */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Block Type Selector */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-2">
              1. Choose Block Profile & Thickness:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: '6-inch' as const, label: '6" Hollow Block', sub: 'Standard Exterior', psi: '5.5 N/mm²' },
                { id: '9-inch' as const, label: '9" Heavy Hollow', sub: 'Multi-Storey Load', psi: '6.5 N/mm²' },
                { id: '4-inch' as const, label: '4" Solid Partition', sub: 'Interior Walls', psi: '4.2 N/mm²' },
              ].map((bt) => (
                <button
                  key={bt.id}
                  id={`calc-block-type-${bt.id}`}
                  onClick={() => setBlockType(bt.id)}
                  className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                    blockType === bt.id
                      ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{bt.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{bt.sub}</div>
                  <div className="text-[10px] font-mono text-orange-600 font-semibold mt-1">{bt.psi}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Wall Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Total Wall Length (Meters):
              </label>
              <div className="relative">
                <input
                  id="calc-wall-length-input"
                  type="number"
                  step="0.5"
                  min="1"
                  max="500"
                  value={lengthMeters}
                  onChange={(e) => setLengthMeters(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3.5 py-2.5 text-sm font-bold text-slate-900 font-mono focus:outline-none focus:border-orange-500 focus:bg-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">m</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Approx {(lengthMeters * 3.28084).toFixed(1)} ft</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Wall Height (Meters):
              </label>
              <div className="relative">
                <input
                  id="calc-wall-height-input"
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="30"
                  value={heightMeters}
                  onChange={(e) => setHeightMeters(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3.5 py-2.5 text-sm font-bold text-slate-900 font-mono focus:outline-none focus:border-orange-500 focus:bg-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">m</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Approx {(heightMeters * 3.28084).toFixed(1)} ft</span>
            </div>
          </div>

          {/* Openings (Doors & Windows deductions) */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                2. Deduct Openings (Doors & Windows):
              </label>
              <div className="flex gap-2">
                <button
                  id="calc-add-door-btn"
                  onClick={() => handleAddOpening('door')}
                  className="text-xs px-2.5 py-1 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer border border-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" /> + Door
                </button>
                <button
                  id="calc-add-window-btn"
                  onClick={() => handleAddOpening('window')}
                  className="text-xs px-2.5 py-1 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer border border-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" /> + Window
                </button>
              </div>
            </div>

            {openings.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-sm text-center">
                No openings added (calculating solid continuous wall)
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {openings.map((op) => (
                  <div 
                    key={op.id}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-sm p-2 text-xs"
                  >
                    <span className="font-bold uppercase text-slate-700 px-2 py-0.5 bg-slate-200 rounded-xs text-[10px] shrink-0">
                      {op.type}
                    </span>
                    
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-slate-500">W:</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0.2"
                        value={op.widthMeters}
                        onChange={(e) => handleUpdateOpening(op.id, 'widthMeters', parseFloat(e.target.value) || 0.1)}
                        className="w-14 bg-white border border-slate-300 rounded-xs px-1.5 py-1 text-center font-mono font-bold"
                      />
                      <span className="text-slate-400">m × H:</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0.2"
                        value={op.heightMeters}
                        onChange={(e) => handleUpdateOpening(op.id, 'heightMeters', parseFloat(e.target.value) || 0.1)}
                        className="w-14 bg-white border border-slate-300 rounded-xs px-1.5 py-1 text-center font-mono font-bold"
                      />
                      <span className="text-slate-400">m × Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={op.count}
                        onChange={(e) => handleUpdateOpening(op.id, 'count', parseInt(e.target.value) || 1)}
                        className="w-12 bg-white border border-slate-300 rounded-xs px-1.5 py-1 text-center font-mono font-bold"
                      />
                    </div>

                    <span className="font-mono text-slate-600 text-[11px]">
                      ={(op.widthMeters * op.heightMeters * op.count).toFixed(1)}m²
                    </span>

                    <button
                      onClick={() => handleRemoveOpening(op.id)}
                      className="p-1 hover:text-red-600 text-slate-400 transition-colors cursor-pointer"
                      title="Remove opening"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wastage Safety Slider */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Wastage & Cutting Allowance:
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
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>0% (Exact)</span>
              <span>5% (Industry Standard)</span>
              <span>10% (Complex Corners)</span>
              <span>15%</span>
            </div>
          </div>

        </div>

        {/* Right Output & Add-to-Cart Panel */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 bg-slate-50 p-6 rounded-sm border border-slate-200">
          <div>
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-orange-500" />
              Calculated Material Takeoff Results
            </h3>

            {/* Visual Wall Diagram Summary */}
            <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs mb-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Gross Wall Area</span>
                <span className="font-extrabold text-slate-800 text-sm font-mono">{results.grossWallAreaM2} m²</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-slate-400 text-[10px] block uppercase">Openings Subtracted</span>
                <span className="font-extrabold text-slate-500 text-sm font-mono">-{results.openingsAreaM2} m²</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Net Wall Area</span>
                <span className="font-extrabold text-orange-600 text-sm font-mono">{results.netWallAreaM2} m²</span>
              </div>
            </div>

            {/* Material Requirement Cards */}
            <div className="space-y-3">
              {/* Blocks */}
              <div className="bg-orange-50/70 border border-orange-200 rounded-sm p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-orange-950 uppercase tracking-wider block">
                    Total Concrete Blocks Needed
                  </span>
                  <p className="text-xs text-orange-800 mt-0.5">
                    {results.blocksNeeded} base + {results.blocksWithWastage - results.blocksNeeded} wastage units
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-orange-950 font-mono">
                    {results.blocksWithWastage.toLocaleString()}
                  </div>
                  <span className="text-xs font-bold text-orange-800">
                    Est. {formatCurrency(results.estimatedBlockCost)}
                  </span>
                </div>
              </div>

              {/* Cement for Mortar */}
              <div className="bg-white border border-slate-200 rounded-sm p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Portland Cement 42.5R (50kg Bags)</span>
                  <span className="text-slate-500">For laying bedding & perpend mortar joints</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-base font-bold text-slate-900">{results.cementBagsNeeded} Bags</span>
                  <span className="block text-slate-500 font-sans">~{formatCurrency(results.cementBagsNeeded * 9.80)}</span>
                </div>
              </div>

              {/* Sand for Mortar */}
              <div className="bg-white border border-slate-200 rounded-sm p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Sharp River Sand for Mortar</span>
                  <span className="text-slate-500">Silt-free mortar mix</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-base font-bold text-slate-900">{results.sandTonsNeeded} Tons</span>
                  <span className="block text-slate-500 font-sans">1 Tipper Portion</span>
                </div>
              </div>

              {/* Total Logistics Freight Info */}
              <div className="bg-slate-900 text-slate-200 rounded-sm p-3.5 flex items-center justify-between text-xs border border-slate-800">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Logistics Weight Estimate</span>
                    <span className="text-slate-400">
                      Requires {Math.max(1, Math.ceil(results.estimatedWeightTons / 20))}x 20-ton Heavy Tipper Truck
                    </span>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-orange-400 text-sm">
                  {formatWeight(results.estimatedWeightTons * 1000)}
                </div>
              </div>

            </div>
          </div>

          {/* Quick Action to Add All to Cart */}
          <div className="pt-4 border-t border-slate-200">
            <button
              id="calc-add-all-materials-btn"
              onClick={handleAddAllToCart}
              className={`w-full py-3.5 px-4 rounded-sm font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 hover:bg-orange-500 hover:text-white text-white active:scale-98'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>{results.blocksWithWastage} Blocks & {results.cementBagsNeeded} Cement Bags Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add All Calculated Materials to Order Quote</span>
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
