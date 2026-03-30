import React from 'react'
import { SproutIcon } from 'lucide-react'

interface CropHealthItemProps {
  name: string
  stage: string
  field: string
  progress: number
  icon: React.ReactNode
}

function CropHealthItem({ name, stage, field, progress, icon }: CropHealthItemProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4">
      <div className="bg-muted p-3 rounded-xl text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm font-headings text-foreground">{name}</h4>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          {stage} • {field}
        </p>
      </div>
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={100}
            strokeDashoffset={100 - progress}
            className="text-primary"
          />
        </svg>
        <span className="absolute text-[10px] font-bold">{progress}%</span>
      </div>
    </div>
  )
}

export function CropHealthList() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold font-headings uppercase tracking-widest text-muted-foreground">Crop Health</h3>
        <button className="text-xs font-bold text-primary">View All</button>
      </div>
      <CropHealthItem 
        name="H614D Maize" 
        stage="Vegetative Stage" 
        field="Field A" 
        progress={85}
        icon={<SproutIcon className="w-5 h-5" />}
      />
      <CropHealthItem 
        name="SC Duma 43 Maize" 
        stage="Flowering Stage" 
        field="Field B" 
        progress={60}
        icon={<SproutIcon className="w-5 h-5" />}
      />
    </div>
  )
}
