import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MapPin, CheckCircle2, Search, Filter, ChevronRight, Loader2, Map as MapIcon } from 'lucide-react';
import { marketService } from '../services/api';
import { MarketMap } from './MarketMap';

export const MarketPricesPage: React.FC = () => {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedMarketId, setSelectedMarketId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      const data = await marketService.getLivePrices();
      setPrices(data);
      setLoading(false);
    };
    fetchPrices();
  }, []);

  const filteredPrices = prices.filter(p => {
    const isMaize = p.crop.toLowerCase().includes('maize') || p.crop.toLowerCase().includes('corn');
    const matchesSearch = p.crop.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    return isMaize && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-stone-900 tracking-tighter">Maize Market Intelligence</h2>
          <p className="text-stone-500 font-medium">Real-time maize price tracking across major Kenyan markets.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto relative">
          <button 
            onClick={() => setIsMapOpen(true)}
            className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-stone-900/20 hover:scale-105 transition-all"
          >
            <MapIcon size={18} />
            View Map
          </button>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-2xl py-3 pl-12 pr-4 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-emerald-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Price List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredPrices.length > 0 ? filteredPrices.map((price, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-xl">
                    {price.crop[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-stone-900">{price.crop}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-stone-400 text-xs font-bold">
                        <MapPin size={12} />
                        {price.location}
                      </div>
                      <span className="text-stone-200">|</span>
                      <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">{price.unit}</span>
                      {price.category && (
                        <>
                          <span className="text-stone-200">|</span>
                          <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">{price.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-8">
                  <div className="text-right">
                    <p className="text-2xl font-black text-stone-900">KES {price.price.toLocaleString()}</p>
                    <div className={`flex items-center justify-end gap-1 text-xs font-bold ${price.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {price.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {price.change}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button 
                      onClick={() => {
                        setSelectedMarketId(price.id);
                        setIsMapOpen(true);
                      }}
                      className="flex items-center gap-1 bg-stone-50 text-stone-600 hover:bg-emerald-50 hover:text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <MapPin size={10} />
                      Locate
                    </button>
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle2 size={10} />
                      Verified
                    </div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                      Updated {price.timestamp?.toDate ? price.timestamp.toDate().toLocaleDateString() : (price.timestamp ? new Date(price.timestamp).toLocaleDateString() : 'Recent')}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-3xl p-20 border border-stone-100 text-center space-y-4">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
                  <Search size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900">No results found</h3>
                  <p className="text-stone-500 font-medium">Try adjusting your search or filters.</p>
                </div>
                <button 
                  onClick={() => { setSearchTerm(''); setFilterCategory('all'); }}
                  className="text-emerald-600 font-black text-sm uppercase tracking-widest"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Market Insights Sidebar */}
          <div className="space-y-8">
            <div className="bg-[#1C1C1E] rounded-[2.5rem] p-8 text-white space-y-6">
              <h3 className="text-xl font-black tracking-tighter">Market Trends</h3>
              <div className="space-y-6">
                {prices.slice(0, 4).map((p, i) => (
                  <TrendItem 
                    key={p.id || i} 
                    label={p.crop} 
                    trend={(p.trend || 'up') as 'up' | 'down'} 
                    value={p.change || '0%'} 
                  />
                ))}
                {prices.length === 0 && (
                  <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">No trend data available</p>
                )}
              </div>
              <button className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                View Full Report
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-black tracking-tighter">Sell Your Produce</h3>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  Connect directly with verified buyers and get the best prices for your harvest.
                </p>
                <button className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-black text-sm shadow-xl">
                  List My Crops
                </button>
              </div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      )}
      {/* Market Map Modal */}
      {isMapOpen && (
        <MarketMap 
          markets={prices} 
          onClose={() => {
            setIsMapOpen(false);
            setSelectedMarketId(undefined);
          }} 
          initialSelectedId={selectedMarketId}
        />
      )}
    </div>
  );
};

const TrendItem: React.FC<{ label: string, trend: 'up' | 'down', value: string }> = ({ label, trend, value }) => (
  <div className="flex justify-between items-center">
    <span className="font-bold text-stone-300">{label}</span>
    <div className={`flex items-center gap-1 font-black ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
      {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
      {value}
    </div>
  </div>
);
