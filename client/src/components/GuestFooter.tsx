import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiGithub, FiHeart } from 'react-icons/fi';
import { FaDiscord } from 'react-icons/fa';

const GuestFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t" style={{ 
      backgroundColor: 'var(--footer-bg)',
      borderColor: 'var(--border)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              <h3 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>SyncSpace</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Your centralized knowledge hub for notes, links, and code snippets.
              Organize, search, and access your information anytime, anywhere.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg transition-all duration-300 hover:scale-110" style={{ color: 'var(--muted)' }}>
                <FiTwitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg transition-all duration-300 hover:scale-110" style={{ color: 'var(--muted)' }}>
                <FiGithub size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg transition-all duration-300 hover:scale-110" style={{ color: 'var(--muted)' }}>
                <FaDiscord size={18} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Product</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Features</Link></li>
              <li><Link to="/pricing" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Pricing</Link></li>
              <li><Link to="/demo" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Live Demo</Link></li>
              <li><Link to="/roadmap" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Roadmap</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>About Us</Link></li>
              <li><Link to="/blog" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Blog</Link></li>
              <li><Link to="/careers" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Careers</Link></li>
              <li><Link to="/contact" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Contact</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Support</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Help Center</Link></li>
              <li><Link to="/privacy" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Terms of Service</Link></li>
              <li><Link to="/security" className="text-sm transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              © {currentYear} SyncSpace. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
              <span>Built with</span>
              <FiHeart className="animate-pulse" style={{ color: 'var(--accent)' }} />
              <span>for knowledge management</span>
            </div>
            <div className="flex gap-4">
              <Link to="/privacy" className="text-xs transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Privacy</Link>
              <Link to="/terms" className="text-xs transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Terms</Link>
              <Link to="/cookies" className="text-xs transition-colors duration-300 hover:opacity-70" style={{ color: 'var(--muted)' }}>Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GuestFooter;