import React from 'react'
import { Layout } from '../components/Layout'
import { 
  BugIcon, 
  XIcon, 
  ZapIcon, 
  CheckCircle2Icon,
  AlertCircleIcon,
  ChevronRightIcon,
  ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PestReportPage() {
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
          AI Scanner
        </div>
      </div>

      <div className="relative mb-8 overflow-hidden rounded-[2.5rem] bg-black h-[400px] shadow-2xl">
        <img 
          src="https://picsum.photos/seed/pest-scan/800/1200" 
          className="w-full h-full object-cover opacity-60"
          alt="Pest Scan"
          referrerPolicy="no-referrer"
        />
        
        {/* Camera UI Overlay */}
        <div className="absolute top-6 left-6 right-6 flex justify-between">
          <button className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white border border-white/20">
            <XIcon className="w-5 h-5" />
          </button>
          <button className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white border border-white/20">
            <ZapIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scanning Frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-white/40 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#A7F305] -translate-x-1 -translate-y-1 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#A7F305] translate-x-1 -translate-y-1 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#A7F305] -translate-x-1 translate-y-1 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#A7F305] translate-x-1 translate-y-1 rounded-br-xl" />
            
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[#A7F305]/50 animate-pulse" />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="bg-white/90 backdrop-blur-md text-[#1A4D2E] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 bg-[#A7F305] rounded-full animate-ping" />
            Analyzing Leaf...
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-border">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Early Blight</h2>
              <div className="flex items-center gap-1.5 text-green-600">
                <CheckCircle2Icon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">94% Confidence</span>
              </div>
            </div>
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Critical
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted/50 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Affected</span>
              <span className="text-sm font-bold">Leaves & Stems</span>
            </div>
            <div className="bg-muted/50 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Cause</span>
              <span className="text-sm font-bold">Fungal</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircleIcon className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Action Plan</h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Apply copper-based fungicide immediately. Remove infected leaves to prevent spread to healthy plants.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 rounded-full border border-border font-bold text-xs uppercase tracking-widest hover:bg-muted transition-all">
              Save
            </button>
            <button className="py-4 rounded-full bg-[#1A4D2E] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#1A4D2E]/90 transition-all shadow-lg">
              Treatment
            </button>
          </div>
        </div>
        
        <button className="w-full flex items-center justify-between bg-white p-5 rounded-[2rem] border border-border transition-all hover:bg-muted/30 group">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-2xl">
              <BugIcon className="w-6 h-6 text-[#1A4D2E]" />
            </div>
            <span className="font-bold text-sm">View Pest History</span>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="h-24 md:hidden" />
    </Layout>
  )
}
