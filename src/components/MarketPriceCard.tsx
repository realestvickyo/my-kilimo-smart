import React from 'react'
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react'
interface MarketPriceCardProps {
  marketName: string
  price: number
  transportCost: number
  trend: 'up' | 'down'
}
export function MarketPriceCard({
  marketName,
  price,
  transportCost,
  trend,
}: MarketPriceCardProps) {
  const netProfit = price - transportCost
  const isUp = trend === 'up'
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold font-headings text-lg">{marketName}</h3>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-primary' : 'text-destructive'}`}
        >
          {isUp ? (
            <TrendingUpIcon className="w-4 h-4" />
          ) : (
            <TrendingDownIcon className="w-4 h-4" />
          )}
          <span>{isUp ? '+2%' : '-1.5%'}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Selling Price (90kg)</span>
          <span className="font-semibold">KES {price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Est. Transport</span>
          <span className="text-destructive">
            - KES {transportCost.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-border flex justify-between items-center">
        <span className="font-medium text-foreground">Est. Net Profit</span>
        <span className="font-bold text-lg text-primary">
          KES {netProfit.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
