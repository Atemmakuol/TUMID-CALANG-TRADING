import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Ruler, 
  Weight, 
  Truck, 
  ShoppingCart, 
  Check, 
  FileText, 
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, getProductUnitPrice, formatWeight } from '../utils/calculator';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState<number>(product.minOrder || 1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.availableColors && product.availableColors.length > 0 ? product.availableColors[0] : ''
  );
  const [isAdded, setIsAdded] = useState(false);

  const { unitPrice, discountPercent } = getProductUnitPrice(product, quantity);
  const lineTotal = unitPrice * quantity;
  const originalLineTotal = product.price * quantity;
  const savings = originalLineTotal - lineTotal;
  const totalWeightKg = product.weightKg * quantity;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedColor || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="product-spec-modal"
        className="bg-white rounded-sm max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-950 text-white">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-500 text-white rounded-xs">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">Technical Specification Sheet</h2>
              <p className="text-xs text-slate-400">Certified Material Data & Quality Batch Test</p>
            </div>
          </div>
          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="p-2 rounded-sm hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Image & Quick Highlights */}
            <div className="md:col-span-5 space-y-3">
              <div className="h-60 rounded-sm overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Lab Certification Banner */}
              <div className="bg-slate-50 border border-slate-300 rounded-sm p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-slate-950 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Quality Assurance Standard</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every batch undergoes 28-day hydraulic crushing compression tests conforming to BS EN 771-3 / NIS standards.
                </p>
                <div className="text-[11px] font-mono text-slate-900 font-bold bg-slate-200 px-2 py-1 rounded-xs inline-block border border-slate-300">
                  Verified Batch QA: TCT-2026-PASS
                </div>
              </div>
            </div>

            {/* Product Details & Specs */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  {product.subCategory || product.category}
                </span>
                <h1 className="text-xl font-extrabold text-slate-950 mt-0.5 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Color Selection if any */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Select Color Finish:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableColors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`text-xs px-3 py-1.5 rounded-sm border font-medium transition-colors cursor-pointer ${
                          selectedColor === col
                            ? 'bg-orange-500 text-white font-bold border-orange-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  Engineering Specifications
                </h4>
                <div className="rounded-sm border border-slate-200 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-600">Unit Base Price</td>
                        <td className="py-2 px-3 font-bold text-slate-900 font-mono">{formatCurrency(product.price)} {product.unit}</td>
                      </tr>
                      {product.dimensions && (
                        <tr className="border-b border-slate-200">
                          <td className="py-2 px-3 font-semibold text-slate-600">Dimensions</td>
                          <td className="py-2 px-3 text-slate-800">{product.dimensions}</td>
                        </tr>
                      )}
                      {product.strengthRating && (
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-600">Compressive Strength</td>
                          <td className="py-2 px-3 font-bold text-orange-600">{product.strengthRating}</td>
                        </tr>
                      )}
                      <tr className="border-b border-slate-200">
                        <td className="py-2 px-3 font-semibold text-slate-600">Unit Mass / Weight</td>
                        <td className="py-2 px-3 text-slate-800">{product.weightKg} kg ({formatWeight(product.weightKg)})</td>
                      </tr>
                      {product.coveragePerM2 && (
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-600">Coverage Yield</td>
                          <td className="py-2 px-3 text-slate-800">{product.coveragePerM2} units per m²</td>
                        </tr>
                      )}
                      {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key} className="border-b border-slate-200 last:border-0">
                          <td className="py-2 px-3 font-semibold text-slate-600">{key}</td>
                          <td className="py-2 px-3 text-slate-800">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bulk Tier Volume Table */}
              {product.bulkTiers && product.bulkTiers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    Wholesale Contractor Price Tiers
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {product.bulkTiers.map((tier, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setQuantity(tier.minQty)}
                        className={`p-2.5 rounded-sm border cursor-pointer transition-all ${
                          quantity >= tier.minQty && (idx === product.bulkTiers.length - 1 || quantity < product.bulkTiers[idx + 1].minQty)
                            ? 'bg-orange-50 border-orange-500 font-bold text-orange-950 ring-1 ring-orange-500'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className="font-semibold text-slate-500 text-[11px]">
                          {tier.minQty}+ {product.unit.replace('per ', '')}
                        </div>
                        <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
                          {formatCurrency(tier.price)}
                        </div>
                        {tier.discountPercent > 0 ? (
                          <div className="text-[10px] text-emerald-700 font-bold">
                            Save {tier.discountPercent}%
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 font-normal">Base Rate</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Modal Footer / Direct Add */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">
              Total Weight: <strong className="text-slate-800">{formatWeight(totalWeightKg)}</strong>
            </div>
            <div className="text-xl font-extrabold text-slate-900 font-mono">
              {formatCurrency(lineTotal)}
              {savings > 0 && (
                <span className="text-xs font-bold text-emerald-700 ml-2">
                  (Saved {formatCurrency(savings)})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-300 rounded-sm bg-white overflow-hidden">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.minOrder || 1, parseInt(e.target.value) || 1))}
                min={product.minOrder || 1}
                className="w-20 text-center text-sm font-bold text-slate-900 font-mono py-2 focus:outline-none"
              />
            </div>

            <button
              id="modal-add-to-cart-btn"
              onClick={handleAdd}
              className={`px-6 py-2.5 rounded-sm font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-98'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Quote!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add {quantity} to Order Quote</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
