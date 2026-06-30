/**
 * User registration form data
 */
export interface SignupFormData {
  name: string
  email: string
  password: string
}

/**
 * User login form data
 */
export interface LoginFormData {
  email: string
  password: string
}

/**
 * Authenticated user object returned from backend
 */
export interface AuthUser {
  id: number
  name: string
  email: string
}

/**
 * Standard auth API response
 * Returned from signup, login, and current-user endpoints
 */
export interface AuthResponse {
  user: AuthUser
}

/**
 * Raw auth response shape from backend (FastAPI/Pydantic)
 */
export interface AuthApiResponse {
  access_token?: string
  refresh_token?: string
  user: AuthUser
}

/**
 * Redux auth state shape
 */
export interface AuthState {
  // Authentication status
  isAuthenticated: boolean

  // User data
  user: AuthUser | null

  // UI states
  loading: boolean
  error: string | null
}