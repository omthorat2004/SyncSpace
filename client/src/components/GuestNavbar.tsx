import Logo from '@/components/molecules/Logo'
import ThemeToggle from '@/components/molecules/ThemeToggle'
import { useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
import { MdClose, MdMenu } from 'react-icons/md'
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
  ]

  return (
    <nav className={`sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-md border-b border-border' : 'border-b border-border/50'}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 md:gap-4">
          <Logo />

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 flex-1 mx-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-accent text-accent-text font-medium hover:bg-accent-hover transition-colors text-sm">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-container rounded-lg transition-colors">
                    Sign In
                  </Link>
                  <Link to="/signup" className="px-4 py-2 rounded-lg bg-accent text-accent-text font-medium hover:bg-accent-hover transition-colors text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background hover:bg-surface-container transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="pt-2 space-y-2 border-t border-border/50">
            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-surface-container rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile CTA Buttons */}
            <div className="space-y-2 border-t border-border/50 pt-2 mt-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="block w-full px-4 py-2 rounded-lg bg-accent text-accent-text font-medium text-center hover:bg-accent-hover transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 text-center text-sm font-medium text-foreground hover:bg-surface-container rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full px-4 py-2 rounded-lg bg-accent text-accent-text font-medium text-center hover:bg-accent-hover transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
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
