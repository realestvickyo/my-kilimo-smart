import React, { ReactNode } from 'react'
interface ActivityCardProps {
  title: string
  farmName: string
  date: string
  icon: ReactNode
  notes?: string
  photoUrl?: string
}
export function ActivityCard({
  title,
  farmName,
  date,
  icon,
  notes,
  photoUrl,
}: ActivityCardProps) {
  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center z-10 relative">
          {icon}
        </div>
        <div className="w-px h-full bg-border absolute top-10 bottom-[-1rem] z-0" />
      </div>
      <div className="bg-card border border-border rounded-xl p-4 flex-1 mb-4 shadow-sm">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-semibold font-headings text-foreground">
            {title}
          </h4>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <p className="text-sm text-primary font-medium mb-2">{farmName}</p>
        {notes && <p className="text-sm text-muted-foreground mb-3">{notes}</p>}
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Activity"
            className="w-full h-32 object-cover rounded-lg"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    </div>
  )
}
