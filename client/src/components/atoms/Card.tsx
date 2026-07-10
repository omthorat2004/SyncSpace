import type { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    hoverable?: boolean
}

const Card = ({ children, className = '', hoverable = false }: CardProps) => {
    return (
        <div
            className={`card ${hoverable ? 'hover:shadow-lg transition-all duration-300' : ''} ${className}`}
        >
            {children}
        </div>
    )
}

export default Card
