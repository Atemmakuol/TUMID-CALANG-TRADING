import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Building2, 
  Check, 
  Award, 
  Send, 
  Clock, 
  CreditCard,
  Truck
} from 'lucide-react';
import { COMPANY_INFO } from '../data/products';

interface TradeAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TradeAccountModal: React.FC<TradeAccountModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [estimatedMonthlyVolume, setEstimatedMonthlyVolume] = useState('5,000 - 15,000 Blocks / Month');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="contractor-trade-modal"
        className="bg-white rounded-sm max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200"
      >
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-orange-500 text-white rounded-xs font-bold">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">Contractor & Developer Trade Account</h3>
              <p className="text-xs text-slate-400">Wholesale Volume Pricing & Dedicated Priority Dispatch</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-sm flex items-center justify-center mx-auto border border-emerald-300">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-950 tracking-tight">Trade Application Received!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{contactName || 'Engineer'}</strong>. Our Key Account Manager for <strong>{companyName || 'your company'}</strong> will review your credentials and contact you within 2 hours to activate your wholesale trade pricing tier.
            </p>
            <div className="pt-3">
              <button
                onClick={() => { setIsSubmitted(false); onClose(); }}
                className="px-6 py-2.5 rounded-sm bg-slate-950 text-orange-400 font-bold text-xs hover:bg-slate-900 transition-colors cursor-pointer border border-slate-850"
              >
                Close & Return to Catalog
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Value Props */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-sm">
                <Award className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                <span className="font-bold text-[11px] text-slate-900 block">Tier-1 Pricing</span>
                <span className="text-[10px] text-slate-500">Up to 24% off</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-sm">
                <Truck className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                <span className="font-bold text-[11px] text-slate-900 block">Priority Fleet</span>
                <span className="text-[10px] text-slate-500">Guaranteed 6 AM load</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-sm">
                <CreditCard className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                <span className="font-bold text-[11px] text-slate-900 block">30-Day Terms</span>
                <span className="text-[10px] text-slate-500">Upon credit vetting</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Contractor Name:</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sterling Civil Works Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Project Engineer / Contact Person:</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Engr. Michael Vance"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone / WhatsApp Number:</label>
                <input
                  required
                  type="tel"
                  placeholder="+1 (800) 555-..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Corporate Email Address:</label>
                <input
                  required
                  type="email"
                  placeholder="procurement@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Active Site / Project Location:</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Horizon Valley Estate Phase 3, West Wing"
                  value={projectLocation}
                  onChange={(e) => setProjectLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Expected Monthly Supply Volume:</label>
                <select
                  value={estimatedMonthlyVolume}
                  onChange={(e) => setEstimatedMonthlyVolume(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="1,000 - 5,000 Blocks / Month">1,000 - 5,000 Blocks / Month (Small Multi-Unit)</option>
                  <option value="5,000 - 15,000 Blocks / Month">5,000 - 15,000 Blocks / Month (Residential Estate)</option>
                  <option value="15,000 - 50,000+ Blocks / Month">15,000 - 50,000+ Blocks / Month (Commercial / Industrial Mega Project)</option>
                  <option value="Bulk Aggregates & Ready Mix Only">Bulk Sand & Granite Tippers Only (100+ Tons/Week)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-sm text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-sm bg-orange-500 hover:bg-orange-600 text-white font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Trade Application</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
