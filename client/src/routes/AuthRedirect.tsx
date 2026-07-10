// AuthRedirect.tsx
import { useAppSelector } from '@/store/hook'
import { Navigate } from 'react-router-dom'

interface AuthRedirectProps {
  children: React.ReactNode
}

/**
 * AuthRedirect Component
 * Redirects authenticated users away from auth pages
 * - While the initial session check is in flight: render nothing (avoids
 *   deciding on a stale/default auth state)
 * - If authenticated: redirects to dashboard
 * - If not authenticated: shows the auth page
 */
export default function AuthRedirect({ children }: AuthRedirectProps) {
  const { isAuthenticated, authChecked } = useAppSelector((state) => state.auth)

  if (!authChecked) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}