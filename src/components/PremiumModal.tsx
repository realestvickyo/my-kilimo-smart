import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Smartphone, ShieldCheck, Zap, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { paymentService } from '../services/api';

interface PremiumModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'plans' | 'payment' | 'processing' | 'success'>('plans');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);

  const handlePayment = async () => {
    let formattedPhone = phone.trim();
    
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }
    
    if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.substring(1);
    }

    if (!formattedPhone.startsWith('254') || formattedPhone.length !== 12) {
      setError('Please use a valid Safaricom number (e.g., 0712345678)');
      return;
    }
    
    setStep('processing');
    setError('');
    
    try {
      const result = await paymentService.initiateStkPush(formattedPhone, 1);
      
      if (result.ResponseCode === "0") {
        const id = result.CheckoutRequestID;
        setCheckoutRequestId(id);
        
        // Start polling for status
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/mpesa/query/${id}`);
            const statusData = await statusResponse.json();
            
            if (statusData.status === 'success') {
              clearInterval(pollInterval);
              setStep('success');
            } else if (statusData.status === 'failed') {
              clearInterval(pollInterval);
              setError(`Payment failed: ${statusData.resultDesc}`);
              setStep('payment');
            }
          } catch (err) {
            console.error("Polling error:", err);
          }
        }, 3000);

        // Timeout after 60 seconds
        setTimeout(() => {
          clearInterval(pollInterval);
          if (step === 'processing') {
            setError('Payment timed out. Please try again.');
            setStep('payment');
          }
        }, 60000);

      } else {
        setError(result.error || result.CustomerMessage || 'Payment initiation failed. Please try again.');
        setStep('payment');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Network error. Please check your connection.';
      setError(errorMessage);
      setStep('payment');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 z-10"
        >
          <X size={24} />
        </button>

        <div className="p-12">
          <AnimatePresence mode="wait">
            {step === 'plans' && (
              <motion.div 
                key="plans"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">
                    Premium Access
                  </div>
                  <h2 className="text-4xl font-black text-stone-900 tracking-tighter">Unlock Pro Features</h2>
                  <p className="text-stone-500 font-medium">Get advanced AI insights and real-time market alerts.</p>
                </div>

                <div className="space-y-4">
                  <FeatureItem text="Advanced AI Pest Diagnosis" />
                  <FeatureItem text="Real-time Market Price Alerts" />
                  <FeatureItem text="Unlimited Soil Health Reports" />
                  <FeatureItem text="KALRO Expert Consultation Access" />
                </div>

                <div className="bg-stone-50 p-8 rounded-[2rem] border border-stone-100 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Monthly Plan</p>
                    <p className="text-3xl font-black text-stone-900">KES 1<span className="text-sm text-stone-400 font-bold">/mo</span></p>
                  </div>
                  <button 
                    onClick={() => setStep('payment')}
                    className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 flex items-center gap-2"
                  >
                    Select Plan
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-stone-900 tracking-tighter">M-Pesa Express</h2>
                  <p className="text-stone-500 font-medium">Enter your phone number to receive an STK push.</p>
                </div>

                <div className="space-y-6">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 p-4 rounded-2xl flex items-center gap-3 text-red-600 border border-red-100"
                    >
                      <AlertCircle size={20} />
                      <p className="text-xs font-bold leading-tight">{error}</p>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07..."
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-5 pl-12 pr-4 font-black text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-6 rounded-2xl flex items-start gap-4">
                    <ShieldCheck className="text-emerald-600 shrink-0" size={24} />
                    <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                      Your payment is secure. You will receive a prompt on your phone to enter your M-Pesa PIN.
                    </p>
                  </div>

                  <button 
                    onClick={handlePayment}
                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-100 flex items-center justify-center gap-3"
                  >
                    Pay KES 1
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 flex flex-col items-center text-center space-y-6"
              >
                <div className="relative">
                  <Loader2 className="animate-spin text-emerald-600" size={64} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="text-emerald-600" size={24} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-stone-900">Processing Payment</h3>
                  <p className="text-stone-500 font-medium">Please check your phone and enter your PIN.</p>
                </div>
                
                {/* Manual confirmation for testing with external webhooks */}
                <div className="pt-8 border-t border-stone-100 w-full">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Testing with Webhook.site?</p>
                  <button 
                    onClick={async () => {
                      if (!checkoutRequestId) return;
                      try {
                        const res = await fetch('/api/mpesa/simulate-success', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ checkoutRequestId })
                        });
                        if (res.ok) {
                          setStep('success');
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="text-emerald-600 text-xs font-bold hover:underline"
                  >
                    I have paid (Manual Confirm)
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-8"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-100">
                  <Check size={48} strokeWidth={3} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-stone-900">Welcome to Pro!</h3>
                  <p className="text-stone-500 font-medium">Your account has been upgraded successfully.</p>
                </div>
                <button 
                  onClick={onSuccess}
                  className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4">
    <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full">
      <Check size={14} strokeWidth={3} />
    </div>
    <span className="text-stone-600 font-bold text-sm">{text}</span>
  </div>
);
