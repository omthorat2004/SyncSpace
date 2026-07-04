import { LinkProps, Link as RouterLink } from 'react-router-dom'

interface NavLinkProps extends Omit<LinkProps, 'to'> {
    to: string
    label: string
    isActive?: boolean
    onClick?: () => void
}

const NavLink = ({ to, label, isActive = false, onClick, ...props }: NavLinkProps) => {
    return (
        <RouterLink
            to={to}
            className={`nav-link ${isActive ? 'bg-surface-container-high text-foreground' : ''}`}
            onClick={onClick}
            {...props}
        >
            {label}
        </RouterLink>
    )
}

export default NavLink
