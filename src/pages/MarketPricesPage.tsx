import React from 'react'
import { Layout } from '../components/Layout'
import { 
  TrendingUpIcon, 
  AlertTriangleIcon,
  ChevronRightIcon,
  ArrowLeft
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useNavigate } from 'react-router-dom'

const growthData = [
  { day: 'Mon', value: 30 },
  { day: 'Tue', value: 35 },
  { day: 'Wed', value: 45 },
  { day: 'Thu', value: 42 },
  { day: 'Fri', value: 55 },
  { day: 'Sat', value: 65 },
  { day: 'Sun', value: 72 },
]

export function MarketPricesPage() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="rounded-full bg-white p-3 shadow-sm border border-border"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Analytics
        </div>
      </div>

      <div className="mb-6">
        <h1 className="font-headings text-3xl font-bold text-foreground">Crop Health</h1>
        <p className="text-sm font-medium text-muted-foreground">Potato field in Field A</p>
      </div>

      <div className="space-y-8">
        {/* Growth Progress Chart */}
        <section className="rounded-[2.5rem] bg-white p-8 border border-border shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-foreground">Growth Progress</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Last 7 days</p>
            </div>
            <div className="text-right">
              <div className="text-[#4F7942] font-bold text-2xl">+12%</div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">vs. average</p>
            </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A4D2E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1A4D2E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5F6368', fontSize: 10, fontWeight: 'bold' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1A4D2E" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Pest Risk Alert */}
        <section className="bg-orange-50 border border-orange-100 rounded-[2rem] p-6">
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-border">
              <AlertTriangleIcon className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-sm text-orange-900">Pest Risk Alert</h4>
                <span className="bg-orange-200 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Moderate
                </span>
              </div>
              <p className="text-xs text-orange-800/80 leading-relaxed mb-3">
                Aphid activity detected near sector 4 due to rising humidity.
              </p>
              <button className="text-[10px] font-bold text-orange-900 uppercase tracking-widest flex items-center gap-1">
                View Map <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

        {/* Soil Composition */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Soil Composition</h3>
            <button className="text-muted-foreground">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-border text-center shadow-sm">
              <div className="w-8 h-8 bg-muted text-foreground rounded-xl flex items-center justify-center text-[10px] font-bold mx-auto mb-3">N</div>
              <div className="text-lg font-bold mb-1">180</div>
              <div className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Optimal</div>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-border text-center shadow-sm">
              <div className="w-8 h-8 bg-muted text-foreground rounded-xl flex items-center justify-center text-[10px] font-bold mx-auto mb-3">P</div>
              <div className="text-lg font-bold mb-1">42</div>
              <div className="text-[9px] font-bold text-red-600 uppercase tracking-widest">Low</div>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-border text-center shadow-sm">
              <div className="w-8 h-8 bg-muted text-foreground rounded-xl flex items-center justify-center text-[10px] font-bold mx-auto mb-3">K</div>
              <div className="text-lg font-bold mb-1">210</div>
              <div className="text-[9px] font-bold text-foreground uppercase tracking-widest">Good</div>
            </div>
          </div>
        </section>
      </div>
      
      <div className="h-24 md:hidden" />
    </Layout>
  )
}
