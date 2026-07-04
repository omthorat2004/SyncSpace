import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
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
        'font-medium transition-colors duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    }

    const variantClasses = {
        primary: 'bg-accent text-accent-text hover:bg-accent-hover',
        secondary: 'bg-secondary text-on-secondary-fixed hover:bg-secondary-action-hover',
        ghost: 'text-foreground hover:bg-surface-container',
        outline: 'border border-border text-foreground hover:bg-surface-container',
    }

    const widthClass = fullWidth ? 'w-full' : ''

    return (
        <button
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    )
}

export default Button
