import { Link } from 'react-router-dom'

interface LogoProps {
    to?: string
    showText?: boolean
    showSubtext?: boolean
}

const Logo = ({ to = '/', showText = true, showSubtext = true }: LogoProps) => {
    return (
        <Link to={to} className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            <div className="brand-badge">S</div>
            {showText && (
                <div className="hidden sm:block">
                    <p className="text-sm font-semibold leading-none">SyncSpace</p>
                    {showSubtext && <p className="text-xs text-muted leading-none">Guest hub</p>}
                </div>
            )}
        </Link>
    )
}

export default Logo
