import React, { useState, createContext, useContext, ReactNode } from 'react'

import { AppView } from '../types'

export type Page = 'welcome' | 'onboarding' | 'auth' | 'main'
export type Tab = AppView
export type ViewMode = 'client' | 'admin'

interface AppContextType {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  currentTab: Tab
  setCurrentTab: (tab: Tab) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  isOffline: boolean
  toggleOffline: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('welcome')
  const [currentTab, setCurrentTab] = useState<Tab>(AppView.HOME)
  const [viewMode, setViewMode] = useState<ViewMode>('client')
  const [isOffline, setIsOffline] = useState(false)
  const toggleOffline = () => setIsOffline(!isOffline)

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        currentTab,
        setCurrentTab,
        viewMode,
        setViewMode,
        isOffline,
        toggleOffline,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
