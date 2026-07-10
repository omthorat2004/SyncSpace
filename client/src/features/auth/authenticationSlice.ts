import type {
  AuthApiResponse,
  AuthResponse,
  AuthState,
  LoginFormData,
  SignupFormData,
} from '@/features/auth/auth.type'
import { publicApi } from '@/services/api.service'
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import { toast } from 'sonner';



// ============================================================
// Async Thunks
// ============================================================

const normalizeAuthResponse = (data: AuthApiResponse): AuthResponse => ({
  user: data.user,
})

const extractErrorMessage = (err: unknown, fallbackMessage: string): string => {
  if (err instanceof AxiosError) {
    const backendMessage = (err.response?.data as { message?: string; detail?: string } | undefined)
    if (backendMessage?.message) {
      return backendMessage.message
    }
    if (backendMessage?.detail) {
      return backendMessage.detail
    }
    if (err.message) {
      return err.message
    }
  }

  if (err instanceof Error) {
    return err.message
  }

  return fallbackMessage
}

export const signup = createAsyncThunk<AuthResponse, SignupFormData, { rejectValue: string }>(
  'auth/signup',
  async (body, { rejectWithValue }) => {
    try {
      const response = await publicApi.register(body.name, body.email, body.password)
      return normalizeAuthResponse(response.data)
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'An error occurred during signup'))
    }
  }
)

export const login = createAsyncThunk<AuthResponse, LoginFormData, { rejectValue: string }>(
  'auth/login',
  async (body, { rejectWithValue }) => {
    try {
      const response = await publicApi.login(body.email, body.password)
      return normalizeAuthResponse(response.data)
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'An error occurred during login'))
    }
  }
)

export const refreshSession = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  'auth/refreshSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicApi.refreshToken()
      return normalizeAuthResponse(response.data)
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Unable to restore session'))
    }
  }
)

export const getCurrentUser = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicApi.getCurrentUser()
      return normalizeAuthResponse(response.data)
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Unable to load session'))
    }
  }
)

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await publicApi.logout()
      // Return undefined on success
      return
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'An error occurred during logout'))
    }
  }
)








// ============================================================
// Initial State
// ============================================================

const initialState: AuthState = {
  isAuthenticated: false,
  authChecked: false,
  user: null,
  loading: false,
  error: null,
}

// ============================================================
// Slice
// ============================================================


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetAuthState: (state) => {
      state.isAuthenticated = false
      state.authChecked = true
      state.user = null
      state.loading = false
      state.error = null
    },
    updateUserProfile: (state, action: PayloadAction<Partial<typeof state.user>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    setAuthState: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.authChecked = true
        state.user = action.payload.user
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.authChecked = true
        state.user = null
        state.error = action.payload as string
      })

      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.authChecked = true
        state.user = action.payload.user
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.authChecked = true
        state.user = null
        state.error = action.payload as string
        toast.error(state.error)
      })

      .addCase(refreshSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.authChecked = true
        state.user = action.payload.user
        state.error = null
      })
      .addCase(refreshSession.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.authChecked = true
        state.user = null
        state.error = null
      })

      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.authChecked = true
        state.user = action.payload.user
        state.error = null
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.authChecked = true
        state.user = null
        state.error = null
      })

      .addCase(logout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.authChecked = true
        state.user = null
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

// ============================================================
// Selectors
// ============================================================

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated

export const selectUser = (state: { auth: AuthState }) =>
  state.auth.user

export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.loading

export const selectAuthError = (state: { auth: AuthState }) =>
  state.auth.error

export const { clearError, resetAuthState, updateUserProfile, setAuthState } =
  authSlice.actions

export default authSlice.reducer