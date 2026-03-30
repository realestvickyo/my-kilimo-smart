import React from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  ArrowLeft,
  MessageCircle,
  ExternalLink,
  Smartphone,
  Scan
} from 'lucide-react';
import { FarmerProfile, Language } from '../types';
import { QRCodeCanvas } from 'qrcode.react';

interface SupportPageProps {
  farmer: FarmerProfile;
  lang: Language;
  onBack: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ lang, onBack }) => {
  const ADMIN_PHONE = "0701196503";
  const WHATSAPP_LINK = "https://wa.me/254701196503";

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] md:h-[calc(100vh-100px)] bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 p-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 hover:bg-stone-50 rounded-2xl text-stone-400 transition-all border border-stone-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-stone-900">
              {lang === Language.ENGLISH ? 'WhatsApp Support' : 'Msaada wa WhatsApp'}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                {lang === Language.ENGLISH ? 'Direct Support Line' : 'Njia ya Msaada ya Moja kwa Moja'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md space-y-6"
        >
          <div className="bg-emerald-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-emerald-600">
            <MessageCircle size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-tighter text-stone-900">
              {lang === Language.ENGLISH ? 'Scan to Chat' : 'Skeni ili Uzungumze'}
            </h3>
            <p className="text-stone-500 font-medium leading-relaxed">
              {lang === Language.ENGLISH 
                ? 'Scan the QR code below with your phone camera to start a conversation with our support team on WhatsApp.' 
                : 'Skeni msimbo wa QR hapa chini kwa kamera ya simu yako ili kuanza mazungumzo na timu yetu ya usaidizi kwenye WhatsApp.'}
            </p>
          </div>
        </motion.div>

        {/* QR Code Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-emerald-600/5 rounded-[3rem] blur-2xl group-hover:bg-emerald-600/10 transition-all duration-500" />
          <div className="relative bg-white p-8 rounded-[3rem] border-4 border-emerald-50 shadow-2xl shadow-emerald-100/50">
            <div className="bg-stone-50 p-4 rounded-[2rem]">
              <QRCodeCanvas 
                value={WHATSAPP_LINK} 
                size={200}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
            <div className="absolute -top-3 -right-3 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg">
              <Scan size={20} />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons removed as per user request to use ONLY QR code */}

        {/* Help Info */}
        <div className="flex flex-col md:flex-row gap-8 pt-8 border-t border-stone-100 w-full max-w-2xl justify-center">
          <div className="flex items-center gap-4 text-left">
            <div className="bg-stone-50 p-3 rounded-2xl text-stone-400">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Available On</p>
              <p className="text-sm font-bold text-stone-900">Mobile & Web</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left">
            <div className="bg-stone-50 p-3 rounded-2xl text-stone-400">
              <MessageCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Response Time</p>
              <p className="text-sm font-bold text-stone-900">Under 5 Minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
