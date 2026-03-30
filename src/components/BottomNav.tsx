import React from 'react';
import { LayoutDashboard, BarChart3, Bell, User, Sprout } from 'lucide-react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.HOME, icon: LayoutDashboard, label: 'Home' },
    { id: AppView.GUIDE, icon: Sprout, label: 'Guide' },
    { id: AppView.MARKET, icon: BarChart3, label: 'Market' },
    { id: AppView.ALERTS, icon: Bell, label: 'Alerts' },
    { id: AppView.SETTINGS, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-stone-100 px-6 py-4 flex justify-between items-center z-40">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center gap-1 transition-all relative ${
            currentView === item.id ? 'text-emerald-600' : 'text-stone-400'
          }`}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
