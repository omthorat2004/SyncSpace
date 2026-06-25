import type { LoginFormData } from '@/features/auth/auth.type'
import { login } from '@/features/auth/authenticationSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { MdEmail, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({})

  // Validation function
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

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (formErrors[name as keyof LoginFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await dispatch(login(formData)).unwrap()
      // Navigate to dashboard after successful login
      navigate('/dashboard', {
        replace: true
      })
    } catch (err) {
      // Error is already handled in Redux state
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="min-h-full bg-background text-foreground flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-md">
        {/* Card container */}
        <div className="card rounded-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold mt-2 text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-muted">
              Sign in to your SyncSpace account
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email field */}
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

            {/* Password field */}
            <div className="form-group">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="form-label mb-0">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-muted hover:text-foreground transition-colors duration-200"
                >
                  Forgot?
                </Link>
              </div>
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="button w-full py-3 font-semibold mt-8 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted">Don't have an account?</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Signup link */}
          <div className="text-center">
            <p className="text-sm text-muted">
              Create a new account{' '}
              <Link
                to="/signup"
                className="text-link hover:text-link-hover font-semibold transition-colors"
                style={{ textDecoration: 'none' }}
              >
                here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-6 text-center text-xs text-muted">
          <p>
            By signing in, you agree to our{' '}
            <Link
              to="/terms"
              className="text-link hover:text-link-hover"
              style={{ textDecoration: 'none' }}
            >
              Terms of Service
            </Link>
            {' and '}
            <Link
              to="/privacy"
              className="text-link hover:text-link-hover"
              style={{ textDecoration: 'none' }}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}