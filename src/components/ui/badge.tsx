interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'electric' | 'outline'
  size?: 'sm' | 'md'
}

const variantStyles = {
  default: 'bg-white/[0.08] text-surface-300',
  success: 'bg-success-500/15 text-success-400',
  warning: 'bg-warning-400/15 text-warning-400',
  danger: 'bg-danger-500/15 text-danger-400',
  accent: 'bg-accent-500/20 text-accent-300',
  electric: 'bg-electric-400/15 text-electric-400',
  outline: 'bg-transparent border border-white/[0.1] text-surface-400',
}

const sizeStyles = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2.5 py-0.5',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  return (
    <span
      className={`rounded-full font-medium inline-flex items-center gap-1 ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  )
}
