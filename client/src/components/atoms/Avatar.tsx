import { getInitials } from '@/utils/format'

interface AvatarProps {
    name: string
    src?: string | null
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
}

const Avatar = ({ name, src, size = 'md', className = '' }: AvatarProps) => {
    return (
        <div
            className={`shrink-0 rounded-full bg-accent-soft text-accent flex items-center justify-center font-semibold overflow-hidden ${sizeClasses[size]} ${className}`}
        >
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span>{getInitials(name)}</span>
            )}
        </div>
    )
}

export default Avatar
