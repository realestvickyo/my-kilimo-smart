import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { AppProvider, useApp } from './contexts/AppContext'
import { authService } from './services/authService'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

// Pages & Components
import { WelcomePage } from './pages/WelcomePage'
import { OnboardingPage } from './pages/OnboardingPage'
import { AuthModal } from './pages/AuthPage'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import Scan from './components/Scan'
import ProfileView from './components/ProfileView'
import { PremiumModal } from './components/PremiumModal'
import { MarketPricesPage } from './components/MarketPricesPage'
import { AlertsPage } from './components/AlertsPage'
import { WeatherWidget } from './components/WeatherWidget'
import { Recommendations } from './components/Recommendations'
import { AdminPanel } from './components/AdminPanel'
import { GlobalSearch } from './components/GlobalSearch'
import { SupportPage } from './components/SupportPage'
import { MaizeGuide } from './components/MaizeGuide'

// Types
import { Language, FarmerProfile, AppView, MarketPrice, SoilMetrics, PestAlert, Crop } from './types'
import { weatherService, pestService } from './services/api'
import { Loader2, LogOut, User as UserIcon, Bell, Search, Settings as SettingsIcon, Zap, X } from 'lucide-react'

import { FirebaseProvider, useFirebase } from './components/FirebaseProvider'
import { ErrorBoundary } from './components/ErrorBoundary'

const INITIAL_SOIL: SoilMetrics = {
  moisture: 32,
  ph: 6.5,
  nitrogen: 'High',
  temp: 68
};

const INITIAL_ALERTS: PestAlert[] = [
  { 
    id: '1', 
    title: 'Pest Risk Alert', 
    severity: 'moderate', 
    description: 'Aphid activity detected near sector 4 due to rising humidity.', 
    location: 'Sector 4', 
    timestamp: '2h ago' 
  }
];

