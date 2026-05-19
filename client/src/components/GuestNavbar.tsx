import { useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
import { FiLogIn } from 'react-icons/fi'
import { HiArrowRight } from 'react-icons/hi'
import { MdClose, MdDarkMode, MdMenu, MdSunny } from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom'

const GuestNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

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
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'shadow-lg' : ''
        }`}
      style={{
        backgroundColor: 'var(--header-bg)',
        borderBottom: `1px solid var(--border)`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group no-underline hover:no-underline">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity"
                style={{ backgroundColor: 'var(--accent)' }}
              />
              <span className="text-xl font-bold relative" style={{ color: 'var(--accent)' }}>
                S
              </span>
            </div>
            <span className="text-lg font-bold hidden sm:inline" style={{ color: 'var(--foreground)' }}>
              SyncSpace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 no-underline hover:no-underline"
                style={{
                  color: 'var(--foreground)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--border)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-md transition-colors duration-200 hover:opacity-70"
              style={{
                color: 'var(--foreground)',
              }}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <MdSunny size={20} /> : <MdDarkMode size={20} />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2 no-underline hover:no-underline group"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-text)',
                }}
              >
                <span>Dashboard</span>
                <HiArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 no-underline hover:no-underline"
                  style={{
                    color: 'var(--accent)',
                    border: `1.5px solid var(--accent)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent)'
                    e.currentTarget.style.color = 'var(--accent-text)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                >
                  <FiLogIn size={16} />
                  <span>Sign In</span>
                </Link>

                {/* Signup Button */}
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2 no-underline hover:no-underline group"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--accent-text)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(234, 88, 12, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span>Get Started</span>
                  <HiArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md transition-colors duration-200"
              style={{
                color: 'var(--foreground)',
              }}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <MdSunny size={20} /> : <MdDarkMode size={20} />}
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md transition-colors duration-200 focus:outline-none"
              style={{
                color: 'var(--foreground)',
              }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="py-4 space-y-1 border-t" style={{ borderColor: 'var(--border)' }}>
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 no-underline hover:no-underline"
                style={{
                  color: 'var(--foreground)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--border)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 space-y-2 border-t" style={{ borderColor: 'var(--border)' }}>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="block text-center px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 no-underline hover:no-underline"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--accent-text)',
                  }}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-center px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 no-underline hover:no-underline"
                    style={{
                      color: 'var(--accent)',
                      border: `1.5px solid var(--accent)`,
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-center px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 no-underline hover:no-underline"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--accent-text)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent)'
                    }}
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