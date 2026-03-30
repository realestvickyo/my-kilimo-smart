import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  CreditCard, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  UserPlus,
  Store,
  Bell,
  Plus,
  Trash2,
  MapPin,
  Tag
} from 'lucide-react';
import { FarmerProfile } from '../types';

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<FarmerProfile[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [pestAlerts, setPestAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'transactions' | 'markets' | 'alerts'>('users');
  const [currentUser, setCurrentUser] = useState<FarmerProfile | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  // Form states for adding new items
  const [newPrice, setNewPrice] = useState({ crop: '', price: '', location: '', unit: '90kg Bag', category: 'Cereals', trend: 'up' });
  const [newAlert, setNewAlert] = useState({ title: '', severity: 'moderate' as 'low' | 'moderate' | 'high', description: '', location: '' });

  const fetchData = async () => {
    try {
      if (activeTab === 'users') {
        const data = await authService.getAdminUsers();
        setUsers(data);
      } else if (activeTab === 'transactions') {
        const data = await authService.getAdminTransactions();
        setTransactions(data);
      } else if (activeTab === 'markets') {
        const data = await authService.getMarketPrices();
        setMarketPrices(data);
      } else if (activeTab === 'alerts') {
        const data = await authService.getPestAlerts();
        setPestAlerts(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching ${activeTab}:`, err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    
    // Polling for real-time updates (every 5 seconds)
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const [editingPrice, setEditingPrice] = useState<any | null>(null);
  const [editingAlert, setEditingAlert] = useState<any | null>(null);

  const updateMarketPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrice) return;
    try {
      const { id, ...data } = editingPrice;
      await authService.updateMarketPrice(id, {
        ...data,
        price: Number(data.price)
      });
      setEditingPrice(null);
      fetchData();
    } catch (err) {
      console.error("Error updating price:", err);
    }
  };

  const updatePestAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlert) return;
    try {
      const { id, ...data } = editingAlert;
      await authService.updatePestAlert(id, data);
      setEditingAlert(null);
      fetchData();
    } catch (err) {
      console.error("Error updating alert:", err);
    }
  };

  const addMarketPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrice.crop || !newPrice.price) return;
    try {
      await authService.addMarketPrice({
        ...newPrice,
        price: Number(newPrice.price)
      });
      setNewPrice({ crop: '', price: '', location: '', unit: '90kg Bag', category: 'Cereals', trend: 'up' });
      fetchData();
    } catch (err) {
      console.error("Error adding price:", err);
    }
  };

  const deleteMarketPrice = async (id: string) => {
    try {
      await authService.deleteMarketPrice(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting price:", err);
    }
  };

  const addPestAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.title || !newAlert.description) return;
    try {
      await authService.addPestAlert(newAlert);
      setNewAlert({ title: '', severity: 'moderate', description: '', location: '' });
      fetchData();
    } catch (err) {
      console.error("Error adding alert:", err);
    }
  };

  const deletePestAlert = async (id: string) => {
    try {
      await authService.deletePestAlert(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting alert:", err);
    }
  };

  const togglePremium = async (userId: string, currentStatus: boolean) => {
    try {
      await authService.updateUserPremium(userId, !currentStatus);
      fetchData();
    } catch (err) {
      console.error("Error updating premium status:", err);
    }
  };

  const toggleAdmin = async (userId: string, currentRole: string | undefined) => {
    try {
      await authService.updateUserRole(userId, currentRole === 'admin' ? 'user' : 'admin');
      fetchData();
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    premiumUsers: users.filter(u => u.isPremium).length,
    totalRevenue: transactions.filter(t => t.status === 'success').reduce((acc, t) => acc + t.amount, 0),
    pendingPayments: transactions.filter(t => t.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Farmers" 
          value={stats.totalUsers.toString()} 
          icon={<Users className="text-blue-500" />} 
          trend="+12%" 
        />
        <StatCard 
          label="Pro Members" 
          value={stats.premiumUsers.toString()} 
          icon={<ShieldCheck className="text-emerald-500" />} 
          trend={`${Math.round((stats.premiumUsers / stats.totalUsers) * 100)}%`}
        />
        <StatCard 
          label="Total Revenue" 
          value={`KES ${stats.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign className="text-amber-500" />} 
          trend="Live" 
        />
        <StatCard 
          label="Pending STK" 
          value={stats.pendingPayments.toString()} 
          icon={<Activity className="text-purple-500" />} 
          trend="Active" 
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-[88px] z-20 bg-white">
          <div className="flex items-center gap-4 bg-stone-50 p-1 rounded-2xl w-fit">
            {[
              { id: 'users', label: 'Users', icon: Users },
              { id: 'transactions', label: 'Payments', icon: CreditCard },
              { id: 'markets', label: 'Markets', icon: Store },
              { id: 'alerts', label: 'Alerts', icon: Bell },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  activeTab === tab.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-stone-50 border-none rounded-2xl text-sm font-bold w-full md:w-80 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1 max-h-[calc(100vh-400px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'users' && (
              <motion.table 
                key="users"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full text-left border-collapse relative"
              >
                <thead className="sticky top-0 z-10 bg-white shadow-sm">
                  <tr className="bg-stone-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Farmer</th>
                    <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Contact</th>
                    <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-stone-50/30 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="font-black text-stone-900">{user.name}</p>
                            <p className="text-[10px] font-bold text-stone-400 uppercase">{user.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-bold text-stone-600">{user.email}</p>
                        <p className="text-xs font-bold text-stone-400">{user.phone}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.isPremium ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                          {user.isPremium ? 'Pro' : 'Free'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => togglePremium(user.uid, user.isPremium)}
                            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all"
                            title={user.isPremium ? "Revoke Pro" : "Grant Pro"}
                          >
                            {user.isPremium ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                          </button>
                          <button 
                            onClick={() => toggleAdmin(user.uid, user.role)}
                            className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-all"
                            title="Toggle Admin"
                          >
                            <UserPlus size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </motion.table>
            )}

            {activeTab === 'transactions' && (
              <motion.table 
                key="transactions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full text-left border-collapse relative"
              >
                <thead className="sticky top-0 z-10 bg-white shadow-sm">
                  <tr className="bg-stone-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Transaction ID</th>
                    <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Phone</th>
                    <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-stone-50/30 transition-all">
                      <td className="px-8 py-6 font-mono text-xs text-stone-500">{t.checkoutRequestId}</td>
                      <td className="px-8 py-6 font-bold text-stone-900">{t.phone}</td>
                      <td className="px-8 py-6 font-black text-stone-900">KES {t.amount}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {t.status === 'success' ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                          ) : t.status === 'failed' ? (
                            <XCircle size={14} className="text-red-500" />
                          ) : (
                            <RefreshCw size={14} className="text-amber-500 animate-spin" />
                          )}
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            t.status === 'success' ? 'text-emerald-600' : 
                            t.status === 'failed' ? 'text-red-600' : 'text-amber-600'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs text-stone-400">
                        {new Date(t.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </motion.table>
            )}

            {activeTab === 'markets' && (
              <motion.div
                key="markets"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 space-y-8"
              >
                <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100">
                  <h3 className="text-lg font-black text-stone-900 mb-6 flex items-center gap-2">
                    {editingPrice ? <RefreshCw className="text-blue-600" /> : <Plus className="text-emerald-600" />}
                    {editingPrice ? 'Edit Price Entry' : 'Add New Price Entry'}
                  </h3>
                  <form onSubmit={editingPrice ? updateMarketPrice : addMarketPrice} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Crop</label>
                      <input 
                        type="text" 
                        required
                        value={editingPrice ? editingPrice.crop : newPrice.crop}
                        onChange={e => editingPrice ? setEditingPrice({...editingPrice, crop: e.target.value}) : setNewPrice({...newPrice, crop: e.target.value})}
                        className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        placeholder="e.g. Maize"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Price (KES)</label>
                      <input 
                        type="number" 
                        required
                        value={editingPrice ? editingPrice.price : newPrice.price}
                        onChange={e => editingPrice ? setEditingPrice({...editingPrice, price: e.target.value}) : setNewPrice({...newPrice, price: e.target.value})}
                        className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        placeholder="4200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Location</label>
                      <input 
                        type="text" 
                        required
                        value={editingPrice ? editingPrice.location : newPrice.location}
                        onChange={e => editingPrice ? setEditingPrice({...editingPrice, location: e.target.value}) : setNewPrice({...newPrice, location: e.target.value})}
                        className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        placeholder="e.g. Nairobi"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Unit</label>
                      <select 
                        value={editingPrice ? editingPrice.unit : newPrice.unit}
                        onChange={e => editingPrice ? setEditingPrice({...editingPrice, unit: e.target.value}) : setNewPrice({...newPrice, unit: e.target.value})}
                        className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      >
                        <option value="90kg Bag">90kg Bag</option>
                        <option value="50kg Bag">50kg Bag</option>
                        <option value="Crate">Crate</option>
                        <option value="kg">kg</option>
                        <option value="Bunch">Bunch</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Category</label>
                      <select 
                        value={editingPrice ? editingPrice.category : newPrice.category}
                        onChange={e => editingPrice ? setEditingPrice({...editingPrice, category: e.target.value}) : setNewPrice({...newPrice, category: e.target.value})}
                        className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      >
                        <option value="Cereals">Cereals</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Legumes">Legumes</option>
                        <option value="Tubers">Tubers</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Trend</label>
                      <select 
                        value={editingPrice ? editingPrice.trend : newPrice.trend}
                        onChange={e => editingPrice ? setEditingPrice({...editingPrice, trend: e.target.value}) : setNewPrice({...newPrice, trend: e.target.value})}
                        className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      >
                        <option value="up">Trending Up</option>
                        <option value="down">Trending Down</option>
                        <option value="stable">Stable</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 flex gap-4">
                      <button 
                        type="submit"
                        className={`flex-1 ${editingPrice ? 'bg-blue-600' : 'bg-emerald-600'} text-white py-4 rounded-xl font-black text-sm shadow-xl transition-all`}
                      >
                        {editingPrice ? 'Update Price Entry' : 'Add Price Entry'}
                      </button>
                      {editingPrice && (
                        <button 
                          type="button"
                          onClick={() => setEditingPrice(null)}
                          className="px-8 bg-stone-200 text-stone-600 py-4 rounded-xl font-black text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse relative">
                  <thead className="sticky top-0 z-10 bg-white shadow-sm">
                    <tr className="bg-stone-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Crop</th>
                      <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Location</th>
                      <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Price</th>
                      <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {marketPrices.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/30 transition-all">
                        <td className="px-8 py-6 font-black text-stone-900">{p.crop}</td>
                        <td className="px-8 py-6 font-bold text-stone-600">{p.location}</td>
                        <td className="px-8 py-6 font-black text-stone-900">KES {p.price}</td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setEditingPrice(p)}
                              className="p-2 text-stone-400 hover:text-blue-600 transition-all"
                            >
                              <RefreshCw size={18} />
                            </button>
                            <button 
                              onClick={() => deleteMarketPrice(p.id)}
                              className="p-2 text-stone-400 hover:text-red-600 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'alerts' && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 space-y-8"
              >
                <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100">
                  <h3 className="text-lg font-black text-stone-900 mb-6 flex items-center gap-2">
                    {editingAlert ? <RefreshCw className="text-blue-600" /> : <Plus className="text-red-600" />}
                    {editingAlert ? 'Edit Pest Alert' : 'Issue New Pest Alert'}
                  </h3>
                  <form onSubmit={editingAlert ? updatePestAlert : addPestAlert} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Title</label>
                        <input 
                          type="text" 
                          required
                          value={editingAlert ? editingAlert.title : newAlert.title}
                          onChange={e => editingAlert ? setEditingAlert({...editingAlert, title: e.target.value}) : setNewAlert({...newAlert, title: e.target.value})}
                          className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                          placeholder="e.g. Fall Armyworm Outbreak"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Severity</label>
                        <select 
                          value={editingAlert ? editingAlert.severity : newAlert.severity}
                          onChange={e => editingAlert ? setEditingAlert({...editingAlert, severity: e.target.value as any}) : setNewAlert({...newAlert, severity: e.target.value as any})}
                          className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="moderate">Moderate</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Description</label>
                      <textarea 
                        required
                        value={editingAlert ? editingAlert.description : newAlert.description}
                        onChange={e => editingAlert ? setEditingAlert({...editingAlert, description: e.target.value}) : setNewAlert({...newAlert, description: e.target.value})}
                        className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        placeholder="Describe the risk and recommended actions..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Location</label>
                        <input 
                          type="text" 
                          required
                          value={editingAlert ? editingAlert.location : newAlert.location}
                          onChange={e => editingAlert ? setEditingAlert({...editingAlert, location: e.target.value}) : setNewAlert({...newAlert, location: e.target.value})}
                          className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                          placeholder="e.g. Narok County"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button 
                          type="submit"
                          className={`flex-1 ${editingAlert ? 'bg-blue-600' : 'bg-red-600'} text-white py-4 rounded-xl font-black text-sm shadow-xl transition-all`}
                        >
                          {editingAlert ? 'Update Alert' : 'Broadcast Alert'}
                        </button>
                        {editingAlert && (
                          <button 
                            type="button"
                            onClick={() => setEditingAlert(null)}
                            className="px-8 bg-stone-200 text-stone-600 py-4 rounded-xl font-black text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pestAlerts.map((alert) => (
                    <div key={alert.id} className="bg-stone-50 p-6 rounded-3xl border border-stone-100 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-600' : 
                            alert.severity === 'moderate' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {alert.severity}
                          </span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setEditingAlert(alert)}
                              className="p-2 text-stone-400 hover:text-blue-600 transition-all"
                            >
                              <RefreshCw size={18} />
                            </button>
                            <button 
                              onClick={() => deletePestAlert(alert.id)}
                              className="text-stone-400 hover:text-red-600 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-xl font-black text-stone-900">{alert.title}</h4>
                        <p className="text-sm text-stone-500 font-medium leading-relaxed">{alert.description}</p>
                        <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
                          <div className="flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                            <MapPin size={12} />
                            {alert.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, trend }: { label: string, value: string, icon: React.ReactNode, trend: string }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm space-y-3">
    <div className="flex justify-between items-start">
      <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center">
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </div>
      <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">
        {trend}
      </span>
    </div>
    <div>
      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{label}</p>
      <h4 className="text-2xl font-black text-stone-900 tracking-tighter mt-1">{value}</h4>
    </div>
  </div>
);
