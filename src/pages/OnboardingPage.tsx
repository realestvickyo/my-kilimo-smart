import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { authService } from '../services/authService';
import { Sprout, MapPin, Ruler, Check, ArrowRight, Loader2, Map as MapIcon } from 'lucide-react';
import { KENYA_LOCATIONS } from '../data/locations';
import { AppView } from '../types';

export function OnboardingPage() {
  const { setCurrentPage, setCurrentTab } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [farmSize, setFarmSize] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [county, setCounty] = useState('');
  const [subCounty, setSubCounty] = useState('');
  const [ward, setWard] = useState('');

  const selectedCountyData = KENYA_LOCATIONS.find(c => c.name === county);
  const selectedSubCountyData = selectedCountyData?.subCounties.find(sc => sc.name === subCounty);

  const crops = [
    { id: 'highland', name: 'Highland', icon: '⛰️', desc: 'Cool & Humid (1700-2300m)' },
    { id: 'mid_altitude', name: 'Mid-Altitude', icon: '🌄', desc: 'Mild & Moderate (1000-1800m)' },
    { id: 'lowland', name: 'Lowland', icon: '🌊', desc: 'Hot & Humid (0-1250m)' },
    { id: 'dryland', name: 'Dryland', icon: '☀️', desc: 'Arid & Semi-Arid (ASAL)' },
  ];

  const toggleCrop = (id: string) => {
    setSelectedCrops(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      await authService.updateProfile({
        farmSize: parseFloat(farmSize),
        county,
        subCounty,
        ward,
        location: `${ward}, ${subCounty}, ${county}`,
        crops: selectedCrops.map(id => {
          const crop = crops.find(c => c.id === id);
          return {
            id: Math.random().toString(36).substr(2, 9),
            name: `${crop?.name} Maize`,
            stage: 'Vegetative',
            health: 85,
            location: 'Main Field'
          };
        }),
        completeness: 100
      });
      setCurrentTab(AppView.SETTINGS);
      setCurrentPage('main');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Progress Bar */}
      <div className="h-2 bg-stone-50 w-full">
        <motion.div 
          className="h-full bg-emerald-600"
          initial={{ width: '0%' }}
          animate={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-start md:justify-center px-6 md:px-24 max-w-2xl mx-auto w-full py-6 md:py-12 overflow-y-auto relative">
        {/* Skip Button */}
        <button 
          onClick={() => {
            setCurrentTab(AppView.SETTINGS);
            setCurrentPage('main');
          }}
          className="absolute top-6 right-6 text-stone-400 font-bold text-xs uppercase tracking-widest hover:text-emerald-600 transition-colors z-10"
        >
          Skip to Profile
        </button>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <div className="bg-emerald-50 text-emerald-600 w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-100/50">
                  <MapIcon size={32} />
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter leading-none">
                  Where is your <span className="text-emerald-600">farm?</span>
                </h2>
                <p className="text-stone-500 text-lg font-medium">Select your location for precise weather and pest alerts.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">County</label>
                  <select 
                    value={county}
                    onChange={(e) => { setCounty(e.target.value); setSubCounty(''); setWard(''); }}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 px-6 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  >
                    <option value="">Select County</option>
                    {KENYA_LOCATIONS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                {county && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Sub-County</label>
                    <select 
                      value={subCounty}
                      onChange={(e) => { setSubCounty(e.target.value); setWard(''); }}
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 px-6 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="">Select Sub-County</option>
                      {selectedCountyData?.subCounties.map(sc => <option key={sc.name} value={sc.name}>{sc.name}</option>)}
                    </select>
                  </div>
                )}

                {subCounty && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Ward</label>
                    <select 
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 px-6 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="">Select Ward</option>
                      {selectedSubCountyData?.wards.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <button 
                disabled={!ward}
                onClick={() => setStep(2)}
                className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-100 flex items-center justify-center gap-4 hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                Next Step
                <ArrowRight size={24} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <div className="bg-emerald-50 text-emerald-600 w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-100/50">
                  <Ruler size={32} />
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter leading-none">
                  How big is your <span className="text-emerald-600">farm?</span>
                </h2>
                <p className="text-stone-500 text-lg font-medium">This helps us calculate fertilizer and water needs accurately.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="number" 
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    placeholder="Enter size in acres"
                    className="w-full bg-stone-50 border border-stone-100 rounded-[2rem] py-8 px-8 text-3xl font-black text-stone-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-stone-400 font-black text-xl uppercase tracking-widest">Acres</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-stone-100 text-stone-600 py-6 rounded-[2rem] font-black text-xl hover:bg-stone-200 transition-all"
                >
                  Back
                </button>
                <button 
                  disabled={!farmSize}
                  onClick={() => setStep(3)}
                  className="flex-[2] bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-100 flex items-center justify-center gap-4 hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                  Next Step
                  <ArrowRight size={24} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-3 md:space-y-4">
                <div className="bg-emerald-50 text-emerald-600 w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-100/50">
                  <Sprout size={28} />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tighter leading-none">
                  Which <span className="text-emerald-600">maize</span> type?
                </h2>
                <p className="text-stone-500 text-sm md:text-lg font-medium">Select the variety you are growing for tailored advice.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {crops.map((crop) => (
                  <button
                    key={crop.id}
                    onClick={() => toggleCrop(crop.id)}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 text-center ${
                      selectedCrops.includes(crop.id)
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100'
                        : 'bg-stone-50 border-stone-100 text-stone-900 hover:bg-white hover:shadow-lg'
                    }`}
                  >
                    <span className="text-4xl">{crop.icon}</span>
                    <div className="space-y-1">
                      <span className="font-black text-sm uppercase tracking-widest block">{crop.name}</span>
                      <span className={`text-[8px] font-bold uppercase tracking-tighter block ${selectedCrops.includes(crop.id) ? 'text-emerald-100' : 'text-stone-400'}`}>
                        {crop.desc}
                      </span>
                    </div>
                    {selectedCrops.includes(crop.id) && (
                      <div className="bg-white/20 p-1 rounded-full">
                        <Check size={12} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 bg-stone-100 text-stone-600 py-3 md:py-6 rounded-[1.25rem] md:rounded-[2rem] font-black text-base md:text-xl hover:bg-stone-200 transition-all"
                >
                  Back
                </button>
                <button 
                  disabled={selectedCrops.length === 0 || loading}
                  onClick={handleComplete}
                  className="flex-[2] bg-emerald-600 text-white py-3 md:py-6 rounded-[1.25rem] md:rounded-[2rem] font-black text-base md:text-xl shadow-2xl shadow-emerald-100 flex items-center justify-center gap-4 hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Complete Setup'}
                  {!loading && <Check size={24} strokeWidth={3} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
