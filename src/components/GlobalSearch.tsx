import React, { useState, useEffect } from 'react';
import { Search, X, Sprout, BarChart3, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { FarmerProfile, AppView } from '../types';
import { marketService } from '../services/api';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: FarmerProfile;
  setView: (view: AppView) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, farmer, setView }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    crops: any[];
    markets: any[];
    tasks: any[];
  }>({ crops: [], markets: [], tasks: [] });
  const [loading, setLoading] = useState(false);
  const [allMarketPrices, setAllMarketPrices] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchMarkets = async () => {
        const data = await marketService.getLivePrices();
        setAllMarketPrices(data);
      };
      fetchMarkets();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults({ crops: [], markets: [], tasks: [] });
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      const q = query.toLowerCase();
      
      // Search Crops
      const matchedCrops = farmer.crops.filter(c => 
        c.name.toLowerCase().includes(q) || c.stage.toLowerCase().includes(q)
      );

      // Search Markets
      const matchedMarkets = allMarketPrices.filter(m => 
        m.crop.toLowerCase().includes(q) || m.location.toLowerCase().includes(q)
      );

      // Search Tasks (Mocking some tasks for search if needed, or just use what's in Dashboard)
      // For now, let's just search crops and markets as they are the main "items"
      
      setResults({
        crops: matchedCrops,
        markets: matchedMarkets,
        tasks: [] // Could add tasks here if we had a global task list
      });
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, farmer.crops, allMarketPrices]);

  if (!isOpen) return null;

  const handleSelect = (view: AppView) => {
    setView(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-stone-900/40 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-stone-100 flex items-center gap-4">
          <Search className="text-emerald-600" size={24} />
          <input 
            autoFocus
            type="text" 
            placeholder="Search crops, market prices, alerts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-xl font-black text-stone-900 placeholder:text-stone-300"
          />
          <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-xl transition-all text-stone-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400 gap-4">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
              <p className="text-xs font-black uppercase tracking-widest">Searching Kilimo Database...</p>
            </div>
          ) : !query ? (
            <div className="space-y-6">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Quick Links</p>
              <div className="grid grid-cols-2 gap-4">
                <QuickLink icon={<Sprout />} label="My Crops" onClick={() => handleSelect(AppView.SETTINGS)} />
                <QuickLink icon={<BarChart3 />} label="Market Prices" onClick={() => handleSelect(AppView.MARKET)} />
                <QuickLink icon={<Clock />} label="Farm Analytics" onClick={() => handleSelect(AppView.ANALYTICS)} />
                <QuickLink icon={<Search />} label="Pest Scan" onClick={() => handleSelect(AppView.SCAN)} />
              </div>
            </div>
          ) : (
            <>
              {results.crops.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2">Crops ({results.crops.length})</p>
                  {results.crops.map(crop => (
                    <ResultItem 
                      key={crop.id}
                      icon={<Sprout size={18} />}
                      title={crop.name}
                      subtitle={crop.stage}
                      onClick={() => handleSelect(AppView.SETTINGS)}
                    />
                  ))}
                </div>
              )}

              {results.markets.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2">Market Prices ({results.markets.length})</p>
                  {results.markets.map(market => (
                    <ResultItem 
                      key={market.id}
                      icon={<BarChart3 size={18} />}
                      title={`${market.crop} in ${market.location}`}
                      subtitle={`KES ${market.price.toLocaleString()} per ${market.unit}`}
                      onClick={() => handleSelect(AppView.MARKET)}
                    />
                  ))}
                </div>
              )}

              {results.crops.length === 0 && results.markets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-stone-400 gap-2">
                  <Search size={48} className="opacity-10" />
                  <p className="text-xs font-black uppercase tracking-widest">No results found for "{query}"</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickLink: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
  >
    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-stone-400 group-hover:text-emerald-600 shadow-sm transition-all">
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </div>
    <span className="text-sm font-black text-stone-900">{label}</span>
  </button>
);

const ResultItem: React.FC<{ icon: React.ReactNode, title: string, subtitle: string, onClick: () => void }> = ({ icon, title, subtitle, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 group-hover:text-emerald-600 transition-all">
        {icon}
      </div>
      <div className="text-left">
        <h4 className="font-black text-stone-900">{title}</h4>
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-stone-200 group-hover:text-emerald-600 transition-all" />
  </button>
);
