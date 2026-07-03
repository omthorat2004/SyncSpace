// PrivateRoute.tsx
import { useAppSelector } from '@/store/hook'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: React.ReactNode
}

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * - If not authenticated: redirects to login
 * - If authenticated: shows the protected content
 */
export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  // Only redirect if explicitly not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}