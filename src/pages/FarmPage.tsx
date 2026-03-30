import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { 
  PlusIcon, 
  Settings2Icon, 
  ArrowUpRightIcon, 
  CheckCircle2Icon,
  ClockIcon,
  ChevronRightIcon,
  ArrowLeftIcon
} from 'lucide-react'

export function FarmPage() {
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('Today')

  const tasks = [
    { id: 1, title: 'Activate irrigation', date: 'Dec - Mar 2026', status: 'todo', statusLabel: t('task.status.todo') },
    { id: 2, title: 'Get rid of weeds', date: 'Oct - Dec 2026', status: 'in-progress', statusLabel: t('task.status.inProgress') },
    { id: 3, title: 'Spray a pesticide.', date: 'Jan - Mar 2026', status: 'done', statusLabel: t('task.status.done') },
  ]

  return (
    <div className="p-4 space-y-8 bg-[#F8FAF8]">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('task.title')}</h1>
          <p className="text-sm font-medium text-gray-400">{t('task.subtitle')}</p>
        </div>
        <button className="w-12 h-12 rounded-2xl bg-[#A7F305] flex items-center justify-center shadow-xl shadow-lime-900/20 text-[#1A4D2E]">
          <PlusIcon size={24} />
        </button>
      </header>

      {/* Inventory Card */}
      <Card elevated className="flex items-center gap-6 p-6">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
          <Settings2Icon size={32} className="text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">{t('task.inventory.title')}</h3>
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
              <ArrowUpRightIcon size={16} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>{t('task.inventory.subtitle')}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-[#2E7D32]">{t('task.inventory.status')}</span>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {['Today', 'This Week', 'Completed', 'Upcoming'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeFilter === filter ? 'bg-[#1B5E20] text-white shadow-lg shadow-green-900/20' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
          >
            {filter.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} elevated className="group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-1 tracking-tight group-hover:text-[#2E7D32] transition-colors">
                  {task.title}
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {task.date}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge 
                  variant={task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'warning' : 'neutral'}
                  className="uppercase tracking-widest text-[9px] font-extrabold"
                >
                  {task.statusLabel}
                </Badge>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#A7F305] group-hover:text-[#1A4D2E] transition-all">
                  <ChevronRightIcon size={20} />
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
