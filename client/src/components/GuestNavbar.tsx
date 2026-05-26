import { useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
import { HiArrowRight } from 'react-icons/hi'
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
    { label: 'Pricing', href: '/pricing' },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-border/80 backdrop-blur-xl transition duration-300 ${scrolled ? 'bg-white/95 shadow-sm dark:bg-slate-950/95' : 'bg-white/90 dark:bg-slate-950/90'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-3 text-current no-underline">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-100">
              S
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">SyncSpace</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Guest hub</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {isDarkMode ? <MdSunny size={18} /> : <MdDarkMode size={18} />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Dashboard
                  <HiArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white! transition hover:bg-slate-800"
                  >
                    Get Started
                    <HiArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
            </button>
          </div>
        </div>

        <div className={`${isMobileMenuOpen ? 'mt-4 max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-300 md:hidden`}>
          <div className="rounded-3xl border border-border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="rounded-full px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="rounded-full bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-full border border-border px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-full bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white! transition hover:bg-slate-800"
                  >
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
