import { useAppSelector } from '@/store/hook'
import { Navigate } from 'react-router-dom'

interface AuthRedirectProps {
  children: React.ReactNode
}

/**
 * AuthRedirect Component
 * Redirects authenticated users away from auth pages
 * - If logged in: redirects to dashboard
 * - If not logged in: shows the auth page
 */
export default function AuthRedirect({ children }: AuthRedirectProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}