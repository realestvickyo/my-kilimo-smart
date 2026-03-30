import React, { ReactNode, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { OfflineIndicator } from './OfflineIndicator'
interface LayoutProps {
  children: ReactNode
}
export function Layout({ children }: LayoutProps) {
  // Simulate offline state occasionally for prototype purposes
  const [isOffline, setIsOffline] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Just a mock toggle to show the UI
      setIsOffline(Math.random() > 0.8)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="min-h-screen bg-background font-body text-foreground flex flex-col">
      {isOffline && <OfflineIndicator />}

      <div className="flex flex-1">
        <Sidebar 
          currentView={0 as any} 
          setView={() => {}} 
          farmer={{} as any} 
          lang={0 as any} 
          setLang={() => {}} 
        />

        <main className="flex-1 md:ml-64 pb-16 md:pb-0 w-full overflow-x-hidden">
          <div className="max-w-5xl mx-auto p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
