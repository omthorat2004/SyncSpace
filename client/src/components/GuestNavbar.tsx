import { useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
// removed unused HiArrowRight
import { MdClose, MdDarkMode, MdMenu, MdSunny } from 'react-icons/md'
import { Link } from 'react-router-dom'

const GuestNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
  })
  const [scrolled, setScrolled] = useState(false)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDarkMode(true)
    }
  }

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'About', href: '/#about' },

  ]

  return (
    <nav className={`sticky top-0 z-50 w-full backdrop-blur-xl transition duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="site-nav-inner">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="nav-brand">
            <div className="brand-badge">S</div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">SyncSpace</p>
              <p className="text-xs text-muted">Guest hub</p>
            </div>
          </Link>

          <div className="hidden lg:flex nav-links">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted">
              {isDarkMode ? <MdSunny size={18} /> : <MdDarkMode size={18} />}
            </button>

            <div className="hidden md:flex nav-cta">
              {isAuthenticated ? (
                <Link to="/dashboard" className="primary-button">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="nav-link">
                    Sign In
                  </Link>
                  <Link to="/signup" className="primary-button py-2!">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted md:hidden" aria-label="Toggle menu">
              {isMobileMenuOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
            </button>
          </div>
        </div>

        <div className={`${isMobileMenuOpen ? 'mt-4 max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-300 md:hidden`}>
          <div className="rounded-3xl border border-border bg-background p-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} className="nav-link">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard" className="primary-button">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="nav-link">
                    Sign In
                  </Link>
                  <Link to="/signup" className="primary-button">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default GuestNavbar
