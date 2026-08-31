import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Eye, 
  Weight, 
  Ruler, 
  ShieldCheck, 
  Tag, 
  Check
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, getProductUnitPrice, formatWeight } from '../utils/calculator';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  const [quantity, setQuantity] = useState<number>(product.minOrder || 1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.availableColors && product.availableColors.length > 0 ? product.availableColors[0] : ''
  );
  const [isAdded, setIsAdded] = useState(false);

  const { unitPrice, discountPercent } = getProductUnitPrice(product, quantity);
  const lineTotal = unitPrice * quantity;
  const originalLineTotal = product.price * quantity;
  const savings = originalLineTotal - lineTotal;

  const handleQtyChange = (val: number) => {
    const min = product.minOrder || 1;
    const newQty = Math.max(min, Math.min(product.stockCount, val));
    setQuantity(newQty);
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedColor || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  // Find next tier for incentive
  const nextTier = product.bulkTiers
    ?.slice()
    .sort((a, b) => a.minQty - b.minQty)
    .find(tier => tier.minQty > quantity);

  return (
    <div 
      id={`product-card-${product.id}`}
      className="bg-white rounded border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
    >
      {/* Product Image & Badges */}
      <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.isFeatured && (
            <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              HIGH DEMAND
            </span>
          )}
          {product.tags && product.tags[0] && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
              {product.tags[0]}
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5">
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            In Stock
          </span>
        </div>

        {/* Quick View Button on Image */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Specifications</span>
        </button>
      </div>

      {/* Product Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Strength / Dimension Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {product.strengthRating && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-950 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3 text-orange-600" />
                {product.strengthRating}
              </span>
            )}
            {product.dimensions && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono">
                <Ruler className="w-3 h-3 text-slate-500" />
                {product.dimensions}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-bold text-slate-900 text-base leading-snug hover:text-orange-600 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Color Selector (if available) */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="mt-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Color Option:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {product.availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`text-xs px-2.5 py-1 rounded border transition-all cursor-pointer ${
                      selectedColor === color
                        ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Bulk Tier Notice */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900 font-mono">
                  {formatCurrency(unitPrice)}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {product.unit}
                </span>
              </div>
              {discountPercent > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-0.5">
                  <span className="line-through text-slate-400 font-normal">{formatCurrency(product.price)}</span>
                  <span>{discountPercent.toFixed(1)}% Bulk Tier Applied</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Unit Weight</span>
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 justify-end font-mono">
                <Weight className="w-3 h-3 text-slate-400" />
                {product.weightKg >= 1000 ? `${(product.weightKg/1000).toFixed(1)}t` : `${product.weightKg}kg`}
              </span>
            </div>
          </div>

          {/* Next Bulk Tier Prompt */}
          {nextTier && (
            <div className="bg-orange-50 border border-orange-200 rounded p-2 text-[11px] text-orange-950 flex items-center justify-between gap-1">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-orange-600" />
                Order <strong className="font-black">{nextTier.minQty} {product.unit}</strong> to save {nextTier.discountPercent}%
              </span>
              <button
                onClick={() => handleQtyChange(nextTier.minQty)}
                className="text-orange-700 font-black uppercase underline hover:text-orange-950 text-[10px] cursor-pointer"
              >
                Set Qty
              </button>
            </div>
          )}

          {/* Interactive Quantity & Add Button */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">Qty (Min: {product.minOrder || 1}):</span>
              <span className="font-bold text-slate-900 font-mono">
                Total: {formatCurrency(lineTotal)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-slate-300 rounded bg-slate-50 overflow-hidden shrink-0">
                <button
                  id={`qty-minus-${product.id}`}
                  onClick={() => handleQtyChange(quantity - (product.minOrder >= 50 ? 50 : 5))}
                  className="p-2 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  id={`qty-input-${product.id}`}
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQtyChange(parseInt(e.target.value) || product.minOrder || 1)}
                  min={product.minOrder || 1}
                  className="w-14 text-center text-xs font-black text-slate-900 bg-transparent focus:outline-none font-mono py-1.5"
                />
                <button
                  id={`qty-plus-${product.id}`}
                  onClick={() => handleQtyChange(quantity + (product.minOrder >= 50 ? 50 : 5))}
                  className="p-2 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                id={`add-to-cart-${product.id}`}
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-orange-500 text-white hover:text-white active:scale-95'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Order</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Quote</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
