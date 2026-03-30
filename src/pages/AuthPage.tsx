import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { authService } from '../services/authService';
import { Sprout, Mail, Lock, User, ArrowRight, Loader2, Smartphone, MapPin, Chrome, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (page: 'main' | 'onboarding') => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        await authService.login(email, password, rememberMe);
        onSuccess('main');
      } else if (mode === 'signup') {
        await authService.signup(email, password, name);
        onSuccess('onboarding');
      } else if (mode === 'forgot') {
        await authService.forgotPassword(email);
        setSuccessMsg('If an account exists for this email, a reset link has been sent.');
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is currently disabled in the Firebase Console. Please enable it or use Google Login.');
      } else {
        setError(err.response?.data?.error || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.googleLogin();
      onSuccess('main');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
          >
            {/* Left Side Visual (Hidden on small screens) */}
            <div className="hidden md:flex w-2/5 bg-emerald-600 p-10 flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-white mb-8">
                  <Sprout size={24} />
                  <span className="font-black text-sm tracking-tighter uppercase">Kilimo Smart</span>
                </div>
                <h3 className="text-3xl font-black text-white leading-tight tracking-tighter">
                  {mode === 'signup' ? 'Start Your Journey.' : mode === 'forgot' ? 'Reset Your Access.' : 'Welcome Back.'}
                </h3>
              </div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 text-emerald-100">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">AI Diagnostics</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-100">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Market Insights</span>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500 rounded-full blur-3xl opacity-50" />
            </div>

            {/* Right Side Form */}
            <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-center">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-stone-300 hover:text-stone-900 transition-all"
              >
                <X size={24} />
              </button>

              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-stone-900 tracking-tighter">
                    {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Forgot PIN?' : 'Sign In'}
                  </h2>
                  <p className="text-stone-500 mt-2 text-sm font-medium">
                    {mode === 'signup' ? 'Join 50k+ farmers today.' : mode === 'forgot' ? 'Enter your email to reset your PIN.' : 'Access your farm dashboard.'}
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  {mode !== 'forgot' && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Password / PIN</label>
                        {mode === 'login' && (
                          <button 
                            type="button"
                            onClick={() => setMode('forgot')}
                            className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                          >
                            Forgot PIN?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input 
                          type="password" 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {mode === 'login' && (
                    <div className="flex items-center gap-2 ml-1">
                      <input 
                        type="checkbox" 
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-stone-200 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="remember" className="text-[10px] font-black text-stone-400 uppercase tracking-widest cursor-pointer">Remember Me</label>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  {successMsg && (
                    <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 size={14} />
                      {successMsg}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm shadow-2xl shadow-emerald-100 flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : (mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Link' : 'Login')}
                    {!loading && <ArrowRight size={18} />}
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-stone-100"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                      <span className="bg-white px-4 text-stone-400">Or continue with</span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white border border-stone-100 text-stone-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-stone-50 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Chrome size={18} className="text-emerald-600" />
                    Google Login
                  </button>
                </form>

                <div className="text-center">
                  <button 
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="text-stone-400 text-xs font-black uppercase tracking-widest hover:text-emerald-600 transition-all"
                  >
                    {mode === 'login' ? "Don't have an account? Sign up" : mode === 'forgot' ? "Back to Login" : "Already have an account? Login"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
