import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Layers, 
  Droplets, 
  Hammer, 
  Cpu, 
  Flame,
  FileCheck
} from 'lucide-react';
import { COMPANY_INFO } from '../data/products';

interface QualityStandardsProps {
  onOpenTradeModal: () => void;
}

export const QualityStandards: React.FC<QualityStandardsProps> = ({ onOpenTradeModal }) => {
  const testingPillars = [
    {
      title: 'Hydraulic Vibro-Compaction',
      icon: Cpu,
      desc: 'Our high-frequency 4,500 RPM vibration presses evacuate air pockets under 160 Bar hydraulic compaction pressure, creating dense, impermeable concrete blocks with zero void fissures.',
    },
    {
      title: '14 to 21 Days Moisture Curing',
      icon: Droplets,
      desc: 'Blocks are stored in shaded humidity-controlled curing bays with automated overhead water misting. This allows the cement hydration reaction to reach 95%+ of maximum theoretical compressive strength.',
    },
    {
      title: 'Washed Silt-Free Aggregate Mix',
      icon: Layers,
      desc: 'We strictly utilize dredged river sharp sand (silt content <1.5%) blended with 3/8" quarry granite chippings and Grade 42.5R Portland cement. No loamy soil or dusty sand is ever used.',
    },
    {
      title: 'Compressive Crushing Batch Tests',
      icon: Hammer,
      desc: 'Every production shift has sample blocks crush-tested on our calibrated digital hydraulic press. Standard 6" blocks consistently achieve 5.5 to 6.2 N/mm² (exceeding standard 3.45 N/mm² code requirements).',
    },
  ];

  return (
    <div id="quality-standards-section" className="space-y-8">
      {/* Quality Banner */}
      <div className="bg-slate-950 text-white rounded-sm p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-slate-900 border border-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Certified Engineering Quality Standards</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            Why Contractors Rely On TUMID CALANG TRADING
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            In building construction, structural collapse and hairline wall cracks often trace back to sub-standard, 
            crumbly hand-molded blocks. At TUMID CALANG TRADING, precision machinery and strict laboratory testing ensure 
            every block bearing our brand delivers unwavering structural integrity.
          </p>
        </div>
      </div>

      {/* Comparison Grid: Machine Vibro-Pressed vs Ordinary Hand-Molded Blocks */}
      <div className="bg-white rounded-sm border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-extrabold text-slate-900 mb-6 text-center tracking-tight">
          Material Quality Comparison: TUMID CALANG vs Hand-Molded Roadside Blocks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TUMID CALANG */}
          <div className="bg-slate-50 border border-emerald-500/80 rounded-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-950 font-extrabold text-base">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>TUMID CALANG TRADING Blocks</span>
              </div>
              <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-xs">
                CERTIFIED
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>5.5 – 7.0 N/mm² Crushing Strength:</strong> High load-bearing capacity for multi-storey walls and fence perimeters.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Laser-Sharp 90° Edges:</strong> True geometric dimensions reduce mortar joint thickness by 40%, saving cement on site.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>14+ Days Controlled Water Curing:</strong> Eliminates crumbling edges during truck transport and handling.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Smooth Finish:</strong> Requires minimal plastering layer (saves on finishing render cost).</span>
              </li>
            </ul>
          </div>

          {/* Substandard Market Blocks */}
          <div className="bg-slate-50 border border-rose-300 rounded-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-950 font-extrabold text-base">
                <span>Ordinary Hand-Molded Roadside Blocks</span>
              </div>
              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-xs border border-rose-200">
                HIGH RISK
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 text-rose-600 font-black shrink-0">✕</span>
                <span><strong>Weak Strength (&lt; 2.0 N/mm²):</strong> Prone to vertical stress cracks when supporting floor beams or roof loads.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 text-rose-600 font-black shrink-0">✕</span>
                <span><strong>Irregular Dimensions & Warping:</strong> Forces masons to use thick uneven mortar joints, escalating project cost.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 text-rose-600 font-black shrink-0">✕</span>
                <span><strong>Premature 2-Day Sun Drying:</strong> Lack of proper water curing causes blocks to crumble like dust on offloading.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 text-rose-600 font-black shrink-0">✕</span>
                <span><strong>Excess Silt & Soil:</strong> High mud content causes plaster peeling and paint dampness.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Manufacturing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {testingPillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div 
              key={idx}
              className="bg-white rounded-sm border border-slate-200 p-5 space-y-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-sm bg-orange-50 text-orange-600 flex items-center justify-center font-bold border border-orange-200">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">{pillar.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Lab Certification Request Banner */}
      <div className="bg-slate-950 text-slate-100 rounded-sm p-6 flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <FileCheck className="w-8 h-8 text-orange-400" />
          <div>
            <h4 className="font-bold text-white text-base">Require Batch Quality Certificates for Engineers or Building Approvals?</h4>
            <p className="text-xs text-slate-400">We provide official 7-day and 28-day crushing test laboratory result certificates with every major order.</p>
          </div>
        </div>

        <button
          onClick={onOpenTradeModal}
          className="px-5 py-2.5 rounded-sm bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Request Batch Test Report
        </button>
      </div>
    </div>
  );
};
