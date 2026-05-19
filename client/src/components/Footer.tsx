import { FiActivity, FiClock, FiShield } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className="mt-auto border-t border-border bg-card/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="font-semibold text-foreground">SyncSpace Workspace</p>
                        <p className="text-sm text-muted">Organize notes, links, and snippets inside structured spaces.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border">
                            <FiActivity size={12} className="text-success" />
                            Services Operational
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border">
                            <FiShield size={12} className="text-accent" />
                            Cookie Auth Enabled
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border">
                            <FiClock size={12} className="text-secondary-hover" />
                            Last Sync: Just now
                        </span>
                    </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted">
                    <p>© {year} SyncSpace. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
                        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