function AppContent() {
  const { currentPage, setCurrentPage, currentTab, setCurrentTab, viewMode, setViewMode } = useApp()
  const { language, setLanguage } = useLanguage()
  const { user, loading: authLoading } = useFirebase()
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // App State
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [soilMetrics, setSoilMetrics] = useState<SoilMetrics>(INITIAL_SOIL);
  const [pestAlerts, setPestAlerts] = useState<PestAlert[]>(INITIAL_ALERTS);
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      // Get admin alerts from API
      const adminAlerts = await pestService.getAdminAlerts();
      
      // Get weather-based alerts
      let weatherAlerts: PestAlert[] = [];
      if (farmer?.location && weatherData) {
        const cropNames = farmer.crops.map(c => c.name);
        weatherAlerts = pestService.getAlerts(weatherData, cropNames);
      }

      // Merge and deduplicate (by title or ID)
      const merged = [...adminAlerts, ...weatherAlerts];
      const unique = merged.filter((v, i, a) => a.findIndex(t => (t.id === v.id || t.title === v.title)) === i);
      
      setPestAlerts(unique.length > 0 ? unique : INITIAL_ALERTS);
    };

    fetchAlerts();
  }, [farmer?.location, farmer?.crops, weatherData]);

  useEffect(() => {
    if (farmer?.location) {
      const fetchWeather = async () => {
        const data = await weatherService.getForecast(farmer.location);
        if (data) {
          setWeatherData(data);
        }
      };
      fetchWeather();
    }
  }, [farmer?.location]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await authService.getUserProfile(user.uid);
          if (profile) {
            setFarmer(profile);
            
            // If admin, set viewMode to admin by default if not already set
            if (profile.role === 'admin' && currentPage === 'welcome') {
              setViewMode('admin');
              setCurrentTab(AppView.ADMIN);
            }
            
            if (profile.completeness < 100) {
              setCurrentPage('onboarding');
            } else {
              setCurrentPage('main');
            }
          } else {
            setFarmer(null);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setFarmer(null);
        }
      } else {
        setFarmer(null);
        if (currentPage === 'main' || currentPage === 'onboarding') {
          setCurrentPage('welcome');
        }
      }
      setLoading(false);
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading, setCurrentPage, setViewMode, setCurrentTab, currentPage]);

  const handleUpgrade = () => setIsPremiumModalOpen(true);
  
  const updateFarmer = async (updates: Partial<FarmerProfile>) => {
    if (farmer) {
      try {
        await authService.updateProfile(updates);
        setFarmer({ ...farmer, ...updates });
      } catch (err) {
        console.error("Failed to update farmer profile:", err);
      }
    }
  };

  const finalizeUpgrade = async () => {
    await updateFarmer({ isPremium: true });
    setIsPremiumModalOpen(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    setFarmer(null);
    setCurrentPage('welcome');
    setCurrentTab(AppView.HOME);
    setViewMode('client');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-stone-50 font-sans text-stone-900 overflow-hidden">
      <AnimatePresence mode="wait">
        {currentPage === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <WelcomePage onLogin={() => setIsAuthModalOpen(true)} />
          </motion.div>
        )}

        {currentPage === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <OnboardingPage />
          </motion.div>
        )}

        {currentPage === 'main' && farmer && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full overflow-hidden"
          >
            {/* Sidebar - Desktop */}
            <Sidebar 
              currentView={currentTab} 
              setView={setCurrentTab} 
              farmer={farmer}
              lang={language}
              setLang={setLanguage}
              onUpgrade={() => setCurrentTab(AppView.SETTINGS)}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            
            {/* Main Container */}
            <main className="flex-1 md:ml-64 h-full overflow-y-auto pb-24 md:pb-12 transition-all duration-300 scroll-smooth">
              {/* Top Header */}
              {currentTab !== AppView.HOME && (
                <header className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md px-8 py-6 flex justify-between items-center border-b border-stone-100">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black text-stone-900 tracking-tighter uppercase">
                      {viewMode === 'admin' ? 'Admin Control' : currentTab.replace('_', ' ')}
                    </h2>
                    {viewMode === 'client' && (
                      <div 
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden md:flex items-center gap-2 bg-white border border-stone-200 rounded-2xl px-4 py-2 shadow-sm cursor-pointer hover:border-emerald-500 transition-all"
                      >
                        <Search size={16} className="text-stone-400" />
                        <span className="text-xs font-bold text-stone-400 w-48">Search anything...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    {viewMode === 'admin' && (
                      <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-100">
                        Admin Mode
                      </div>
                    )}
                    <button className="relative text-stone-400 hover:text-stone-900 transition-all">
                      <Bell size={20} />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-stone-50" />
                    </button>
                    <div className="h-8 w-px bg-stone-200" />
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-stone-900 leading-none">{farmer.name}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                          {farmer.role === 'admin' ? 'Administrator' : (farmer.isPremium ? 'Pro Member' : 'Free Plan')}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black shadow-sm">
                        {farmer.name[0]}
                      </div>
                    </div>
                  </div>
                </header>
              )}

              <div className={`max-w-7xl mx-auto ${currentTab === AppView.SUPPORT || viewMode === 'admin' ? 'px-0 py-0 space-y-0' : 'px-8 py-10 space-y-12'}`}>
                {viewMode === 'admin' ? (
                  <AdminPanel />
                ) : (
                  <>
                    {currentTab === AppView.HOME && (
                      <div className="max-w-4xl mx-auto">
                        <Dashboard 
                          lang={language} 
                          farmer={farmer} 
                          soilMetrics={soilMetrics}
                          pestAlerts={pestAlerts}
                          onUpgrade={handleUpgrade}
                          onSearchClick={() => setIsSearchOpen(true)}
                          setView={setCurrentTab}
                        />
                      </div>
                    )}
                    
                    {currentTab === AppView.ANALYTICS && (
                      <Analytics lang={language} farmer={farmer} pestAlerts={pestAlerts} />
                    )}

                    {currentTab === AppView.MARKET && (
                      <MarketPricesPage />
                    )}

                    {currentTab === AppView.GUIDE && (
                      <MaizeGuide />
                    )}

                    {currentTab === AppView.SCAN && (
                      farmer.isPremium ? (
                        <Scan onClose={() => setCurrentTab(AppView.HOME)} />
                      ) : (
                        <div className="relative flex flex-col items-center justify-center py-20 text-center space-y-6">
                          <button 
                            onClick={() => setCurrentTab(AppView.HOME)}
                            className="absolute top-0 right-0 p-2 text-stone-400 hover:text-stone-900 transition-all"
                          >
                            <X size={24} />
                          </button>
                          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-100">
                            <Zap size={40} />
                          </div>
                          <div className="space-y-2 max-w-md">
                            <h3 className="text-2xl font-black text-stone-900">Premium Feature</h3>
                            <p className="text-stone-500 font-medium">AI Crop Scanning is only available for Pro members. Upgrade now to get instant pest diagnosis.</p>
                          </div>
                          <button 
                            onClick={handleUpgrade}
                            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100"
                          >
                            Upgrade to Pro
                          </button>
                        </div>
                      )
                    )}

                    {currentTab === AppView.ALERTS && (
                      <AlertsPage alerts={pestAlerts} />
                    )}

                    {currentTab === AppView.SUPPORT && (
                      <SupportPage 
                        farmer={farmer} 
                        lang={language} 
                        onBack={() => setCurrentTab(AppView.HOME)} 
                      />
                    )}

                    {currentTab === AppView.SETTINGS && (
                      <ProfileView 
                        farmer={farmer} 
                        setFarmer={setFarmer as any}
                        setLang={setLanguage} 
                        lang={language} 
                        onLogout={handleLogout}
                        onUpgrade={handleUpgrade}
                        onUpdate={updateFarmer}
                        setView={setCurrentTab}
                      />
                    )}
                  </>
                )}
              </div>
            </main>

            {/* Mobile Nav - Only on small screens and when in client mode */}
            {viewMode === 'client' && (
              <div className="md:hidden">
                <BottomNav currentView={currentTab} setView={setCurrentTab} isPremium={farmer.isPremium} />
              </div>
            )}

            {/* Global Search Overlay */}
            <GlobalSearch 
              isOpen={isSearchOpen} 
              onClose={() => setIsSearchOpen(false)} 
              farmer={farmer}
              setView={setCurrentTab}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(page) => {
          setIsAuthModalOpen(false);
          setCurrentPage(page);
        }}
      />

      {/* Upgrade Overlay */}
      {isPremiumModalOpen && (
        <PremiumModal 
          onClose={() => setIsPremiumModalOpen(false)} 
          onSuccess={finalizeUpgrade} 
          />
      )}
    </div>
  );
}

const MarketItem = ({ label, price, trend }: { label: string, price: string, trend: 'up' | 'down' }) => (
  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
    <span className="font-bold text-stone-300">{label}</span>
    <div className="text-right">
      <p className="font-black text-white">KES {price}</p>
      <p className={`text-[10px] font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
        {trend === 'up' ? '▲ 2.4%' : '▼ 1.2%'}
      </p>
    </div>
  </div>
);

export function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <LanguageProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </LanguageProvider>
      </FirebaseProvider>
    </ErrorBoundary>
  )
}
