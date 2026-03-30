import React from 'react';
import { motion } from 'motion/react';
import { Info, MapPin, CloudRain, Thermometer, ChevronRight } from 'lucide-react';

const MAIZE_ZONES = [
  {
    title: "High Altitude & High Rainfall",
    climate: "Altitude 1700m - 2300m; Rainfall > 1000mm. Cool & Humid.",
    regions: "Mt. Elgon slopes, Trans-Nzoia, Uasin Gishu, Nandi, Kericho, Kiambu, Nyandarua.",
    varieties: [
      { name: "H614D", desc: "Late maturing (6-9 months), high yield (30-40 bags/acre)." },
      { name: "H6213", desc: "Tolerant to leaf diseases, excellent for silage." },
      { name: "H6210", desc: "Good for high altitude, very stable yields." }
    ],
    color: "emerald"
  },
  {
    title: "Medium Altitude & Medium Rainfall",
    climate: "Altitude 1200m - 1700m; Rainfall 750mm - 1000mm. Warm.",
    regions: "Central Kenya (Nyeri, Murang'a), parts of Rift Valley (Nakuru, Bomet), Western (Kakamega, Bungoma).",
    varieties: [
      { name: "H513", desc: "Medium maturing (4-5 months), drought tolerant." },
      { name: "H516", desc: "High yield in medium rainfall areas." },
      { name: "SC Duma 43", desc: "Very early maturing, excellent for short rains." }
    ],
    color: "blue"
  },
  {
    title: "Lowland & Coastal Areas",
    climate: "Altitude 0m - 1200m; Rainfall 500mm - 800mm. Hot & Humid.",
    regions: "Coast region (Kilifi, Kwale, Tana River), parts of Lower Eastern.",
    varieties: [
      { name: "PH1", desc: "Tolerant to coastal heat and moisture stress." },
      { name: "PH4", desc: "Early maturing, good for coastal conditions." },
      { name: "Pwani Hybrid", desc: "Specifically bred for coastal humidity." }
    ],
    color: "orange"
  },
  {
    title: "Dryland & Semi-Arid Areas",
    climate: "Altitude 600m - 1200m; Rainfall < 500mm. Hot & Dry.",
    regions: "Machakos, Makueni, Kitui, Tharaka Nithi, parts of Kajiado.",
    varieties: [
      { name: "Katumani Composite B", desc: "Drought escaping, matures in 3 months." },
      { name: "DLC1", desc: "Dryland composite, very hardy." },
      { name: "DH04", desc: "Early maturing hybrid for dry areas." }
    ],
    color: "red"
  }
];

export const MaizeGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tighter">Maize Variety Guide</h2>
          <p className="text-stone-500 font-medium">Selecting the right variety for your agro-ecological zone</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MAIZE_ZONES.map((zone, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl bg-${zone.color}-50 text-${zone.color}-600`}>
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-black text-stone-900 leading-tight">{zone.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    <CloudRain size={12} /> Climate
                  </div>
                  <p className="text-sm text-stone-600 font-medium leading-relaxed">{zone.climate}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    <MapPin size={12} /> Regions
                  </div>
                  <p className="text-sm text-stone-600 font-medium leading-relaxed">{zone.regions}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Recommended Varieties</div>
                <div className="grid grid-cols-1 gap-3">
                  {zone.varieties.map((v, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-100 group-hover:bg-white transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 bg-${zone.color}-500`} />
                      <div>
                        <div className="text-sm font-black text-stone-900">{v.name}</div>
                        <div className="text-xs text-stone-500 font-medium">{v.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-emerald-600 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <h3 className="text-3xl font-black tracking-tighter">Need a specific recommendation?</h3>
          <p className="text-emerald-50 font-medium leading-relaxed">
            Our AI can analyze your specific soil test results and local micro-climate to suggest the absolute best variety for your farm.
          </p>
          <button className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:gap-3 transition-all shadow-xl shadow-emerald-900/20">
            Get AI Analysis <ChevronRight size={18} />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </div>
    </div>
  );
};
