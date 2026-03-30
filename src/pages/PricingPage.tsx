import React from 'react'
import { Layout } from '../components/Layout'
import { SubscriptionCard } from '../components/SubscriptionCard'
import { SmartphoneIcon, ArrowLeft, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PricingPage() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="rounded-full bg-white p-3 shadow-sm border border-border"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Membership
        </div>
      </div>

      <div className="mb-12 max-w-2xl">
        <h1 className="font-headings text-4xl font-bold text-foreground mb-4">Upgrade Your Farm.</h1>
        <p className="text-lg font-medium text-muted-foreground leading-relaxed">
          Unlock advanced market intelligence, unlimited farms, and priority extension support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { name: 'Free', price: 0, features: ['2 Farms', 'Basic Reports', 'Basic Advisory'] },
          { name: 'Basic', price: 50, features: ['5 Farms', 'Full Reports', 'Email Support'] },
          { name: 'Premium', price: 150, features: ['Unlimited Farms', 'Advanced Advisory', 'Weather Forecasts'], recommended: true },
          { name: 'Enterprise', price: 300, features: ['API Access', 'Dedicated Support', 'Custom Integrations'] },
        ].map((plan) => (
          <div 
            key={plan.name}
            className={`relative flex flex-col rounded-[2rem] p-8 border transition-all ${plan.recommended ? 'bg-[#1A4D2E] text-white border-[#1A4D2E] shadow-2xl scale-105 z-10' : 'bg-white text-foreground border-border shadow-sm'}`}
          >
            {plan.recommended && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#A7F305] text-[#1A4D2E] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                Recommended
              </span>
            )}
            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-xs font-bold opacity-60">/mo</span>
              </div>
            </div>
            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className={`rounded-full p-1 ${plan.recommended ? 'bg-[#A7F305] text-[#1A4D2E]' : 'bg-muted text-muted-foreground'}`}>
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-xs font-medium opacity-90">{feature}</span>
                </div>
              ))}
            </div>
            <button className={`w-full py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${plan.recommended ? 'bg-[#A7F305] text-[#1A4D2E] hover:bg-[#A7F305]/90' : 'bg-[#1A4D2E] text-white hover:bg-[#1A4D2E]/90 shadow-lg'}`}>
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {/* Payment Simulation */}
      <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] p-10 border border-border shadow-sm">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 bg-[#1A4D2E] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
            <SmartphoneIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Instant Activation</h3>
            <p className="text-sm font-medium text-muted-foreground">Secure payment via M-PESA STK Push.</p>
          </div>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Phone Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-6 rounded-l-2xl border border-r-0 border-border bg-muted text-muted-foreground text-sm font-bold">
                +254
              </span>
              <input
                type="tel"
                placeholder="7XX XXX XXX"
                className="flex-1 bg-white border border-border rounded-r-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#1A4D2E] transition-colors"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full bg-[#1A4D2E] text-white font-bold py-5 rounded-full text-xs uppercase tracking-widest hover:bg-[#1A4D2E]/90 transition-all shadow-xl"
          >
            Pay KES 150
          </button>

          <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest mt-6">
            You will receive a prompt on your phone.
          </p>
        </form>
      </div>
      
      <div className="h-24 md:hidden" />
    </Layout>
  )
}
