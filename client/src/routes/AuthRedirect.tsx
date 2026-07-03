// AuthRedirect.tsx
import { useAppSelector } from '@/store/hook'
import { Navigate } from 'react-router-dom'

interface AuthRedirectProps {
  children: React.ReactNode
}

/**
 * AuthRedirect Component
 * Redirects authenticated users away from auth pages
 * - If authenticated: redirects to dashboard
 * - If not authenticated: shows the auth page
 */
export default function AuthRedirect({ children }: AuthRedirectProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  // Since isAuthenticated defaults to true, we only redirect if true
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}