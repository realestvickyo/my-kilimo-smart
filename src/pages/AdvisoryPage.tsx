import React from 'react'
import { Layout } from '../components/Layout'
import {
  SproutIcon,
  CalendarIcon,
  CloudRainIcon,
  CheckCircle2Icon,
  ArrowLeft,
  ChevronRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AdvisoryPage() {
  const navigate = useNavigate()
  
  const stages = [
    { name: 'Germination', active: false, completed: true },
    { name: 'Vegetative', active: true, completed: false },
    { name: 'Flowering', active: false, completed: false },
    { name: 'Grain Fill', active: false, completed: false },
    { name: 'Maturity', active: false, completed: false },
  ]

  const forecast = [
    { date: 'Mar 10', high: 24, low: 16, precip: 10 },
    { date: 'Mar 11', high: 22, low: 15, precip: 45 },
    { date: 'Mar 12', high: 21, low: 14, precip: 80 },
    { date: 'Mar 13', high: 23, low: 16, precip: 20 },
    { date: 'Mar 14', high: 25, low: 17, precip: 5 },
  ]

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
          Advisory
        </div>
      </div>

      <div className="mb-6">
        <h1 className="font-headings text-3xl font-bold text-foreground">Crop Advisory</h1>
        <p className="text-sm font-medium text-muted-foreground">Intelligence for your current season.</p>
      </div>

      {/* Growth Stage Tracker */}
      <div className="bg-white border border-border rounded-[2rem] p-8 shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#1A4D2E] p-2.5 rounded-xl text-white">
            <SproutIcon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold font-headings text-foreground">Maize Growth Stage</h2>
        </div>

        <div className="relative mb-10">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0 rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-[35%] h-1 bg-[#1A4D2E] -translate-y-1/2 z-0 rounded-full"></div>

          <div className="flex justify-between relative z-10">
            {stages.map((stage, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${stage.completed ? 'bg-[#1A4D2E] border-[#1A4D2E] text-white' : stage.active ? 'bg-white border-[#1A4D2E] text-[#1A4D2E] ring-4 ring-[#1A4D2E]/10' : 'bg-white border-border text-muted-foreground'}`}
                >
                  {stage.completed ? <CheckCircle2Icon className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest hidden md:block ${stage.active ? 'text-[#1A4D2E]' : 'text-muted-foreground'}`}
                >
                  {stage.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-center text-foreground/80 font-medium">
          Currently in <span className="text-[#1A4D2E] font-bold">Vegetative Stage (V6)</span>. <br />
          Plants are rapidly growing leaves.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Schedule */}
        <div className="bg-white border border-border rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-bold font-headings">Upcoming Schedule</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-muted/50 rounded-2xl border border-border/50">
              <div className="text-center min-w-[3rem]">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase">Feb</span>
                <span className="block text-xl font-bold text-foreground">05</span>
              </div>
              <div className="w-px bg-border h-full" />
              <div>
                <h4 className="font-bold text-sm">Top Dressing</h4>
                <p className="text-xs text-muted-foreground mt-1">Apply CAN fertilizer.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-white rounded-2xl border border-border">
              <div className="text-center min-w-[3rem]">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase">Feb</span>
                <span className="block text-xl font-bold text-foreground">15</span>
              </div>
              <div className="w-px bg-border h-full" />
              <div>
                <h4 className="font-bold text-sm">Second Weeding</h4>
                <p className="text-xs text-muted-foreground mt-1">Keep field weed-free.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="bg-white border border-border rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <CloudRainIcon className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-bold font-headings">Weather Advice</h3>
          </div>
          <div className="space-y-6">
            <div className="border-l-4 border-[#1A4D2E] pl-4">
              <h4 className="font-bold text-sm mb-1">Expected Rainfall</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Moderate rain expected in 48h. Good time to apply fertilizer.
              </p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-bold text-sm mb-1">Pest Warning</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Warm conditions favor Fall Armyworm. Scout fields tomorrow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-[#1A4D2E] border border-[#1A4D2E] rounded-[2.5rem] p-8 shadow-xl text-white">
        <div className="flex items-center gap-2 mb-8">
          <CloudRainIcon className="w-5 h-5 text-[#A7F305]" />
          <h3 className="text-lg font-bold font-headings">5-Day Forecast</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
          {forecast.map((day, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-3">{day.date}</span>
              <div className="text-xl font-bold mb-1">{day.high}°</div>
              <div className="text-xs opacity-60 mb-3">{day.low}°</div>
              <div className="flex items-center gap-1 text-[#A7F305]">
                <CloudRainIcon className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{day.precip}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-24 md:hidden" />
    </Layout>
  )
}
