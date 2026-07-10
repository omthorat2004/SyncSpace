import type { ReactNode } from 'react'

interface BadgeProps {
    children: ReactNode
    variant?: 'neutral' | 'accent' | 'positive' | 'destructive'
    active?: boolean
    className?: string
    onClick?: () => void
    icon?: ReactNode
}

const variantClasses = {
    neutral: 'bg-surface-container text-muted border border-border',
    accent: 'bg-accent-soft text-accent border border-transparent',
    positive: 'bg-success/10 text-success border border-transparent',
    destructive: 'bg-destructive/10 text-destructive border border-transparent',
}

const Badge = ({ children, variant = 'neutral', active = false, className = '', onClick, icon }: BadgeProps) => {
    const Component = onClick ? 'button' : 'span'

    return (
        <Component
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-150 ${active ? variantClasses.accent : variantClasses[variant]
                } ${onClick ? 'hover:opacity-80 cursor-pointer' : ''} ${className}`}
        >
            {icon}
            {children}
        </Component>
    )
}

export default Badge
