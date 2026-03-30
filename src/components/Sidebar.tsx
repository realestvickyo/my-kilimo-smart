import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut,
  Sprout,
  ChevronRight,
  Globe,
  Shield,
  User,
  ArrowLeftRight,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import { AppView, FarmerProfile, Language } from '../types';
import { ViewMode } from '../contexts/AppContext';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  farmer: FarmerProfile;
  lang: Language;
  setLang: (lang: Language) => void;
  onUpgrade: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setView, 
  farmer, 
  lang, 
  setLang, 
  onUpgrade,
  viewMode,
  setViewMode
}) => {
  const navItems = [
    { id: AppView.HOME, icon: LayoutDashboard, label: lang === Language.ENGLISH ? 'Dashboard' : 'Dashibodi' },
    { id: AppView.GUIDE, icon: Sprout, label: lang === Language.ENGLISH ? 'Variety Guide' : 'Mwongozo wa Mbegu' },
    { id: AppView.MARKET, icon: BarChart3, label: lang === Language.ENGLISH ? 'Market' : 'Soko' },
    { id: AppView.ALERTS, icon: Bell, label: lang === Language.ENGLISH ? 'Alerts' : 'Tahadhari' },
    { id: AppView.SUPPORT, icon: MessageCircle, label: lang === Language.ENGLISH ? 'Support' : 'Msaada' },
    { id: AppView.SETTINGS, icon: Settings, label: lang === Language.ENGLISH ? 'Profile' : 'Wasifu' },
  ];

  const isAdmin = farmer.role === 'admin';

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-100 h-screen fixed left-0 top-0 z-40">
      <div className="p-8">
        <div className="flex items-center gap-3 text-emerald-600 mb-12">
          <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-100">
            <Sprout size={24} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase text-stone-900">Kilimo Smart</span>
        </div>

        {viewMode === 'client' ? (
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all group relative ${
                  currentView === item.id 
                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' 
                    : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <item.icon size={20} className={currentView === item.id ? 'text-white' : 'group-hover:text-emerald-600'} />
                <span className="text-sm">{item.label}</span>
                {currentView === item.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </button>
            ))}
          </nav>
        ) : (
          <nav className="space-y-2">
            <button
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all bg-purple-600 text-white shadow-xl shadow-purple-100"
            >
              <Shield size={20} className="text-white" />
              <span className="text-sm">Admin Panel</span>
              <ChevronRight size={14} className="ml-auto opacity-50" />
            </button>
          </nav>
        )}
      </div>

      <div className="mt-auto p-8 space-y-6">
        {/* Admin Switcher */}
        {isAdmin && (
          <button 
            onClick={() => {
              const newMode = viewMode === 'admin' ? 'client' : 'admin';
              setViewMode(newMode);
              if (newMode === 'client') setView(AppView.HOME);
            }}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-dashed border-stone-200 text-stone-500 hover:border-emerald-500 hover:text-emerald-600 transition-all group"
          >
            <ArrowLeftRight size={18} className="group-hover:rotate-180 transition-all duration-500" />
            <span className="text-xs font-black uppercase tracking-widest">
              {viewMode === 'admin' ? 'Switch to Client' : 'Switch to Admin'}
            </span>
          </button>
        )}

        {/* Language Toggle */}
        <div className="bg-stone-50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
            <Globe size={12} />
            Language
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setLang(Language.ENGLISH)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${lang === Language.ENGLISH ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-400'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang(Language.SWAHILI)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${lang === Language.SWAHILI ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-400'}`}
            >
              SW
            </button>
          </div>
        </div>

        {viewMode === 'client' && !farmer.isPremium && (
          <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Go Pro</p>
              <p className="text-xs font-bold text-stone-900 mb-4">Unlock Advanced AI Insights</p>
              <button 
                onClick={onUpgrade}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
              >
                Upgrade Now
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-100 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
