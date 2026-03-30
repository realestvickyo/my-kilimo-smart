import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { Sprout, ArrowRight, Play, ShieldCheck, Globe, Zap, X } from 'lucide-react';

export function WelcomePage({ onLogin }: { onLogin: () => void }) {
  const { setCurrentPage } = useApp();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3 text-emerald-600">
          <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-100">
            <Sprout size={24} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase text-stone-900">Kilimo Smart</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <NavLink label="Features" targetId="features" />
          <NavLink label="Market" targetId="market" />
          <NavLink label="Pricing" targetId="pricing" />
          <button 
            onClick={onLogin}
            className="bg-stone-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
            >
              <Zap size={14} />
              The Future of Farming is Here
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-8xl font-black text-stone-900 tracking-tighter leading-[0.85]"
            >
              GROW<br />
              <span className="text-emerald-600">SMARTER</span><br />
              NOT HARDER.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-stone-500 max-w-lg leading-relaxed font-medium"
            >
              Harness the power of AI to optimize your yields, monitor soil health, and track real-time market prices across Kenya.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={onLogin}
                className="bg-emerald-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-emerald-100 flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all hover:scale-105"
              >
                Start Your Journey
                <ArrowRight size={24} />
              </button>
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-white border-2 border-stone-100 text-stone-900 px-10 py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-stone-50 transition-all"
              >
                <div className="bg-stone-100 p-2 rounded-full">
                  <Play size={18} fill="currentColor" />
                </div>
                Watch Demo
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-8 pt-10"
            >
              <TrustItem icon={<ShieldCheck size={20} />} label="KALRO Verified" />
              <div className="w-px h-8 bg-stone-100" />
              <TrustItem icon={<Globe size={20} />} label="Nationwide Coverage" />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white">
              <img 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000" 
                alt="Modern Farming" 
                className="w-full h-[600px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-stone-50 z-20 space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
                  <Sprout size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Yield Increase</p>
                  <p className="text-2xl font-black text-stone-900">+34.2%</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-50 rounded-full -z-10" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-stone-50 rounded-full -z-10" />
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-32 border-t border-stone-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <FeatureCard 
            icon={<Zap className="text-emerald-600" size={32} />}
            title="AI Insights"
            description="Real-time analysis of your crops using advanced machine learning models."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-emerald-600" size={32} />}
            title="Soil Health"
            description="Deep dive into your soil's nutrient levels and moisture content."
          />
          <FeatureCard 
            icon={<Globe className="text-emerald-600" size={32} />}
            title="Market Access"
            description="Direct connection to buyers and real-time pricing across the country."
          />
        </div>
      </section>

      {/* Market Section */}
      <section id="market" className="bg-stone-900 text-white py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-black tracking-tighter leading-none">
                KNOW THE <br />
                <span className="text-emerald-500">MARKET VALUE</span>
              </h2>
              <p className="text-stone-400 text-lg font-medium max-w-md">
                Don't guess your prices. Get real-time data from major markets in Nairobi, Mombasa, and Kisumu.
              </p>
              <button 
                onClick={onLogin}
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all"
              >
                Explore Market
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MarketStat label="Maize" price="KES 4,200" trend="+5%" />
              <MarketStat label="Beans" price="KES 9,800" trend="-2%" />
              <MarketStat label="Potatoes" price="KES 3,100" trend="+12%" />
              <MarketStat label="Tomatoes" price="KES 6,500" trend="+8%" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-8 py-32">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-5xl font-black tracking-tighter">SIMPLE PRICING</h2>
          <p className="text-stone-500 font-medium">Choose the plan that fits your farm's size.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard 
            title="Free"
            price="0"
            features={["Basic Soil Metrics", "Market Price View", "Expert Support"]}
            buttonText="Get Started"
            onAction={onLogin}
          />
          <PricingCard 
            title="Pro"
            price="999"
            features={["Advanced AI Analysis", "Direct Market Access", "Expert Support", "KALRO Integration"]}
            buttonText="Go Pro"
            highlight
            onAction={onLogin}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="bg-emerald-600 p-2 rounded-xl text-white">
              <Sprout size={20} />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase text-stone-900">Kilimo Smart</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Need Expert Support?</p>
            <button 
              onClick={onLogin}
              className="text-2xl font-black text-stone-900 hover:text-emerald-600 transition-all uppercase tracking-tighter"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>

      {/* Background decoration */}
      <div className="fixed top-0 right-0 w-[50vw] h-screen bg-stone-50 -z-20" />

      {/* Video Demo Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
              >
                <X size={24} />
              </button>
              <video 
                autoPlay 
                controls 
                className="w-full h-full object-contain"
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-3xl pointer-events-none">
                <p className="text-white font-black text-xl tracking-tighter">Kilimo Smart Demo</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Platform Walkthrough & Features</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const NavLink = ({ label, targetId }: { label: string, targetId: string }) => (
  <button 
    onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })}
    className="text-sm font-black text-stone-400 uppercase tracking-widest hover:text-emerald-600 transition-all relative group"
  >
    {label}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full" />
  </button>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="space-y-6 group">
    <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
      {icon}
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter">{title}</h3>
      <p className="text-stone-500 font-medium leading-relaxed">{description}</p>
    </div>
  </div>
);

const MarketStat = ({ label, price, trend }: { label: string, price: string, trend: string }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{label}</p>
    <p className="text-2xl font-black mt-1">{price}</p>
    <p className={`text-xs font-bold mt-1 ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
      {trend}
    </p>
  </div>
);

const PricingCard = ({ title, price, features, buttonText, highlight, onAction }: { 
  title: string, 
  price: string, 
  features: string[], 
  buttonText: string, 
  highlight?: boolean,
  onAction: () => void
}) => (
  <div className={`p-10 rounded-[3rem] border ${highlight ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xl shadow-emerald-100' : 'bg-white border-stone-100 text-stone-900'}`}>
    <div className="space-y-6">
      <div className="space-y-2">
        <p className={`text-xs font-black uppercase tracking-widest ${highlight ? 'text-emerald-200' : 'text-stone-400'}`}>{title}</p>
        <h3 className="text-5xl font-black tracking-tighter">
          <span className="text-xl font-medium">KES</span> {price}
          <span className="text-sm font-medium opacity-60">/mo</span>
        </h3>
      </div>
      <div className={`h-px w-full ${highlight ? 'bg-white/20' : 'bg-stone-100'}`} />
      <ul className="space-y-4">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm font-bold">
            <ShieldCheck size={18} className={highlight ? 'text-emerald-200' : 'text-emerald-600'} />
            {f}
          </li>
        ))}
      </ul>
      <button 
        onClick={onAction}
        className={`w-full py-5 rounded-2xl font-black text-sm transition-all ${highlight ? 'bg-white text-emerald-600 hover:bg-emerald-50' : 'bg-stone-900 text-white hover:bg-stone-800'}`}
      >
        {buttonText}
      </button>
    </div>
  </div>
);

const TrustItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center gap-3 text-stone-400">
    <div className="text-emerald-600">{icon}</div>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </div>
);
