import React from 'react';
import { AlertTriangle, Bell, ShieldAlert, Info, ChevronRight, MapPin, Clock } from 'lucide-react';
import { PestAlert } from '../types';

const MOCK_ALERTS: PestAlert[] = [
  { 
    id: '1', 
    title: 'Fall Armyworm Outbreak', 
    severity: 'high', 
    description: 'Significant activity reported in neighboring farms. Immediate scouting of maize fields is required.', 
    location: 'Narok County', 
    timestamp: '2023-10-24T08:00:00Z' 
  },
  { 
    id: '2', 
    title: 'Maize Lethal Necrosis Risk', 
    severity: 'moderate', 
    description: 'Environmental conditions are favorable for MLN spread. Ensure use of certified seeds and crop rotation.', 
    location: 'Rift Valley Region', 
    timestamp: '2023-10-23T14:30:00Z' 
  },
  { 
    id: '3', 
    title: 'Locust Swarm Warning', 
    severity: 'low', 
    description: 'Small swarms detected in northern regions. Monitoring is advised for farmers in bordering areas.', 
    location: 'Laikipia', 
    timestamp: '2023-10-22T09:15:00Z' 
  },
];

interface AlertsPageProps {
  alerts: PestAlert[];
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ alerts }) => {
  const [selectedAlert, setSelectedAlert] = React.useState<PestAlert | null>(null);
  const displayAlerts = alerts.length > 0 ? alerts : MOCK_ALERTS;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-stone-900 tracking-tighter">Advanced Alerts</h2>
          <p className="text-stone-500 font-medium">Real-time pest and disease monitoring based on environmental data.</p>
        </div>
        <div className="bg-white border border-stone-200 p-4 rounded-3xl flex items-center gap-4 shadow-sm">
          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
            <Bell size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Push Notifications</p>
            <p className="text-sm font-bold text-stone-900">Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`bg-white rounded-[2.5rem] p-8 border shadow-sm hover:shadow-lg transition-all flex flex-col justify-between ${
              alert.severity === 'high' ? 'border-red-100' : alert.severity === 'moderate' ? 'border-orange-100' : 'border-stone-100'
            }`}
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${
                  alert.severity === 'high' ? 'bg-red-50 text-red-600' : alert.severity === 'moderate' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {alert.severity === 'high' ? <ShieldAlert size={24} /> : alert.severity === 'moderate' ? <AlertTriangle size={24} /> : <Info size={24} />}
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-600' : alert.severity === 'moderate' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {alert.severity}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-stone-900 tracking-tight leading-tight">{alert.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-medium">
                  {alert.description}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-stone-50">
                <div className="flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  <MapPin size={12} />
                  {alert.location}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  <Clock size={12} />
                  {alert.timestamp?.toDate ? alert.timestamp.toDate().toLocaleDateString() : (alert.timestamp ? new Date(alert.timestamp).toLocaleDateString() : 'Recent')}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedAlert(alert)}
              className={`mt-8 w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                alert.severity === 'high' ? 'bg-red-600 text-white shadow-xl shadow-red-100' : 'bg-stone-900 text-white'
              }`}
            >
              View Treatment Plan
              <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Treatment Plan Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 space-y-8 relative overflow-hidden">
            <button 
              onClick={() => setSelectedAlert(null)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-900"
            >
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <div className="space-y-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                selectedAlert.severity === 'high' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
              }`}>
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-3xl font-black text-stone-900 tracking-tighter">{selectedAlert.title}</h3>
              <p className="text-stone-500 font-medium leading-relaxed">{selectedAlert.description}</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">KALRO Recommended Actions</h4>
              <ul className="space-y-3">
                {['Isolate affected area', 'Apply recommended fungicide', 'Consult local extension officer'].map((action, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-stone-900">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">
                      {i + 1}
                    </div>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => setSelectedAlert(null)}
              className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black text-sm"
            >
              Close Plan
            </button>
          </div>
        </div>
      )}

      {/* KALRO Integration Banner */}
      <div className="bg-emerald-50 rounded-[2.5rem] p-10 border border-emerald-100 flex flex-col md:flex-row items-center gap-10">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-100/50">
          <SproutIcon className="w-12 h-12" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className="text-2xl font-black text-stone-900 tracking-tighter">KALRO Expert Guidelines</h3>
          <p className="text-stone-600 font-medium leading-relaxed">
            All our pest and disease alerts are cross-referenced with official KALRO (Kenya Agricultural and Livestock Research Organization) guidelines to ensure you get the most accurate and safe treatment advice.
          </p>
        </div>
        <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100">
          Learn More
        </button>
      </div>
    </div>
  );
};

const SproutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
