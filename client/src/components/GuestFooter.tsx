import React from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiHeart, FiTwitter } from 'react-icons/fi'
import { FaDiscord } from 'react-icons/fa'

const GuestFooter: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-card text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-100">
                S
              </div>
              <div>
                <p className="text-base font-semibold text-slate-950 dark:text-white">SyncSpace</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Guest landing page</p>
              </div>
            </div>
            <p className="max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-400">
              Organize notes, links, and snippets with clear spaces, simple navigation, and fast discovery.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                <FiGithub size={18} />
              </a>
              <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                <FaDiscord size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Product</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/features" className="transition hover:text-slate-900 dark:hover:text-white">Features</Link></li>
              <li><Link to="/pricing" className="transition hover:text-slate-900 dark:hover:text-white">Pricing</Link></li>
              <li><Link to="/demo" className="transition hover:text-slate-900 dark:hover:text-white">Live Demo</Link></li>
              <li><Link to="/roadmap" className="transition hover:text-slate-900 dark:hover:text-white">Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Company</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/about" className="transition hover:text-slate-900 dark:hover:text-white">About</Link></li>
              <li><Link to="/blog" className="transition hover:text-slate-900 dark:hover:text-white">Blog</Link></li>
              <li><Link to="/careers" className="transition hover:text-slate-900 dark:hover:text-white">Careers</Link></li>
              <li><Link to="/contact" className="transition hover:text-slate-900 dark:hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Support</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/help" className="transition hover:text-slate-900 dark:hover:text-white">Help Center</Link></li>
              <li><Link to="/privacy" className="transition hover:text-slate-900 dark:hover:text-white">Privacy</Link></li>
              <li><Link to="/terms" className="transition hover:text-slate-900 dark:hover:text-white">Terms</Link></li>
              <li><Link to="/security" className="transition hover:text-slate-900 dark:hover:text-white">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>© {currentYear} SyncSpace. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                <FiHeart size={14} className="text-rose-500" /> Built for knowledge management
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/privacy" className="transition hover:text-slate-900 dark:hover:text-white">Privacy</Link>
                <Link to="/terms" className="transition hover:text-slate-900 dark:hover:text-white">Terms</Link>
                <Link to="/cookies" className="transition hover:text-slate-900 dark:hover:text-white">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default GuestFooter
