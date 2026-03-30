import React, { ReactNode } from 'react'
interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
}
export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground font-body">
          {title}
        </span>
        <div className="p-2 bg-primary/10 text-primary rounded-lg">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold font-headings text-foreground">
          {value}
        </h3>
        {trend && (
          <span
            className={`text-xs font-medium ${trend.isPositive ? 'text-primary' : 'text-destructive'}`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}
