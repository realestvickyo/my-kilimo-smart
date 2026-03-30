import React from 'react'
import { Layout } from '../components/Layout'
import { 
  PlusIcon, 
  MapPinIcon, 
  SproutIcon, 
  ArrowUpRight,
  ArrowLeft,
  ChevronRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function FarmsPage() {
  const navigate = useNavigate()
  
  const farms = [
    {
      id: 1,
      name: 'Shamba 1',
      crop: 'Maize (H624)',
      size: '2.5 Acres',
      location: 'Nakuru, KE',
      health: 85,
      status: 'Optimal',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      id: 2,
      name: 'Shamba 2',
      crop: 'Beans (Rosecoco)',
      size: '1.2 Acres',
      location: 'Nakuru, KE',
      health: 60,
      status: 'Attention',
      statusColor: 'bg-red-100 text-red-700'
    },
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
        <button className="flex items-center gap-2 rounded-full bg-[#A7F305] px-4 py-2 text-sm font-bold text-[#1A4D2E] shadow-lg">
          <PlusIcon className="h-4 w-4" />
          Add Farm
        </button>
      </div>

      <div className="mb-6">
        <h1 className="font-headings text-3xl font-bold text-foreground">My Farms</h1>
        <p className="text-sm font-medium text-muted-foreground">Manage your agricultural assets.</p>
      </div>

      <div className="grid gap-6">
        {farms.map((farm) => (
          <div 
            key={farm.id}
            className="group relative overflow-hidden rounded-[2rem] bg-white p-8 border border-border transition-all hover:border-[#A7F305] shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-foreground">{farm.name}</h2>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${farm.statusColor}`}>
                    {farm.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Crop</span>
                    <span className="text-sm font-bold">{farm.crop}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Size</span>
                    <span className="text-sm font-bold">{farm.size}</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Location</span>
                    <span className="text-sm font-bold">{farm.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Health</span>
                  <div className="text-2xl font-bold">{farm.health}%</div>
                </div>
                <div className="rounded-full bg-muted p-3 text-muted-foreground transition-all group-hover:bg-[#A7F305] group-hover:text-[#1A4D2E]">
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
              <div 
                className={`h-full transition-all duration-1000 ${farm.health > 70 ? 'bg-green-600' : 'bg-red-600'}`}
                style={{ width: `${farm.health}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="h-24 md:hidden" />
    </Layout>
  )
}
