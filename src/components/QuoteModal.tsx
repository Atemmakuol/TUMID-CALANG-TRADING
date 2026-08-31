import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Send, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { CartItem, QuoteCustomerDetails } from '../types';
import { COMPANY_INFO, DELIVERY_ZONES } from '../data/products';
import { formatCurrency, formatWeight, getProductUnitPrice, calculateCartTotals } from '../utils/calculator';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  selectedZoneId: string;
  needsOffloading: boolean;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  cart,
  selectedZoneId,
  needsOffloading,
}) => {
  if (!isOpen) return null;

  const quoteRef = useRef<HTMLDivElement>(null);
  const quoteNumber = `TCT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const quoteDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const validUntilDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [customer, setCustomer] = useState<QuoteCustomerDetails>({
    fullName: 'Chief Structural Engineer / Site Manager',
    companyName: 'Apex Construction & Civil Works Ltd',
    phone: '+1 (800) 555-0199',
    email: 'procurement@apexconstruction.com',
    deliveryAddress: 'Site Plot 45, Golden Crest Estate, Phase 2',
    deliveryZone: selectedZoneId,
    siteAccessNotes: 'Direct road access available. 20-ton tipper accessible.',
    needsOffloadingService: needsOffloading,
    preferredDeliveryDate: 'Within 48 Hours upon payment confirmation',
    paymentMethod: 'bank_transfer',
    notes: 'Please ensure 14-day sprinkler-cured blocks are loaded for testing.',
  });

  const [isEditingCustomer, setIsEditingCustomer] = useState(false);

  const totals = calculateCartTotals(cart, selectedZoneId, needsOffloading);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsAppQuote = () => {
    let msg = `*OFFICIAL PROFORMA QUOTATION - TUMID CALANG TRADING*\n`;
    msg += `Quote Ref: ${quoteNumber}\n`;
    msg += `Date: ${quoteDate}\n`;
    msg += `Client: ${customer.fullName} (${customer.companyName || 'Individual'})\n`;
    msg += `Delivery Site: ${customer.deliveryAddress}\n`;
    msg += `----------------------------------------\n`;
    cart.forEach((item, idx) => {
      const { unitPrice } = getProductUnitPrice(item.product, item.quantity);
      msg += `${idx + 1}. ${item.product.name} x ${item.quantity} ${item.product.unit} = ${formatCurrency(unitPrice * item.quantity)}\n`;
    });
    msg += `----------------------------------------\n`;
    msg += `*Total Weight:* ${formatWeight(totals.totalWeightKg)} (${totals.truckLoadsEstimated} Truck Load(s))\n`;
    msg += `*Materials Subtotal:* ${formatCurrency(totals.subtotal)}\n`;
    msg += `*Delivery Freight:* ${formatCurrency(totals.deliveryFee)}\n`;
    if (needsOffloading) msg += `*Offloading Fee:* ${formatCurrency(totals.offloadingFee)}\n`;
    msg += `*GRAND TOTAL:* ${formatCurrency(totals.grandTotal)}\n\n`;
    msg += `Kindly issue proforma invoice confirmation.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="official-quote-modal"
        className="bg-white rounded-sm max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-6"
      >
        {/* Top Control Bar (Hidden during print) */}
        <div className="p-4 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-500 text-white rounded-xs font-bold">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">Official Proforma Quotation</h3>
              <p className="text-xs text-slate-400">Quote ID: {quoteNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingCustomer(!isEditingCustomer)}
              className="px-3 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              {isEditingCustomer ? 'Save Details' : 'Edit Customer / Site Info'}
            </button>

            <button
              id="quote-print-btn"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-orange-400" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleSendWhatsAppQuote}
              className="px-3.5 py-1.5 rounded-sm bg-orange-500 hover:bg-orange-600 text-xs font-extrabold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp Dispatch</span>
            </button>

            <button
              id="quote-modal-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-sm hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Edit Customer Details Drawer if toggled */}
        {isEditingCustomer && (
          <div className="bg-slate-100 p-4 border-b border-slate-300 text-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 print:hidden">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name / Contact:</label>
              <input
                type="text"
                value={customer.fullName}
                onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-sm p-1.5 text-xs font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Company / Project Name:</label>
              <input
                type="text"
                value={customer.companyName}
                onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-sm p-1.5 text-xs font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number:</label>
              <input
                type="text"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-sm p-1.5 text-xs font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Site Delivery Address:</label>
              <input
                type="text"
                value={customer.deliveryAddress}
                onChange={(e) => setCustomer({ ...customer, deliveryAddress: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-sm p-1.5 text-xs font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Site Access Notes:</label>
              <input
                type="text"
                value={customer.siteAccessNotes}
                onChange={(e) => setCustomer({ ...customer, siteAccessNotes: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-sm p-1.5 text-xs font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {/* Printable Quotation Document */}
        <div ref={quoteRef} className="p-6 sm:p-8 space-y-6 text-slate-900 bg-white text-xs sm:text-sm">
          
          {/* Document Header */}
          <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-sm bg-orange-500 flex items-center justify-center text-white font-black">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xl font-black font-sans tracking-tight uppercase text-slate-950">
                  TUMID CALANG TRADING
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Vibro-Compressed Concrete Blocks & Quarry Materials Supplier
              </p>
              <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                <div>{COMPANY_INFO.address}</div>
                <div>Tel: {COMPANY_INFO.phone} | WhatsApp: {COMPANY_INFO.whatsapp}</div>
                <div>Email: {COMPANY_INFO.email}</div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-lg font-black text-orange-600 uppercase tracking-wider block">
                PROFORMA QUOTATION
              </span>
              <div className="text-xs font-mono font-bold text-slate-800">
                REF: {quoteNumber}
              </div>
              <div className="text-xs text-slate-500">
                Date Issued: <strong className="text-slate-800">{quoteDate}</strong>
              </div>
              <div className="text-xs text-slate-500">
                Valid Until: <strong className="text-slate-800">{validUntilDate}</strong> (14 Days)
              </div>
            </div>
          </div>

          {/* Bill To & Project Site Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-sm border border-slate-200 text-xs">
            <div>
              <span className="font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                CLIENT / RECIPIENT:
              </span>
              <div className="font-bold text-slate-900 text-sm">{customer.fullName}</div>
              {customer.companyName && <div className="text-slate-700">{customer.companyName}</div>}
              <div className="text-slate-600 mt-1">Phone: {customer.phone}</div>
              <div className="text-slate-600">Email: {customer.email}</div>
            </div>

            <div>
              <span className="font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                DELIVERY DESTINATION & SITE ACCESS:
              </span>
              <div className="font-semibold text-slate-900">{customer.deliveryAddress}</div>
              <div className="text-orange-800 font-medium mt-1">Zone: {totals.zone.name}</div>
              <div className="text-slate-600 mt-1">Access Notes: {customer.siteAccessNotes}</div>
            </div>
          </div>

          {/* Itemized Materials Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-sm overflow-hidden">
              <thead className="bg-slate-950 text-white font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Description & Specifications</th>
                  <th className="py-2.5 px-3 text-center">Unit Mass</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {cart.map((item, idx) => {
                  const { unitPrice, discountPercent } = getProductUnitPrice(item.product, item.quantity);
                  const lineTotal = unitPrice * item.quantity;
                  const itemWeightKg = item.product.weightKg * item.quantity;

                  return (
                    <tr key={item.product.id} className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}>
                      <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{item.product.name}</div>
                        {item.product.dimensions && (
                          <div className="text-[11px] text-slate-500">Size: {item.product.dimensions}</div>
                        )}
                        {item.product.strengthRating && (
                          <div className="text-[11px] text-orange-700 font-semibold">Rating: {item.product.strengthRating}</div>
                        )}
                        {item.selectedColor && (
                          <div className="text-[11px] text-slate-600">Color: {item.selectedColor}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                        {formatWeight(itemWeightKg)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        {item.quantity} {item.product.unit.replace('per ', '')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatCurrency(unitPrice)}
                        {discountPercent > 0 && (
                          <span className="block text-[10px] text-emerald-700 font-bold">(-{discountPercent.toFixed(0)}%)</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quotation Summary Totals & Freight */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
            <div className="sm:col-span-7 space-y-3 text-xs text-slate-600">
              <div className="bg-slate-50 border border-slate-300 rounded-sm p-3.5 space-y-1.5">
                <div className="font-bold text-slate-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  Quality Assurance & Commercial Terms:
                </div>
                <ul className="list-disc pl-4 text-slate-700 space-y-1 text-[11px]">
                  <li>All hollow & solid blocks are hydraulic vibro-compressed and water-sprinkler cured for a minimum of 14 days.</li>
                  <li>Total Order Weight: <strong>{formatWeight(totals.totalWeightKg)}</strong> (Approx {totals.truckLoadsEstimated} tipper truck trip{totals.truckLoadsEstimated > 1 ? 's' : ''}).</li>
                  <li>Offloading is conducted on solid level ground accessible by haulage vehicle.</li>
                  <li>Payment must be confirmed prior to truck dispatch from yard.</li>
                </ul>
              </div>

              {/* Bank Account Details for Proforma Payment */}
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 text-[11px] space-y-1">
                <span className="font-bold text-slate-900 block">Bank Transfer Account Details:</span>
                <div className="text-slate-700">Account Name: <strong>TUMID CALANG TRADING CO.</strong></div>
                <div className="text-slate-700">Bank: <strong>First Construction Bank & Trust</strong></div>
                <div className="text-slate-700 font-mono">Account No: <strong>0194882741</strong> | Sort Code: <strong>044-150</strong></div>
              </div>
            </div>

            <div className="sm:col-span-5 bg-slate-50 p-4 rounded-sm border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Materials Subtotal:</span>
                <span className="font-mono font-semibold text-slate-900">{formatCurrency(totals.subtotal)}</span>
              </div>

              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Contractor Volume Discount:</span>
                  <span className="font-mono">-{formatCurrency(totals.totalDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Site Delivery Freight ({totals.truckLoadsEstimated} Truck):</span>
                <span className="font-mono font-semibold text-slate-900">{formatCurrency(totals.deliveryFee)}</span>
              </div>

              {needsOffloading && (
                <div className="flex justify-between text-slate-600">
                  <span>Offloading Team / Crane Service:</span>
                  <span className="font-mono font-semibold text-slate-900">{formatCurrency(totals.offloadingFee)}</span>
                </div>
              )}

              <div className="border-t border-slate-300 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Payable:</span>
                <span className="text-lg font-mono font-black text-orange-600">
                  {formatCurrency(totals.grandTotal)}
                </span>
              </div>

              <div className="pt-4 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Authorized Company Signature</div>
                <div className="font-serif italic text-base text-slate-700 mt-1">Tumid Calang Executive Desk</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
