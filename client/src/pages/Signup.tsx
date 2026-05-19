import type { SignupFormData } from '@/features/auth/auth.type'
import { signup } from '@/features/auth/authenticationSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { MdEmail, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Partial<SignupFormData>>({})


  const validateForm = (): boolean => {
    const errors: Partial<SignupFormData> = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

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
    if (formErrors[name as keyof SignupFormData]) {
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
      const result = await dispatch(signup(formData)).unwrap()
      // Navigate to dashboard or home after successful signup
      navigate('/dashboard', {
        replace: true
      })
    } catch (err) {
      // Error is already handled in Redux state
      console.error('Signup failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Background gradient animation */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Card container */}
        <div className="card shadow-lg hover-lift">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Join SyncSpace
            </h1>
            <p className="text-muted text-sm">
              Create your account to get started
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
            {/* Name field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="relative">
                <MdPerson className="auth-input-icons w-5 h-5" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-field pl-3 pr-10 ${formErrors.name ? 'border-destructive' : ''
                    }`}
                  disabled={loading}
                  autoComplete="name"
                />
              </div>
              {formErrors.name && (
                <p className="text-destructive text-xs mt-1.5 font-medium">
                  {formErrors.name}
                </p>
              )}
            </div>

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
                  className={`form-field pl-3 pr-10 ${formErrors.email ? 'border-destructive' : ''
                    }`}
                  disabled={loading}
                  autoComplete="email"
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
                  className={`form-field pl-3 pr-10 ${formErrors.password ? 'border-destructive' : ''
                    }`}
                  disabled={loading}
                  autoComplete="new-password"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted">Already have an account?</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Login link */}
          <div className="text-center">
            <p className="text-sm text-muted">
              Sign in to your account{' '}
              <Link
                to="/login"
                className="text-link hover:text-link-hover font-semibold transition-colors"
              >
                here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-6 text-center text-xs text-muted">
          <p>
            By signing up, you agree to our{' '}
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