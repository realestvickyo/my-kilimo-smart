import React from 'react'
import { WifiOffIcon } from 'lucide-react'
export function OfflineIndicator() {
  return (
    <div className="bg-destructive/10 text-destructive px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
      <WifiOffIcon className="w-4 h-4 animate-pulse" />
      <span>You're offline. Changes will sync when connected.</span>
    </div>
  )
}
