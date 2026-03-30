import React, { useState, useEffect } from 'react';
import { Sparkles, FlaskConical, Droplets, Sprout, ChevronRight, CheckCircle2, Loader2, Zap, X, RefreshCw, AlertCircle } from 'lucide-react';
import { Recommendation, FarmerProfile, SoilMetrics } from '../types';
import { geminiService } from '../services/geminiService';

interface RecommendationsProps {
  farmer: FarmerProfile;
  soil: SoilMetrics;
}

const MOCK_RECS: Recommendation[] = [
  { 
    id: '1', 
    title: 'Nitrogen Optimization', 
    content: 'Based on your recent soil test, Nitrogen levels are slightly below optimal for the flowering stage of your Maize. Apply 50kg/acre of CAN fertilizer.', 
    type: 'soil', 
    timestamp: '2023-10-24T08:00:00Z' 
  },
  { 
    id: '2', 
    title: 'Irrigation Adjustment', 
    content: 'Forecast predicts high temperatures for the next 3 days. Increase irrigation frequency for your Maize to twice daily (6 AM and 6 PM).', 
    type: 'water', 
    timestamp: '2023-10-24T09:00:00Z' 
  },
  { 
    id: '3', 
    title: 'Crop Rotation Planning', 
    content: 'To maintain soil health in Field B, consider rotating with legumes after the current Maize harvest to fix nitrogen.', 
    type: 'crop', 
    timestamp: '2023-10-23T15:30:00Z' 
  },
];

export const Recommendations: React.FC<RecommendationsProps> = ({ farmer, soil }) => {
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [recs, setRecs] = useState<Recommendation[]>(MOCK_RECS);
  const [loading, setLoading] = useState(false);

  const fetchAIAdvice = async () => {
    if (!farmer || !farmer.isPremium) return;
    setLoading(true);
    try {
      const aiData = await geminiService.getPersonalizedAdvice(farmer, soil);
      if (aiData && aiData.length > 0) {
        const formattedRecs = aiData.map((item: any, idx: number) => ({
          id: `ai-${idx}`,
          title: item.title,
          content: item.content,
          type: item.type,
          timestamp: new Date().toISOString()
        }));
        setRecs(formattedRecs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (farmer?.isPremium) {
      fetchAIAdvice();
    }
  }, [farmer?.isPremium]);

  if (!farmer) return null;

  return (
    <div className="space-y-6">
      {farmer.isPremium && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sparkles size={18} />
            <span className="text-xs font-black uppercase tracking-widest">AI-Powered Insights Active</span>
          </div>
          <button 
            onClick={fetchAIAdvice}
            disabled={loading}
            className="text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-emerald-600 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={12} /> : <RefreshCw size={12} />}
            Refresh Advice
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recs.map((rec) => (
          <div key={rec.id} className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-[1.5rem] ${
                  rec.type === 'soil' ? 'bg-emerald-50 text-emerald-600' : 
                  rec.type === 'water' ? 'bg-blue-50 text-blue-600' : 
                  rec.type === 'pest' ? 'bg-red-50 text-red-600' :
                  'bg-orange-50 text-orange-600'
                }`}>
                  {rec.type === 'soil' ? <FlaskConical size={24} /> : 
                   rec.type === 'water' ? <Droplets size={24} /> : 
                   rec.type === 'pest' ? <AlertCircle size={24} /> :
                   <Sprout size={24} />}
                </div>
                <div className="flex items-center gap-1 bg-stone-50 px-3 py-1 rounded-full">
                  {rec.id.startsWith('ai-') ? (
                    <Zap size={10} className="text-amber-500 fill-amber-500" />
                  ) : (
                    <CheckCircle2 size={10} className="text-emerald-600" />
                  )}
                  <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">
                    {rec.id.startsWith('ai-') ? 'AI Generated' : 'KALRO Verified'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-xl font-black text-stone-900 leading-tight tracking-tight group-hover:text-emerald-600 transition-colors">{rec.title}</h4>
                <p className="text-sm text-stone-500 leading-relaxed font-medium line-clamp-3">
                  {rec.content}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">
                {rec.id.startsWith('ai-') ? 'Just now' : '2h ago'}
              </span>
              <button 
                onClick={() => setSelectedRec(rec)}
                className="text-emerald-600 text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                Details <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Detail Modal */}
      {selectedRec && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 space-y-8 relative overflow-hidden">
            <button 
              onClick={() => setSelectedRec(null)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-900"
            >
              <X size={24} />
            </button>
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl inline-block ${
                selectedRec.type === 'soil' ? 'bg-emerald-50 text-emerald-600' : 
                selectedRec.type === 'water' ? 'bg-blue-50 text-blue-600' : 
                selectedRec.type === 'pest' ? 'bg-red-50 text-red-600' :
                'bg-orange-50 text-orange-600'
              }`}>
                {selectedRec.type === 'soil' ? <FlaskConical size={32} /> : 
                 selectedRec.type === 'water' ? <Droplets size={32} /> : 
                 selectedRec.type === 'pest' ? <AlertCircle size={32} /> :
                 <Sprout size={32} />}
              </div>
              <h3 className="text-3xl font-black text-stone-900 tracking-tighter">{selectedRec.title}</h3>
              <p className="text-stone-500 font-medium leading-relaxed">{selectedRec.content}</p>
            </div>
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3">
                {selectedRec.id.startsWith('ai-') ? 'AI Analysis' : 'Expert Context'}
              </h4>
              <p className="text-xs text-stone-600 font-medium italic">
                {selectedRec.id.startsWith('ai-') 
                  ? "This advice was generated by our premium AI model analyzing your specific farm location, crop types, and real-time soil metrics."
                  : "This recommendation is based on real-time sensor data and historical crop performance in your region."}
              </p>
            </div>
            <button 
              onClick={() => setSelectedRec(null)}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
