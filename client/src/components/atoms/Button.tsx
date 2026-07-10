import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    isLoading?: boolean
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const baseClasses =
        'inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 rounded-full disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'

    const sizeClasses = {
        sm: 'px-3.5 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    }

    const variantClasses = {
        primary: 'bg-accent text-accent-text hover:bg-accent-hover',
        secondary: 'bg-card border border-border text-foreground hover:bg-surface-container',
        ghost: 'text-foreground hover:bg-surface-container',
        outline: 'border border-border text-foreground hover:bg-surface-container',
        destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/15',
    }

    const widthClass = fullWidth ? 'w-full' : ''

    return (
        <button
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? 'Loading…' : children}
        </button>
    )
}

export default Button
