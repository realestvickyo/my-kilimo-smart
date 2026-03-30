import React from 'react'
import { DropletsIcon, ThermometerIcon, ZapIcon, FlaskConicalIcon } from 'lucide-react'

interface SoilMetricProps {
  label: string
  value: string
  status: string
  statusType: 'success' | 'warning' | 'info' | 'error'
  icon: React.ReactNode
}

function SoilMetric({ label, value, status, statusType, icon }: SoilMetricProps) {
  const statusColors = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-700',
    info: 'bg-blue-100 text-blue-700',
    error: 'bg-red-100 text-red-700',
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-border flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl font-bold font-headings text-foreground">{value}</div>
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${statusColors[statusType]}`}>
        {status}
      </div>
    </div>
  )
}

export function SoilStatusGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SoilMetric 
        label="Moisture" 
        value="32%" 
        status="Low Level" 
        statusType="warning"
        icon={<DropletsIcon className="w-3.5 h-3.5" />}
      />
      <SoilMetric 
        label="PH Level" 
        value="6.5" 
        status="Optimal" 
        statusType="success"
        icon={<FlaskConicalIcon className="w-3.5 h-3.5" />}
      />
      <SoilMetric 
        label="Nitrogen" 
        value="High" 
        status="Good" 
        statusType="success"
        icon={<ZapIcon className="w-3.5 h-3.5" />}
      />
      <SoilMetric 
        label="Temp" 
        value="68°F" 
        status="Normal" 
        statusType="success"
        icon={<ThermometerIcon className="w-3.5 h-3.5" />}
      />
    </div>
  )
}
