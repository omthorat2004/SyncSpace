import { resetAuthState } from '@/features/auth/authenticationSlice'
import { openCreateModal } from '@/features/space/spaceSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
import { FiGrid, FiLogOut, FiPlus, FiSearch } from 'react-icons/fi'
import { MdDarkMode, MdSunny } from 'react-icons/md'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.auth.user)

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark')
            setIsDarkMode(true)
        }

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
        <header
            className={`sticky top-0 z-40 border-b border-border bg-header-bg backdrop-blur-sm transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-8 min-w-0">
                        <Link to="/dashboard" className="no-underline hover:no-underline flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold bg-slate-100 text-foreground">
                                S
                            </div>
                            <span className="font-bold text-lg hidden sm:block text-foreground">
                                SyncSpace
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-2">
                            <Link
                                to="/dashboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium no-underline hover:no-underline transition-colors ${location.pathname === '/dashboard' ? 'bg-card text-foreground' : 'text-muted hover:text-foreground'}`}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleCreateSpace}
                                className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 border border-border text-foreground hover:bg-slate-100 transition-colors"
                            >
                                <FiPlus size={14} />
                                New Space
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden lg:flex items-center gap-2 rounded-lg px-3 py-2 bg-card border border-border">
                            <FiSearch size={16} className="text-muted" />
                            <span className="text-sm text-muted">Search spaces...</span>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md text-foreground hover:bg-card transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <MdSunny size={20} /> : <MdDarkMode size={20} />}
                        </button>

                        <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-2 bg-card border border-border">
                            <FiGrid size={14} className="text-muted" />
                            <span className="text-sm font-medium text-foreground">
                                {user?.name ?? 'Workspace'}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 text-destructive border border-destructive hover:bg-destructive hover:text-white transition-colors"
                        >
                            <FiLogOut size={14} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
