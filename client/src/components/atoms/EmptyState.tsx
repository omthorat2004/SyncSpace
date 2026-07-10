import type { ReactNode } from 'react'

interface EmptyStateProps {
    icon: ReactNode
    title: string
    description?: string
    action?: ReactNode
    className?: string
}

const EmptyState = ({ icon, title, description, action, className = '' }: EmptyStateProps) => {
    return (
        <div className={`flex flex-col items-center text-center gap-3 py-12 px-4 ${className}`}>
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-muted">
                {icon}
            </div>
            <div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                {description && (
                    <p className="text-sm text-muted mt-1 max-w-sm">{description}</p>
                )}
            </div>
            {action}
        </div>
    )
}

export default EmptyState
