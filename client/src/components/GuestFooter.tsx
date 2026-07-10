import React from 'react'
import { FaDiscord } from 'react-icons/fa'
import { FiGithub, FiHeart, FiTwitter } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const GuestFooter: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-root mt-auto">
      <div className="page-container py-12">
        <div className="footer-grid">
          <div className="footer-brand space-y-4">
            <div className="flex items-center gap-3">
              <div className="brand-badge">S</div>
              <div>
                <p className="text-base font-semibold">SyncSpace</p>
                <p className="text-sm text-muted">Guest landing page</p>
              </div>
            </div>
            <p className="max-w-lg text-sm leading-7 text-muted">Organize notes, links, and snippets with clear spaces, simple navigation, and fast discovery.</p>
            <div className="flex items-center gap-3">
              <a href="#" className="social-icon" aria-label="Twitter"><FiTwitter size={18} /></a>
              <a href="#" className="social-icon" aria-label="GitHub"><FiGithub size={18} /></a>
              <a href="#" className="social-icon" aria-label="Discord"><FaDiscord size={18} /></a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted">Product</p>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              <li><Link to="/login" className="transition hover:text-foreground">Log in</Link></li>
              <li><Link to="/signup" className="transition hover:text-foreground">Sign up</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted">Legal</p>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              <li><Link to="/privacy" className="transition hover:text-foreground">Privacy</Link></li>
              <li><Link to="/terms" className="transition hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-sm text-muted">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>© {currentYear} SyncSpace. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs text-muted">
                <FiHeart size={14} className="text-rose-500" /> Built for knowledge management
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/privacy" className="transition hover:text-foreground">Privacy</Link>
                <Link to="/terms" className="transition hover:text-foreground">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default GuestFooter
