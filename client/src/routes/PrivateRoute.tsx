// PrivateRoute.tsx
import { LoadingShimmer } from '@/components/LoadingShimmer'
import { useAppSelector } from '@/store/hook'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: React.ReactNode
}

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * - While the initial session check is in flight: show a loading skeleton
 *   (avoids bouncing an actually-logged-in user to /login before we know)
 * - If not authenticated: redirects to login
 * - If authenticated: shows the protected content
 */
export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, authChecked } = useAppSelector((state) => state.auth)

  if (!authChecked) {
    return <LoadingShimmer />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}