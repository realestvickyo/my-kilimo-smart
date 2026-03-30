import React from 'react'
import { motion } from 'motion/react'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  highlightColor?: 'emerald' | 'amber' | 'red' | 'none'
  onClick?: () => void
  elevated?: boolean
  noPadding?: boolean
}

export function Card({
  children,
  className = '',
  highlightColor = 'none',
  onClick,
  elevated = false,
  noPadding = false,
  ...props
}: CardProps) {
  const highlightStyles = {
    emerald: 'border-l-[3px] border-l-[#2E7D32]',
    amber: 'border-l-[3px] border-l-amber-500',
    red: 'border-l-[3px] border-l-red-500',
    none: '',
  }
  const baseStyles = `
    bg-white rounded-2xl 
    ${noPadding ? '' : 'p-4'}
    ${elevated ? 'shadow-[0_4px_12px_rgba(0,0,0,0.08)]' : 'shadow-[0_1px_3px_rgba(0,0,0,0.06)]'}
    border border-gray-100/80
    ${highlightStyles[highlightColor]}
    ${onClick ? 'cursor-pointer card-interactive' : ''}
    ${className}
  `

  if (onClick) {
    return (
      <motion.div
        className={baseStyles}
        onClick={onClick}
        whileTap={{
          scale: 0.98,
        }}
        transition={{
          duration: 0.1,
        }}
        {...(props as any)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={baseStyles} {...props}>
      {children}
    </div>
  )
}
