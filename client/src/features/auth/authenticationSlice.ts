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
import { setLocalStorage } from '@/utils'
import { ACCESS_TOKEN,REFRESH_TOKEN } from '@/constants'



// Util functions

function _setLocalStorage(accessToken: string, refreshToken: string) {
  setLocalStorage(
    { key: ACCESS_TOKEN, value: accessToken },
    { key: REFRESH_TOKEN, value: refreshToken }
  )
}

// ============================================================
// Async Thunks
// ============================================================

const normalizeAuthResponse = (data: AuthApiResponse): AuthResponse => ({
  user: data.user,
  accessToken: data.access_token,
  refreshToken: data.refresh_token,
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




// ============================================================
// Initial State
// ============================================================

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem(ACCESS_TOKEN),
  accessToken: localStorage.getItem(ACCESS_TOKEN)||'',
  refreshToken: localStorage.getItem(REFRESH_TOKEN)||'',
  user: null,
  loading: false,
  error: null
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
    resetAuthState: (state) =>{
      state.accessToken = ''
      state.refreshToken = ''
      state.isAuthenticated = false
      localStorage.clear()
      
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
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        _setLocalStorage(state.accessToken,state.refreshToken)
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = ''
        state.refreshToken = ''
        state.error = action.payload as string
      })

      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user

        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken

        _setLocalStorage(state.accessToken,state.refreshToken)

        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = ''
        state.refreshToken = ''
        state.error = action.payload as string
      })

      .addCase(refreshSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.error = null
      })
      .addCase(refreshSession.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = ''
        state.refreshToken = ''
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

export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken

export const selectRefreshToken = (state: { auth: AuthState }) =>
  state.auth.refreshToken

export const { clearError, resetAuthState, updateUserProfile, setAuthState } =
  authSlice.actions

export default authSlice.reducer