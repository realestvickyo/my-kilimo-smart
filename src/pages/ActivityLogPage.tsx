import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { 
  ArrowLeft, 
  Plus, 
  Settings2, 
  ArrowUpRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ActivityLogPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Today')
  
  const tasks = [
    {
      id: 1,
      title: 'Activate irrigation',
      date: 'Dec - Mar 2026',
      status: 'To Do',
      statusColor: 'bg-muted text-muted-foreground'
    },
    {
      id: 2,
      title: 'Get rid of weeds',
      date: 'Oct - Dec 2026',
      status: 'In Progress',
      statusColor: 'bg-orange-100 text-orange-700'
    },
    {
      id: 3,
      title: 'Spray a pesticide.',
      date: 'Jan - Mar 2026',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-700'
    }
  ]

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="rounded-full bg-white p-3 shadow-sm border border-border"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button className="flex items-center gap-2 rounded-full bg-[#A7F305] px-4 py-2 text-sm font-bold text-[#1A4D2E] shadow-lg">
          <Plus className="h-4 w-4" />
          Add task
        </button>
      </div>

      <div className="mb-6">
        <h1 className="font-headings text-3xl font-bold text-foreground">Farm Operation</h1>
        <p className="text-sm font-medium text-muted-foreground">Potato field in Field A</p>
      </div>

      {/* Inventory Card */}
      <div className="mb-8 flex items-center gap-4 rounded-[2.5rem] bg-white p-6 shadow-sm border border-border">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Settings2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">50 Potato Left</h3>
            <div className="rounded-full bg-[#A7F305] p-1.5 text-[#1A4D2E]">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span>Seeds</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span>In Stock</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Today', 'This Week', 'Completed', 'Upcoming'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${activeTab === tab ? 'bg-[#1A4D2E] text-white' : 'bg-white text-muted-foreground border border-border'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="flex items-center gap-4 rounded-[2rem] bg-white p-5 shadow-sm border border-border transition-transform active:scale-[0.98]"
          >
            <div className="flex-1">
              <h4 className="mb-1 text-lg font-bold">{task.title}</h4>
              <p className="text-xs font-medium text-muted-foreground">{task.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${task.statusColor}`}>
                {task.status}
              </span>
              <div className="rounded-full bg-[#A7F305] p-2 text-[#1A4D2E]">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-24 md:hidden" />
    </Layout>
  )
}
