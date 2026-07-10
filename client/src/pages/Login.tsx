import Button from '@/components/atoms/Button'
import type { LoginFormData } from '@/features/auth/auth.type'
import { login } from '@/features/auth/authenticationSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useEffect, useState } from 'react'
import { MdEmail, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const navigate = useNavigate()

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({})

  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {}

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (formErrors[name as keyof LoginFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await dispatch(login(formData)).unwrap()
      // AuthRedirect will handle navigation to dashboard after isAuthenticated is set
    } catch (err) {
      // Error is already handled in Redux state
      console.error('Login failed:', err)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = localStorage.getItem('redirectAfterLogin')
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin')
        navigate(redirectPath)
      }
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-full bg-background text-foreground flex items-center justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-md">
        <div className="card rounded-2xl p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold mt-2 text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted mt-1">
              Sign in to your SyncSpace account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <MdEmail className="auth-input-icons w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-field pl-3 pr-10 ${formErrors.email ? 'border-destructive' : ''}`}
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </div>
              {formErrors.email && (
                <p className="text-destructive text-xs mt-1.5 font-medium">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-field pl-3 pr-10 ${formErrors.password ? 'border-destructive' : ''}`}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {showPassword ? (
                    <MdVisibilityOff className="w-5 h-5" />
                  ) : (
                    <MdVisibility className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-destructive text-xs mt-1.5 font-medium">
                  {formErrors.password}
                </p>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading} className="mt-2">
              Sign in
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted">Don't have an account?</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted">
              Create a new account{' '}
              <Link to="/signup" className="text-link hover:text-link-hover font-semibold transition-colors">
                here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted">
          <p>
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-link hover:text-link-hover">
              Terms of Service
            </Link>
            {' and '}
            <Link to="/privacy" className="text-link hover:text-link-hover">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
