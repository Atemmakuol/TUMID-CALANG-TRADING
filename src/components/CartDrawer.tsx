import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Truck, 
  FileText, 
  Send, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Weight
} from 'lucide-react';
import { CartItem } from '../types';
import { DELIVERY_ZONES, COMPANY_INFO } from '../data/products';
import { formatCurrency, formatWeight, getProductUnitPrice, calculateCartTotals } from '../utils/calculator';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenQuoteModal: () => void;
  selectedZoneId: string;
  setSelectedZoneId: (zoneId: string) => void;
  needsOffloading: boolean;
  setNeedsOffloading: (val: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenQuoteModal,
  selectedZoneId,
  setSelectedZoneId,
  needsOffloading,
  setNeedsOffloading,
}) => {
  if (!isOpen) return null;

  const totals = calculateCartTotals(cart, selectedZoneId, needsOffloading);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let text = `*NEW ORDER / QUOTATION REQUEST - TUMID CALANG TRADING*\n`;
    text += `----------------------------------------\n`;
    cart.forEach((item, idx) => {
      const { unitPrice } = getProductUnitPrice(item.product, item.quantity);
      text += `${idx + 1}. *${item.product.name}*\n`;
      if (item.selectedColor) text += `   • Color: ${item.selectedColor}\n`;
      text += `   • Qty: ${item.quantity} ${item.product.unit}\n`;
      text += `   • Rate: ${formatCurrency(unitPrice)} | Line: ${formatCurrency(unitPrice * item.quantity)}\n`;
    });
    text += `----------------------------------------\n`;
    text += `*Total Estimated Weight:* ${formatWeight(totals.totalWeightKg)} (${totals.truckLoadsEstimated} Truck Load(s))\n`;
    text += `*Delivery Destination:* ${totals.zone.name}\n`;
    text += `*Subtotal:* ${formatCurrency(totals.subtotal)}\n`;
    text += `*Delivery Freight:* ${formatCurrency(totals.deliveryFee)}\n`;
    if (needsOffloading) text += `*Offloading Service:* ${formatCurrency(totals.offloadingFee)}\n`;
    text += `*ESTIMATED TOTAL:* ${formatCurrency(totals.grandTotal)}\n\n`;
    text += `Please confirm availability and dispatch schedule.`;

    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 relative animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-orange-500 text-white flex items-center justify-center font-bold">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">Order & Material Quotation</h2>
              <p className="text-[11px] text-slate-400">
                {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                id="cart-clear-btn"
                onClick={onClearCart}
                className="text-xs text-slate-400 hover:text-red-400 font-medium px-2 py-1 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              id="cart-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-sm hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-400">
              <div className="w-16 h-16 rounded-sm bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Your Order Cart is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Browse our concrete blocks, pavers, cement, or use the Wall Estimator to add materials.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-sm bg-slate-900 text-orange-400 font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Explore Materials Catalog
              </button>
            </div>
          ) : (
            <>
              {/* Item Cards */}
              <div className="space-y-3">
                {cart.map((item) => {
                  const { unitPrice, discountPercent } = getProductUnitPrice(item.product, item.quantity);
                  const lineTotal = unitPrice * item.quantity;
                  const itemWeightKg = item.product.weightKg * item.quantity;

                  return (
                    <div
                      key={item.product.id}
                      className="bg-slate-50 border border-slate-200 rounded-sm p-3.5 flex gap-3 items-start justify-between"
                    >
                      <div className="w-16 h-16 rounded-sm overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        
                        {item.selectedColor && (
                          <span className="inline-block text-[10px] font-semibold text-orange-900 bg-orange-100 px-1.5 py-0.5 rounded-xs border border-orange-200">
                            Color: {item.selectedColor}
                          </span>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-mono font-bold text-slate-900">
                            {formatCurrency(unitPrice)}
                          </span>
                          <span>{item.product.unit}</span>
                          {discountPercent > 0 && (
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded-xs border border-emerald-200">
                              -{discountPercent.toFixed(0)}% Bulk Tier
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Weight className="w-3 h-3" />
                          <span>{formatWeight(itemWeightKg)}</span>
                        </div>
                      </div>

                      {/* Quantity Controls & Delete */}
                      <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center border border-slate-300 rounded-sm bg-white overflow-hidden text-xs">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - (item.product.minOrder >= 50 ? 50 : 5))}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + (item.product.minOrder >= 50 ? 50 : 5))}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-xs font-mono font-extrabold text-slate-900 mt-1">
                          {formatCurrency(lineTotal)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Haulage Logistics Breakdown Box */}
              <div className="bg-slate-950 text-slate-200 rounded-sm p-4 space-y-3 border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-400" />
                    <span className="font-bold text-xs text-white uppercase tracking-wider">Freight & Logistics Calculator</span>
                  </div>
                  <span className="text-xs font-mono text-orange-400 font-bold">
                    {formatWeight(totals.totalWeightKg)}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Select Project Site Delivery Zone:
                    </label>
                    <select
                      id="cart-delivery-zone-select"
                      value={selectedZoneId}
                      onChange={(e) => setSelectedZoneId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-sm px-2.5 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      {DELIVERY_ZONES.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} (+{formatCurrency(zone.baseTruckRate)}/truck)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Estimated Truck Loads (Max 20t / truck):</span>
                    <strong className="text-white font-mono">{totals.truckLoadsEstimated} Truck(s)</strong>
                  </div>

                  {/* Offloading Checkbox */}
                  <label className="flex items-center gap-2 pt-2 border-t border-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={needsOffloading}
                      onChange={(e) => setNeedsOffloading(e.target.checked)}
                      className="accent-orange-500 rounded-xs"
                    />
                    <span className="text-[11px] text-slate-300">
                      Include Yard Offloading Team / Hiab Crane Service (+{formatCurrency(25 * totals.truckLoadsEstimated)})
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer & Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Materials Subtotal:</span>
                <span className="font-mono text-slate-900 font-semibold">{formatCurrency(totals.subtotal)}</span>
              </div>

              {totals.totalDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>Bulk Volume Tier Savings:</span>
                  <span className="font-mono">-{formatCurrency(totals.totalDiscount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Site Delivery Freight ({totals.truckLoadsEstimated} Truck{totals.truckLoadsEstimated > 1 ? 's' : ''}):</span>
                <span className="font-mono text-slate-900 font-semibold">{formatCurrency(totals.deliveryFee)}</span>
              </div>

              {needsOffloading && (
                <div className="flex items-center justify-between">
                  <span>Site Offloading Labor / Crane:</span>
                  <span className="font-mono text-slate-900 font-semibold">{formatCurrency(totals.offloadingFee)}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                <span>Estimated Grand Total:</span>
                <span className="text-lg font-mono text-slate-950 font-black">
                  {formatCurrency(totals.grandTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                id="cart-generate-quote-btn"
                onClick={onOpenQuoteModal}
                className="py-3 px-3 rounded-sm bg-slate-900 hover:bg-slate-800 text-orange-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs border border-slate-800"
              >
                <FileText className="w-4 h-4" />
                <span>Official PDF / Proforma</span>
              </button>

              <button
                id="cart-whatsapp-order-btn"
                onClick={handleWhatsAppOrder}
                className="py-3 px-3 rounded-sm bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Send WhatsApp Order</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
