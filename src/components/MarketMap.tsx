import React, { useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { X, MapPin, TrendingUp, TrendingDown, Navigation } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

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
  initialSelectedId?: string;
}

export const MarketMap: React.FC<MarketMapProps> = ({ markets, onClose, initialSelectedId }) => {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(
    markets.find(m => m.id === initialSelectedId) || null
  );

  if (!hasValidKey) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-100">
            <MapPin size={40} />
          </div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tighter">Google Maps API Key Required</h2>
          <div className="text-left space-y-4 bg-stone-50 p-6 rounded-3xl border border-stone-100">
            <p className="text-sm font-bold text-stone-600">To enable the market locator, please add your Google Maps API key:</p>
            <ol className="text-xs font-bold text-stone-500 space-y-3 list-decimal pl-4">
              <li>Get an API key from the <a href="https://console.cloud.google.com/google/maps-apis/credentials" target="_blank" rel="noopener" className="text-emerald-600 underline">Google Cloud Console</a>.</li>
              <li>Open <strong>Settings</strong> (⚙️ gear icon) in AI Studio.</li>
              <li>Go to <strong>Secrets</strong> and add <code>GOOGLE_MAPS_PLATFORM_KEY</code>.</li>
              <li>Paste your key and press Enter.</li>
            </ol>
          </div>
          <button 
            onClick={onClose}
            className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-stone-900 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900 tracking-tight leading-none">Market Locator</h2>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Finding the best prices near you</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-stone-50 rounded-xl transition-all text-stone-400"
        >
          <X size={24} />
        </button>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative">
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={selectedMarket ? { lat: selectedMarket.lat, lng: selectedMarket.lng } : { lat: -1.286389, lng: 36.817223 }}
            defaultZoom={selectedMarket ? 12 : 7}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
            {markets.map(market => (
              <MarketMarker 
                key={market.id} 
                market={market} 
                isSelected={selectedMarket?.id === market.id}
                onClick={() => setSelectedMarket(market)}
              />
            ))}

            {selectedMarket && (
              <InfoWindow
                position={{ lat: selectedMarket.lat, lng: selectedMarket.lng }}
                onCloseClick={() => setSelectedMarket(null)}
                pixelOffset={[0, -10]}
              >
                <div className="p-2 min-w-[200px] space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-stone-900 text-base leading-tight">{selectedMarket.crop}</h3>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{selectedMarket.location}</p>
                    </div>
                    <div className={`flex items-center gap-0.5 text-[10px] font-black ${selectedMarket.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {selectedMarket.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {selectedMarket.change}
                    </div>
                  </div>
                  
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Current Price</p>
                    <p className="text-xl font-black text-stone-900">KES {selectedMarket.price.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-stone-400">per {selectedMarket.unit}</p>
                  </div>

                  <button 
                    className="w-full bg-emerald-600 text-white py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedMarket.lat},${selectedMarket.lng}`, '_blank')}
                  >
                    <Navigation size={12} />
                    Get Directions
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

const MarketMarker: React.FC<{ market: Market, isSelected: boolean, onClick: () => void }> = ({ market, isSelected, onClick }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: market.lat, lng: market.lng }}
      onClick={onClick}
      title={market.crop}
    >
      <Pin 
        background={isSelected ? '#059669' : '#10b981'} 
        glyphColor={'#fff'} 
        borderColor={isSelected ? '#064e3b' : '#065f46'}
        scale={isSelected ? 1.2 : 1}
      />
    </AdvancedMarker>
  );
};
