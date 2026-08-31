import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DELIVERY_ZONES, COMPANY_INFO } from '../data/products';
import { formatCurrency } from '../utils/calculator';

interface DeliveryFleetProps {
  onOpenTradeModal: () => void;
}

export const DeliveryFleet: React.FC<DeliveryFleetProps> = ({ onOpenTradeModal }) => {
  const [selectedZone, setSelectedZone] = useState<string>(DELIVERY_ZONES[0].id);

  const fleetTypes = [
    {
      title: '10-Ton Short-Wheelbase Tipper',
      capacity: 'Up to 500 blocks (6") or 10 Tons sand/gravel',
      ideal: 'Residential sites with narrow access streets, sharp turns, or overhead wires',
      specs: ['Length: 6.5m', 'Turning Radius: 7.2m', 'Manual or quick rear hydraulic tip'],
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: '20-Ton Heavy Duty Double-Axle Tipper',
      capacity: 'Up to 1,000 blocks (6") or 20 Tons sand/granite',
      ideal: 'Standard commercial & residential construction projects and road works',
      specs: ['Length: 8.8m', 'Load: 20 Metric Tons', 'High-speed hydraulic rear dump'],
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: '30-Ton Multi-Axle Flatbed with Hiab Crane',
      capacity: 'Up to 1,600 shrink-wrapped palletized blocks with crane offload',
      ideal: 'Multi-storey buildings (can lift pallets directly to 1st/2nd floor slabs) & large housing estates',
      specs: ['Boom Reach: 14 meters', 'Lifting Capacity: 3.5 tons at 4m', 'Zero block damage guarantee'],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div id="delivery-fleet-section" className="space-y-8">
      {/* Fleet Hero Banner */}
      <div className="bg-slate-950 text-white rounded-sm p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-slate-900 border border-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Dedicated Heavy Duty Haulage Fleet</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            Direct-to-Site Logistics & Crane Offloading
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            TUMID CALANG TRADING operates our own private fleet of high-capacity tipper trucks and 
            crane-equipped flatbed lorries. We eliminate broker delays, guaranteeing punctual site drop-offs and safe unloading.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900 p-3 rounded-xs border border-slate-800">
              <span className="text-xs text-slate-400 block">Same-Day Dispatch</span>
              <span className="text-sm font-bold text-orange-400">Order by 10:00 AM</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xs border border-slate-800">
              <span className="text-xs text-slate-400 block">GPS Live Tracked</span>
              <span className="text-sm font-bold text-orange-400">Real-Time Site ETAs</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xs border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 block">Crane Pallet Lift</span>
              <span className="text-sm font-bold text-orange-400">Saves 4+ Hours Labor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Vehicles Cards */}
      <div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">
          Our Transport & Haulage Fleet Vehicles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fleetTypes.map((vehicle, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-sm border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-slate-100 overflow-hidden relative">
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-slate-950/90 text-orange-400 text-xs font-mono font-bold px-2.5 py-1 rounded-xs border border-slate-800">
                    Fleet #{idx + 1}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-base">
                    {vehicle.title}
                  </h4>

                  <div className="bg-orange-50 border border-orange-200 rounded-xs p-3 text-xs text-orange-950">
                    <strong>Capacity:</strong> {vehicle.capacity}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Best For:</strong> {vehicle.ideal}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    {vehicle.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1.5 text-xs text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href={`tel:${COMPANY_INFO.whatsapp}`}
                  className="w-full py-2 px-3 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-600" />
                  <span>Inquire Vehicle Availability</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Zones & Freight Rates */}
      <div className="bg-white rounded-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Delivery Coverage Zones & Truck Freight Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Transparent per-truck trip rates based on site distance from Plot 14 Industrial Layout
            </p>
          </div>

          <span className="text-xs font-bold text-orange-900 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xs flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            Loading Yard: Calang Expressway Yard 3
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DELIVERY_ZONES.map((zone) => (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={`p-4 rounded-sm border transition-all cursor-pointer ${
                selectedZone === zone.id
                  ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-extrabold text-slate-900">{zone.name}</div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-2">
                {formatCurrency(zone.baseTruckRate)}
                <span className="text-xs font-normal text-slate-500"> / trip</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-2">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>{zone.estimatedHours}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Site Delivery Preparation Guidelines */}
        <div className="bg-slate-50 rounded-sm p-5 border border-slate-200 text-xs text-slate-700 space-y-3">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-orange-600" />
            Site Access & Offloading Instructions
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 list-disc pl-4 text-slate-600">
            <li>Ensure the delivery road is free of low-hanging electrical cables below 4.5m height for tippers.</li>
            <li>Ground should be reasonably compacted to prevent 20-ton and 30-ton trucks from sinking during wet weather.</li>
            <li>Direct tipping requires a clear turning circle of at least 10 meters.</li>
            <li>For palletized blocks with crane offload, clear a flat staging area next to the truck parking spot.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
