import { resetAuthState } from '@/features/auth/authenticationSlice'
import { openCreateModal } from '@/features/space/spaceSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
import { FiGrid, FiLogOut, FiPlus, FiSearch } from 'react-icons/fi'
import { MdClose, MdDarkMode, MdMenu, MdSunny } from 'react-icons/md'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme')
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        return savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
    })
    const [scrolled, setScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.auth.user)

    // Theme effect
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDarkMode])

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
            setIsDarkMode(false)
            return
        }

        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
        setIsDarkMode(true)
    }

    const handleLogout = () => {
        dispatch(resetAuthState())
        navigate('/login')
    }

    const handleCreateSpace = () => {
        dispatch(openCreateModal())
    }

    return (
        <nav className={`sticky top-0 z-50 w-full backdrop-blur-xl transition duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
            <div className="site-nav-inner">
                <div className="flex items-center justify-between h-16 gap-4">
                    <div className="flex items-center gap-8 min-w-0">
                        <Link to="/dashboard" className="nav-brand">
                            <div className="brand-badge">S</div>
                            <span className="hidden sm:block">
                                <p className="text-sm font-semibold">SyncSpace</p>
                            </span>
                        </Link>

                        <nav className="hidden md:flex nav-links">
                            <Link
                                to="/dashboard"
                                className={`nav-link ${location.pathname === '/dashboard' ? ' text-foreground' : ''}`}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleCreateSpace}
                                className="nav-link flex items-center gap-2"
                            >
                                <FiPlus size={14} />
                                New Space
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2 rounded-full px-3 py-2  border border-border">
                            <FiSearch size={16} className="text-muted" />
                            <span className="text-sm text-muted">Search spaces...</span>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border  text-muted"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <MdSunny size={18} /> : <MdDarkMode size={18} />}
                        </button>

                        <div className="hidden sm:flex items-center gap-2 rounded-full px-3 py-2  border border-border">
                            <FiGrid size={14} className="text-muted" />
                            <span className="text-sm font-medium text-foreground">
                                {user?.name ?? 'Workspace'}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-destructive hover:bg-destructive/10 transition-colors"
                            aria-label="Logout"
                        >
                            <FiLogOut size={16} />
                        </button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted md:hidden"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${isMobileMenuOpen ? 'mt-4 max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-300 md:hidden`}>
                    <div className="rounded-3xl border border-border bg-background p-4">
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/dashboard"
                                className="nav-link"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    handleCreateSpace()
                                    setIsMobileMenuOpen(false)
                                }}
                                className="nav-link flex items-center gap-2"
                            >
                                <FiPlus size={14} />
                                New Space
                            </button>
                        </div>
                        <div className="mt-4 flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    handleLogout()
                                    setIsMobileMenuOpen(false)
                                }}
                                className="nav-link flex items-center gap-2 bg-tra border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
                            >
                                <FiLogOut className='' size={14} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar