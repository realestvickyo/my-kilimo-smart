import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Smartphone, 
  MapPin, 
  Ruler, 
  LogOut, 
  ChevronRight, 
  Shield, 
  CreditCard,
  Globe,
  Bell,
  Zap,
  X,
  Save,
  Plus,
  Trash2,
  Sprout,
  Scan
} from 'lucide-react';
import { FarmerProfile, Language, Crop, AppView } from '../types';

interface ProfileViewProps {
  farmer: FarmerProfile;
  setFarmer: React.Dispatch<React.SetStateAction<FarmerProfile | null>>;
  lang: Language;
  setLang: (lang: Language) => void;
  onLogout: () => void;
  onUpgrade: () => void;
  onUpdate: (updates: Partial<FarmerProfile>) => Promise<void>;
  setView: (view: AppView) => void;
}

type ModalType = 'personal' | 'location' | 'farm' | 'payment' | 'notifications' | 'security' | null;

export const ProfileView: React.FC<ProfileViewProps> = ({ farmer, setFarmer, lang, setLang, onLogout, onUpgrade, onUpdate, setView }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (updates: Partial<FarmerProfile>) => {
    setIsSaving(true);
    await onUpdate(updates);
    setIsSaving(false);
    setActiveModal(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row items-center gap-10 bg-white p-12 rounded-[3rem] border border-stone-100 shadow-sm">
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-100 flex items-center justify-center text-emerald-700 text-5xl font-black shadow-xl shadow-emerald-100/50">
            {farmer.name[0]}
          </div>
          {farmer.isPremium && (
            <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-xl shadow-lg border-4 border-white">
              <Shield size={20} fill="currentColor" />
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-4xl font-black text-stone-900 tracking-tighter">{farmer.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-stone-400 text-sm font-bold">
              <Mail size={16} />
              {farmer.email}
            </div>
            <div className="flex items-center gap-2 text-stone-400 text-sm font-bold">
              <Smartphone size={16} />
              {farmer.phone}
            </div>
          </div>
          <div className="pt-4 flex justify-center md:justify-start gap-3">
            <span className="bg-stone-100 text-stone-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              {farmer.location}
            </span>
            <span className="bg-stone-100 text-stone-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              {farmer.farmSize} Acres
            </span>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="bg-red-50 text-red-600 p-4 rounded-2xl hover:bg-red-100 transition-all"
        >
          <LogOut size={24} />
        </button>
      </div>

      {!farmer.isPremium && (
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-200">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Zap size={12} fill="currentColor" />
              Limited Time Offer
            </div>
            <h3 className="text-3xl font-black tracking-tighter">Upgrade to Smart Pro</h3>
            <p className="text-emerald-100 font-medium max-w-md">
              Get unlimited disease scans, advanced market insights, and priority KALRO expert support.
            </p>
          </div>
          <button 
            onClick={onUpgrade}
            className="bg-white text-emerald-700 px-10 py-5 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all"
          >
            Upgrade Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Settings */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-stone-900 tracking-tighter px-2">Account Settings</h3>
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm">
            <ProfileLink icon={<UserIcon size={20} />} label="Personal Information" onClick={() => setActiveModal('personal')} />
            <ProfileLink icon={<MapPin size={20} />} label="Farm Location" onClick={() => setActiveModal('location')} />
            <ProfileLink icon={<Ruler size={20} />} label="Farm Size & Crops" onClick={() => setActiveModal('farm')} />
            <ProfileLink icon={<CreditCard size={20} />} label="Payment Methods" onClick={() => setActiveModal('payment')} last />
          </div>
        </div>

        {/* App Preferences */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-stone-900 tracking-tighter px-2">App Preferences</h3>
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm">
            <div className="p-6 flex items-center justify-between border-b border-stone-50">
              <div className="flex items-center gap-4">
                <div className="bg-stone-50 text-stone-400 p-2.5 rounded-xl">
                  <Globe size={20} />
                </div>
                <span className="font-bold text-stone-900">Language</span>
              </div>
              <div className="flex gap-2 bg-stone-50 p-1 rounded-xl">
                <button 
                  onClick={() => setLang(Language.ENGLISH)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === Language.ENGLISH ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-400'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang(Language.SWAHILI)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === Language.SWAHILI ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-400'}`}
                >
                  SW
                </button>
              </div>
            </div>
            <ProfileLink icon={<Bell size={20} />} label="Notifications" onClick={() => setActiveModal('notifications')} />
            <ProfileLink icon={<Shield size={20} />} label="Privacy & Security" onClick={() => setActiveModal('security')} last />
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'personal' && (
        <SettingsModal 
          title="Personal Information" 
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
          isSaving={isSaving}
          initialData={{ name: farmer.name, email: farmer.email, phone: farmer.phone }}
          fields={[
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'email', label: 'Email Address', type: 'email', disabled: true },
            { name: 'phone', label: 'Phone Number', type: 'tel' },
          ]}
        />
      )}

      {activeModal === 'location' && (
        <SettingsModal 
          title="Farm Location" 
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
          isSaving={isSaving}
          initialData={{ location: farmer.location, ward: farmer.ward || '' }}
          fields={[
            { name: 'location', label: 'County', type: 'text' },
            { name: 'ward', label: 'Ward / Village', type: 'text' },
          ]}
        />
      )}

      {activeModal === 'farm' && (
        <FarmSettingsModal 
          farmer={farmer}
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {activeModal === 'payment' && (
        <SettingsModal 
          title="Payment Methods" 
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
          isSaving={isSaving}
          initialData={{ mpesaNumber: farmer.phone }}
          fields={[
            { name: 'mpesaNumber', label: 'M-Pesa Number', type: 'tel' },
          ]}
          description="Manage your payment methods for premium subscriptions."
        />
      )}

      {activeModal === 'notifications' && (
        <SettingsModal 
          title="Notifications" 
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
          isSaving={isSaving}
          initialData={{ pushEnabled: true, emailEnabled: false }}
          fields={[
            { name: 'pushEnabled', label: 'Push Notifications', type: 'checkbox' },
            { name: 'emailEnabled', label: 'Email Alerts', type: 'checkbox' },
          ]}
        />
      )}

      {activeModal === 'security' && (
        <SettingsModal 
          title="Privacy & Security" 
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
          isSaving={isSaving}
          initialData={{ dataSharing: true }}
          fields={[
            { name: 'dataSharing', label: 'Share Anonymous Data for Research', type: 'checkbox' },
          ]}
          description="Manage your data privacy and account security settings."
        />
      )}

      {/* Support Section */}
      <div className="bg-stone-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-black tracking-tighter">Need Help?</h3>
          <p className="text-stone-400 font-medium">Our support team is available 24/7 to assist you with any issues.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={() => setView(AppView.SUPPORT)}
            className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-emerald-700 transition-all text-center flex items-center justify-center gap-2"
          >
            <Scan size={20} />
            Support QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileLink = ({ icon, label, last, onClick }: { icon: React.ReactNode, label: string, last?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full p-6 flex items-center justify-between hover:bg-stone-50 transition-all ${!last ? 'border-b border-stone-50' : ''}`}
  >
    <div className="flex items-center gap-4">
      <div className="bg-stone-50 text-stone-400 p-2.5 rounded-xl">
        {icon}
      </div>
      <span className="font-bold text-stone-900">{label}</span>
    </div>
    <ChevronRight size={18} className="text-stone-300" />
  </button>
);

interface SettingsModalProps {
  title: string;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
  initialData: any;
  fields: { name: string, label: string, type: string, disabled?: boolean }[];
  description?: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ title, onClose, onSave, isSaving, initialData, fields, description }) => {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-stone-100 flex justify-between items-center">
          <h3 className="text-2xl font-black text-stone-900 tracking-tighter">{title}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900 transition-all">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          {description && <p className="text-sm text-stone-500 font-medium">{description}</p>}
          
          {fields.map(field => (
            <div key={field.name} className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
                {field.label}
              </label>
              {field.type === 'checkbox' ? (
                <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl">
                  <input 
                    type="checkbox" 
                    checked={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                    className="w-5 h-5 rounded-lg border-stone-200 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-bold text-stone-700">{field.label}</span>
                </div>
              ) : (
                <input 
                  type={field.type}
                  value={formData[field.name]}
                  disabled={field.disabled}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
                />
              )}
            </div>
          ))}
        </div>

        <div className="p-8 bg-stone-50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-black text-sm text-stone-400 hover:text-stone-900 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(formData)}
            disabled={isSaving}
            className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const FarmSettingsModal = ({ farmer, onClose, onSave, isSaving }: { farmer: FarmerProfile, onClose: () => void, onSave: (data: any) => Promise<void>, isSaving: boolean }) => {
  const [farmSize, setFarmSize] = useState(farmer.farmSize);
  const [crops, setCrops] = useState<Crop[]>(farmer.crops);
  const [newCropName, setNewCropName] = useState('');

  const addCrop = () => {
    if (newCropName.trim()) {
      const newCrop: Crop = {
        id: Date.now().toString(),
        name: newCropName.trim(),
        stage: 'Vegetative',
        health: 100,
        location: farmer.location,
        lastWatered: new Date().toISOString()
      };
      setCrops([...crops, newCrop]);
      setNewCropName('');
    }
  };

  const removeCrop = (id: string) => {
    setCrops(crops.filter(c => c.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-8 border-b border-stone-100 flex justify-between items-center">
          <h3 className="text-2xl font-black text-stone-900 tracking-tighter">Farm Size & Crops</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900 transition-all">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 space-y-8 overflow-y-auto flex-1">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
              Farm Size (Acres)
            </label>
            <input 
              type="number"
              value={farmSize}
              onChange={(e) => setFarmSize(Number(e.target.value))}
              className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
              My Crops
            </label>
            <div className="space-y-3">
              {crops.map(crop => (
                <div key={crop.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                      <Sprout size={16} />
                    </div>
                    <span className="font-bold text-stone-900">{crop.name}</span>
                  </div>
                  <button onClick={() => removeCrop(crop.id)} className="text-stone-300 hover:text-red-500 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Add new crop..."
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                className="flex-1 bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <button 
                onClick={addCrop}
                className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 bg-stone-50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-black text-sm text-stone-400 hover:text-stone-900 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave({ farmSize, crops })}
            disabled={isSaving}
            className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const Loader = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default ProfileView;
