import React from 'react'
import { Layout } from '../components/Layout'
import { 
  Settings, 
  MapPin, 
  Droplets, 
  Thermometer, 
  Wind,
  Plus,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react'
import { motion } from 'motion/react'

export function DashboardPage() {
  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim" 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-headings text-xl font-bold text-foreground">Hi, Rahim Khan</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>Tangail, Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
        <button className="rounded-full bg-white p-2.5 shadow-sm border border-border">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Hero Weather Card */}
      <div className="relative mb-6 overflow-hidden rounded-[2.5rem] bg-[#1A4D2E] p-8 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop" 
            alt="Farm" 
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <Droplets className="h-4 w-4 text-[#A7F305]" />
              <span className="text-xs font-bold">42.5%</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <Thermometer className="h-4 w-4 text-[#A7F305]" />
              <span className="text-xs font-bold">+12°C</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <Wind className="h-4 w-4 text-[#A7F305]" />
              <span className="text-xs font-bold">5 km/h</span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="font-headings text-7xl font-bold tracking-tighter">24°C</div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-xl font-bold">
                <Wind className="h-5 w-5 text-[#A7F305]" />
                <span>Friday Day</span>
              </div>
              <div className="text-sm font-medium opacity-70">10.45 AM | Feb 26</div>
            </div>
          </div>
        </div>
      </div>

      {/* Efficiency of Water */}
      <div className="mb-6 rounded-[2rem] bg-white p-6 shadow-sm border border-border">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-headings font-bold text-foreground">Efficiency of Water</h3>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700 uppercase">High</span>
            <span className="text-lg font-bold">85%</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-1 h-16">
          {[40, 60, 80, 100, 90, 70, 50, 85, 95, 100, 80, 60, 40, 30, 20, 15, 10].map((h, i) => (
            <div 
              key={i} 
              className={`w-full rounded-full transition-all ${i < 12 ? 'bg-[#1A4D2E]' : 'bg-muted'}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Soil & Crop Health Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm border border-border">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Soil Health</span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">Normal</span>
          </div>
          <div className="mb-2 text-sm font-bold">pH: 7.5, Optional</div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-green-600">
            <ArrowUpRight className="h-3 w-3" />
            <span>+24% Last Week</span>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-sm border border-border">
          <div className="mb-3 text-xs font-bold text-muted-foreground">Crop Health Score</div>
          <div className="relative flex h-16 items-center justify-center overflow-hidden">
            {/* Simple Gauge visualization */}
            <div className="absolute bottom-0 h-24 w-24 rounded-full border-8 border-muted" />
            <div 
              className="absolute bottom-0 h-24 w-24 rounded-full border-8 border-green-600" 
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: 'rotate(45deg)' }}
            />
            <div className="z-10 text-lg font-bold">75 <span className="text-xs text-muted-foreground">/ 100</span></div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="relative mb-6 overflow-hidden rounded-[2.5rem] bg-muted h-64 shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000&auto=format&fit=crop" 
          alt="Field Map" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="absolute top-4 left-4">
          <button className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold backdrop-blur-md shadow-sm">
            <MapPin className="h-3 w-3 text-green-700" />
            See Maps
          </button>
        </div>

        <div className="absolute top-4 right-4">
          <button className="rounded-full bg-[#A7F305] p-2 shadow-lg text-[#1A4D2E]">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <button className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold backdrop-blur-md shadow-sm">
            Generate Report
          </button>
          <div className="rounded-2xl bg-white/90 p-3 text-[10px] font-bold shadow-lg backdrop-blur-md">
            <div className="mb-1">Efficiency of Water: 85%</div>
            <div>Crop health: 75/100</div>
          </div>
        </div>
      </div>

      <div className="h-24 md:hidden" />
    </Layout>
  )
}
