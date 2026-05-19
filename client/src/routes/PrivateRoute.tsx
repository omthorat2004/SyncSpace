import { useAppSelector } from '@/store/hook'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: React.ReactNode
}

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * - If logged in: shows the component
 * - If not logged in: redirects to login
 */
export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}