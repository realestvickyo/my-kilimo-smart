import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, CheckCircle2, AlertCircle, ChevronRight, Save, Play, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';

interface ScanResult {
  diagnosis: string;
  severity: 'low' | 'moderate' | 'high';
  confidence: number;
  recommendations: string[];
}

const Scan: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToLog = () => {
    if (!result) return;
    // In a real app, this would save to Firestore
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setScanning(false);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setScanning(false);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;
    setScanning(true);
    setError(null);
    try {
      const data = await geminiService.analyzeLeaf(selectedImage);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-stone-900 rounded-[3rem] overflow-hidden relative flex flex-col md:flex-row h-[80vh] shadow-2xl border border-white/10">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <X size={24} />
        </button>

        {/* Left Side: Image/Upload Area */}
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative flex-1 bg-stone-950 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-white/5"
        >
          {!selectedImage ? (
            <div className="text-center space-y-6 p-8">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20">
                <Upload size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight">Upload Leaf Image</h3>
                <p className="text-stone-500 text-sm font-medium max-w-xs mx-auto">
                  Drag and drop your image here or click to browse your files.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                >
                  Select from Device
                </button>
                <button 
                  onClick={onClose}
                  className="bg-white border-2 border-stone-100 text-stone-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-stone-50 transition-all"
                >
                  Cancel & Exit
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img 
                src={selectedImage} 
                alt="Leaf Scan" 
                className="w-full h-full object-cover opacity-80"
              />
              
              {!scanning && !result && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                  <button 
                    onClick={startAnalysis}
                    className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"
                  >
                    <Zap size={24} fill="currentColor" />
                    Start AI Analysis
                  </button>
                </div>
              )}
              
              {/* Scanning Animation */}
              <AnimatePresence>
                {scanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <div className="relative w-64 h-64">
                      {/* Bounding Box Corners */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />
                      
                      {/* Scanning Line */}
                      <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"
                      />
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 bg-emerald-500 text-white px-6 py-3 rounded-full text-xs font-black flex items-center gap-3 shadow-2xl"
                    >
                      <Loader2 className="animate-spin" size={16} />
                      Analyzing Leaf Structure...
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Side: Results/Info */}
        <div className="w-full md:w-[400px] bg-white p-10 flex flex-col justify-center overflow-y-auto">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center text-stone-300 mx-auto">
                  <Zap size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-stone-900 tracking-tight">AI Diagnostics</h2>
                  <p className="text-stone-500 text-sm font-medium leading-relaxed">
                    Our advanced neural network will analyze your crop's health in seconds.
                  </p>
                </div>
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100">
                    {error}
                  </div>
                )}
                <div className="pt-8 space-y-4">
                  <FeatureItem icon={<CheckCircle2 size={16} />} text="94% Accuracy Rate" />
                  <FeatureItem icon={<CheckCircle2 size={16} />} text="KALRO Verified Advice" />
                  <FeatureItem icon={<CheckCircle2 size={16} />} text="Instant Treatment Plans" />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black text-stone-900 tracking-tight leading-tight">{result.diagnosis}</h2>
                    <div className="flex items-center gap-2 mt-3 text-emerald-600">
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">AI Verified</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    result.severity === 'high' ? 'bg-red-100 text-red-600' :
                    result.severity === 'moderate' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {result.severity} Severity
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-stone-900">
                    <AlertCircle size={18} className="text-emerald-600" />
                    <h3 className="font-black text-sm uppercase tracking-widest">Recommendations</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-3 text-xs text-stone-500 leading-relaxed font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={handleSaveToLog}
                    disabled={isSaved}
                    className={`w-full py-5 rounded-2xl font-black text-sm shadow-2xl flex items-center justify-center gap-3 transition-all ${
                      isSaved ? 'bg-stone-100 text-stone-400' : 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        Saved Successfully
                        <CheckCircle2 size={18} />
                      </>
                    ) : (
                      <>
                        Save to Farm Log
                        <Save size={18} />
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedImage(null);
                      setResult(null);
                      setError(null);
                    }}
                    className="w-full bg-white border-2 border-stone-100 text-stone-900 py-4 rounded-2xl font-black text-sm hover:bg-stone-50 transition-all"
                  >
                    Scan Another Leaf
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-3 text-stone-400">
    <div className="text-emerald-600">{icon}</div>
    <span className="text-xs font-bold uppercase tracking-widest">{text}</span>
  </div>
);

export default Scan;
