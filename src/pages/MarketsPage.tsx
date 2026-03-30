import React from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  SearchIcon, 
  FilterIcon,
  ChevronRightIcon,
  MapPinIcon
} from 'lucide-react'

export function MarketsPage() {
  const { t } = useLanguage()

  const commodities = [
    { id: 1, name: 'Maize', price: 'KES 3,200', unit: '90kg bag', trend: 'up', change: '+5.2%', location: 'Nairobi' },
    { id: 2, name: 'Beans', price: 'KES 8,500', unit: '90kg bag', trend: 'down', change: '-2.1%', location: 'Mombasa' },
    { id: 3, name: 'Potatoes', price: 'KES 2,800', unit: '50kg bag', trend: 'up', change: '+1.4%', location: 'Nakuru' },
    { id: 4, name: 'Tomatoes', price: 'KES 4,500', unit: 'Crate', trend: 'up', change: '+8.7%', location: 'Eldoret' },
    { id: 5, name: 'Onions', price: 'KES 1,200', unit: 'Net', trend: 'down', change: '-0.5%', location: 'Kisumu' },
  ]

  return (
    <div className="p-4 space-y-6 bg-[#F8FAF8]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Market Prices</h2>
        <button className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <FilterIcon size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search commodities..." 
          className="w-full bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {commodities.map((item) => (
          <Card key={item.id} elevated onClick={() => {}} className="group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-[#E8F5E9] group-hover:border-[#C8E6C9] transition-colors">
                  <span className="text-xl font-bold text-gray-400 group-hover:text-[#2E7D32]">{item.name[0]}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <MapPinIcon size={10} />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-[#1B5E20]">{item.price}</p>
                <div className="flex items-center justify-end gap-1">
                  {item.trend === 'up' ? (
                    <TrendingUpIcon size={12} className="text-green-500" />
                  ) : (
                    <TrendingDownIcon size={12} className="text-red-500" />
                  )}
                  <span className={`text-[10px] font-bold ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="h-4" />
    </div>
  )
}
