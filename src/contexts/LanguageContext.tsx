import React, { useState, createContext, useContext, ReactNode } from 'react'

import { Language } from '../types'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  [Language.ENGLISH]: {
    'app.title': 'Kilimo Smart',
    'welcome.tagline': 'Welcome to Kilimo Smart',
    'welcome.subtitle': 'AI-powered tools for smarter farming',
    'btn.getStarted': 'Get Started',
    'btn.next': 'Next',
    'btn.back': 'Back',
    'btn.skip': 'Skip',
    'btn.sendOtp': 'Send OTP',
    'btn.verify': 'Verify',
    'nav.home': 'Home',
    'nav.weather': 'Weather',
    'nav.crops': 'Crops',
    'nav.task': 'Task',
    'nav.settings': 'Settings',
    'offline.banner': 'You are offline. Data may not be current.',
    'offline.status': 'Offline',
    'online.status': 'Online',
    'home.greeting': 'Hi, John!',
    'home.location': 'Trans Nzoia, Kenya',
    'home.water.efficiency': 'Efficiency of Water',
    'home.soil.health': 'Soil Health',
    'home.crop.health': 'Crop Health Score',
    'home.see.maps': 'See Maps',
    'home.generate.report': 'Generate Report',
    'task.title': 'Farm Operation',
    'task.add': 'Add task',
    'task.subtitle': 'Maize field in Plot A',
    'task.inventory.title': '50 Maize Seeds Left',
    'task.inventory.subtitle': 'Seeds',
    'task.inventory.status': 'In Stock',
    'task.filter.today': 'Today',
    'task.filter.thisWeek': 'This Week',
    'task.filter.completed': 'Completed',
    'task.filter.upcoming': 'Upcoming',
    'task.status.todo': 'To Do',
    'task.status.inProgress': 'In Progress',
    'task.status.done': 'Completed',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.darkmode': 'Dark Mode',
    'settings.datasave': 'Data Saving Mode',
    'settings.support': 'Help & Support',
    'settings.signout': 'Sign Out',
    'onboarding.step1.title': 'Enter your phone number',
    'onboarding.step2.title': 'Enter verification code',
    'onboarding.step3.title': 'Create a 4-digit PIN',
    'onboarding.step4.title': 'Personal Details',
    'onboarding.step5.title': 'Farm Details',
    'onboarding.step6.title': 'Welcome to Kilimo Smart',
    'alerts.filter.all': 'All',
    'alerts.filter.high': 'High',
    'alerts.filter.medium': 'Medium',
    'alerts.filter.low': 'Low',
    'alerts.search': 'Search alerts...',
  },
  [Language.SWAHILI]: {
    'app.title': 'Kilimo Smart',
    'welcome.tagline': 'Karibu Kilimo Smart',
    'welcome.subtitle': 'Zana za AI kwa kilimo bora',
    'btn.getStarted': 'Anza Sasa',
    'btn.next': 'Endelea',
    'btn.back': 'Rudi',
    'btn.skip': 'Ruka',
    'btn.sendOtp': 'Tuma Nenosiri',
    'btn.verify': 'Thibitisha',
    'nav.home': 'Nyumbani',
    'nav.weather': 'Hali ya Hewa',
    'nav.crops': 'Mazao',
    'nav.task': 'Kazi',
    'nav.settings': 'Mipangilio',
    'offline.banner': 'Uko nje ya mtandao. Data inaweza kuwa ya zamani.',
    'offline.status': 'Nje ya mtandao',
    'online.status': 'Mtandaoni',
    'home.greeting': 'Hujambo, John!',
    'home.location': 'Trans Nzoia, Kenya',
    'home.water.efficiency': 'Ufanisi wa Maji',
    'home.soil.health': 'Afya ya Udongo',
    'home.crop.health': 'Alama ya Afya ya Mazao',
    'home.see.maps': 'Tazama Ramani',
    'home.generate.report': 'Tengeneza Ripoti',
    'task.title': 'Operesheni ya Shamba',
    'task.add': 'Ongeza kazi',
    'task.subtitle': 'Shamba la mahindi Plot A',
    'task.inventory.title': 'Mbegu 50 za Mahindi Zimebaki',
    'task.inventory.subtitle': 'Mbegu',
    'task.inventory.status': 'Zipo',
    'task.filter.today': 'Leo',
    'task.filter.thisWeek': 'Wiki Hii',
    'task.filter.completed': 'Zilizokamilika',
    'task.filter.upcoming': 'Zijazo',
    'task.status.todo': 'Kufanya',
    'task.status.inProgress': 'Inaendelea',
    'task.status.done': 'Imekamilika',
    'settings.title': 'Mipangilio',
    'settings.language': 'Lugha',
    'settings.darkmode': 'Hali ya Giza',
    'settings.datasave': 'Hifadhi Data',
    'settings.support': 'Msaada',
    'settings.signout': 'Ondoka',
    'onboarding.step1.title': 'Weka namba yako ya simu',
    'onboarding.step2.title': 'Weka namba ya uthibitisho',
    'onboarding.step3.title': 'Tengeneza PIN ya tarakimu 4',
    'onboarding.step4.title': 'Maelezo Binafsi',

    'onboarding.step5.title': 'Maelezo ya Shamba',
    'onboarding.step6.title': 'Karibu Kilimo Smart',
    'alerts.filter.all': 'Zote',
    'alerts.filter.high': 'Hatari',
    'alerts.filter.medium': 'Kati',
    'alerts.filter.low': 'Chini',
    'alerts.search': 'Tafuta...',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(Language.ENGLISH)
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === Language.ENGLISH ? Language.SWAHILI : Language.ENGLISH))
  }
  const t = (key: string): string => {
    return translations[language][key] || key
  }
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
