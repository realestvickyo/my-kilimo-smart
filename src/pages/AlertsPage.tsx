import React, { useState } from 'react'
import {
  SearchIcon,
  ShieldAlertIcon,
  ShieldIcon,
  CheckCircleIcon,
  BellIcon,
  ThermometerIcon,
  DropletIcon,
  ChevronDownIcon,
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useLanguage } from '../contexts/LanguageContext'
import { motion, AnimatePresence } from 'motion/react'

export function AlertsPage() {
  const { t } = useLanguage()
  const [expandedId, setExpandedId] = useState<number | null>(1)
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    {
      id: 'all',
      label: t('alerts.filter.all'),
    },
    {
      id: 'high',
      label: t('alerts.filter.high'),
      variant: 'danger' as const,
    },
    {
      id: 'medium',
      label: t('alerts.filter.medium'),
      variant: 'warning' as const,
    },
    {
      id: 'low',
      label: t('alerts.filter.low'),
      variant: 'success' as const,
    },
  ]

  const alerts = [
    {
      id: 1,
      pest: 'Fall Armyworm',
      level: 'HIGH RISK',
      color: 'red' as const,
      date: 'Today, 08:30 AM',
      desc: 'Outbreak reported in your sub-county. High humidity and current crop stage make your farm highly vulnerable.',
      conditions: {
        temp: 28,
        humidity: 78,
      },
      steps: [
        'Inspect whorls of 20 plants across your field immediately.',
        'If >20% show damage, apply recommended pesticide (e.g., Coragen).',
        'Spray early morning or late evening for best results.',
      ],
    },
    {
      id: 2,
      pest: 'Maize Lethal Necrosis (MLND)',
      level: 'MEDIUM',
      color: 'amber' as const,
      date: 'Yesterday',
      desc: 'Vectors spotted in neighboring county. Monitor for yellowing leaves starting from the margins.',
      conditions: {
        temp: 26,
        humidity: 65,
      },
      steps: [
        'Ensure field is free of weeds that host vectors.',
        'Uproot and burn any infected plants immediately.',
        'Do not feed infected plants to livestock.',
      ],
    },
    {
      id: 3,
      pest: 'Stalk Borer',
      level: 'LOW',
      color: 'emerald' as const,
      date: 'Oct 12',
      desc: 'Current weather conditions are unfavorable for stalk borer. Continue routine scouting.',
      conditions: {
        temp: 22,
        humidity: 45,
      },
      steps: ['Maintain regular weekly scouting.'],
    },
  ]

  return (
    <div className="flex flex-col h-full bg-[#F8FAF8]">
      {/* Search & Filters */}
      <div className="px-4 py-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="relative mb-4">
          <SearchIcon
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t('alerts.search')}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === filter.id ? (filter.id === 'all' ? 'bg-gray-900 text-white' : filter.id === 'high' ? 'bg-red-500 text-white' : filter.id === 'medium' ? 'bg-amber-500 text-white' : 'bg-[#2E7D32] text-white') : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            elevated
            highlightColor={alert.color === 'red' ? 'red' : alert.color === 'amber' ? 'amber' : 'emerald'}
            onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
            className="transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${alert.color === 'red' ? 'bg-red-50 text-red-600' : alert.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                  {alert.color === 'red' ? <ShieldAlertIcon size={20} /> : <ShieldIcon size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{alert.pest}</h3>
                  <p className="text-xs text-gray-400 font-medium">{alert.date}</p>
                </div>
              </div>
              <Badge variant={alert.color === 'red' ? 'danger' : alert.color === 'amber' ? 'warning' : 'success'}>
                {alert.level}
              </Badge>
            </div>

            <AnimatePresence>
              {expandedId === alert.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                      {alert.desc}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <ThermometerIcon size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Temperature</span>
                        </div>
                        <p className="text-lg font-extrabold text-gray-900">{alert.conditions.temp}°C</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <DropletIcon size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Humidity</span>
                        </div>
                        <p className="text-lg font-extrabold text-gray-900">{alert.conditions.humidity}%</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recommended Actions</h4>
                      {alert.steps.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircleIcon size={12} />
                          </div>
                          <p className="text-sm text-gray-700 font-medium leading-snug">{step}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="ghost" size="md" fullWidth>Dismiss</Button>
                      <Button variant="primary" size="md" fullWidth>Get Treatment</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!expandedId && (
              <div className="mt-2 flex justify-center">
                <ChevronDownIcon size={16} className="text-gray-300" />
              </div>
            )}
          </Card>
        ))}
      </div>
      
      <div className="h-4" />
    </div>
  )
}
