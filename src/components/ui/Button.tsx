import React from 'react'
import { motion } from 'motion/react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost'
    | 'outline-white'
    | 'white'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
  icon?: React.ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:
      'bg-[#2E7D32] text-white hover:bg-[#1B5E20] focus-visible:ring-[#2E7D32] shadow-[0_2px_8px_rgba(46,125,50,0.25)] hover:shadow-[0_4px_12px_rgba(46,125,50,0.3)]',
    secondary:
      'bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500 shadow-[0_2px_8px_rgba(245,158,11,0.25)]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400',
    'outline-white':
      'bg-transparent border-2 border-white/30 text-white hover:bg-white/10 focus-visible:ring-white backdrop-blur-sm',
    white:
      'bg-white text-[#2E7D32] hover:bg-gray-50 focus-visible:ring-[#2E7D32] shadow-[0_2px_8px_rgba(0,0,0,0.1)]',
  }
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-xl min-h-[36px]',
    md: 'px-4 py-2.5 text-sm rounded-xl min-h-[42px]',
    lg: 'px-6 py-3.5 text-base rounded-2xl min-h-[52px]',
  }
  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `

  return (
    <motion.button
      className={classes}
      disabled={disabled || isLoading}
      whileTap={{
        scale: 0.97,
      }}
      transition={{
        duration: 0.1,
      }}
      {...(props as any)}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  )
}
