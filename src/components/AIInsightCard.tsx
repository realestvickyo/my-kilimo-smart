import React from 'react'
import { SparklesIcon } from 'lucide-react'

interface AIInsightCardProps {
  title: string
  description: string
}

export function AIInsightCard({ title, description }: AIInsightCardProps) {
  return (
    <div className="bg-[#1A1C1E] text-white rounded-2xl p-4 flex gap-4 items-start shadow-lg">
      <div className="bg-[#2D2F31] p-2.5 rounded-xl shrink-0">
        <SparklesIcon className="w-5 h-5 text-warning" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-sm font-headings">{title}</h4>
          <span className="bg-warning text-[#1A1C1E] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
            New
          </span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
