import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

export function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#1A4D2E]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
          alt="Green Field"
          className="h-full w-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#1A4D2E]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-screen flex-col items-center justify-end px-6 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md"
        >
          <h1 className="mb-4 font-headings text-5xl font-bold leading-tight text-white">
            Welcome to Neofarm
          </h1>
          <p className="mb-10 text-lg font-medium text-white/80">
            AI-powered tools for smarter farming
          </p>

          <Link
            to="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#A7F305] py-5 text-lg font-bold text-[#1A4D2E] shadow-xl transition-transform active:scale-95"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
