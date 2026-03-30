import React from 'react'
import { CheckIcon, XIcon } from 'lucide-react'
interface SubscriptionCardProps {
  name: string
  price: number
  features: {
    name: string
    included: boolean
  }[]
  isRecommended?: boolean
  buttonText: string
}
export function SubscriptionCard({
  name,
  price,
  features,
  isRecommended,
  buttonText,
}: SubscriptionCardProps) {
  return (
    <div
      className={`bg-card rounded-2xl p-6 flex flex-col relative ${isRecommended ? 'border-2 border-primary shadow-lg scale-105 z-10' : 'border border-border shadow-sm'}`}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Recommended
        </div>
      )}

      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold font-headings mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold font-headings">KES {price}</span>
          <span className="text-muted-foreground text-sm">/mo</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm">
            {feature.included ? (
              <CheckIcon className="w-5 h-5 text-primary shrink-0" />
            ) : (
              <XIcon className="w-5 h-5 text-muted-foreground/50 shrink-0" />
            )}
            <span
              className={
                feature.included ? 'text-foreground' : 'text-muted-foreground'
              }
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-2.5 rounded-lg font-medium transition-colors ${isRecommended ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary/20 text-secondary-foreground hover:bg-secondary/30'}`}
      >
        {buttonText}
      </button>
    </div>
  )
}
