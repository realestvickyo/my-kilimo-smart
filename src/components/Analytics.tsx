import React from 'react';
import { AppView, FarmerProfile, Language, PestAlert } from '../types';
import { 
  Bell, 
  TrendingUp, 
  AlertTriangle, 
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface AnalyticsProps {
  lang: Language;
  farmer: FarmerProfile;
  pestAlerts: PestAlert[];
}

const data = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 40 },
  { name: 'Thu', value: 65 },
  { name: 'Fri', value: 75 },
  { name: 'Sat', value: 85 },
  { name: 'Sun', value: 92 },
];

const Analytics: React.FC<AnalyticsProps> = ({ lang, farmer, pestAlerts }) => {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center px-2">
        <div>
          <p className="text-stone-400 text-xs font-medium uppercase tracking-widest">Field Analytics</p>
          <h1 className="text-2xl font-bold text-stone-900">Crop Health</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-white border border-stone-100 flex items-center justify-center shadow-sm">
          <Bell size={20} className="text-stone-600" />
        </button>
      </header>

      {/* Growth Progress Chart */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Growth Progress</h3>
            <p className="text-[10px] text-stone-400 font-medium">Last 7 days</p>
          </div>
          <div className="text-right">
            <span className="text-emerald-600 font-bold text-sm">+12%</span>
            <p className="text-[10px] text-stone-400 font-medium">vs. average</p>
          </div>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94A3B8' }} 
                dy={10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10B981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pest Risk Alert */}
      {pestAlerts.length > 0 && (
        <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-orange-600">
              <AlertTriangle size={18} />
              <span className="font-bold text-sm">Pest Risk Alert</span>
            </div>
            <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Moderate</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {pestAlerts[0].description}
          </p>
          <button className="text-orange-600 text-xs font-bold flex items-center gap-1">
            View Map <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Soil Composition */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-stone-900">Soil Composition</h3>
          <button className="text-stone-400">
            <MoreHorizontal size={20} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <CompositionCard label="N" value="180" unit="mg/kg" status="Optimal" color="text-emerald-600" />
          <CompositionCard label="P" value="42" unit="mg/kg" status="Low" color="text-orange-500" />
          <CompositionCard label="K" value="210" unit="mg/kg" status="Good" color="text-emerald-600" />
        </div>
      </section>
    </div>
  );
};

const CompositionCard = ({ label, value, unit, status, color }: { label: string, value: string, unit: string, status: string, color: string }) => (
  <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm space-y-3">
    <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 font-bold text-xs">
      {label}
    </div>
    <div>
      <p className="text-lg font-bold text-stone-900">{value}</p>
      <p className="text-[10px] text-stone-400 font-medium mb-1">{unit}</p>
      <span className={`text-[9px] font-bold uppercase tracking-wider ${color}`}>
        {status}
      </span>
    </div>
  </div>
);

export default Analytics;
