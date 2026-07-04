import { ReactNode } from 'react'

interface ContainerProps {
    children: ReactNode
    className?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const Container = ({
    children,
    className = '',
    maxWidth = 'lg',
}: ContainerProps) => {
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'w-full',
    }

    return (
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}>
            {children}
        </div>
    )
}

export default Container
