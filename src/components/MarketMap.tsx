import React, { useState, useMemo } from 'react';
import { X, MapPin, Filter } from 'lucide-react';
import { KENYA_LOCATIONS, County, SubCounty } from '../data/locations';

interface Market {
  id: string;
  crop: string;
  price: number;
  unit: string;
  trend: 'up' | 'down';
  change: string;
  location: string;
  category: string;
  lat: number;
  lng: number;
}

interface MarketMapProps {
  markets: Market[];
  onClose: () => void;
}

export const MarketMap: React.FC<MarketMapProps> = ({ markets, onClose }) => {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [selectedSubCounty, setSelectedSubCounty] = useState<SubCounty | null>(null);

  // Filtered markets logic
  const filteredMarkets = useMemo(() => {
    if (!selectedCounty) return markets;

    const countyName = selectedCounty.name.toLowerCase();
    return markets.filter(market => {
      const matchesCounty = market.location.toLowerCase().includes(countyName);
      const matchesSubCounty = selectedSubCounty 
        ? market.location.toLowerCase().includes(selectedSubCounty.name.toLowerCase())
        : true;
      
      return matchesCounty && matchesSubCounty;
    });
  }, [markets, selectedCounty, selectedSubCounty]);

  return (
    <div className="fixed inset-0 z-[100] bg-stone-900 flex flex-col">
      {/* 1. Main Header */}
      <header className="bg-white px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900 tracking-tight">Market Locator</h2>
            <p className="text-xs text-stone-500">Kenya Agricultural Markets • Real-time Prices</p>
          </div>
        </div>

        <button
          type="button"
          title="Close Market Locator"
          onClick={onClose}
          className="p-2 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-stone-600 transition-all"
        >
          <X size={24} />
        </button>
      </header>

      {/* 2. Filter Bar */}
      <div className="bg-white border-b border-stone-100 px-6 py-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-stone-600">
          <Filter size={18} />
          Filter by Location:
        </div>

        <select
        title="county"
          value={selectedCounty?.code || ''}
          onChange={(e) => {
            const val = e.target.value;
            const county = val ? KENYA_LOCATIONS.find(c => c.code === parseInt(val)) : null;
            setSelectedCounty(county || null);
            setSelectedSubCounty(null);
          }}
          className="bg-white border border-stone-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 min-w-[180px]"
        >
          <option value="">All Counties</option>
          {KENYA_LOCATIONS.map(county => (
            <option key={county.code} value={county.code}>{county.name}</option>
          ))}
        </select>

        {selectedCounty && (
          <select
            title="select"
            value={selectedSubCounty?.name || ''}
            onChange={(e) => {
              const sub = selectedCounty.subCounties.find(s => s.name === e.target.value);
              setSelectedSubCounty(sub || null);
            }}
            className="bg-white border border-stone-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 min-w-[200px]"
          >
            <option value="">All Sub-Counties</option>
            {selectedCounty.subCounties.map((sub, idx) => (
              <option key={idx} value={sub.name}>{sub.name}</option>
            ))}
          </select>
        )}

        <div className="ml-auto text-xs text-emerald-600 font-medium">
          {filteredMarkets.length} markets found
        </div>
      </div>

      {/* 3. Map Content Area */}
      <div className="flex-1 bg-stone-50 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col h-full">
            
            {/* Map Card Header */}
            <div className="px-6 py-4 border-b border-stone-100 bg-white flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest">
                  National Market Information System
                </h3>
                <p className="text-[10px] text-stone-500 font-medium">
                  Live KAMIS Data • All Kenya Counties
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Live Feed</span>
              </div>
            </div>

            {/* The Map Iframe */}
            <div className="flex-1 w-full min-h-[600px] lg:min-h-[750px]">
              <iframe 
                src="https://www.google.com/maps/d/embed?mid=11m2bpnb1LkaT_pqNGE74WxeYUsRV_whX&femb=1&ll=-0.36030464245898913%2C37.916193289999995&z=6" 
                width="100%" 
                height="100%"
                className="border-0"
                allowFullScreen
                loading="lazy"
                title="Kenya Market Prices Map"
              ></iframe>
            </div>
            
            {/* Map Card Footer */}
            <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 flex justify-between items-center">
              <p className="text-[10px] text-stone-400">
                © 2026 Smart Duka Manager • Agricultural Insights
              </p>
              <div className="text-[10px] font-bold text-stone-500 uppercase italic">
                Empowering Kenyan Farmers
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};