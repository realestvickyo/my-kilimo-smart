import React from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../contexts/LanguageContext'
import { useApp } from '../contexts/AppContext'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { 
  UserIcon, 
  SettingsIcon, 
  GlobeIcon, 
  MoonIcon, 
  ShieldCheckIcon, 
  LogOutIcon,
  ChevronRightIcon,
  CreditCardIcon,
  HelpCircleIcon
} from 'lucide-react'

export function ProfilePage() {
  const { t, language, toggleLanguage } = useLanguage()
  const { setCurrentPage } = useApp()

  const settings = [
    { id: 'language', label: t('settings.language'), icon: GlobeIcon, value: language.toUpperCase(), onClick: toggleLanguage },
    { id: 'darkmode', label: t('settings.darkmode'), icon: MoonIcon, value: 'OFF' },
    { id: 'datasave', label: t('settings.datasave'), icon: ShieldCheckIcon, value: 'ON' },
    { id: 'support', label: t('settings.support'), icon: HelpCircleIcon },
  ]

  return (
    <div className="p-4 space-y-8 bg-[#F8FAF8]">
      {/* Profile Header */}
      <header className="flex flex-col items-center text-center mt-8 mb-12">
        <div className="w-24 h-24 rounded-3xl bg-[#E8F5E9] flex items-center justify-center border border-[#C8E6C9] mb-4 shadow-xl shadow-green-900/10">
          <UserIcon size={48} className="text-[#2E7D32]" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">John Kamau.</h1>
        <p className="text-sm font-medium text-gray-400 mb-4">Premium Member</p>
        <Badge variant="success" className="uppercase tracking-widest text-[10px] font-extrabold">ACTIVE</Badge>
      </header>

      {/* Subscription Card */}
      <Card elevated className="bg-[#1B5E20] text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <CreditCardIcon size={20} className="text-[#A7F305]" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">Subscription</span>
            </div>
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white backdrop-blur-md">RENEW MAR 12</Badge>
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight mb-1">Premium Plan.</h3>
          <p className="text-sm font-medium opacity-60">Unlimited farms & advanced analytics.</p>
        </div>
      </Card>

      {/* Settings List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Account Settings</h3>
        {settings.map((item) => (
          <Card key={item.id} elevated onClick={item.onClick} className="group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-[#E8F5E9] group-hover:border-[#C8E6C9] transition-colors">
                  <item.icon size={18} className="text-gray-400 group-hover:text-[#2E7D32]" />
                </div>
                <span className="text-sm font-bold text-gray-900">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {item.value && (
                  <span className="text-xs font-extrabold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-lg">{item.value}</span>
                )}
                <ChevronRightIcon size={16} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Sign Out */}
      <button 
        onClick={() => setCurrentPage('welcome')}
        className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-red-50 text-red-600 font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
      >
        <LogOutIcon size={18} />
        {t('settings.signout')}
      </button>

      <div className="h-4" />
    </div>
  )
}
