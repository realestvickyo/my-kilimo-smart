import React from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'
import { useApp } from '../contexts/AppContext'
import { Card } from '../components/ui/Card'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Badge } from '../components/ui/Badge'
import { 
  MapPinIcon, 
  DropletsIcon, 
  ThermometerIcon, 
  WindIcon, 
  ChevronRightIcon,
  BellIcon,
  SearchIcon,
  UserIcon
} from 'lucide-react'

export function HomePage() {
  const { t } = useLanguage()
  const { setCurrentTab } = useApp()

  return (
    <div className="p-4 space-y-6 bg-[#F8FAF8]">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center border border-[#C8E6C9]">
            <UserIcon size={24} className="text-[#2E7D32]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              {t('home.greeting')}
            </h1>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <MapPinIcon size={12} />
              <span>{t('home.location')}</span>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm relative">
          <BellIcon size={20} className="text-gray-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </header>

      {/* Weather Hero Card */}
      <Card className="weather-gradient text-white overflow-hidden relative" noPadding elevated>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white backdrop-blur-md">
                <DropletsIcon size={12} /> 42.5%
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white backdrop-blur-md">
                <ThermometerIcon size={12} /> +12°C
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Friday Day</p>
              <p className="text-[10px] font-medium opacity-40">10.45 AM | Feb 26</p>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-6xl font-extrabold tracking-tighter">24°C</h2>
              <p className="text-sm font-medium opacity-80 mt-1">Partly Cloudy</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
              <WindIcon size={16} className="text-[#A7F305]" />
              <span className="text-xs font-bold">5 km/h</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Efficiency & Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card elevated className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {t('home.water.efficiency')}
            </h3>
            <Badge variant="success">HIGH</Badge>
          </div>
          <div className="flex items-end justify-between gap-1 h-16 mb-4">
            {[40, 60, 80, 100, 90, 70, 50, 85, 95, 100, 80, 60, 40, 30, 20, 15, 10].map((h, i) => (
              <div 
                key={i} 
                className={`w-full rounded-full transition-all ${i < 12 ? 'bg-[#2E7D32]' : 'bg-gray-100'}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="text-2xl font-extrabold text-gray-900">85%</div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card elevated className="flex flex-col justify-between">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              {t('home.soil.health')}
            </h3>
            <div>
              <div className="text-xl font-extrabold text-gray-900 mb-1">pH 7.5</div>
              <Badge variant="success" size="sm">NORMAL</Badge>
            </div>
          </Card>
          <Card elevated className="flex flex-col items-center justify-center text-center">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              {t('home.crop.health')}
            </h3>
            <ProgressRing 
              progress={75} 
              size={60} 
              strokeWidth={6} 
              color="#2E7D32"
              label={<span className="text-sm font-extrabold">75</span>}
            />
          </Card>
        </div>
      </div>

      {/* Map Section */}
      <Card noPadding elevated className="relative h-48 overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000&auto=format&fit=crop" 
          alt="Field Map" 
          className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-black/5">
            <MapPinIcon size={14} className="text-[#2E7D32]" />
            {t('home.see.maps').toUpperCase()}
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <button className="bg-[#1B5E20] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xl shadow-green-900/20">
            {t('home.generate.report').toUpperCase()}
          </button>
          <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Efficiency</p>
            <p className="text-xs font-extrabold text-[#1B5E20]">85% WATER / 75 HEALTH</p>
          </div>
        </div>
      </Card>

      <div className="h-4" />
    </div>
  )
}
