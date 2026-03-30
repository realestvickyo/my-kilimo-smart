import React, { useState } from 'react';
import { AppView, FarmerProfile, Language, SoilMetrics, PestAlert } from '../types';
import { 
  Droplets, 
  Thermometer, 
  FlaskConical, 
  Zap,
  TrendingUp,
  ChevronRight,
  MapPin,
  Sprout,
  AlertTriangle,
  Info,
  Shield,
  PlusCircle,
  BarChart3,
  Bell,
  Search,
  X,
  Save,
  Calendar,
  CheckCircle2,
  Clock,
  Sun,
  MessageSquare,
  Play,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Recommendations } from './Recommendations';
import { WeatherWidget } from './WeatherWidget';

interface DashboardProps {
  lang: Language;
  farmer: FarmerProfile;
  soilMetrics: SoilMetrics;
  pestAlerts: PestAlert[];
  onUpgrade: () => void;
  onSearchClick: () => void;
  setView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ lang, farmer, soilMetrics, pestAlerts, onUpgrade, onSearchClick, setView }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Apply Fertilizer', crop: 'Maize', dueDate: 'Today', status: 'pending' },
    { id: '2', title: 'Irrigation', crop: 'Maize', dueDate: 'Tomorrow', status: 'pending' },
  ]);

  const addTask = (title: string, crop: string) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      crop,
      dueDate: 'Upcoming',
      status: 'pending'
    };
    setTasks([newTask, ...tasks]);
    setIsTaskModalOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = taskFilter === 'all' || t.status === taskFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredCrops = farmer.crops.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.stage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-900/20">
            {farmer.name[0]}
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 flex items-center gap-1">
              {greeting} 👋
            </p>
            <h2 className="text-2xl font-black text-stone-900 tracking-tighter leading-tight">
              Hello {farmer.name.split(' ')[0]}!
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1">
                <MapPin size={10} />
                {farmer.location}, Kenya
              </p>
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-all"
              >
                <div className="bg-emerald-100 p-1 rounded-full">
                  <Play size={8} fill="currentColor" />
                </div>
                Watch Demo
              </button>
              <button 
                onClick={() => setView(AppView.SUPPORT)}
                className="flex items-center gap-1.5 text-[10px] font-black text-stone-600 uppercase tracking-widest hover:text-stone-900 transition-all"
              >
                <div className="bg-stone-100 p-1 rounded-full">
                  <Phone size={8} fill="currentColor" />
                </div>
                Contact Support
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 max-w-md gap-3">
          <div 
            onClick={onSearchClick}
            className="relative flex-1 cursor-pointer group"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-hover:text-emerald-500 transition-colors" size={18} />
            <div className="w-full bg-white border border-stone-100 rounded-2xl py-3 pl-12 pr-4 font-bold text-stone-400 group-hover:border-emerald-500 transition-all text-sm shadow-sm">
              Search tasks, crops...
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-emerald-600 transition-all shadow-sm relative">
              <Bell size={20} />
              {pestAlerts.length > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Weather Section (Redesigned Widget) */}
      <section>
        <WeatherWidget location={farmer.location} />
      </section>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ActionButton 
          icon={<PlusCircle className="text-emerald-600" />} 
          label="Add Task" 
          bgColor="bg-emerald-50" 
          onClick={() => setIsTaskModalOpen(true)} 
        />
        <ActionButton 
          icon={<Sprout className="text-blue-600" />} 
          label="Add Crop" 
          bgColor="bg-blue-50" 
          onClick={() => setView(AppView.SETTINGS)} 
        />
        <ActionButton 
          icon={<AlertTriangle className="text-red-600" />} 
          label="Alerts" 
          bgColor="bg-red-50" 
          onClick={() => setView(AppView.ALERTS)} 
        />
        <ActionButton 
          icon={<BarChart3 className="text-orange-600" />} 
          label="Market Prices" 
          bgColor="bg-orange-50" 
          onClick={() => setView(AppView.MARKET)} 
        />
        <button 
          onClick={() => setView(AppView.SUPPORT)}
          className="bg-emerald-50 p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-sm hover:shadow-md border border-white/50"
        >
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <WhatsAppIcon />
          </div>
          <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest text-center leading-tight">
            WhatsApp Support
          </span>
        </button>
      </section>

      {/* Soil Status Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-2xl font-black text-stone-900 tracking-tighter">Soil Vitality</h3>
          <button 
            onClick={() => setView(AppView.ANALYTICS)}
            className="text-emerald-600 text-xs font-black uppercase tracking-widest flex items-center gap-1"
          >
            Detailed Analysis <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SoilCard 
            icon={<Droplets size={24} />} 
            label="MOISTURE" 
            value={`${soilMetrics.moisture}%`} 
            status="Optimal" 
            statusColor="text-emerald-600 bg-emerald-50" 
          />
          <SoilCard 
            icon={<FlaskConical size={24} />} 
            label="PH LEVEL" 
            value={soilMetrics.ph.toString()} 
            status="Optimal" 
            statusColor="text-emerald-600 bg-emerald-50" 
          />
          <SoilCard 
            icon={<Zap size={24} />} 
            label="NITROGEN" 
            value={soilMetrics.nitrogen} 
            status="Good" 
            statusColor="text-emerald-600 bg-emerald-50" 
          />
          <SoilCard 
            icon={<Thermometer size={24} />} 
            label="TEMP" 
            value={`${soilMetrics.temp}°F`} 
            status="Normal" 
            statusColor="text-emerald-600 bg-emerald-50" 
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-12">
        {/* Tasks Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-2">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white p-2 rounded-xl">
                <Clock size={20} />
              </div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tighter">Upcoming Tasks</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-stone-100 p-1 rounded-xl">
                {(['all', 'pending', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTaskFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      taskFilter === f ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="text-emerald-600 text-xs font-black uppercase tracking-widest ml-2"
              >
                Add New
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.length > 0 ? filteredTasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between ${
                  task.status === 'completed' ? 'bg-stone-50 border-transparent opacity-60' : 'bg-white border-stone-100 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {task.status === 'completed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h4 className={`font-black text-stone-900 ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</h4>
                    <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">{task.crop} • {task.dueDate}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-stone-300" />
              </div>
            )) : (
              <div className="col-span-full py-10 text-center bg-stone-50 rounded-[2rem] border border-dashed border-stone-200">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">No tasks found matching your search</p>
              </div>
            )}
          </div>
        </section>

        {/* AI Recommendations Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 text-white p-2 rounded-xl">
                <Zap size={20} />
              </div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tighter">AI Recommendations</h2>
            </div>
            <div className="flex items-center gap-2 text-stone-400">
              <Info size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">KALRO Verified</span>
            </div>
          </div>
          <Recommendations farmer={farmer} soil={soilMetrics} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Pest Alerts Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 text-white p-2 rounded-xl">
                  <AlertTriangle size={20} />
                </div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tighter">Active Pest Alerts</h2>
              </div>
              <button onClick={() => setView(AppView.ALERTS)} className="text-emerald-600 text-xs font-black uppercase tracking-widest">View All</button>
            </div>
            <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm space-y-4 h-full">
              {pestAlerts.length > 0 ? pestAlerts.slice(0, 3).map((alert) => (
                <AlertItem 
                  key={alert.id}
                  title={alert.title} 
                  severity={alert.severity} 
                  desc={alert.description}
                />
              )) : (
                <div className="flex flex-col items-center justify-center py-10 text-stone-400 space-y-2">
                  <Shield size={32} className="opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">No active threats</p>
                </div>
              )}
            </div>
          </section>

          {/* Crop Health Overview */}
          <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 text-white p-2 rounded-xl">
                  <Sprout size={20} />
                </div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tighter">Crop Health</h2>
              </div>
              <button 
                onClick={() => setView(AppView.SETTINGS)}
                className="text-emerald-600 text-xs font-black uppercase tracking-widest"
              >
                Manage Crops
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredCrops.length > 0 ? filteredCrops.map((crop) => (
                <div key={crop.id} className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-emerald-600">
                      <Sprout size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-stone-900 text-lg tracking-tight">{crop.name}</h4>
                      <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">{crop.stage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black text-stone-900">{crop.health}%</p>
                      <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Healthy</p>
                    </div>
                    <div className="w-12 h-12">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle className="text-stone-100" strokeWidth="4" stroke="currentColor" fill="none" r="16" cx="18" cy="18" />
                        <circle className="text-emerald-500" strokeWidth="4" strokeDasharray={`${crop.health}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" r="16" cx="18" cy="18" />
                      </svg>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center bg-stone-50 rounded-[2rem] border border-dashed border-stone-200">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">No crops found matching your search</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-stone-900 tracking-tighter">Add New Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-stone-400 hover:text-stone-900 transition-all">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addTask(formData.get('title') as string, formData.get('crop') as string);
            }} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Task Title</label>
                <input 
                  name="title"
                  required
                  placeholder="e.g., Apply Fertilizer"
                  className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Related Crop</label>
                <select 
                  name="crop"
                  required
                  className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  {farmer.crops.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Due Date</label>
                <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl text-stone-400">
                  <Calendar size={20} />
                  <span className="text-sm font-bold">Today</span>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-sm text-stone-400 hover:text-stone-900 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
                >
                  <Save size={18} />
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Demo Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-md">
          <div className="w-full max-w-4xl aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative">
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
            <div className="absolute bottom-8 left-8 right-8 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-3xl">
              <p className="text-white font-black text-xl tracking-tighter">Kilimo Smart Demo</p>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Platform Walkthrough & Features</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon, label, bgColor, onClick }: { icon: React.ReactNode, label: string, bgColor: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`${bgColor} p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-sm hover:shadow-md border border-white/50`}
  >
    <div className="p-3 bg-white rounded-2xl shadow-sm">
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
    <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest text-center leading-tight">
      {label}
    </span>
  </button>
);

const SoilCard = ({ icon, label, value, status, statusColor }: { icon: React.ReactNode, label: string, value: string, status: string, statusColor: string }) => (
  <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm space-y-4 hover:shadow-lg transition-all">
    <div className="flex items-center gap-3 text-stone-400">
      {icon}
      <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
    </div>
    <div>
      <p className="text-3xl font-black text-stone-900">{value}</p>
      <span className={`text-[10px] font-black px-3 py-1 rounded-full mt-2 inline-block uppercase tracking-widest ${statusColor}`}>
        {status}
      </span>
    </div>
  </div>
);

const AlertItem: React.FC<{ title: string, severity: 'low' | 'moderate' | 'high', desc: string }> = ({ title, severity, desc }) => (
  <div className="flex gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
    <div className={`w-2 h-full rounded-full ${severity === 'high' ? 'bg-red-500' : severity === 'moderate' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <h4 className="font-black text-stone-900 text-sm">{title}</h4>
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
          severity === 'high' ? 'bg-red-100 text-red-700' : 
          severity === 'moderate' ? 'bg-orange-100 text-orange-700' : 
          'bg-emerald-100 text-emerald-700'
        }`}>
          {severity}
        </span>
      </div>
      <p className="text-xs text-stone-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Dashboard;
