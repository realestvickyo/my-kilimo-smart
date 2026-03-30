import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'outline'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
  className?: string
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  icon,
  className = '',
}: BadgeProps) {
  const variants = {
    success: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    outline: 'bg-transparent text-gray-600 border-gray-300',
  }
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }
  return (
    <span
      className={`
      inline-flex items-center gap-1 rounded-full font-medium border
      ${variants[variant]} 
      ${sizes[size]}
      ${className}
    `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
